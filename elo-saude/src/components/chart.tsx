import { useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { font, space, useTheme } from '../theme';
import { Analito, Ponto, dataEixo, flagDe, fonte } from '../data/mock';
import { SourceBadge } from './ui';

/**
 * Gráfico de evolução de um analito ao longo do tempo.
 *
 * Forma: série única ao longo do tempo -> linha + pontos. Por ser série única,
 * não leva legenda (o título nomeia a série). A faixa de referência entra como
 * banda sombreada, e só o último ponto (ou o ponto tocado) recebe rótulo direto
 * — nunca um número em cima de cada ponto.
 *
 * Desenhado com Views puras de propósito: sem react-native-svg o app roda no
 * Expo Go sem development build.
 */

const ALTURA = 190;
const PAD = { top: 22, right: 14, bottom: 26, left: 46 };
const RAIO_PONTO = 5;

type Escala = {
  lo: number;
  hi: number;
  px: (i: number) => number;
  py: (v: number) => number;
  largura: number;
};

function montarEscala(a: Analito, pts: Ponto[], largura: number): Escala {
  const valores = pts.map((p) => p.valor);
  let lo = Math.min(...valores);
  let hi = Math.max(...valores);
  const amplitude = hi - lo || Math.abs(hi) * 0.2 || 1;

  // Inclui os limites de referência no domínio só quando estão perto dos dados,
  // para a banda aparecer sem achatar a série.
  if (a.refMin !== null && a.refMin < lo && lo - a.refMin <= amplitude * 1.5) lo = a.refMin;
  if (a.refMax !== null && a.refMax > hi && a.refMax - hi <= amplitude * 1.5) hi = a.refMax;

  const folga = (hi - lo || 1) * 0.14;
  lo -= folga;
  hi += folga;

  const plotW = Math.max(largura - PAD.left - PAD.right, 1);
  const plotH = ALTURA - PAD.top - PAD.bottom;
  const n = pts.length;

  return {
    lo,
    hi,
    largura,
    px: (i) => PAD.left + (n === 1 ? plotW / 2 : (plotW * i) / (n - 1)),
    py: (v) => PAD.top + plotH - ((v - lo) / (hi - lo)) * plotH,
  };
}

/** Segmento de reta entre dois pontos, via View rotacionada. */
function Segmento({
  x1,
  y1,
  x2,
  y2,
  cor,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  cor: string;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const comprimento = Math.hypot(dx, dy);
  const angulo = (Math.atan2(dy, dx) * 180) / Math.PI;
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: (x1 + x2) / 2 - comprimento / 2,
        top: (y1 + y2) / 2 - 1,
        width: comprimento,
        height: 2,
        backgroundColor: cor,
        borderRadius: 1,
        transform: [{ rotate: `${angulo}deg` }],
      }}
    />
  );
}

export function EvolutionChart({ a, pts }: { a: Analito; pts: Ponto[] }) {
  const t = useTheme();
  const [largura, setLargura] = useState(0);
  const [sel, setSel] = useState<number | null>(null);

  const onLayout = (e: LayoutChangeEvent) => setLargura(e.nativeEvent.layout.width);

  if (pts.length === 0) return null;

  const esc = largura > 0 ? montarEscala(a, pts, largura) : null;
  const destaque = sel ?? pts.length - 1;
  const pontoDestaque = pts[destaque];
  const flagDestaque = flagDe(a, pontoDestaque.valor);

  const bandaLo = a.refMin !== null ? Math.max(a.refMin, esc?.lo ?? 0) : esc?.lo ?? 0;
  const bandaHi = a.refMax !== null ? Math.min(a.refMax, esc?.hi ?? 0) : esc?.hi ?? 0;
  const temBanda = esc !== null && bandaHi > bandaLo;

  return (
    <View>
      {/* Rótulo direto do ponto em foco — substitui o tooltip de hover */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: space.sm, marginBottom: space.md }}>
        <Text style={{ color: t.text, fontSize: 32, fontWeight: '700' }}>
          {pontoDestaque.valor}
        </Text>
        <Text style={[font.body, { color: t.textSecondary, marginBottom: 5 }]}>{a.unidade}</Text>
        <View style={{ flex: 1 }} />
        <View style={{ alignItems: 'flex-end', marginBottom: 3 }}>
          <Text style={[font.small, { color: t.textSecondary }]}>{dataEixo(pontoDestaque.data)}</Text>
          <SourceBadge f={fonte(pontoDestaque.fonteId)} />
        </View>
      </View>

      <View onLayout={onLayout} style={{ height: ALTURA, position: 'relative' }}>
        {esc ? (
          <>
            {/* Banda de referência */}
            {temBanda ? (
              <View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  left: PAD.left,
                  right: PAD.right,
                  top: esc.py(bandaHi),
                  height: Math.max(esc.py(bandaLo) - esc.py(bandaHi), 1),
                  backgroundColor: t.bandFill,
                  borderTopWidth: a.refMax !== null ? StyleSheet.hairlineWidth : 0,
                  borderBottomWidth: a.refMin !== null ? StyleSheet.hairlineWidth : 0,
                  borderColor: t.axis,
                }}
              />
            ) : null}

            {/* Rótulos do eixo Y: topo e base do domínio */}
            {[esc.hi, esc.lo].map((v) => (
              <Text
                key={v}
                style={[
                  font.tiny,
                  {
                    position: 'absolute',
                    left: 0,
                    top: esc.py(v) - 6,
                    width: PAD.left - 8,
                    textAlign: 'right',
                    color: t.textMuted,
                    fontVariant: ['tabular-nums'],
                  },
                ]}
              >
                {v.toFixed(a.unidade === '%' || a.codigo === 'creatinina' || a.codigo === 'tsh' ? 1 : 0)}
              </Text>
            ))}

            {/* Linha ligando os pontos */}
            {pts.slice(0, -1).map((p, i) => (
              <Segmento
                key={`s${i}`}
                x1={esc.px(i)}
                y1={esc.py(p.valor)}
                x2={esc.px(i + 1)}
                y2={esc.py(pts[i + 1].valor)}
                cor={t.brand}
              />
            ))}

            {/* Pontos — alvo de toque maior que a marca */}
            {pts.map((p, i) => {
              const emFoco = i === destaque;
              return (
                <Pressable
                  key={p.exameId}
                  onPress={() => setSel(i)}
                  hitSlop={14}
                  style={{
                    position: 'absolute',
                    left: esc.px(i) - 16,
                    top: esc.py(p.valor) - 16,
                    width: 32,
                    height: 32,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <View
                    style={{
                      width: (emFoco ? RAIO_PONTO + 2 : RAIO_PONTO) * 2,
                      height: (emFoco ? RAIO_PONTO + 2 : RAIO_PONTO) * 2,
                      borderRadius: 99,
                      backgroundColor: emFoco ? t.brand : t.surface,
                      borderWidth: 2,
                      borderColor: t.brand,
                    }}
                  />
                </Pressable>
              );
            })}

            {/* Eixo X — datas */}
            {pts.map((p, i) => (
              <Text
                key={`x${i}`}
                style={[
                  font.tiny,
                  {
                    position: 'absolute',
                    top: ALTURA - PAD.bottom + 8,
                    left: esc.px(i) - 24,
                    width: 48,
                    textAlign: 'center',
                    color: i === destaque ? t.textSecondary : t.textMuted,
                    fontWeight: i === destaque ? '700' : '600',
                  },
                ]}
              >
                {dataEixo(p.data)}
              </Text>
            ))}
          </>
        ) : null}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm, marginTop: space.md }}>
        <View
          style={{
            width: 12,
            height: 10,
            borderRadius: 3,
            backgroundColor: t.bandFill,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: t.axis,
          }}
        />
        <Text style={[font.tiny, { color: t.textMuted, flex: 1 }]} numberOfLines={1}>
          FAIXA NORMAL
        </Text>
        <Text
          style={[
            font.tiny,
            {
              color:
                flagDestaque === 'normal' ? t.goodText : flagDestaque === 'alto' ? t.critical : t.warning,
            },
          ]}
        >
          {flagDestaque === 'normal' ? '✓ NA FAIXA' : flagDestaque === 'alto' ? '↑ ACIMA' : '↓ ABAIXO'}
        </Text>
      </View>
      <Text style={[font.tiny, { color: t.textMuted, marginTop: space.sm, fontWeight: '400' }]}>
        Toque em um ponto para ver aquela medição.
      </Text>
    </View>
  );
}

/** Mini-linha para as linhas de lista. Sem eixo e sem rótulo, só a tendência. */
export function Sparkline({ pts, largura = 56, altura = 22 }: { pts: Ponto[]; largura?: number; altura?: number }) {
  const t = useTheme();
  if (pts.length < 2) return <View style={{ width: largura, height: altura }} />;

  const valores = pts.map((p) => p.valor);
  const lo = Math.min(...valores);
  const hi = Math.max(...valores);
  const span = hi - lo || 1;
  const px = (i: number) => (largura * i) / (pts.length - 1);
  const py = (v: number) => altura - 3 - ((v - lo) / span) * (altura - 6);

  return (
    <View style={{ width: largura, height: altura, position: 'relative' }}>
      {pts.slice(0, -1).map((p, i) => (
        <Segmento
          key={i}
          x1={px(i)}
          y1={py(p.valor)}
          x2={px(i + 1)}
          y2={py(pts[i + 1].valor)}
          cor={t.textMuted}
        />
      ))}
      <View
        style={{
          position: 'absolute',
          left: px(pts.length - 1) - 3,
          top: py(valores[valores.length - 1]) - 3,
          width: 6,
          height: 6,
          borderRadius: 99,
          backgroundColor: t.brand,
        }}
      />
    </View>
  );
}

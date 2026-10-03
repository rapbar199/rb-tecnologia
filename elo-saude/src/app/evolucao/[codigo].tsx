import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  AvisoMock,
  Card,
  FlagBadge,
  Muted,
  Row,
  Screen,
  ScreenHeader,
  SectionTitle,
  Small,
  SourceBadge,
} from '../../components/ui';
import { EvolutionChart } from '../../components/chart';
import { font, radius, space, useTheme } from '../../theme';
import {
  analito,
  analitos,
  analitosComHistorico,
  dataCurta,
  faixaTexto,
  flagDe,
  fonte,
  serie,
} from '../../data/mock';

export default function Evolucao() {
  const t = useTheme();
  const { codigo } = useLocalSearchParams<{ codigo: string }>();
  const existe = analitos.some((a) => a.codigo === codigo);

  if (!existe) {
    return (
      <Screen>
        <ScreenHeader titulo="Indicador não encontrado" />
      </Screen>
    );
  }

  const a = analito(codigo);
  const pts = serie(a.codigo);
  const outros = analitosComHistorico().filter((x) => x.codigo !== a.codigo);

  const primeiro = pts[0];
  const ultimo = pts[pts.length - 1];
  const delta = ultimo.valor - primeiro.valor;
  const melhorou =
    (a.direcao === 'baixo-melhor' && delta < 0) ||
    (a.direcao === 'alto-melhor' && delta > 0) ||
    (a.direcao === 'faixa' && flagDe(a, ultimo.valor) === 'normal');

  const fontesUsadas = Array.from(new Set(pts.map((p) => p.fonteId)));

  return (
    <Screen>
      <ScreenHeader titulo={a.nome} sub={`${a.grupo} · LOINC ${a.loinc}`} />

      {/* Gráfico: série única ao longo do tempo, sem legenda (o título nomeia) */}
      <Card>
        <EvolutionChart a={a} pts={pts} />
      </Card>

      <Card style={{ marginTop: space.lg }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Muted>FAIXA DE REFERÊNCIA</Muted>
            <Text style={[font.h3, { color: t.text, marginTop: 3 }]}>{faixaTexto(a)}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Muted>DESDE {dataCurta(primeiro.data).toUpperCase()}</Muted>
            <Text
              style={[
                font.h3,
                { color: melhorou ? t.goodText : t.textSecondary, marginTop: 3 },
              ]}
            >
              {melhorou ? '✓ ' : ''}
              {delta > 0 ? '+' : ''}
              {Number(delta.toFixed(2))} {a.unidade}
            </Text>
          </View>
        </View>
      </Card>

      {fontesUsadas.length > 1 ? (
        <Card style={{ marginTop: space.lg }}>
          <Small style={{ lineHeight: 20 }}>
            Esta série junta resultados de {fontesUsadas.length} laboratórios
            diferentes. Isso só é possível porque os valores são casados pelo
            código LOINC <Text style={{ fontWeight: '700' }}>{a.loinc}</Text> e
            convertidos para a mesma unidade ({a.unidade}) — não pelo nome que
            cada laudo usa.
          </Small>
          <View style={{ flexDirection: 'row', gap: space.lg, marginTop: space.md, flexWrap: 'wrap' }}>
            {fontesUsadas.map((id) => (
              <SourceBadge key={id} f={fonte(id)} completo />
            ))}
          </View>
        </Card>
      ) : null}

      {/* Visão em tabela — alternativa não-visual ao gráfico */}
      <SectionTitle>Todas as medições</SectionTitle>
      <Card>
        <View
          style={{
            flexDirection: 'row',
            paddingBottom: space.sm,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: t.border,
          }}
        >
          <Text style={[font.tiny, { color: t.textMuted, flex: 1 }]}>DATA</Text>
          <Text style={[font.tiny, { color: t.textMuted, width: 64, textAlign: 'right' }]}>VALOR</Text>
          <Text style={[font.tiny, { color: t.textMuted, width: 72, textAlign: 'right' }]}>SITUAÇÃO</Text>
        </View>
        {[...pts].reverse().map((p, i) => {
          const flag = flagDe(a, p.valor);
          return (
            <Pressable
              key={p.exameId}
              onPress={() => router.push(`/exame/${p.exameId}`)}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: space.md,
                  borderBottomWidth: i === pts.length - 1 ? 0 : StyleSheet.hairlineWidth,
                  borderBottomColor: t.border,
                }}
              >
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
                  <SourceBadge f={fonte(p.fonteId)} />
                  <Text style={[font.body, { color: t.text }]}>{dataCurta(p.data)}</Text>
                </View>
                <Text
                  style={[
                    font.mono,
                    {
                      width: 64,
                      textAlign: 'right',
                      color: flag === 'normal' ? t.text : flag === 'alto' ? t.critical : t.warning,
                    },
                  ]}
                >
                  {p.valor}
                </Text>
                <View style={{ width: 72, alignItems: 'flex-end' }}>
                  <FlagBadge flag={flag} />
                </View>
              </View>
            </Pressable>
          );
        })}
      </Card>

      <SectionTitle>Outros indicadores</SectionTitle>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: space.sm }}
      >
        {outros.map((o) => (
          <Pressable key={o.codigo} onPress={() => router.replace(`/evolucao/${o.codigo}`)}>
            <View
              style={{
                paddingHorizontal: space.lg,
                paddingVertical: 9,
                borderRadius: radius.pill,
                backgroundColor: t.surface,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: t.border,
              }}
            >
              <Text style={[font.small, { color: t.text, fontWeight: '600' }]}>{o.abrev}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <View style={{ marginTop: space.xl }}>
        <AvisoMock texto="Tendência é informação, não diagnóstico. O app não sugere conduta nem interpreta o resultado — isso é papel do seu médico." />
      </View>
    </Screen>
  );
}

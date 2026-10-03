import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import {
  Card,
  H1,
  Muted,
  Row,
  Screen,
  SectionTitle,
  Small,
  SourceBadge,
  corFonte,
} from '../../components/ui';
import { Sparkline } from '../../components/chart';
import { font, radius, space, useTheme } from '../../theme';
import {
  alteradosNoExame,
  analitosComHistorico,
  dataCurta,
  exames,
  flagDe,
  fonte,
  fontes,
  serie,
} from '../../data/mock';

export default function Exames() {
  const t = useTheme();
  const [filtro, setFiltro] = useState<string | null>(null);
  const [aba, setAba] = useState<'exames' | 'evolucao'>('exames');

  const labs = fontes.filter((f) => f.status === 'conectado');
  const lista = filtro ? exames.filter((e) => e.fonteId === filtro) : exames;
  const analitos = analitosComHistorico();

  return (
    <Screen>
      <H1>Exames</H1>
      <Small style={{ marginTop: space.xs }}>
        {exames.length} exames de {labs.length} fontes, unificados por código LOINC
      </Small>

      {/* Alternância entre a lista e a visão por evolução */}
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: t.surfaceAlt,
          borderRadius: radius.md,
          padding: 3,
          marginTop: space.lg,
        }}
      >
        {(['exames', 'evolucao'] as const).map((k) => (
          <Pressable
            key={k}
            onPress={() => setAba(k)}
            style={{
              flex: 1,
              paddingVertical: 9,
              borderRadius: radius.sm,
              backgroundColor: aba === k ? t.surface : 'transparent',
              alignItems: 'center',
            }}
          >
            <Text style={[font.small, { color: aba === k ? t.text : t.textSecondary, fontWeight: '600' }]}>
              {k === 'exames' ? 'Por exame' : 'Por evolução'}
            </Text>
          </Pressable>
        ))}
      </View>

      {aba === 'exames' ? (
        <>
          {/* Filtro por fonte — uma linha acima da lista */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: space.sm, paddingVertical: space.lg }}
          >
            <Pressable onPress={() => setFiltro(null)}>
              <View
                style={{
                  paddingHorizontal: space.lg,
                  paddingVertical: 8,
                  borderRadius: radius.pill,
                  backgroundColor: filtro === null ? t.brand : t.surface,
                  borderWidth: 1,
                  borderColor: filtro === null ? t.brand : t.border,
                }}
              >
                <Text style={[font.small, { color: filtro === null ? t.onBrand : t.textSecondary, fontWeight: '600' }]}>
                  Todas
                </Text>
              </View>
            </Pressable>
            {labs.map((f) => {
              const ativo = filtro === f.id;
              return (
                <Pressable key={f.id} onPress={() => setFiltro(ativo ? null : f.id)}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      paddingHorizontal: space.md,
                      paddingVertical: 8,
                      borderRadius: radius.pill,
                      backgroundColor: ativo ? t.brandSoft : t.surface,
                      borderWidth: 1,
                      borderColor: ativo ? t.brand : t.border,
                    }}
                  >
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 99,
                        backgroundColor: corFonte(t, f),
                      }}
                    />
                    <Text style={[font.small, { color: t.text, fontWeight: '600' }]}>{f.nome}</Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>

          <Card>
            {lista.map((e, i) => {
              const alterados = alteradosNoExame(e);
              return (
                <Row
                  key={e.id}
                  titulo={e.nome}
                  sub={`${dataCurta(e.data)} · ${e.resultados.length} resultados${alterados ? ` · ${alterados} fora da faixa` : ''}`}
                  onPress={() => router.push(`/exame/${e.id}`)}
                  right={<SourceBadge f={fonte(e.fonteId)} />}
                  ultimo={i === lista.length - 1}
                />
              );
            })}
          </Card>
          <Muted style={{ marginTop: space.lg, textAlign: 'center', lineHeight: 17 }}>
            A unificação usa o código LOINC de cada analito, não o nome que o
            laboratório imprime no laudo.
          </Muted>
        </>
      ) : (
        <>
          <SectionTitle>{analitos.length} indicadores com histórico</SectionTitle>
          <Card>
            {analitos.map((a, i) => {
              const pts = serie(a.codigo);
              const ultimo = pts[pts.length - 1];
              const flag = flagDe(a, ultimo.valor);
              return (
                <Row
                  key={a.codigo}
                  titulo={a.nome}
                  sub={`${pts.length} medições · ${a.grupo}`}
                  onPress={() => router.push(`/evolucao/${a.codigo}`)}
                  right={
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
                      <Sparkline pts={pts} />
                      <View style={{ alignItems: 'flex-end', minWidth: 58 }}>
                        <Text style={[font.mono, { color: t.text }]}>{ultimo.valor}</Text>
                        <Text
                          style={[
                            font.tiny,
                            { color: flag === 'normal' ? t.goodText : flag === 'alto' ? t.critical : t.warning },
                          ]}
                        >
                          {flag === 'normal' ? '✓ OK' : flag === 'alto' ? '↑ ALTO' : '↓ BAIXO'}
                        </Text>
                      </View>
                    </View>
                  }
                  ultimo={i === analitos.length - 1}
                />
              );
            })}
          </Card>
        </>
      )}
    </Screen>
  );
}

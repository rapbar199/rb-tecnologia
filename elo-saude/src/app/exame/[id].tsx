import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  AvisoMock,
  Body,
  Card,
  FlagBadge,
  Muted,
  Screen,
  ScreenHeader,
  SectionTitle,
  Small,
  SourceBadge,
} from '../../components/ui';
import { font, radius, space, useTheme } from '../../theme';
import {
  analito,
  dataCurta,
  exames,
  faixaTexto,
  flagDe,
  fonte,
  serie,
} from '../../data/mock';

export default function DetalheExame() {
  const t = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const exame = exames.find((e) => e.id === id);

  if (!exame) {
    return (
      <Screen>
        <ScreenHeader titulo="Exame não encontrado" />
      </Screen>
    );
  }

  const f = fonte(exame.fonteId);
  const alterados = exame.resultados.filter((r) => flagDe(analito(r.codigo), r.valor) !== 'normal');

  // Agrupa por painel (Lipídios, Hemograma...) como o laudo faria
  const grupos = exame.resultados.reduce<Record<string, typeof exame.resultados>>((acc, r) => {
    const g = analito(r.codigo).grupo;
    (acc[g] ??= []).push(r);
    return acc;
  }, {});

  return (
    <Screen>
      <ScreenHeader titulo={exame.nome} sub={dataCurta(exame.data)} />

      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
          <SourceBadge f={f} completo />
        </View>
        <View
          style={{
            height: StyleSheet.hairlineWidth,
            backgroundColor: t.border,
            marginVertical: space.md,
          }}
        />
        <Small>Solicitado por</Small>
        <Body style={{ marginTop: 2 }}>{exame.solicitante}</Body>

        <View style={{ flexDirection: 'row', gap: space.xl, marginTop: space.lg }}>
          <View>
            <Text style={{ color: t.text, fontSize: 22, fontWeight: '700' }}>
              {exame.resultados.length}
            </Text>
            <Muted>resultados</Muted>
          </View>
          <View>
            <Text
              style={{
                color: alterados.length ? t.critical : t.goodText,
                fontSize: 22,
                fontWeight: '700',
              }}
            >
              {alterados.length}
            </Text>
            <Muted>fora da faixa</Muted>
          </View>
        </View>
      </Card>

      {exame.temPdf ? (
        <View style={{ marginTop: space.lg }}>
          <Pressable
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              gap: space.md,
              backgroundColor: t.surface,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: t.border,
              borderRadius: radius.lg,
              padding: space.lg,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text style={{ fontSize: 20 }}>📄</Text>
            <View style={{ flex: 1 }}>
              <Text style={[font.h3, { color: t.text }]}>Laudo original em PDF</Text>
              <Small>4 páginas · do {f.nome}</Small>
            </View>
            <Text style={{ color: t.textMuted, fontSize: 20 }}>›</Text>
          </Pressable>
        </View>
      ) : null}

      {Object.entries(grupos).map(([grupo, resultados]) => (
        <View key={grupo}>
          <SectionTitle>{grupo}</SectionTitle>
          <Card>
            {/* Cabeçalho da tabela */}
            <View
              style={{
                flexDirection: 'row',
                paddingBottom: space.sm,
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: t.border,
              }}
            >
              <Text style={[font.tiny, { color: t.textMuted, flex: 1 }]}>EXAME</Text>
              <Text style={[font.tiny, { color: t.textMuted, width: 58, textAlign: 'right' }]}>
                VALOR
              </Text>
              <Text style={[font.tiny, { color: t.textMuted, width: 70, textAlign: 'right' }]}>
                SITUAÇÃO
              </Text>
              <Text style={{ width: 19 }} />
            </View>

            {resultados.map((r, i) => {
              const a = analito(r.codigo);
              const flag = flagDe(a, r.valor);
              const temHistorico = serie(a.codigo).length >= 2;
              return (
                <Pressable
                  key={r.codigo}
                  onPress={temHistorico ? () => router.push(`/evolucao/${a.codigo}`) : undefined}
                  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: space.md,
                      borderBottomWidth: i === resultados.length - 1 ? 0 : StyleSheet.hairlineWidth,
                      borderBottomColor: t.border,
                    }}
                  >
                    <View style={{ flex: 1, paddingRight: space.sm }}>
                      <Text style={[font.body, { color: t.text, fontWeight: '500' }]} numberOfLines={1}>
                        {a.nome}
                      </Text>
                      <Muted style={{ marginTop: 2 }}>Ref: {faixaTexto(a)}</Muted>
                    </View>
                    <Text
                      style={[
                        font.mono,
                        {
                          width: 58,
                          textAlign: 'right',
                          color: flag === 'normal' ? t.text : flag === 'alto' ? t.critical : t.warning,
                        },
                      ]}
                    >
                      {r.valor}
                    </Text>
                    <View style={{ width: 70, alignItems: 'flex-end' }}>
                      <FlagBadge flag={flag} />
                    </View>
                    <Text style={{ color: temHistorico ? t.textMuted : 'transparent', fontSize: 17, marginLeft: 2 }}>
                      ›
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </Card>
        </View>
      ))}

      <View style={{ marginTop: space.xl }}>
        <AvisoMock texto="O app organiza e mostra tendências — não interpreta nem substitui avaliação médica. Resultado fora da faixa deve ser discutido com seu médico." />
      </View>
    </Screen>
  );
}

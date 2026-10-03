import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import {
  AvisoMock,
  Body,
  Button,
  Card,
  FlagBadge,
  H2,
  Muted,
  Screen,
  ScreenHeader,
  SectionTitle,
  Small,
} from '../components/ui';
import { font, radius, space, useTheme } from '../theme';
import { analito, faixaTexto, flagDe, perfil } from '../data/mock';

const OPCOES = [
  { id: 'foto', icone: '📷', titulo: 'Tirar foto do laudo', texto: 'Funciona com papel. A leitura é feita na imagem.' },
  { id: 'pdf', icone: '📄', titulo: 'Enviar PDF', texto: 'O arquivo que o laboratório manda por e-mail ou site.' },
  { id: 'email', icone: '✉️', titulo: 'Encaminhar por e-mail', texto: 'Mande para o seu endereço e o exame entra sozinho.' },
  { id: 'manual', icone: '⌨️', titulo: 'Digitar manualmente', texto: 'Para exame antigo que só existe no papel.' },
];

/** Resultado que a leitura "encontraria" — mockado para a demo. */
const EXTRAIDO = [
  { codigo: 'colesterol', valor: 178 },
  { codigo: 'ldl', valor: 104 },
  { codigo: 'hdl', valor: 51 },
  { codigo: 'triglicerideos', valor: 115 },
];

type Etapa = 'escolha' | 'email' | 'processando' | 'revisao' | 'salvo';

export default function Adicionar() {
  const t = useTheme();
  const [etapa, setEtapa] = useState<Etapa>('escolha');

  useEffect(() => {
    if (etapa !== 'processando') return;
    const timer = setTimeout(() => setEtapa('revisao'), 2200);
    return () => clearTimeout(timer);
  }, [etapa]);

  if (etapa === 'processando') {
    return (
      <Screen>
        <ScreenHeader titulo="Lendo o laudo…" />
        <Card style={{ alignItems: 'center', paddingVertical: space.xxl }}>
          <ActivityIndicator size="large" color={t.brand} />
          <H2>Extraindo os resultados</H2>
          <Small style={{ textAlign: 'center', marginTop: space.md, lineHeight: 20 }}>
            Identificando cada analito, a unidade e a faixa de referência que o
            laboratório usou — e casando com o código LOINC para entrar na sua
            série histórica.
          </Small>
        </Card>
      </Screen>
    );
  }

  if (etapa === 'revisao') {
    return (
      <Screen>
        <ScreenHeader titulo="Confira antes de salvar" sub="Perfil lipídico · 28 set 2026" />

        <Card>
          <Small style={{ lineHeight: 20 }}>
            A leitura encontrou {EXTRAIDO.length} resultados. Você confirma antes
            de entrar no histórico — leitura automática erra, e exame errado no
            histórico é pior que exame nenhum.
          </Small>
        </Card>

        <SectionTitle>Resultados encontrados</SectionTitle>
        <Card>
          {EXTRAIDO.map((r, i) => {
            const a = analito(r.codigo);
            const flag = flagDe(a, r.valor);
            return (
              <View
                key={r.codigo}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: space.md,
                  borderBottomWidth: i === EXTRAIDO.length - 1 ? 0 : StyleSheet.hairlineWidth,
                  borderBottomColor: t.border,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Body>{a.nome}</Body>
                  <Muted style={{ marginTop: 2 }}>Ref: {faixaTexto(a)}</Muted>
                </View>
                <Text style={[font.mono, { color: t.text, width: 64, textAlign: 'right' }]}>
                  {r.valor}
                </Text>
                <View style={{ width: 72, alignItems: 'flex-end' }}>
                  <FlagBadge flag={flag} />
                </View>
              </View>
            );
          })}
        </Card>

        <View style={{ marginTop: space.xl, gap: space.md }}>
          <Button onPress={() => setEtapa('salvo')}>Salvar no meu histórico</Button>
          <Button variante="secundario" onPress={() => setEtapa('escolha')}>
            Corrigir algum valor
          </Button>
        </View>
      </Screen>
    );
  }

  if (etapa === 'salvo') {
    return (
      <Screen>
        <ScreenHeader titulo="Salvo" />
        <Card style={{ alignItems: 'center', paddingVertical: space.xxl }}>
          <Text style={{ fontSize: 36 }}>✅</Text>
          <H2>Exame no histórico</H2>
          <Small style={{ textAlign: 'center', marginTop: space.md, lineHeight: 20 }}>
            Os 4 resultados entraram nas séries de LDL, HDL, colesterol total e
            triglicerídeos. Os gráficos de evolução já incluem este ponto.
          </Small>
        </Card>
        <View style={{ marginTop: space.lg }}>
          <Button onPress={() => router.back()}>Fechar</Button>
        </View>
      </Screen>
    );
  }

  if (etapa === 'email') {
    return (
      <Screen>
        <ScreenHeader titulo="Sua caixa de entrada" sub="Encaminhe o resultado para cá" />
        <Card>
          <Small style={{ lineHeight: 20 }}>
            Este endereço é só seu. Qualquer laudo que chegar nele é lido,
            organizado e adicionado ao seu histórico automaticamente.
          </Small>
          <View
            style={{
              backgroundColor: t.surfaceAlt,
              borderRadius: radius.md,
              padding: space.lg,
              marginTop: space.lg,
            }}
          >
            <Text style={[font.h3, { color: t.brand }]} selectable>
              {perfil.caixaEntrada}
            </Text>
          </View>
          <Small style={{ lineHeight: 20, marginTop: space.lg }}>
            Dá para configurar uma regra no seu e-mail para encaminhar sozinho
            tudo que vier do laboratório — aí o histórico se mantém sem você
            fazer nada.
          </Small>
        </Card>
        <View style={{ marginTop: space.xl }}>
          <Button variante="secundario" onPress={() => setEtapa('escolha')}>
            Voltar
          </Button>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader titulo="Adicionar exame" sub="Quatro caminhos, nenhum deles pede sua senha" />

      <View style={{ gap: space.md }}>
        {OPCOES.map((o) => (
          <Pressable
            key={o.id}
            onPress={() => setEtapa(o.id === 'email' ? 'email' : 'processando')}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <Card>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.lg }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: radius.md,
                    backgroundColor: t.brandSoft,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 20 }}>{o.icone}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[font.h3, { color: t.text }]}>{o.titulo}</Text>
                  <Small style={{ marginTop: 2, lineHeight: 19 }}>{o.texto}</Small>
                </View>
                <Text style={{ color: t.textMuted, fontSize: 20 }}>›</Text>
              </View>
            </Card>
          </Pressable>
        ))}
      </View>

      <View style={{ marginTop: space.xl }}>
        <AvisoMock texto="Protótipo: as opções simulam a leitura com um resultado de exemplo. Não há câmera, upload nem envio de arquivo." />
      </View>
    </Screen>
  );
}

import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  AvisoMock,
  Body,
  Button,
  Card,
  H2,
  Muted,
  Screen,
  ScreenHeader,
  SectionTitle,
  Small,
  SourceBadge,
} from '../../components/ui';
import { font, radius, space, useTheme } from '../../theme';
import { consentimentos, dataCurta, fontes } from '../../data/mock';

type Etapa = 'escopo' | 'autenticando' | 'pronto';

export default function Conectar() {
  const t = useTheme();
  const { fonteId } = useLocalSearchParams<{ fonteId: string }>();
  const f = fontes.find((x) => x.id === fonteId);

  const jaConectada = f?.status === 'conectado';
  const [etapa, setEtapa] = useState<Etapa>('escopo');
  const [marcados, setMarcados] = useState<string[]>(f?.escopos ?? []);

  if (!f) {
    return (
      <Screen>
        <ScreenHeader titulo="Fonte não encontrada" />
      </Screen>
    );
  }

  const consentimento = consentimentos.find((c) => c.fonteId === f.id);

  const alternar = (e: string) =>
    setMarcados((m) => (m.includes(e) ? m.filter((x) => x !== e) : [...m, e]));

  if (etapa === 'autenticando') {
    return (
      <Screen>
        <ScreenHeader titulo="Autorizando…" sub={f.nome} />
        <Card style={{ alignItems: 'center', paddingVertical: space.xxl }}>
          <Text style={{ fontSize: 36 }}>🔐</Text>
          <H2>Você sai do app agora</H2>
          <Small style={{ textAlign: 'center', marginTop: space.md, lineHeight: 20 }}>
            No app real, aqui abriria o login oficial do {f.nome} — {f.metodo.toLowerCase()}.
            A autenticação acontece no ambiente deles, e o Elo Saúde nunca vê sua senha.
          </Small>
          <View style={{ height: space.xl }} />
          <Button onPress={() => setEtapa('pronto')}>Simular autorização</Button>
        </Card>
        <View style={{ marginTop: space.lg }}>
          <AvisoMock texto="Protótipo: nada é enviado para fora do aparelho e nenhuma credencial é pedida." />
        </View>
      </Screen>
    );
  }

  if (etapa === 'pronto') {
    return (
      <Screen>
        <ScreenHeader titulo="Conectado" sub={f.nome} />
        <Card style={{ alignItems: 'center', paddingVertical: space.xxl }}>
          <Text style={{ fontSize: 36 }}>✅</Text>
          <H2>{f.nome} conectado</H2>
          <Small style={{ textAlign: 'center', marginTop: space.md, lineHeight: 20 }}>
            {marcados.length} tipos de dado autorizados. A primeira sincronização
            traria o histórico disponível; depois disso, só o que for novo.
          </Small>
        </Card>
        <View style={{ marginTop: space.lg }}>
          <Button onPress={() => router.back()}>Voltar para conexões</Button>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader
        titulo={jaConectada ? 'Autorização ativa' : `Conectar ${f.nome}`}
        sub={f.metodo}
      />

      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
          <SourceBadge f={f} completo />
        </View>
        {consentimento ? (
          <>
            <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: t.border, marginVertical: space.md }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Muted>AUTORIZADO EM</Muted>
                <Body style={{ marginTop: 2 }}>{dataCurta(consentimento.concedidoEm)}</Body>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Muted>VENCE EM</Muted>
                <Body style={{ marginTop: 2 }}>{dataCurta(consentimento.validadeEm)}</Body>
              </View>
            </View>
          </>
        ) : null}
      </Card>

      <SectionTitle>O que você autoriza</SectionTitle>
      <Card>
        <Small style={{ lineHeight: 20, marginBottom: space.md }}>
          Dado de saúde é dado sensível. A autorização precisa ser específica —
          por isso você escolhe item por item, e não um "aceito tudo".
        </Small>
        {f.escopos.map((e, i) => {
          const on = marcados.includes(e);
          return (
            <Pressable
              key={e}
              onPress={() => alternar(e)}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: space.md,
                  paddingVertical: space.md,
                  borderBottomWidth: i === f.escopos.length - 1 ? 0 : StyleSheet.hairlineWidth,
                  borderBottomColor: t.border,
                }}
              >
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    borderWidth: 2,
                    borderColor: on ? t.brand : t.axis,
                    backgroundColor: on ? t.brand : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {on ? <Text style={{ color: '#fff', fontSize: 12, fontWeight: '900' }}>✓</Text> : null}
                </View>
                <Text style={[font.body, { color: t.text, flex: 1 }]}>{e}</Text>
              </View>
            </Pressable>
          );
        })}
      </Card>

      <SectionTitle>Prazo e revogação</SectionTitle>
      <Card>
        <Small style={{ lineHeight: 20 }}>
          A autorização vale por 12 meses e depois precisa ser renovada por você.
          Pode ser revogada a qualquer momento, e a revogação apaga os dados que
          vieram desta fonte.
        </Small>
      </Card>

      <View style={{ marginTop: space.xl, gap: space.md }}>
        {jaConectada ? (
          <>
            <Button variante="secundario" onPress={() => router.back()}>
              Salvar alterações
            </Button>
            <Button variante="perigo" onPress={() => router.back()}>
              Revogar e apagar dados desta fonte
            </Button>
          </>
        ) : (
          <Button onPress={() => setEtapa('autenticando')}>
            Autorizar {marcados.length} {marcados.length === 1 ? 'item' : 'itens'}
          </Button>
        )}
      </View>
    </Screen>
  );
}

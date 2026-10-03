import { Text, View } from 'react-native';
import { router } from 'expo-router';
import {
  AvisoMock,
  Button,
  Card,
  Muted,
  Pill,
  Row,
  Screen,
  ScreenHeader,
  SectionTitle,
  Small,
  SourceBadge,
} from '../components/ui';
import { font, radius, space, useTheme } from '../theme';
import {
  Acesso,
  consentimentos,
  dataCurta,
  dataHora,
  fonte,
  trilhaAcesso,
} from '../data/mock';

const ICONE_ACESSO: Record<Acesso['tipo'], string> = {
  voce: '👤',
  medico: '🩺',
  sistema: '🔄',
};

export default function Privacidade() {
  const t = useTheme();

  return (
    <Screen>
      <ScreenHeader titulo="Privacidade" sub="Seus dados, suas autorizações, seu registro de acesso" />

      <Card>
        <Small style={{ lineHeight: 20 }}>
          Dado de saúde é dado sensível pela LGPD. Isso significa autorização
          específica e destacada para cada finalidade, e nunca compartilhamento
          com terceiro para fim comercial.
        </Small>
        <View
          style={{
            backgroundColor: t.surfaceAlt,
            borderRadius: radius.md,
            padding: space.md,
            marginTop: space.md,
            gap: space.sm,
          }}
        >
          {[
            'Nunca vendemos nem cedemos seus dados',
            'Nunca pedimos senha de portal de laboratório',
            'Você pode exportar ou apagar tudo a qualquer momento',
          ].map((l) => (
            <View key={l} style={{ flexDirection: 'row', gap: space.sm, alignItems: 'flex-start' }}>
              <Text style={{ color: t.goodText, fontSize: 12, fontWeight: '900', marginTop: 2 }}>✓</Text>
              <Small style={{ flex: 1, lineHeight: 19 }}>{l}</Small>
            </View>
          ))}
        </View>
      </Card>

      <SectionTitle>Autorizações ativas · {consentimentos.length}</SectionTitle>
      <Card>
        {consentimentos.map((c, i) => {
          const f = fonte(c.fonteId);
          return (
            <Row
              key={c.fonteId}
              titulo={f.nome}
              sub={`${c.escopos.length} tipos de dado · vence ${dataCurta(c.validadeEm)}`}
              left={<SourceBadge f={f} />}
              onPress={() => router.push(`/conectar/${f.id}`)}
              ultimo={i === consentimentos.length - 1}
            />
          );
        })}
      </Card>

      <SectionTitle>Trilha de acesso</SectionTitle>
      <Card>
        <Small style={{ lineHeight: 20, marginBottom: space.sm }}>
          Todo acesso aos seus dados fica registrado — inclusive os seus e os do
          próprio sistema.
        </Small>
        {trilhaAcesso.map((a, i) => (
          <Row
            key={a.id}
            titulo={a.quem}
            sub={`${a.oque} · ${dataHora(a.quando)}`}
            left={
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: radius.sm,
                  backgroundColor: t.surfaceAlt,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 14 }}>{ICONE_ACESSO[a.tipo]}</Text>
              </View>
            }
            ultimo={i === trilhaAcesso.length - 1}
          />
        ))}
      </Card>

      <SectionTitle>Seus direitos</SectionTitle>
      <Card>
        <Row titulo="Exportar meus dados" sub="Arquivo aberto, legível por outro app" onPress={() => {}} />
        <Row titulo="Corrigir uma informação" sub="Resultado lido errado, dado desatualizado" onPress={() => {}} />
        <Row titulo="Revogar todas as conexões" sub="Mantém o histórico já baixado" onPress={() => {}} ultimo />
      </Card>

      <View style={{ marginTop: space.xl, gap: space.md }}>
        <Button variante="perigo" onPress={() => {}}>
          Apagar minha conta e todos os dados
        </Button>
        <Muted style={{ textAlign: 'center', lineHeight: 17 }}>
          A exclusão é definitiva e imediata. Nada fica em backup além do prazo
          legal mínimo.
        </Muted>
      </View>

      <View style={{ marginTop: space.xl }}>
        <AvisoMock texto="Protótipo: os botões desta tela não executam nada. O texto descreve o comportamento pretendido no app real." />
      </View>
    </Screen>
  );
}

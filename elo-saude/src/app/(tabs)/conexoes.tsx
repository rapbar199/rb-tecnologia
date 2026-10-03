import { Text, View } from 'react-native';
import { router } from 'expo-router';
import {
  AvisoMock,
  Card,
  H1,
  Muted,
  Pill,
  Row,
  Screen,
  SectionTitle,
  Small,
  SourceBadge,
} from '../../components/ui';
import { font, radius, space, useTheme } from '../../theme';
import { Fonte, dataHora, fontesConectaveis, perfil } from '../../data/mock';

const ROTULO_TIPO: Record<Fonte['tipo'], string> = {
  lab: 'Laboratório',
  sus: 'Rede pública',
  operadora: 'Plano de saúde',
  wearable: 'Aparelho',
  manual: 'Manual',
};

export default function Conexoes() {
  const t = useTheme();
  const conectadas = fontesConectaveis.filter((f) => f.status === 'conectado');
  const disponiveis = fontesConectaveis.filter((f) => f.status === 'disponivel');
  const emBreve = fontesConectaveis.filter((f) => f.status === 'em-breve');

  return (
    <Screen>
      <H1>Conexões</H1>
      <Small style={{ marginTop: space.xs, lineHeight: 20 }}>
        Cada fonte precisa da sua autorização, com escopo e prazo definidos. Você
        pode revogar qualquer uma a qualquer momento.
      </Small>

      <SectionTitle>Conectadas · {conectadas.length}</SectionTitle>
      <Card>
        {conectadas.map((f, i) => (
          <Row
            key={f.id}
            titulo={f.nome}
            sub={`${ROTULO_TIPO[f.tipo]} · sinc. ${dataHora(f.ultimaSync!).replace(/ 20\d\d /, ' ')}`}
            left={<SourceBadge f={f} />}
            onPress={() => router.push(`/conectar/${f.id}`)}
            right={
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={{ color: t.goodText, fontSize: 12, fontWeight: '800' }}>✓</Text>
                <Text style={[font.tiny, { color: t.goodText }]}>ATIVA</Text>
              </View>
            }
            ultimo={i === conectadas.length - 1}
          />
        ))}
      </Card>

      <SectionTitle>Disponíveis</SectionTitle>
      <Card>
        {disponiveis.map((f, i) => (
          <Row
            key={f.id}
            titulo={f.nome}
            sub={`${ROTULO_TIPO[f.tipo]} · ${f.escopos.length} tipos de dado`}
            left={<SourceBadge f={f} />}
            onPress={() => router.push(`/conectar/${f.id}`)}
            right={<Text style={[font.small, { color: t.brand, fontWeight: '700' }]}>Conectar</Text>}
            ultimo={i === disponiveis.length - 1}
          />
        ))}
      </Card>

      <SectionTitle>Em breve</SectionTitle>
      <Card>
        {emBreve.map((f, i) => (
          <Row
            key={f.id}
            titulo={f.nome}
            sub={f.metodo}
            left={<View style={{ opacity: 0.45 }}><SourceBadge f={f} /></View>}
            right={<Pill>EM BREVE</Pill>}
            ultimo={i === emBreve.length - 1}
          />
        ))}
      </Card>

      <SectionTitle>Sua caixa de entrada de exames</SectionTitle>
      <Card>
        <Small style={{ lineHeight: 20 }}>
          Encaminhe (ou peça ao laboratório para enviar) o resultado para este
          endereço. O exame entra no seu histórico sozinho, já organizado.
        </Small>
        <View
          style={{
            backgroundColor: t.surfaceAlt,
            borderRadius: radius.md,
            padding: space.md,
            marginTop: space.md,
          }}
        >
          <Text style={[font.small, { color: t.brand, fontWeight: '700' }]} selectable>
            {perfil.caixaEntrada}
          </Text>
        </View>
      </Card>

      <SectionTitle>Como a gente consegue os dados</SectionTitle>
      <Card>
        <Small style={{ lineHeight: 20 }}>
          Não existe no Brasil um padrão obrigatório de API para dados de saúde —
          o Open Health foi desenhado pelo Ministério da Saúde e pela ANS, mas
          ainda não é obrigatório para laboratórios e operadoras.
        </Small>
        <Small style={{ lineHeight: 20, marginTop: space.md }}>
          Enquanto isso, cada fonte entra pelo caminho que existe de verdade:
          login gov.br para a rede pública, leitura do laudo para laboratórios,
          e API oficial para os dados do próprio aparelho. Nunca pedimos a sua
          senha do portal do laboratório.
        </Small>
        <View style={{ marginTop: space.lg }}>
          <AvisoMock texto="Neste protótipo os fluxos de conexão são simulados — nenhuma credencial é pedida e nenhum dado sai do aparelho." />
        </View>
      </Card>

      <Muted style={{ marginTop: space.xl, textAlign: 'center', lineHeight: 17 }}>
        Consentimentos ativos e trilha de acesso ficam em Perfil › Privacidade.
      </Muted>
    </Screen>
  );
}

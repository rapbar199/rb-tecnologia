import { Text, View } from 'react-native';
import { router } from 'expo-router';
import {
  Card,
  H1,
  Muted,
  Pill,
  Row,
  Screen,
  SectionTitle,
  Small,
  StatTile,
} from '../../components/ui';
import { font, radius, space, useTheme } from '../../theme';
import { idade, perfil } from '../../data/mock';

export default function Perfil() {
  const t = useTheme();
  const imc = perfil.peso / Math.pow(perfil.altura / 100, 2);

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.lg }}>
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: radius.pill,
            backgroundColor: t.brandSoft,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: '700', color: t.brand }}>
            {perfil.nome.split(' ').map((p) => p[0]).join('')}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <H1>{perfil.nome}</H1>
          <Small style={{ marginTop: 2 }}>
            {idade(perfil.nascimento)} anos · {perfil.tipoSanguineo} · CPF {perfil.cpfMascarado}
          </Small>
        </View>
      </View>

      <Card style={{ marginTop: space.lg }}>
        <View style={{ flexDirection: 'row' }}>
          <StatTile valor={perfil.tipoSanguineo} rotulo="tipo sanguíneo" />
          <StatTile valor={`${perfil.peso} kg`} rotulo="peso" />
          <StatTile valor={imc.toFixed(1)} rotulo="IMC" />
        </View>
      </Card>

      <SectionTitle>Informações críticas</SectionTitle>
      <Card>
        <Small style={{ marginBottom: space.sm }}>Alergias</Small>
        <View style={{ flexDirection: 'row', gap: space.sm, flexWrap: 'wrap' }}>
          {perfil.alergias.map((a) => (
            <View
              key={a}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                paddingHorizontal: space.md,
                paddingVertical: 6,
                borderRadius: radius.pill,
                borderWidth: 1,
                borderColor: t.critical,
              }}
            >
              <Text style={{ color: t.critical, fontSize: 11, fontWeight: '800' }}>⚠</Text>
              <Text style={[font.tiny, { color: t.critical }]}>{a.toUpperCase()}</Text>
            </View>
          ))}
        </View>

        <Small style={{ marginTop: space.lg, marginBottom: space.sm }}>Condições</Small>
        <View style={{ flexDirection: 'row', gap: space.sm, flexWrap: 'wrap' }}>
          {perfil.condicoes.map((c) => (
            <Pill key={c}>{c.toUpperCase()}</Pill>
          ))}
        </View>
      </Card>

      <SectionTitle>Plano de saúde</SectionTitle>
      <Card>
        <Row titulo={perfil.planoSaude.operadora} sub={perfil.planoSaude.plano} valor={perfil.planoSaude.carteirinha} ultimo />
      </Card>

      <SectionTitle>Contato de emergência</SectionTitle>
      <Card>
        <Row
          titulo={perfil.emergencia.nome}
          sub={`${perfil.emergencia.relacao} · ${perfil.emergencia.telefone}`}
          onPress={() => router.push('/emergencia')}
          ultimo
        />
      </Card>

      <SectionTitle>Meus dados</SectionTitle>
      <Card>
        <Row titulo="Medicamentos" onPress={() => router.push('/medicamentos')} />
        <Row titulo="Vacinas" onPress={() => router.push('/vacinas')} />
        <Row titulo="Documentos e laudos" onPress={() => router.push('/documentos')} />
        <Row titulo="Família e dependentes" onPress={() => router.push('/familia')} />
        <Row titulo="Compartilhamentos" sub="Links gerados para médicos" onPress={() => router.push('/compartilhar')} ultimo />
      </Card>

      <SectionTitle>Privacidade</SectionTitle>
      <Card>
        <Row
          titulo="Consentimentos e trilha de acesso"
          sub="Quem acessou o quê, e quando"
          onPress={() => router.push('/privacidade')}
          ultimo
        />
      </Card>

      <Muted style={{ marginTop: space.xl, textAlign: 'center', lineHeight: 17 }}>
        Elo Saúde · protótipo 0.1{'\n'}Dados fictícios · RB Tecnologia
      </Muted>
    </Screen>
  );
}

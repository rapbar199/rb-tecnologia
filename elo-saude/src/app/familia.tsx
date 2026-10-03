import { Text, View } from 'react-native';
import {
  AvisoMock,
  Button,
  Card,
  Pill,
  Row,
  Screen,
  ScreenHeader,
  SectionTitle,
  Small,
} from '../components/ui';
import { radius, space, useTheme } from '../theme';
import { familiares, perfil } from '../data/mock';

export default function Familia() {
  const t = useTheme();

  return (
    <Screen>
      <ScreenHeader titulo="Família" sub="Perfis que você administra" />

      <Card>
        <Small style={{ lineHeight: 20 }}>
          Quem cuida da saúde da casa normalmente cuida de três ou quatro
          históricos, não só do próprio. Cada dependente tem perfil separado, com
          conexões e autorizações próprias.
        </Small>
      </Card>

      <SectionTitle>Perfis</SectionTitle>
      <Card>
        <Row
          titulo={`${perfil.nome} (você)`}
          sub="Titular · 4 fontes conectadas"
          left={
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: radius.pill,
                backgroundColor: t.brand,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>
                {perfil.nome.split(' ').map((p) => p[0]).join('')}
              </Text>
            </View>
          }
        />
        {familiares.map((f, i) => (
          <Row
            key={f.id}
            titulo={f.nome}
            sub={`${f.relacao} · ${f.idade} anos`}
            left={
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: radius.pill,
                  backgroundColor: t.surfaceAlt,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: t.textSecondary, fontSize: 13, fontWeight: '700' }}>
                  {f.nome.split(' ').map((p) => p[0]).join('')}
                </Text>
              </View>
            }
            right={<Pill cor={t.warning}>{f.pendencia.toUpperCase()}</Pill>}
            onPress={() => {}}
            ultimo={i === familiares.length - 1}
          />
        ))}
      </Card>

      <View style={{ marginTop: space.xl }}>
        <Button variante="secundario" onPress={() => {}}>
          + Adicionar dependente
        </Button>
      </View>

      <SectionTitle>Autorização de menores</SectionTitle>
      <Card>
        <Small style={{ lineHeight: 20 }}>
          Para menor de idade, a autorização é dada pelo responsável legal e
          precisa ser renovada quando o dependente completa 18 anos — a partir
          daí o perfil passa a ser dele, não seu.
        </Small>
      </Card>

      <View style={{ marginTop: space.xl }}>
        <AvisoMock texto="Protótipo: os perfis de dependente são ilustrativos e não abrem." />
      </View>
    </Screen>
  );
}

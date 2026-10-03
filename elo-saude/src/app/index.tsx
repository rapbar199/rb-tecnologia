import { View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Body, Button, H1, Muted, Small } from '../components/ui';
import { font, radius, space, useTheme } from '../theme';
import { Text } from 'react-native';

const PASSOS = [
  { icone: '🔗', titulo: 'Conecte suas fontes', texto: 'Laboratórios, Meu SUS Digital, plano de saúde e o app de saúde do celular.' },
  { icone: '📄', titulo: 'Tudo vira histórico', texto: 'Seus exames são lidos, organizados e unificados numa linha do tempo só sua.' },
  { icone: '📈', titulo: 'Veja a evolução', texto: 'O mesmo exame de labs diferentes, no mesmo gráfico, ao longo dos anos.' },
];

export default function Login() {
  const t = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.page }}>
      <View style={{ flex: 1, padding: space.xl, justifyContent: 'space-between' }}>
        <View>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: radius.lg,
              backgroundColor: t.brand,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: space.xl,
            }}
          >
            <Text style={{ fontSize: 28 }}>🫀</Text>
          </View>

          <H1>Elo Saúde</H1>
          <Body muted style={{ marginTop: space.sm, fontSize: 17, lineHeight: 24 }}>
            Sua saúde inteira num só lugar. Você autoriza, a gente reúne.
          </Body>

          <View style={{ marginTop: space.xxl, gap: space.xl }}>
            {PASSOS.map((p) => (
              <View key={p.titulo} style={{ flexDirection: 'row', gap: space.lg }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: radius.md,
                    backgroundColor: t.brandSoft,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 18 }}>{p.icone}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[font.h3, { color: t.text }]}>{p.titulo}</Text>
                  <Small style={{ marginTop: 3, lineHeight: 19 }}>{p.texto}</Small>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ gap: space.md }}>
          <Button onPress={() => router.replace('/(tabs)')}>Entrar com gov.br</Button>
          <Button variante="secundario" onPress={() => router.replace('/(tabs)')}>
            Entrar com e-mail
          </Button>
          <Muted style={{ textAlign: 'center', marginTop: space.sm, lineHeight: 17 }}>
            Protótipo com dados fictícios. Nenhuma informação real é coletada,
            enviada ou armazenada.
          </Muted>
        </View>
      </View>
    </SafeAreaView>
  );
}

import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { Button, Muted, Small } from '../components/ui';
import { font, radius, space, useTheme } from '../theme';
import { idade, medicamentos, perfil } from '../data/mock';

/**
 * Cartão de emergência. Deliberadamente fora do tema do resto do app: fundo
 * escuro fixo e tipografia grande, para ser lido por um terceiro em situação
 * de pressa, inclusive com a tela na mão de outra pessoa.
 */
export default function Emergencia() {
  const t = useTheme();
  const emUso = medicamentos.filter((m) => m.ativo);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0b0b0b' }}>
      <ScrollView contentContainerStyle={{ padding: space.xl, paddingBottom: space.xxl * 2 }}>
        <View
          style={{
            alignSelf: 'flex-start',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: '#d03b3b',
            paddingHorizontal: space.md,
            paddingVertical: 6,
            borderRadius: radius.pill,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '900' }}>✚</Text>
          <Text style={[font.tiny, { color: '#fff' }]}>CARTÃO DE EMERGÊNCIA</Text>
        </View>

        <Text style={{ color: '#fff', fontSize: 32, fontWeight: '700', marginTop: space.lg }}>
          {perfil.nome}
        </Text>
        <Text style={{ color: '#c3c2b7', fontSize: 16, marginTop: 4 }}>
          {idade(perfil.nascimento)} anos · CNS {perfil.cns}
        </Text>

        <View style={{ flexDirection: 'row', gap: space.md, marginTop: space.xl }}>
          <View style={{ flex: 1, backgroundColor: '#1a1a19', borderRadius: radius.lg, padding: space.lg }}>
            <Text style={[font.tiny, { color: '#898781' }]}>TIPO SANGUÍNEO</Text>
            <Text style={{ color: '#fff', fontSize: 34, fontWeight: '700', marginTop: 2 }}>
              {perfil.tipoSanguineo}
            </Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#1a1a19', borderRadius: radius.lg, padding: space.lg }}>
            <Text style={[font.tiny, { color: '#898781' }]}>PESO</Text>
            <Text style={{ color: '#fff', fontSize: 34, fontWeight: '700', marginTop: 2 }}>
              {perfil.peso}
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#c3c2b7' }}> kg</Text>
            </Text>
          </View>
        </View>

        {/* Alergias em destaque máximo — é o dado que mata se for ignorado */}
        <View
          style={{
            backgroundColor: '#2a1010',
            borderWidth: 2,
            borderColor: '#d03b3b',
            borderRadius: radius.lg,
            padding: space.lg,
            marginTop: space.md,
          }}
        >
          <Text style={[font.tiny, { color: '#ff8a8a' }]}>⚠ ALERGIAS</Text>
          {perfil.alergias.map((a) => (
            <Text key={a} style={{ color: '#fff', fontSize: 24, fontWeight: '700', marginTop: 6 }}>
              {a}
            </Text>
          ))}
        </View>

        <View style={{ backgroundColor: '#1a1a19', borderRadius: radius.lg, padding: space.lg, marginTop: space.md }}>
          <Text style={[font.tiny, { color: '#898781' }]}>CONDIÇÕES</Text>
          {perfil.condicoes.map((c) => (
            <Text key={c} style={{ color: '#fff', fontSize: 17, fontWeight: '600', marginTop: 6 }}>
              {c}
            </Text>
          ))}
        </View>

        <View style={{ backgroundColor: '#1a1a19', borderRadius: radius.lg, padding: space.lg, marginTop: space.md }}>
          <Text style={[font.tiny, { color: '#898781' }]}>MEDICAMENTOS EM USO</Text>
          {emUso.map((m) => (
            <Text key={m.id} style={{ color: '#fff', fontSize: 17, fontWeight: '600', marginTop: 6 }}>
              {m.nome} {m.dose}
            </Text>
          ))}
        </View>

        <View style={{ backgroundColor: '#1a1a19', borderRadius: radius.lg, padding: space.lg, marginTop: space.md }}>
          <Text style={[font.tiny, { color: '#898781' }]}>AVISAR</Text>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700', marginTop: 6 }}>
            {perfil.emergencia.nome}
          </Text>
          <Text style={{ color: '#c3c2b7', fontSize: 16, marginTop: 2 }}>
            {perfil.emergencia.relacao} · {perfil.emergencia.telefone}
          </Text>
        </View>

        <View style={{ backgroundColor: '#1a1a19', borderRadius: radius.lg, padding: space.lg, marginTop: space.md }}>
          <Text style={[font.tiny, { color: '#898781' }]}>PLANO DE SAÚDE</Text>
          <Text style={{ color: '#fff', fontSize: 17, fontWeight: '600', marginTop: 6 }}>
            {perfil.planoSaude.operadora} · {perfil.planoSaude.plano}
          </Text>
          <Text style={{ color: '#c3c2b7', fontSize: 15, marginTop: 2 }}>
            {perfil.planoSaude.carteirinha}
          </Text>
        </View>

        <Text style={{ color: '#898781', fontSize: 12, marginTop: space.xl, lineHeight: 17, textAlign: 'center' }}>
          No app real este cartão abre sem desbloquear o celular e funciona sem
          internet.{'\n'}Dados fictícios — protótipo.
        </Text>

        <View style={{ marginTop: space.xl }}>
          <Button variante="secundario" onPress={() => router.back()}>
            Fechar
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

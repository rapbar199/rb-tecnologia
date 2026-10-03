import { Text, View } from 'react-native';
import {
  AvisoMock,
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
import { radius, space, useTheme } from '../theme';
import { dataCurta, fonte, medicamentos } from '../data/mock';

export default function Medicamentos() {
  const t = useTheme();
  const ativos = medicamentos.filter((m) => m.ativo);
  const encerrados = medicamentos.filter((m) => !m.ativo);

  return (
    <Screen>
      <ScreenHeader titulo="Medicamentos" sub={`${ativos.length} em uso · ${encerrados.length} encerrados`} />

      <SectionTitle>Em uso</SectionTitle>
      <Card>
        {ativos.map((m, i) => (
          <Row
            key={m.id}
            titulo={`${m.nome} ${m.dose}`}
            sub={`${m.posologia} · desde ${dataCurta(m.inicio)}`}
            left={
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: radius.md,
                  backgroundColor: t.brandSoft,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 16 }}>💊</Text>
              </View>
            }
            right={<SourceBadge f={fonte(m.fonteId)} />}
            ultimo={i === ativos.length - 1}
          />
        ))}
      </Card>
      <Muted style={{ marginTop: space.md, lineHeight: 17 }}>
        Prescritores: {Array.from(new Set(ativos.map((m) => m.prescritor))).join(' · ')}
      </Muted>

      <SectionTitle>Encerrados</SectionTitle>
      <Card>
        {encerrados.map((m, i) => (
          <Row
            key={m.id}
            titulo={`${m.nome} ${m.dose}`}
            sub={`${dataCurta(m.inicio)} a ${m.fim ? dataCurta(m.fim) : '—'} · ${m.prescritor}`}
            right={<Pill>ENCERRADO</Pill>}
            ultimo={i === encerrados.length - 1}
          />
        ))}
      </Card>

      <View style={{ marginTop: space.xl }}>
        <AvisoMock texto="Medicamentos dispensados na rede pública chegam pelo Meu SUS Digital. Os de farmácia privada entram por receita ou cadastro manual." />
      </View>
    </Screen>
  );
}

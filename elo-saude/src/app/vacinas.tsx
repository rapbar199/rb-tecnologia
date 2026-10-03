import { Text, View } from 'react-native';
import {
  AvisoMock,
  Card,
  Muted,
  Row,
  Screen,
  ScreenHeader,
  SectionTitle,
  Small,
  SourceBadge,
} from '../components/ui';
import { radius, space, useTheme } from '../theme';
import { dataCurta, fonte, vacinas } from '../data/mock';

export default function Vacinas() {
  const t = useTheme();

  return (
    <Screen>
      <ScreenHeader titulo="Carteira de vacinação" sub={`${vacinas.length} registros`} />

      <Card>
        <Small style={{ lineHeight: 20 }}>
          As vacinas aplicadas na rede pública vêm do Meu SUS Digital. As de
          clínica privada entram por cadastro manual — a rede privada não
          alimenta o registro nacional de forma consistente.
        </Small>
      </Card>

      <SectionTitle>Histórico</SectionTitle>
      <Card>
        {vacinas.map((v, i) => (
          <Row
            key={v.id}
            titulo={v.nome}
            sub={`${v.dose} · ${dataCurta(v.data)} · ${v.local}${v.lote ? ` · lote ${v.lote}` : ''}`}
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
                <Text style={{ fontSize: 16 }}>💉</Text>
              </View>
            }
            right={<SourceBadge f={fonte(v.fonteId)} />}
            ultimo={i === vacinas.length - 1}
          />
        ))}
      </Card>

      <View style={{ marginTop: space.xl }}>
        <AvisoMock texto="Protótipo com dados fictícios. No app real esta tela também mostraria doses em atraso conforme o calendário nacional." />
      </View>
    </Screen>
  );
}

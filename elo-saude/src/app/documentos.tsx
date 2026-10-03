import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  AvisoMock,
  Card,
  Row,
  Screen,
  ScreenHeader,
  Small,
  SourceBadge,
} from '../components/ui';
import { font, radius, space, useTheme } from '../theme';
import { Documento, dataCurta, documentos, fonte } from '../data/mock';

const TIPOS: (Documento['tipo'] | 'Todos')[] = [
  'Todos',
  'Laudo',
  'Receita',
  'Pedido médico',
  'Atestado',
];

const ICONE: Record<Documento['tipo'], string> = {
  Laudo: '📄',
  Receita: '💊',
  'Pedido médico': '📝',
  Atestado: '🗒️',
  Relatório: '📋',
};

export default function Documentos() {
  const t = useTheme();
  const [tipo, setTipo] = useState<(typeof TIPOS)[number]>('Todos');
  const lista = tipo === 'Todos' ? documentos : documentos.filter((d) => d.tipo === tipo);

  return (
    <Screen>
      <ScreenHeader titulo="Documentos" sub={`${documentos.length} arquivos guardados`} />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginBottom: space.lg }}>
        {TIPOS.map((x) => {
          const on = tipo === x;
          return (
            <Pressable key={x} onPress={() => setTipo(x)}>
              <View
                style={{
                  paddingHorizontal: space.md,
                  paddingVertical: 7,
                  borderRadius: radius.pill,
                  backgroundColor: on ? t.brand : t.surface,
                  borderWidth: 1,
                  borderColor: on ? t.brand : t.border,
                }}
              >
                <Text style={[font.small, { color: on ? t.onBrand : t.textSecondary, fontWeight: '600' }]}>
                  {x}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <Card>
        {lista.length === 0 ? (
          <Small>Nenhum documento deste tipo.</Small>
        ) : (
          lista.map((d, i) => (
            <Row
              key={d.id}
              titulo={d.titulo}
              sub={`${d.tipo} · ${dataCurta(d.data)} · ${d.paginas} ${d.paginas === 1 ? 'página' : 'páginas'}`}
              left={
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: radius.md,
                    backgroundColor: t.surfaceAlt,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{ICONE[d.tipo]}</Text>
                </View>
              }
              right={<SourceBadge f={fonte(d.fonteId)} />}
              onPress={() => {}}
              ultimo={i === lista.length - 1}
            />
          ))
        )}
      </Card>

      <View style={{ marginTop: space.xl }}>
        <AvisoMock texto="Protótipo: os arquivos não existem — abrir um documento não faz nada." />
      </View>
    </Screen>
  );
}

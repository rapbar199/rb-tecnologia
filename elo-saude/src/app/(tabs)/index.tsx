import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import {
  AvisoMock,
  Body,
  Card,
  H1,
  Muted,
  Pill,
  Row,
  Screen,
  SectionTitle,
  Small,
  SourceBadge,
  StatTile,
} from '../../components/ui';
import { Sparkline } from '../../components/chart';
import { font, radius, space, useTheme } from '../../theme';
import {
  Evento,
  alteradosNoExame,
  analito,
  analitosComHistorico,
  dataCurta,
  flagDe,
  fonte,
  linhaDoTempo,
  perfil,
  resumoDados,
  serie,
  ultimoResultado,
} from '../../data/mock';

const ICONE_EVENTO: Record<Evento['kind'], string> = {
  exame: '🧪',
  consulta: '🩺',
  vacina: '💉',
  medicamento: '💊',
};

function tituloEvento(e: Evento): { titulo: string; sub: string; fonteId: string } {
  switch (e.kind) {
    case 'exame': {
      const alterados = alteradosNoExame(e.ref);
      return {
        titulo: e.ref.nome,
        sub:
          `${e.ref.resultados.length} resultados` +
          (alterados ? ` · ${alterados} fora da faixa` : ' · todos na faixa'),
        fonteId: e.ref.fonteId,
      };
    }
    case 'consulta':
      return { titulo: e.ref.especialidade, sub: `${e.ref.profissional} · ${e.ref.local}`, fonteId: e.ref.fonteId };
    case 'vacina':
      return { titulo: e.ref.nome, sub: `${e.ref.dose} · ${e.ref.local}`, fonteId: e.ref.fonteId };
    case 'medicamento':
      return { titulo: e.ref.nome, sub: `${e.ref.dose} · ${e.ref.posologia}`, fonteId: e.ref.fonteId };
  }
}

function destinoEvento(e: Evento): string | null {
  if (e.kind === 'exame') return `/exame/${e.ref.id}`;
  if (e.kind === 'vacina') return '/vacinas';
  if (e.kind === 'medicamento') return '/medicamentos';
  return null;
}

export default function Inicio() {
  const t = useTheme();
  const eventos = linhaDoTempo();
  const emFoco = analitosComHistorico()
    .map((a) => ({ a, pts: serie(a.codigo) }))
    .filter(({ a, pts }) => flagDe(a, pts[pts.length - 1].valor) !== 'normal')
    .slice(0, 3);

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <Muted>Bom dia,</Muted>
          <H1>{perfil.nome.split(' ')[0]}</H1>
        </View>
        <Pressable
          onPress={() => router.push('/emergencia')}
          style={{
            backgroundColor: t.surface,
            borderWidth: 1,
            borderColor: t.critical,
            borderRadius: radius.pill,
            paddingHorizontal: space.md,
            paddingVertical: 7,
          }}
        >
          <Text style={[font.tiny, { color: t.critical }]}>✚ EMERGÊNCIA</Text>
        </Pressable>
      </View>

      <Card style={{ marginTop: space.lg }}>
        <View style={{ flexDirection: 'row' }}>
          <StatTile valor={String(resumoDados.fontesConectadas)} rotulo="fontes conectadas" />
          <StatTile valor={String(resumoDados.totalResultados)} rotulo="resultados" />
          <StatTile valor={String(resumoDados.totalExames)} rotulo="exames" />
        </View>
        <View style={{ marginTop: space.lg }}>
          <AvisoMock texto="Protótipo navegável com dados fictícios. Nenhuma integração real está ativa — as conexões e sincronizações são simuladas." />
        </View>
      </Card>

      {emFoco.length ? (
        <>
          <SectionTitle>Merece atenção</SectionTitle>
          <Card>
            {emFoco.map(({ a, pts }, i) => {
              const ultimo = pts[pts.length - 1];
              const flag = flagDe(a, ultimo.valor);
              const anterior = pts.length > 1 ? pts[pts.length - 2].valor : null;
              const delta = anterior !== null ? ultimo.valor - anterior : null;
              const melhorando =
                delta !== null &&
                ((a.direcao === 'baixo-melhor' && delta < 0) ||
                  (a.direcao === 'alto-melhor' && delta > 0));
              return (
                <Row
                  key={a.codigo}
                  titulo={a.nome}
                  sub={
                    `${ultimo.valor} ${a.unidade}` +
                    (delta !== null
                      ? ` · ${delta > 0 ? '+' : ''}${Number(delta.toFixed(2))} desde ${dataCurta(pts[pts.length - 2].data).slice(0, 6)}`
                      : '')
                  }
                  onPress={() => router.push(`/evolucao/${a.codigo}`)}
                  right={
                    <View style={{ alignItems: 'flex-end', gap: 3 }}>
                      <Sparkline pts={pts} />
                      <Text
                        style={[
                          font.tiny,
                          { color: melhorando ? t.goodText : flag === 'alto' ? t.critical : t.warning },
                        ]}
                      >
                        {melhorando ? '✓ MELHORANDO' : flag === 'alto' ? '↑ ALTO' : '↓ BAIXO'}
                      </Text>
                    </View>
                  }
                  ultimo={i === emFoco.length - 1}
                />
              );
            })}
          </Card>
        </>
      ) : null}

      <SectionTitle
        action={
          <Pressable onPress={() => router.push('/adicionar')}>
            <Text style={[font.small, { color: t.brand, fontWeight: '600' }]}>+ Adicionar</Text>
          </Pressable>
        }
      >
        Linha do tempo
      </SectionTitle>

      <Card>
        {eventos.slice(0, 12).map((e, i) => {
          const { titulo, sub, fonteId } = tituloEvento(e);
          const destino = destinoEvento(e);
          return (
            <Row
              key={`${e.kind}-${i}`}
              titulo={titulo}
              sub={`${dataCurta(e.data)} · ${sub}`}
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
                  <Text style={{ fontSize: 16 }}>{ICONE_EVENTO[e.kind]}</Text>
                </View>
              }
              right={<SourceBadge f={fonte(fonteId)} />}
              onPress={destino ? () => router.push(destino as never) : undefined}
              ultimo={i === Math.min(eventos.length, 12) - 1}
            />
          );
        })}
      </Card>

      <SectionTitle>Atalhos</SectionTitle>
      <Card>
        <Row titulo="Medicamentos em uso" sub="3 ativos" onPress={() => router.push('/medicamentos')} />
        <Row titulo="Carteira de vacinação" sub="5 registros" onPress={() => router.push('/vacinas')} />
        <Row titulo="Documentos e laudos" sub={`${resumoDados.totalDocumentos} arquivos`} onPress={() => router.push('/documentos')} />
        <Row titulo="Compartilhar com médico" sub="Link temporário com QR code" onPress={() => router.push('/compartilhar')} />
        <Row titulo="Família" sub="2 perfis · 2 pendências" onPress={() => router.push('/familia')} ultimo />
      </Card>

      <View style={{ marginTop: space.xl, alignItems: 'center' }}>
        <Muted>Histórico desde {dataCurta(resumoDados.desde)}</Muted>
      </View>
    </Screen>
  );
}

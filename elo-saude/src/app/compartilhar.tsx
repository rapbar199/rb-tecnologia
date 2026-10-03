import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import {
  AvisoMock,
  Body,
  Button,
  Card,
  H2,
  Muted,
  Pill,
  Row,
  Screen,
  ScreenHeader,
  SectionTitle,
  Small,
} from '../components/ui';
import { font, radius, space, useTheme } from '../theme';
import { compartilhamentos, dataCurta } from '../data/mock';

const ESCOPOS = [
  'Exames e resultados',
  'Medicamentos em uso',
  'Alergias e condições',
  'Vacinas',
  'Documentos e laudos',
];

const PRAZOS = ['24 horas', '7 dias', '30 dias'];

/** QR fictício: padrão determinístico só para ilustrar a tela. */
function QRFake({ tamanho = 148 }: { tamanho?: number }) {
  const t = useTheme();
  const n = 21;
  const celula = tamanho / n;
  const cheio = (r: number, c: number) => {
    // Marcadores de canto, como num QR real
    const canto =
      (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
    if (canto) {
      const rr = r >= n - 7 ? r - (n - 7) : r;
      const cc = c >= n - 7 ? c - (n - 7) : c;
      const borda = rr === 0 || rr === 6 || cc === 0 || cc === 6;
      const centro = rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4;
      return borda || centro;
    }
    return (r * 7 + c * 13 + ((r * c) % 5)) % 3 === 0;
  };

  return (
    <View
      style={{
        width: tamanho,
        height: tamanho,
        backgroundColor: '#fff',
        padding: celula,
        borderRadius: radius.sm,
      }}
    >
      {Array.from({ length: n }).map((_, r) => (
        <View key={r} style={{ flexDirection: 'row' }}>
          {Array.from({ length: n }).map((_, c) => (
            <View
              key={c}
              style={{
                width: celula,
                height: celula,
                backgroundColor: cheio(r, c) ? '#0b0b0b' : 'transparent',
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

export default function Compartilhar() {
  const t = useTheme();
  const [marcados, setMarcados] = useState<string[]>([ESCOPOS[0], ESCOPOS[2]]);
  const [prazo, setPrazo] = useState(PRAZOS[1]);
  const [gerado, setGerado] = useState(false);

  const alternar = (e: string) =>
    setMarcados((m) => (m.includes(e) ? m.filter((x) => x !== e) : [...m, e]));

  if (gerado) {
    return (
      <Screen>
        <ScreenHeader titulo="Link gerado" sub={`Vale por ${prazo}`} />
        <Card style={{ alignItems: 'center', paddingVertical: space.xl }}>
          <QRFake />
          <H2>Mostre para o médico</H2>
          <Small style={{ textAlign: 'center', marginTop: space.sm, lineHeight: 20 }}>
            O link abre uma visão somente-leitura com {marcados.length}{' '}
            {marcados.length === 1 ? 'categoria' : 'categorias'} de dado, e expira
            sozinho em {prazo}.
          </Small>
          <View
            style={{
              backgroundColor: t.surfaceAlt,
              borderRadius: radius.md,
              padding: space.md,
              marginTop: space.lg,
              alignSelf: 'stretch',
            }}
          >
            <Text style={[font.small, { color: t.brand, fontWeight: '600' }]} selectable>
              elosaude.app/v/8f3a-21bc
            </Text>
          </View>
        </Card>

        <Card style={{ marginTop: space.lg }}>
          <Small style={{ lineHeight: 20 }}>
            Cada abertura do link fica registrada na sua trilha de acesso: quem
            abriu, quando, e o que viu. Você pode revogar antes do prazo.
          </Small>
        </Card>

        <View style={{ marginTop: space.xl, gap: space.md }}>
          <Button onPress={() => router.back()}>Fechar</Button>
          <Button variante="perigo" onPress={() => setGerado(false)}>
            Revogar agora
          </Button>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader titulo="Compartilhar com médico" sub="Escopo e prazo definidos por você" />

      <SectionTitle>O que o médico vai ver</SectionTitle>
      <Card>
        {ESCOPOS.map((e, i) => {
          const on = marcados.includes(e);
          return (
            <Pressable key={e} onPress={() => alternar(e)} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: space.md,
                  paddingVertical: space.md,
                  borderBottomWidth: i === ESCOPOS.length - 1 ? 0 : StyleSheet.hairlineWidth,
                  borderBottomColor: t.border,
                }}
              >
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    borderWidth: 2,
                    borderColor: on ? t.brand : t.axis,
                    backgroundColor: on ? t.brand : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {on ? <Text style={{ color: '#fff', fontSize: 12, fontWeight: '900' }}>✓</Text> : null}
                </View>
                <Text style={[font.body, { color: t.text, flex: 1 }]}>{e}</Text>
              </View>
            </Pressable>
          );
        })}
      </Card>

      <SectionTitle>Validade</SectionTitle>
      <View style={{ flexDirection: 'row', gap: space.sm }}>
        {PRAZOS.map((p) => {
          const on = prazo === p;
          return (
            <Pressable key={p} onPress={() => setPrazo(p)} style={{ flex: 1 }}>
              <View
                style={{
                  paddingVertical: 11,
                  borderRadius: radius.md,
                  alignItems: 'center',
                  backgroundColor: on ? t.brandSoft : t.surface,
                  borderWidth: 1,
                  borderColor: on ? t.brand : t.border,
                }}
              >
                <Text style={[font.small, { color: on ? t.brand : t.textSecondary, fontWeight: '700' }]}>
                  {p}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={{ marginTop: space.xl }}>
        <Button onPress={() => setGerado(true)}>Gerar link e QR code</Button>
      </View>

      <SectionTitle>Compartilhamentos anteriores</SectionTitle>
      <Card>
        {compartilhamentos.map((s, i) => (
          <Row
            key={s.id}
            titulo={s.para}
            sub={`${s.escopo} · ${s.aberturas} ${s.aberturas === 1 ? 'abertura' : 'aberturas'} · até ${dataCurta(s.expiraEm)}`}
            right={<Pill cor={s.ativo ? t.goodText : t.textMuted}>{s.ativo ? 'ATIVO' : 'EXPIRADO'}</Pill>}
            ultimo={i === compartilhamentos.length - 1}
          />
        ))}
      </Card>

      <View style={{ marginTop: space.xl }}>
        <AvisoMock texto="Protótipo: o QR code é ilustrativo e o link não existe de verdade." />
      </View>
    </Screen>
  );
}

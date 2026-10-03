import { ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { font, radius, space, useTheme } from '../theme';
import { Flag, Fonte } from '../data/mock';

/* ------------------------------------------------------------------ layout */

export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  const t = useTheme();
  const Inner = scroll ? ScrollView : View;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.page }} edges={['top']}>
      <Inner
        style={{ flex: 1 }}
        contentContainerStyle={scroll ? { padding: space.lg, paddingBottom: space.xxl * 2 } : undefined}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </Inner>
    </SafeAreaView>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  const t = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: t.surface,
          borderRadius: radius.lg,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: t.border,
          padding: space.lg,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function H1({ children }: { children: ReactNode }) {
  const t = useTheme();
  return <Text style={[font.h1, { color: t.text }]}>{children}</Text>;
}

export function H2({ children }: { children: ReactNode }) {
  const t = useTheme();
  return <Text style={[font.h2, { color: t.text }]}>{children}</Text>;
}

export function Body({ children, muted, style }: { children: ReactNode; muted?: boolean; style?: any }) {
  const t = useTheme();
  return (
    <Text style={[font.body, { color: muted ? t.textSecondary : t.text, lineHeight: 21 }, style]}>
      {children}
    </Text>
  );
}

export function Small({ children, style }: { children: ReactNode; style?: any }) {
  const t = useTheme();
  return <Text style={[font.small, { color: t.textSecondary }, style]}>{children}</Text>;
}

export function Muted({ children, style }: { children: ReactNode; style?: any }) {
  const t = useTheme();
  return <Text style={[font.small, { color: t.textMuted }, style]}>{children}</Text>;
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  const t = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: space.xl,
        marginBottom: space.md,
      }}
    >
      <Text style={[font.tiny, { color: t.textMuted, textTransform: 'uppercase' }]}>{children}</Text>
      {action}
    </View>
  );
}

export function Divider() {
  const t = useTheme();
  return <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: t.border, marginVertical: space.md }} />;
}

/* ------------------------------------------------------------------- header */

export function ScreenHeader({ titulo, sub }: { titulo: string; sub?: string }) {
  const t = useTheme();
  return (
    <View style={{ marginBottom: space.lg }}>
      <Pressable
        onPress={() => router.back()}
        hitSlop={12}
        style={{ marginBottom: space.md, alignSelf: 'flex-start' }}
      >
        <Text style={[font.body, { color: t.brand, fontWeight: '600' }]}>‹ Voltar</Text>
      </Pressable>
      <H1>{titulo}</H1>
      {sub ? <Small style={{ marginTop: space.xs }}>{sub}</Small> : null}
    </View>
  );
}

/* --------------------------------------------------------------------- rows */

export function Row({
  titulo,
  sub,
  valor,
  onPress,
  left,
  right,
  ultimo,
}: {
  titulo: string;
  sub?: string;
  valor?: string;
  onPress?: () => void;
  left?: ReactNode;
  right?: ReactNode;
  ultimo?: boolean;
}) {
  const t = useTheme();
  const conteudo = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: space.md,
        borderBottomWidth: ultimo ? 0 : StyleSheet.hairlineWidth,
        borderBottomColor: t.border,
        gap: space.md,
      }}
    >
      {left}
      <View style={{ flex: 1 }}>
        <Text style={[font.h3, { color: t.text }]}>{titulo}</Text>
        {sub ? <Small style={{ marginTop: 2 }}>{sub}</Small> : null}
      </View>
      {valor ? <Text style={[font.mono, { color: t.text }]}>{valor}</Text> : null}
      {right}
      {onPress ? <Text style={{ color: t.textMuted, fontSize: 20 }}>›</Text> : null}
    </View>
  );
  if (!onPress) return conteudo;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
      {conteudo}
    </Pressable>
  );
}

/* ------------------------------------------------------------------ badges  */

export function Pill({
  children,
  cor,
  fundo,
}: {
  children: ReactNode;
  cor?: string;
  fundo?: string;
}) {
  const t = useTheme();
  return (
    <View
      style={{
        paddingHorizontal: space.md,
        paddingVertical: 5,
        borderRadius: radius.pill,
        backgroundColor: fundo ?? t.surfaceAlt,
      }}
    >
      <Text style={[font.tiny, { color: cor ?? t.textSecondary }]}>{children}</Text>
    </View>
  );
}

/**
 * Cor de identidade de uma fonte. A fonte interna ("Adicionado por você") fica
 * neutra de propósito, para não competir com os laboratórios.
 */
export function corFonte(t: ReturnType<typeof useTheme>, f: Fonte): string {
  return f.tipo === 'manual' ? t.textMuted : t.series[f.cor % t.series.length];
}

/**
 * Identidade da fonte. A cor é acompanhada SEMPRE da sigla em texto — nunca
 * depende só de hue (requisito de acessibilidade para daltonismo).
 */
export function SourceBadge({ f, completo }: { f: Fonte; completo?: boolean }) {
  const t = useTheme();
  const cor = corFonte(t, f);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 7,
          backgroundColor: cor,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 9, fontWeight: '800' }}>{f.sigla}</Text>
      </View>
      {completo ? <Small style={{ color: t.textSecondary }}>{f.nome}</Small> : null}
    </View>
  );
}

const FLAG_INFO: Record<Flag, { rotulo: string; icone: string }> = {
  normal: { rotulo: 'Normal', icone: '✓' },
  alto: { rotulo: 'Alto', icone: '↑' },
  baixo: { rotulo: 'Baixo', icone: '↓' },
};

/** Status sempre com ícone + rótulo — a cor nunca carrega o significado só. */
export function FlagBadge({ flag }: { flag: Flag }) {
  const t = useTheme();
  const cor = flag === 'normal' ? t.goodText : flag === 'alto' ? t.critical : t.warning;
  const info = FLAG_INFO[flag];
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <Text style={{ color: cor, fontSize: 12, fontWeight: '800' }}>{info.icone}</Text>
      <Text style={[font.tiny, { color: cor }]}>{info.rotulo}</Text>
    </View>
  );
}

/* --------------------------------------------------------------- stat tiles */

export function StatTile({ valor, rotulo }: { valor: string; rotulo: string }) {
  const t = useTheme();
  return (
    <View style={{ flex: 1, paddingRight: space.md }}>
      <Text style={{ color: t.text, fontSize: 24, fontWeight: '700' }}>{valor}</Text>
      <Muted style={{ marginTop: 2, lineHeight: 15 }}>{rotulo}</Muted>
    </View>
  );
}

/* ------------------------------------------------------------------ botões  */

export function Button({
  children,
  onPress,
  variante = 'primario',
}: {
  children: ReactNode;
  onPress?: () => void;
  variante?: 'primario' | 'secundario' | 'perigo';
}) {
  const t = useTheme();
  const fundo =
    variante === 'primario' ? t.brand : variante === 'perigo' ? 'transparent' : t.surfaceAlt;
  const cor =
    variante === 'primario' ? t.onBrand : variante === 'perigo' ? t.critical : t.text;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: fundo,
        borderRadius: radius.md,
        paddingVertical: 15,
        alignItems: 'center',
        opacity: pressed ? 0.75 : 1,
        borderWidth: variante === 'perigo' ? StyleSheet.hairlineWidth : 0,
        borderColor: t.critical,
      })}
    >
      <Text style={[font.h3, { color: cor }]}>{children}</Text>
    </Pressable>
  );
}

/* --------------------------------------------------------------- mock aviso */

export function AvisoMock({ texto }: { texto: string }) {
  const t = useTheme();
  return (
    <View
      style={{
        backgroundColor: t.brandSoft,
        borderRadius: radius.md,
        padding: space.md,
        flexDirection: 'row',
        gap: space.sm,
        alignItems: 'flex-start',
      }}
    >
      <Text style={{ fontSize: 13 }}>🧪</Text>
      <Small style={{ flex: 1, color: t.textSecondary }}>{texto}</Small>
    </View>
  );
}

export function EmptyState({ titulo, sub }: { titulo: string; sub?: string }) {
  return (
    <Card style={{ alignItems: 'center', paddingVertical: space.xxl }}>
      <Body>{titulo}</Body>
      {sub ? <Small style={{ marginTop: space.xs, textAlign: 'center' }}>{sub}</Small> : null}
    </Card>
  );
}

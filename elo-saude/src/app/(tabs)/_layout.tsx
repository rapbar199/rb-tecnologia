import { Tabs } from 'expo-router';
import { ColorValue, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../theme';

function Icone({ glifo, cor }: { glifo: string; cor: ColorValue }) {
  return <Text style={{ fontSize: 20, color: cor }}>{glifo}</Text>;
}

export default function TabsLayout() {
  const t = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: t.brand,
        tabBarInactiveTintColor: t.textMuted,
        tabBarStyle: {
          backgroundColor: t.surface,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: t.border,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <Icone glifo="🏠" cor={color} />,
        }}
      />
      <Tabs.Screen
        name="exames"
        options={{
          title: 'Exames',
          tabBarIcon: ({ color }) => <Icone glifo="🧪" cor={color} />,
        }}
      />
      <Tabs.Screen
        name="conexoes"
        options={{
          title: 'Conexões',
          tabBarIcon: ({ color }) => <Icone glifo="🔗" cor={color} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Icone glifo="👤" cor={color} />,
        }}
      />
    </Tabs>
  );
}

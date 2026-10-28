import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { fonts } from '../../../theme';
import { useThemeColors } from '@/theme/theme-context';

export default function TabsLayout() {
  const colors = useThemeColors();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border },
        tabBarLabelStyle: { fontFamily: fonts.semibold, fontSize: 12 },
      }}
    >
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          tabBarIcon: ({ focused, size }) => (
            <MaterialIcons name="chat" size={size} color={focused ? colors.primary : colors.muted} />
          ),
        }}
      />
      <Tabs.Screen
        name="comunidad"
        options={{
          title: 'Comunidad',
          tabBarIcon: ({ focused, size }) => (
            <MaterialIcons name="groups" size={size} color={focused ? colors.primary : colors.muted} />
          ),
        }}
      />
      <Tabs.Screen
        name="foro"
        options={{
          title: 'Foro',
          tabBarIcon: ({ focused, size }) => (
            <MaterialIcons name="forum" size={size} color={focused ? colors.primary : colors.muted} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused, size }) => (
            <MaterialIcons name="person" size={size} color={focused ? colors.primary : colors.muted} />
          ),
        }}
      />
    </Tabs>
  );
}

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { RepositoryScreen } from '../screens/RepositoryScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { RootStackParamList } from '../types';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions = {
  headerStyle: { backgroundColor: '#1f2937' },
  headerTintColor: '#f9fafb',
  headerTitleStyle: { fontWeight: '600' as const },
  contentStyle: { backgroundColor: '#111827' },
};

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ route }) => ({ title: `@${(route.params as any).username}` })}
      />
      <Stack.Screen
        name="Repository"
        component={RepositoryScreen}
        options={({ route }) => ({ title: (route.params as any).repo.name })}
      />
    </Stack.Navigator>
  );
}

function HistoryStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="History" component={HistoryScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ route }) => ({ title: `@${(route.params as any).username}` })}
      />
      <Stack.Screen
        name="Repository"
        component={RepositoryScreen}
        options={({ route }) => ({ title: (route.params as any).repo.name })}
      />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1f2937',
          borderTopColor: '#374151',
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#60a5fa',
        tabBarInactiveTintColor: '#6b7280',
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, [string, string]> = {
            HomeTab: ['search', 'search-outline'],
            HistoryTab: ['time', 'time-outline'],
          };
          const [active, inactive] = icons[route.name] ?? ['circle', 'circle-outline'];
          return <Ionicons name={(focused ? active : inactive) as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Buscar' }} />
      <Tab.Screen name="HistoryTab" component={HistoryStack} options={{ title: 'Histórico' }} />
    </Tab.Navigator>
  );
}

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SearchBar } from '../components/SearchBar';
import { UserCard } from '../components/UserCard';
import { EmptyState } from '../components/EmptyState';
import { useGithubUser } from '../hooks/useGithubUser';
import { RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { user, status, search } = useGithubUser();

  async function handleSearch(query: string) {
    if (!query.trim()) {
      Alert.alert('Campo vazio', 'Digite um nome de usuário para buscar.');
      return;
    }
    await search(query);
  }

  function goToProfile() {
    if (user) navigation.navigate('Profile', { username: user.login });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>GitHub Explorer</Text>
          <Text style={styles.subtitle}>Explore perfis e repositórios do GitHub</Text>
        </View>

        <SearchBar
          onSearch={handleSearch}
          loading={status === 'loading'}
          placeholder="Digite um username do GitHub..."
        />

        <View style={styles.result}>
          {status === 'idle' && (
            <EmptyState
              icon="search-outline"
              title="Busque um usuário"
              subtitle="Digite um username e pressione buscar"
            />
          )}

          {status === 'loading' && (
            <EmptyState icon="hourglass-outline" title="Buscando..." />
          )}

          {status === 'not_found' && (
            <EmptyState
              icon="person-remove-outline"
              title="Usuário não encontrado"
              subtitle="Verifique o username e tente novamente"
            />
          )}

          {status === 'error' && (
            <EmptyState
              icon="wifi-outline"
              title="Erro de conexão"
              subtitle="Verifique sua internet e tente novamente"
            />
          )}

          {status === 'success' && user && (
            <UserCard user={user} onPress={goToProfile} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#111827',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  header: {
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f9fafb',
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
  },
  result: {
    flex: 1,
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { HistoryItem } from '../components/HistoryItem';
import { EmptyState } from '../components/EmptyState';
import { useHistory } from '../hooks/useHistory';
import { RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'History'>;

export function HistoryScreen() {
  const navigation = useNavigation<Nav>();
  const { history, loading, clear, remove } = useHistory();

  function confirmClear() {
    if (Platform.OS === 'web') {
      if (window.confirm('Deseja remover todos os perfis visitados?')) clear();
    } else {
      Alert.alert(
        'Limpar histórico',
        'Deseja remover todos os perfis visitados?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Limpar', style: 'destructive', onPress: clear },
        ]
      );
    }
  }

  function confirmRemove(login: string) {
    if (Platform.OS === 'web') {
      if (window.confirm(`Remover @${login} do histórico?`)) remove(login);
    } else {
      Alert.alert(
        'Remover perfil',
        `Deseja remover @${login} do histórico?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Remover', style: 'destructive', onPress: () => remove(login) },
        ]
      );
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.headerBar}>
        <Text style={styles.title}>Histórico</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={confirmClear} style={styles.clearBtn}>
            <Ionicons name="trash-outline" size={18} color="#f87171" />
            <Text style={styles.clearText}>Limpar</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => `${item.user.login}-${item.viewedAt}`}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <HistoryItem
              entry={item}
              onPress={() =>
                navigation.navigate('Profile', { username: item.user.login })
              }
              onDelete={() => confirmRemove(item.user.login)}
            />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="time-outline"
            title="Nenhum perfil visitado"
            subtitle="Os perfis que você visitar aparecerão aqui"
          />
        }
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#111827' },
  centered: { flex: 1, backgroundCo
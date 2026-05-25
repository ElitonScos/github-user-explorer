import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
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
  const { history, loading, clear } = useHistory();

  function confirmClear() {
    Alert.alert(
      'Limpar histórico',
      'Deseja remover todos os perfis visitados?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpar', style: 'destructive', onPress: clear },
      ]
    );
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
  centered: { flex: 1, backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center' },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: { fontSize: 24, fontWeight: '700', color: '#f9fafb' },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#1f2937',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  clearText: { fontSize: 13, color: '#f87171' },
  list: { paddingHorizontal: 20, paddingBottom: 24 },
  item: { marginBottom: 10 },
});

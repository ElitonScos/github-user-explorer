import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { fetchUser, fetchUserRepos } from '../services/githubApi';
import { addToHistory } from '../services/storage';
import { RepositoryCard } from '../components/RepositoryCard';
import { EmptyState } from '../components/EmptyState';
import { RootStackParamList, GithubUser, GithubRepository } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Profile'>;
type Route = RouteProp<RootStackParamList, 'Profile'>;

type SortOption = 'updated' | 'stars' | 'name';

export function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { username } = route.params;

  const [user, setUser] = useState<GithubUser | null>(null);
  const [repos, setRepos] = useState<GithubRepository[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortOption>('updated');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [userData, reposData] = await Promise.all([
          fetchUser(username),
          fetchUserRepos(username),
        ]);
        if (!cancelled) {
          setUser(userData);
          setRepos(reposData);
          await addToHistory(userData);
        }
      } catch {} finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [username]);

  const filteredRepos = useMemo(() => {
    let list = repos.filter((r) =>
      search.trim()
        ? r.name.toLowerCase().includes(search.toLowerCase())
        : true
    );

    if (sort === 'stars') list = [...list].sort((a, b) => b.stargazers_count - a.stargazers_count);
    else if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else list = [...list].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    return list;
  }, [repos, sort, search]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.centered}>
        <EmptyState icon="alert-circle-outline" title="Perfil não disponível" />
      </SafeAreaView>
    );
  }

  const ProfileHeader = () => (
    <View style={styles.profileHeader}>
      <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
      <View style={styles.names}>
        {user.name && <Text style={styles.name}>{user.name}</Text>}
        <Text style={styles.login}>@{user.login}</Text>
        {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
      </View>

      <View style={styles.statsRow}>
        <Stat icon="people-outline" label="seguidores" value={user.followers.toLocaleString()} />
        <Stat icon="person-add-outline" label="seguindo" value={user.following.toLocaleString()} />
        <Stat icon="git-branch-outline" label="repos" value={user.public_repos.toLocaleString()} />
      </View>

      <TouchableOpacity
        style={styles.githubLink}
        onPress={() => Linking.openURL(user.html_url)}
      >
        <Ionicons name="logo-github" size={16} color="#f9fafb" />
        <Text style={styles.githubLinkText}>Ver no GitHub</Text>
        <Ionicons name="open-outline" size={14} color="#9ca3af" />
      </TouchableOpacity>

      <View style={styles.reposSection}>
        <Text style={styles.reposTitle}>Repositórios</Text>

        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Filtrar repositórios..."
          placeholderTextColor="#6b7280"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={styles.sortRow}>
          <SortButton label="Recentes" value="updated" current={sort} onPress={setSort} />
          <SortButton label="Stars" value="stars" current={sort} onPress={setSort} />
          <SortButton label="A–Z" value="name" current={sort} onPress={setSort} />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={filteredRepos}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={<ProfileHeader />}
        renderItem={({ item }) => (
          <View style={styles.repoItem}>
            <RepositoryCard
              repo={item}
              onPress={() => navigation.navigate('Repository', { repo: item, ownerLogin: user.login })}
            />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="folder-open-outline"
            title="Nenhum repositório encontrado"
            subtitle={search ? 'Tente outro termo de busca' : 'Este usuário não tem repositórios públicos'}
          />
        }
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

function Stat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon as any} size={18} color="#60a5fa" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SortButton({
  label,
  value,
  current,
  onPress,
}: {
  label: string;
  value: SortOption;
  current: SortOption;
  onPress: (v: SortOption) => void;
}) {
  const active = value === current;
  return (
    <TouchableOpacity
      style={[styles.sortBtn, active && styles.sortBtnActive]}
      onPress={() => onPress(value)}
    >
      <Text style={[styles.sortBtnText, active && styles.sortBtnTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#111827' },
  centered: { flex: 1, backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center' },
  list: { paddingBottom: 24 },
  profileHeader: {
    padding: 20,
    gap: 16,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#374151',
    alignSelf: 'center',
  },
  names: { alignItems: 'center', gap: 4 },
  name: { fontSize: 22, fontWeight: '700', color: '#f9fafb', textAlign: 'center' },
  login: { fontSize: 15, color: '#60a5fa' },
  bio: { fontSize: 14, color: '#9ca3af', textAlign: 'center', lineHeight: 20 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 28,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  stat: { alignItems: 'center', gap: 4 },
  statValue: { fontSize: 18, fontWeight: '700', color: '#f9fafb' },
  statLabel: { fontSize: 12, color: '#6b7280' },
  githubLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1f2937',
    borderRadius: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#374151',
  },
  githubLinkText: { fontSize: 14, color: '#f9fafb', fontWeight: '500' },
  reposSection: { gap: 10 },
  reposTitle: { fontSize: 18, fontWeight: '700', color: '#f9fafb' },
  searchInput: {
    backgroundColor: '#1f2937',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#f9fafb',
    borderWidth: 1,
    borderColor: '#374151',
  },
  sortRow: { flexDirection: 'row', gap: 8 },
  sortBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#374151',
  },
  sortBtnActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  sortBtnText: { fontSize: 13, color: '#9ca3af' },
  sortBtnTextActive: { color: '#fff', fontWeight: '600' },
  repoItem: { paddingHorizontal: 20, marginBottom: 10 },
});

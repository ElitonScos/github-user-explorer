import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RootStackParamList } from '../types';

type Route = RouteProp<RootStackParamList, 'Repository'>;

export function RepositoryScreen() {
  const route = useRoute<Route>();
  const { repo } = route.params;

  const createdAt = format(new Date(repo.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const updatedAt = format(new Date(repo.updated_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Ionicons name="git-branch-outline" size={24} color="#60a5fa" />
          <Text style={styles.repoName}>{repo.name}</Text>
          {repo.fork && (
            <View style={styles.forkBadge}>
              <Text style={styles.forkText}>fork</Text>
            </View>
          )}
        </View>

        {repo.description && (
          <Text style={styles.description}>{repo.description}</Text>
        )}

        <View style={styles.statsGrid}>
          <StatCard icon="star-outline" label="Stars" value={repo.stargazers_count.toLocaleString()} color="#fbbf24" />
          <StatCard icon="git-branch-outline" label="Forks" value={repo.forks_count.toLocaleString()} color="#60a5fa" />
          <StatCard icon="alert-circle-outline" label="Issues" value={repo.open_issues_count.toLocaleString()} color="#f87171" />
        </View>

        <View style={styles.section}>
          <InfoRow icon="code-slash-outline" label="Linguagem" value={repo.language ?? '—'} />
          <InfoRow icon="calendar-outline" label="Criado em" value={createdAt} />
          <InfoRow icon="refresh-outline" label="Atualizado em" value={updatedAt} />
        </View>

        {repo.topics.length > 0 && (
          <View style={styles.topicsSection}>
            <Text style={styles.sectionLabel}>Tópicos</Text>
            <View style={styles.topics}>
              {repo.topics.map((topic) => (
                <View key={topic} style={styles.topic}>
                  <Text style={styles.topicText}>{topic}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.openButton}
          onPress={() => Linking.openURL(repo.html_url)}
        >
          <Ionicons name="logo-github" size={18} color="#fff" />
          <Text style={styles.openButtonText}>Abrir no GitHub</Text>
          <Ionicons name="open-outline" size={16} color="#93c5fd" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon as any} size={20} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <Ionicons name={icon as any} size={16} color="#6b7280" />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#111827' },
  content: { padding: 20, gap: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  repoName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#93c5fd',
    flex: 1,
  },
  forkBadge: {
    backgroundColor: '#374151',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  forkText: { fontSize: 12, color: '#9ca3af' },
  description: {
    fontSize: 15,
    color: '#9ca3af',
    lineHeight: 22,
    backgroundColor: '#1f2937',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#374151',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1f2937',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#374151',
  },
  statValue: { fontSize: 20, fontWeight: '700', color: '#f9fafb' },
  statLabel: { fontSize: 12, color: '#6b7280' },
  section: {
    backgroundColor: '#1f2937',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#374151',
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  infoLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoLabel: { fontSize: 14, color: '#9ca3af' },
  infoValue: { fontSize: 14, color: '#f9fafb', fontWeight: '500', maxWidth: '55%', textAlign: 'right' },
  topicsSection: { gap: 10 },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: '#9ca3af' },
  topics: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  topic: {
    backgroundColor: '#1e3a5f',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#1d4ed8',
  },
  topicText: { fontSize: 12, color: '#60a5fa' },
  openButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#374151',
  },
  openButtonText: { fontSize: 15, fontWeight: '600', color: '#fff' },
});

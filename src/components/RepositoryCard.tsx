import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GithubRepository } from '../types';

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C#': '#178600',
  'C++': '#f34b7d',
  C: '#555555',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Vue: '#41b883',
};

interface Props {
  repo: GithubRepository;
  onPress: () => void;
}

export function RepositoryCard({ repo, onPress }: Props) {
  const langColor = repo.language ? (LANGUAGE_COLORS[repo.language] ?? '#6b7280') : '#6b7280';
  const updatedAt = format(new Date(repo.updated_at), "dd 'de' MMM. yyyy", { locale: ptBR });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <Ionicons name="git-branch-outline" size={16} color="#60a5fa" />
        <Text style={styles.name} numberOfLines={1}>{repo.name}</Text>
        {repo.fork && <Text style={styles.fork}>fork</Text>}
      </View>

      {repo.description && (
        <Text style={styles.description} numberOfLines={2}>{repo.description}</Text>
      )}

      <View style={styles.footer}>
        {repo.language && (
          <View style={styles.lang}>
            <View style={[styles.langDot, { backgroundColor: langColor }]} />
            <Text style={styles.footerText}>{repo.language}</Text>
          </View>
        )}
        <View style={styles.stat}>
          <Ionicons name="star-outline" size={13} color="#9ca3af" />
          <Text style={styles.footerText}>{repo.stargazers_count.toLocaleString()}</Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="time-outline" size={13} color="#9ca3af" />
          <Text style={styles.footerText}>{updatedAt}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1f2937',
    borderRadius: 10,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#93c5fd',
  },
  fork: {
    fontSize: 11,
    color: '#9ca3af',
    backgroundColor: '#374151',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  description: {
    fontSize: 13,
    color: '#9ca3af',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flexWrap: 'wrap',
  },
  lang: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  langDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GithubUser } from '../types';

interface Props {
  user: GithubUser;
  onPress?: () => void;
}

export function UserCard({ user, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
      <View style={styles.info}>
        {user.name && <Text style={styles.name}>{user.name}</Text>}
        <Text style={styles.login}>@{user.login}</Text>
        {user.bio && <Text style={styles.bio} numberOfLines={2}>{user.bio}</Text>}
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Ionicons name="people-outline" size={14} color="#9ca3af" />
            <Text style={styles.statText}>{user.followers.toLocaleString()}</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="git-network-outline" size={14} color="#9ca3af" />
            <Text style={styles.statText}>{user.public_repos}</Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#6b7280" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#374151',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f9fafb',
  },
  login: {
    fontSize: 14,
    color: '#60a5fa',
  },
  bio: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 2,
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: '#9ca3af',
  },
});

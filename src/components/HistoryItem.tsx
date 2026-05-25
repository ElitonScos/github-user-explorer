import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { HistoryEntry } from '../types';

interface Props {
  entry: HistoryEntry;
  onPress: () => void;
}

export function HistoryItem({ entry, onPress }: Props) {
  const { user, viewedAt } = entry;
  const timeAgo = formatDistanceToNow(new Date(viewedAt), { addSuffix: true, locale: ptBR });

  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
      <View style={styles.info}>
        {user.name && <Text style={styles.name}>{user.name}</Text>}
        <Text style={styles.login}>@{user.login}</Text>
        <View style={styles.time}>
          <Ionicons name="time-outline" size={12} color="#6b7280" />
          <Text style={styles.timeText}>{timeAgo}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#6b7280" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    borderRadius: 10,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#374151',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f9fafb',
  },
  login: {
    fontSize: 13,
    color: '#60a5fa',
  },
  time: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  timeText: {
    fontSize: 12,
    color: '#6b7280',
  },
});

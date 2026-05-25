import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getHistory, clearHistory, removeFromHistory } from '../services/storage';
import { HistoryEntry } from '../types';

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getHistory();
    setHistory(data);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const clear = useCallback(async () => {
    await clearHistory();
    setHistory([]);
  }, []);

  const remove = useCallback(async 
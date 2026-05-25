import AsyncStorage from '@react-native-async-storage/async-storage';
import { GithubUser, HistoryEntry } from '../types';

const HISTORY_KEY = '@github_explorer:history';
const MAX_HISTORY = 50;

export async function getHistory(): Promise<HistoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function addToHistory(user: GithubUser): Promise<void> {
  try {
    const history = await getHistory();
    const filtered = history.filter((e) => e.user.login !== user.login);
    const entry: HistoryEntry = { user, viewedAt: new Date().toISOString() };
    const updated = [entry, ...filtered].slice(0, MAX_HISTORY);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {}
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(HISTORY_KEY);
}

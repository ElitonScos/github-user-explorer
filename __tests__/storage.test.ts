import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHistory, addToHistory, clearHistory } from '../src/services/storage';
import { GithubUser } from '../src/types';

jest.mock('@react-native-async-storage/async-storage');

const mockUser: GithubUser = {
  login: 'octocat',
  id: 1,
  avatar_url: 'https://avatars.githubusercontent.com/u/583231',
  name: 'The Octocat',
  bio: null,
  followers: 15000,
  following: 9,
  public_repos: 8,
  html_url: 'https://github.com/octocat',
  location: 'San Francisco, CA',
  blog: null,
  company: 'GitHub',
  created_at: '2011-01-25T18:44:36Z',
};

describe('storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('returns empty array when no history exists', async () => {
    const history = await getHistory();
    expect(history).toEqual([]);
  });

  it('adds a user to history', async () => {
    await addToHistory(mockUser);
    const history = await getHistory();
    expect(history).toHaveLength(1);
    expect(history[0].user.login).toBe('octocat');
  });

  it('moves existing entry to top when re-visited', async () => {
    const user2: GithubUser = { ...mockUser, login: 'torvalds', id: 2 };
    await addToHistory(mockUser);
    await addToHistory(user2);
    await addToHistory(mockUser);
    const history = await getHistory();
    expect(history[0].user.login).toBe('octocat');
    expect(history).toHaveLength(2);
  });

  it('clears history', async () => {
    await addToHistory(mockUser);
    await clearHistory();
    const history = await getHistory();
    expect(history).toHaveLength(0);
  });

  it('stores viewedAt as ISO date string', async () => {
    await addToHistory(mockUser);
    const history = await getHistory();
    expect(() => new Date(history[0].viewedAt)).not.toThrow();
    expect(new Date(history[0].viewedAt).getTime()).not.toBeNaN();
  });
});

import { useState, useCallback } from 'react';
import { fetchUser, fetchUserRepos } from '../services/githubApi';
import { addToHistory } from '../services/storage';
import { GithubUser, GithubRepository } from '../types';

type Status = 'idle' | 'loading' | 'success' | 'not_found' | 'error';

export function useGithubUser() {
  const [user, setUser] = useState<GithubUser | null>(null);
  const [repos, setRepos] = useState<GithubRepository[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const search = useCallback(async (username: string) => {
    const trimmed = username.trim();
    if (!trimmed) return;

    setStatus('loading');
    setUser(null);
    setRepos([]);
    setErrorMessage('');

    try {
      const [userData, reposData] = await Promise.all([
        fetchUser(trimmed),
        fetchUserRepos(trimmed),
      ]);
      setUser(userData);
      setRepos(reposData);
      setStatus('success');
      await addToHistory(userData);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setStatus('not_found');
      } else {
        setStatus('error');
        setErrorMessage(err?.message ?? 'Erro desconhecido');
      }
    }
  }, []);

  const reset = useCallback(() => {
    setUser(null);
    setRepos([]);
    setStatus('idle');
    setErrorMessage('');
  }, []);

  return { user, repos, status, errorMessage, search, reset };
}

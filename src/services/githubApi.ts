import axios from 'axios';
import { GithubUser, GithubRepository } from '../types';

const api = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3+json',
  },
});

export async function fetchUser(username: string): Promise<GithubUser> {
  const { data } = await api.get<GithubUser>(`/users/${username}`);
  return data;
}

export async function fetchUserRepos(
  username: string,
  sort: 'updated' | 'stars' | 'created' = 'updated'
): Promise<GithubRepository[]> {
  const sortParam = sort === 'stars' ? 'stars' : sort;
  const { data } = await api.get<GithubRepository[]>(
    `/users/${username}/repos`,
    { params: { per_page: 100, sort: sortParam } }
  );
  return data;
}

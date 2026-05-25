export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
  html_url: string;
  location: string | null;
  blog: string | null;
  company: string | null;
  created_at: string;
}

export interface GithubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  created_at: string;
  html_url: string;
  topics: string[];
  fork: boolean;
}

export interface HistoryEntry {
  user: GithubUser;
  viewedAt: string;
}

export type RootStackParamList = {
  Home: undefined;
  Profile: { username: string };
  Repository: { repo: GithubRepository; ownerLogin: string };
  History: undefined;
};

import axios from 'axios';
import { fetchUser, fetchUserRepos } from '../src/services/githubApi';

jest.mock('axios');

const mockGet = (axios as any).__mockGet as jest.Mock;

const mockUser = {
  login: 'torvalds',
  id: 1,
  avatar_url: 'https://avatars.githubusercontent.com/u/1',
  name: 'Linus Torvalds',
  bio: 'Linux creator',
  followers: 230000,
  following: 0,
  public_repos: 7,
  html_url: 'https://github.com/torvalds',
  location: 'Portland, OR',
  blog: null,
  company: 'Linux Foundation',
  created_at: '2011-09-03T15:26:22Z',
};

const mockRepo = {
  id: 1,
  name: 'linux',
  full_name: 'torvalds/linux',
  description: 'Linux kernel source tree',
  language: 'C',
  stargazers_count: 190000,
  forks_count: 50000,
  open_issues_count: 300,
  updated_at: '2024-01-01T00:00:00Z',
  created_at: '2011-09-04T22:23:17Z',
  html_url: 'https://github.com/torvalds/linux',
  topics: ['linux', 'kernel'],
  fork: false,
};

describe('githubApi', () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  describe('fetchUser', () => {
    it('returns user data on success', async () => {
      mockGet.mockResolvedValueOnce({ data: mockUser });
      const result = await fetchUser('torvalds');
      expect(result.login).toBe('torvalds');
      expect(result.followers).toBe(230000);
    });

    it('throws on 404', async () => {
      const error = { response: { status: 404 } };
      mockGet.mockRejectedValueOnce(error);
      await expect(fetchUser('no-such-user')).rejects.toMatchObject({
        response: { status: 404 },
      });
    });
  });

  describe('fetchUserRepos', () => {
    it('returns list of repositories', async () => {
      mockGet.mockResolvedValueOnce({ data: [mockRepo] });
      const result = await fetchUserRepos('torvalds');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('linux');
    });

    it('returns empty array when user has no repos', async () => {
      mockGet.mockResolvedValueOnce({ data: [] });
      const result = await fetchUserRepos('emptyuser');
      expect(result).toHaveLength(0);
    });

    it('passes sort param to api', async () => {
      mockGet.mockResolvedValueOnce({ data: [] });
      await fetchUserRepos('torvalds', 'stars');
      expect(mockGet).toHaveBeenCalledWith(
        '/users/torvalds/repos',
        expect.objectContaining({ params: expect.objectContaining({ sort: 'stars' }) })
      );
    });
  });
});

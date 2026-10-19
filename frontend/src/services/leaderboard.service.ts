import api from './api';
import { LeaderboardEntry } from '../types/leaderboard.types';

export const leaderboardService = {
  async getLeaderboard(milestone?: string): Promise<LeaderboardEntry[]> {
    try {
      const query = milestone ? `?milestone=${encodeURIComponent(milestone)}` : '';
      const res = await api.get<{ entries: LeaderboardEntry[] }>(`/leaderboard${query}`);
      return res.data.entries ?? [];
    } catch {
      return [];
    }
  },

  async getMyEntry(): Promise<LeaderboardEntry | null> {
    try {
      const res = await api.get<{ entry: LeaderboardEntry | null }>('/leaderboard/me');
      return res.data.entry ?? null;
    } catch {
      return null;
    }
  },

  async publishEntry(data: {
    academicBatch: string;
    semesterMilestone: number;
    displayMode: 'ANONYMOUS' | 'NAMED';
    consentGiven: boolean;
  }): Promise<LeaderboardEntry> {
    const res = await api.post<{ entry: LeaderboardEntry }>('/leaderboard/publish', data);
    return res.data.entry;
  },

  async updateEntry(data: { displayMode?: string; consentGiven?: boolean }): Promise<LeaderboardEntry> {
    const res = await api.patch<{ entry: LeaderboardEntry }>('/leaderboard/publish', data);
    return res.data.entry;
  },

  async withdrawEntry(): Promise<void> {
    await api.delete('/leaderboard/publish');
  },

  async getMyStatus() { return leaderboardService.getMyEntry(); },

  async updateOptIn(data: { displayMode?: string; consentGiven?: boolean }) {
    return leaderboardService.updateEntry(data);
  },

  async verifyEntry(id: string): Promise<LeaderboardEntry> {
    const res = await api.patch<{ entry: LeaderboardEntry }>(`/admin/leaderboard/${id}/verify`);
    return res.data.entry;
  },

  async getAllEntries(params?: { milestone?: string }): Promise<LeaderboardEntry[]> {
    return leaderboardService.getLeaderboard(params?.milestone);
  },
};

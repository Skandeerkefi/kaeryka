import { create } from "zustand";
import axios from "axios";

interface Player {
  uid: string;
  username: string;
  wagered: number;
  weightedWagered: number;
  favoriteGameId: string;
  favoriteGameTitle: string;
  rankLevel: number;
}

interface LeaderboardData {
  disclosure: string;
  data: Player[];
}

interface RoobetStore {
  leaderboard: LeaderboardData | null;
  loading: boolean;
  error: string | null;
  fetchLeaderboard: (startDate?: string, endDate?: string) => Promise<void>;
}

let lastFetchTime = 0;
const FETCH_COOLDOWN = 60 * 1000; // 1 minute cooldown between API calls

export const useRoobetStore = create<RoobetStore>((set) => ({
  leaderboard: null,
  loading: false,
  error: null,

  fetchLeaderboard: async (startDate?: string, endDate?: string) => {
    const now = Date.now();
    if (now - lastFetchTime < FETCH_COOLDOWN) return; // prevent rapid refetching
    lastFetchTime = now;

    set({ loading: true, error: null });

    try {
      // 🗓️ Always get current month range
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();

      const firstDay = new Date(Date.UTC(year, month, 1)).toISOString().split("T")[0];
      const lastDay = new Date(Date.UTC(year, month + 1, 0)).toISOString().split("T")[0];

      const start = startDate || firstDay;
      const end = endDate || lastDay;

      const url = `https://tacodata-production.up.railway.app/api/leaderboard/${start}/${end}`;
      const response = await axios.get(url, { timeout: 8000 });

      if (!response.data || !response.data.data) {
        throw new Error("Invalid API response format");
      }

      const updatedData: LeaderboardData = {
        disclosure: response.data.disclosure,
        data: response.data.data.map((player: any, index: number) => ({
          uid: player.uid,
          username: player.username,
          wagered: player.wagered,
          weightedWagered: player.weightedWagered,
          favoriteGameId: player.favoriteGameId,
          favoriteGameTitle: player.favoriteGameTitle,
          rankLevel: index + 1,
        })),
      };

      set({ leaderboard: updatedData, loading: false });
    } catch (err: any) {
      let message = "Failed to fetch leaderboard";
      if (err.response?.status === 429)
        message = "Too many requests — please wait a minute before retrying.";
      else if (err.response?.status === 500)
        message = "Server error — please try again later.";
      else if (err.code === "ECONNABORTED")
        message = "Request timed out — server may be slow.";

      set({ error: message, loading: false });
    }
  },
}));

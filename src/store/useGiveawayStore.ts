import { create } from "zustand";
import api from "@/lib/api";
import { useAuthStore } from "./useAuthStore";

export type GiveawayStatus = "active" | "completed" | "upcoming";

export interface Giveaway {
	_id: string;
	title: string;
	imageUrl: string;
	endTime: string;
	participants: any[];
	totalParticipants: number;
	totalEntries: number;
	maxPlayers: number;
	depositRequirement: string;
	winnerSelectionType: "random" | "highest_deposit";
	status: GiveawayStatus;
	winner?: any;
	isEntered: boolean;
	isApproved?: boolean;
	applicationStatus?: {
		status: "pending" | "approved" | "rejected";
		applicationId: string;
	} | null;
}

export interface GiveawayApplication {
	_id: string;
	giveaway: string;
	name: string;
	discordName: string;
	depositProofVideo: string;
	depositAmount: number;
	createdAt: string;
	status: "pending" | "approved" | "rejected";
	user?: {
		id?: string;
		csgoName?: string;
		twitchUsername?: string;
		discordUsername?: string;
	};
	reviewedBy?: { csgoName?: string };
}

interface GiveawayState {
	giveaways: Giveaway[];
	fetchGiveaways: () => Promise<void>;
	enterGiveaway: (id: string, toast: any) => Promise<void>;
	createGiveaway: (
		title: string,
		imageUrl: string,
		endTime: string,
		maxPlayers: number,
		depositRequirement: string,
		winnerSelectionType: "random" | "highest_deposit",
		toast: any
	) => Promise<void>;
	submitApplication: (
		id: string,
		name: string,
		discordName: string,
		depositProofVideo: string,
		depositAmount: number,
		toast: any
	) => Promise<void>;
	fetchApplications: (id: string) => Promise<GiveawayApplication[]>;
	approveApplication: (applicationId: string, toast: any) => Promise<void>;
	drawWinner: (id: string, toast: any) => Promise<void>;
	declineApplication: (applicationId: string, toast: any) => Promise<void>;
	deleteApplication: (applicationId: string, toast: any) => Promise<void>;
	deleteGiveaway: (id: string, toast: any) => Promise<void>;
}

export const useGiveawayStore = create<GiveawayState>((set, get) => ({
	giveaways: [],

	fetchGiveaways: async () => {
		const token = useAuthStore.getState().token;
		try {
			const res = await api.get("/api/gws", {
				headers: { Authorization: `Bearer ${token}` },
			});
			const userId = useAuthStore.getState().user?.id;
			const enriched = res.data.map((gws: any) => ({
				...gws,
				isEntered: gws.participants.some(
					(p: any) => p._id === userId || p === userId
				),
				status: gws.state === "complete" ? "completed" : gws.state,
				applicationStatus: gws.applicationStatus || null,
			}));
			set({ giveaways: enriched });
		} catch (err) {
			console.error("Failed to fetch giveaways", err);
		}
	},

	enterGiveaway: async (id, toast) => {
		const token = useAuthStore.getState().token;
		try {
			await api.post(
				`/api/gws/${id}/join`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			await get().fetchGiveaways();
			toast({ title: "Entered successfully" });
		} catch {
			toast({
				title: "Error",
				description: "You Should Wager to enter GW",
				variant: "destructive",
			});
		}
	},

	createGiveaway: async (
		title,
		imageUrl,
		endTime,
		maxPlayers,
		depositRequirement,
		winnerSelectionType,
		toast
	) => {
		const token = useAuthStore.getState().token;
		try {
			await api.post(
				"/api/gws",
				{
					title,
					imageUrl,
					endTime,
					maxPlayers,
					depositRequirement,
					winnerSelectionType,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			await get().fetchGiveaways();
			toast({ title: "Giveaway created successfully" });
		} catch {
			toast({
				title: "Error",
				description: "Failed to create giveaway",
				variant: "destructive",
			});
		}
	},

	submitApplication: async (
		id,
		name,
		discordName,
		depositProofVideo,
		depositAmount,
		toast
	) => {
		const token = useAuthStore.getState().token;
		try {
			await api.post(
				`/api/gws/${id}/applications`,
				{ name, discordName, depositProofVideo, depositAmount },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			await get().fetchGiveaways();
			toast({ title: "Application submitted" });
		} catch (error: any) {
			toast({
				title: "Error",
				description: error.response?.data?.message || "Failed to submit application",
				variant: "destructive",
			});
		}
	},

	fetchApplications: async (id) => {
		const token = useAuthStore.getState().token;
		const res = await api.get(`/api/gws/${id}/applications`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return res.data;
	},

	abproveApplication: async (applicationId, toast) => {
		return get().approveApplication(applicationId, toast);
	},

	approveApplication: async (applicationId, toast) => {
		const token = useAuthStore.getState().token;
		try {
			await api.patch(
				`/api/gws/applications/${applicationId}/approve`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			await get().fetchGiveaways();
			toast({ title: "Application approved" });
		} catch (error: any) {
			toast({
				title: "Error",
				description: error.response?.data?.message || "Failed to approve application",
				variant: "destructive",
			});
		}
	},

	declineApplication: async (applicationId, toast) => {
		const token = useAuthStore.getState().token;
		try {
			await api.patch(
				`/api/gws/applications/${applicationId}/decline`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			await get().fetchGiveaways();
			toast({ title: "Application declined" });
		} catch (error: any) {
			toast({
				title: "Error",
				description: error.response?.data?.message || "Failed to decline application",
				variant: "destructive",
			});
		}
	},

	deleteApplication: async (applicationId, toast) => {
		const token = useAuthStore.getState().token;
		try {
			await api.delete(`/api/gws/applications/${applicationId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			await get().fetchGiveaways();
			toast({ title: "Application deleted" });
		} catch (error: any) {
			toast({
				title: "Error",
				description: error.response?.data?.message || "Failed to delete application",
				variant: "destructive",
			});
		}
	},

	deleteGiveaway: async (id, toast) => {
		const token = useAuthStore.getState().token;
		try {
			await api.delete(`/api/gws/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			await get().fetchGiveaways();
			toast({ title: "Giveaway deleted" });
		} catch (error: any) {
			toast({
				title: "Error",
				description: error.response?.data?.message || "Failed to delete giveaway",
				variant: "destructive",
			});
		}
	},

	drawWinner: async (id, toast) => {
		const token = useAuthStore.getState().token;
		try {
			await api.post(
				`/api/gws/${id}/draw`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			await get().fetchGiveaways();
			toast({ title: "Winner drawn successfully" });
		} catch {
			toast({
				title: "Error",
				description: "Failed to draw winner",
				variant: "destructive",
			});
		}
	},
}));

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useGiveawayStore } from "@/store/useGiveawayStore";
import { useAuthStore } from "@/store/useAuthStore";
import { ShieldAlert, CheckCircle2, Zap, Eye, Trash2, XCircle, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import HomeStyleBackground from "@/components/HomeStyleBackground";
import type { GiveawayApplication } from "@/store/useGiveawayStore";

function AdminDashboard() {
	const {
		giveaways,
		fetchGiveaways,
		fetchApplications,
		approveApplication,
		declineApplication,
		deleteApplication,
		deleteGiveaway,
		drawWinner,
	} = useGiveawayStore();
	const { user } = useAuthStore();
	const { toast } = useToast();

	const [applications, setApplications] = useState<
		Record<string, GiveawayApplication[]>
	>({});
	const [loadingGiveawayId, setLoadingGiveawayId] = useState<string | null>(null);
	const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
	const [selectedVideoUser, setSelectedVideoUser] = useState<{
		name: string;
		discord: string;
	} | null>(null);
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		if (user?.role !== "admin") return;
		fetchGiveaways();
	}, [user, fetchGiveaways]);

	const handleLoadApplications = async (giveawayId: string) => {
		setLoadingGiveawayId(giveawayId);
		try {
			const appsList = await fetchApplications(giveawayId);
			setApplications((prev) => ({
				...prev,
				[giveawayId]: appsList,
			}));
		} catch (error: any) {
			toast({
				title: "Error",
				description: error.response?.data?.message || "Failed to load applications.",
				variant: "destructive",
			});
		} finally {
			setLoadingGiveawayId(null);
		}
	};

	const handleApproveApplication = async (applicationId: string, giveawayId: string) => {
		try {
			await approveApplication(applicationId, toast);
			await handleLoadApplications(giveawayId);
		} catch (error: any) {
			toast({
				title: "Error",
				description: error.response?.data?.message || "Failed to approve application.",
				variant: "destructive",
			});
		}
	};

	const handleDeclineApplication = async (applicationId: string, giveawayId: string) => {
		try {
			await declineApplication(applicationId, toast);
			await handleLoadApplications(giveawayId);
		} catch (error: any) {
			toast({
				title: "Error",
				description: error.response?.data?.message || "Failed to decline application.",
				variant: "destructive",
			});
		}
	};

	const handleDeleteApplication = async (applicationId: string, giveawayId: string) => {
		try {
			await deleteApplication(applicationId, toast);
			await handleLoadApplications(giveawayId);
		} catch (error: any) {
			toast({
				title: "Error",
				description: error.response?.data?.message || "Failed to delete application.",
				variant: "destructive",
			});
		}
	};

	const handleDeleteGiveaway = async (giveawayId: string) => {
		try {
			await deleteGiveaway(giveawayId, toast);
			setApplications((current) => {
				const next = { ...current };
				delete next[giveawayId];
				return next;
			});
		} catch (error: any) {
			toast({
				title: "Error",
				description: error.response?.data?.message || "Failed to delete giveaway.",
				variant: "destructive",
			});
		}
	};

	const handleDrawWinner = async (giveawayId: string) => {
		try {
			await drawWinner(giveawayId, toast);
			await fetchGiveaways();
		} catch (error: any) {
			toast({
				title: "Error",
				description: error.response?.data?.message || "Failed to draw winner.",
				variant: "destructive",
			});
		}
	};

	const filteredGiveaways = giveaways.filter((giveaway) =>
		giveaway.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	if (user?.role !== "admin") {
		return (
			<div className='relative flex flex-col min-h-screen text-white'>
				<HomeStyleBackground />
				<Navbar />
				<main className='container relative z-10 flex-grow max-w-6xl px-4 py-8 mx-auto'>
					<div className='text-center'>
						<ShieldAlert className='w-16 h-16 mx-auto mb-4 text-[#AF2D03]' />
						<h2 className='mb-2 text-2xl font-bold text-[#EA6D0C]'>
							Access Denied
						</h2>
						<p className='text-[#AF2D03]'>
							Only admins can access this page.
						</p>
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	return (
		<div className='relative flex flex-col min-h-screen text-white'>
			<HomeStyleBackground />
			<Navbar />

			<main className='container relative z-10 flex-grow max-w-7xl px-4 py-8 mx-auto'>
				<div className='flex items-center gap-2 mb-8'>
					<ShieldAlert className='w-6 h-6 text-[#EA6D0C]' />
					<h1 className='text-3xl font-bold'>Admin Dashboard</h1>
				</div>

				<div className='p-6 mb-8 rounded-lg bg-[#000000] border border-[#AF2D03]'>
					<div className='flex flex-col gap-4'>
						<p className='text-[#ffffff]'>
							Review and approve user applications for giveaways.
						</p>
						<div className='relative flex-1'>
							<Input
								placeholder='Search giveaways...'
								className='bg-[#ffffff] border border-[#AF2D03] text-black placeholder:text-[#EA6D0C]'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</div>
				</div>

				{filteredGiveaways.length > 0 ? (
					<div className='space-y-6'>
						{filteredGiveaways.map((giveaway) => (
							<div
								key={giveaway._id}
								className='p-6 rounded-lg border border-[#AF2D03] bg-[#000000]'
							>
								<div className='flex items-start justify-between mb-4'>
									<div className='flex items-start gap-4'>
										{giveaway.imageUrl && (
											<img
												src={giveaway.imageUrl}
												alt={giveaway.title}
												className='w-24 h-24 rounded-md object-cover border border-[#AF2D03]'
											/>
										)}
										<div>
											<h2 className='text-xl font-bold text-[#ffffff]'>
												{giveaway.title}
											</h2>
											<p className='text-sm text-[#D3D3D3] mt-1'>
												Status: <span className='text-[#EA6D0C]'>{giveaway.status}</span>
											</p>
											<p className='text-sm text-[#D3D3D3]'>
												Max Players: {giveaway.maxPlayers}
											</p>
											<p className='text-sm text-[#D3D3D3]'>
												Deposit Requirement: {giveaway.depositRequirement}
											</p>
											<p className='text-sm text-[#D3D3D3]'>
												Winner Type:{" "}
												{giveaway.winnerSelectionType === "highest_deposit"
													? "Highest Deposit"
													: "Random"}
											</p>
										</div>
									</div>
									<div className='flex flex-col gap-2'>
										<Button
											type='button'
											onClick={() => handleLoadApplications(giveaway._id)}
											className='bg-[#EA6D0C] hover:bg-[#AF2D03] text-black'
											disabled={loadingGiveawayId === giveaway._id}
										>
											{loadingGiveawayId === giveaway._id ? (
												<>
													<Zap className='w-4 h-4 mr-2 animate-spin' />
													Loading...
												</>
											) : (
												<>
													<CheckCircle2 className='w-4 h-4 mr-2' />
													Load Applications ({applications[giveaway._id]?.length || 0})
												</>
											)}
										</Button>
										<Button
											type='button'
											onClick={() => handleDeleteGiveaway(giveaway._id)}
											variant='destructive'
											className='bg-[#ef4444] hover:bg-[#dc2626] text-white'
										>
											<Trash2 className='w-4 h-4 mr-2' />
											Delete Giveaway
										</Button>
										<Button
											type='button'
											onClick={() => handleDrawWinner(giveaway._id)}
											className='bg-[#22c55e] hover:bg-[#16a34a] text-white'
										>
											<Trophy className='w-4 h-4 mr-2' />
											Draw Winner
										</Button>
									</div>
								</div>

								{applications[giveaway._id] && applications[giveaway._id].length > 0 ? (
									<div className='space-y-3'>
										{applications[giveaway._id].map((application) => (
											<div
												key={application._id}
												className='rounded-lg border border-[#334155] bg-[#090909] p-4'
											>
												<div className='grid grid-cols-1 md:grid-cols-4 gap-4 items-start'>
													{/* User Info */}
													<div className='col-span-1'>
														<p className='text-sm font-semibold text-[#ffffff]'>
															{application.name}
														</p>
														<p className='text-sm text-[#D3D3D3]'>
															Discord: {application.discordName}
														</p>
														<p className='text-xs text-[#888888] mt-1'>
															{new Date(application.createdAt).toLocaleDateString()}
														</p>
													</div>

													{/* Video Preview */}
													<div className='col-span-1'>
														{application.depositProofVideo && (
															<div className='relative group'>
																<video
																	src={application.depositProofVideo}
																	className='w-full h-40 rounded-md object-cover border border-[#334155]'
																	controls
																/>
																<Button
																	type='button'
																	onClick={() => {
																		setSelectedVideo(application.depositProofVideo);
																		setSelectedVideoUser({
																			name: application.name,
																			discord: application.discordName,
																		});
																	}}
																	size='sm'
																	className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#EA6D0C] hover:bg-[#AF2D03] text-black'
																>
																	<Eye className='w-4 h-4' />
																</Button>
															</div>
														)}
													</div>

													{/* Status */}
													<div className='col-span-1'>
														<p className='text-sm text-[#D3D3D3] mb-2'>
															Deposit Amount: {application.depositAmount}
														</p>
														<p className='text-sm text-[#D3D3D3]'>
															Status:{" "}
															<span
																className={
																	application.status === "approved"
																		? "text-[#22c55e] font-semibold"
																		: application.status === "rejected"
																		? "text-[#ef4444] font-semibold"
																		: "text-[#EA6D0C] font-semibold"
																}
															>
																{application.status}
															</span>
														</p>
														{application.reviewedBy && (
															<p className='text-xs text-[#888888] mt-1'>
																Reviewed by: {application.reviewedBy.csgoName || "Admin"}
															</p>
														)}
													</div>

													{/* Action */}
													<div className='col-span-1'>
														{application.status === "approved" ? (
															<div className='flex items-center gap-2 text-sm text-[#22c55e]'>
																<CheckCircle2 className='w-5 h-5' />
																Approved
															</div>
														) : application.status === "rejected" ? (
															<div className='flex items-center gap-2 text-sm text-[#ef4444]'>
																<XCircle className='w-5 h-5' />
																Declined
															</div>
														) : (
															<Button
																type='button'
																onClick={() =>
																	handleApproveApplication(application._id, giveaway._id)
																}
																className='w-full bg-[#22c55e] hover:bg-[#16a34a] text-white'
															>
																Approve
															</Button>
														)}
														<div className='mt-2 flex gap-2'>
															<Button
																type='button'
																onClick={() => handleDeclineApplication(application._id, giveaway._id)}
																className='flex-1 bg-[#ef4444] hover:bg-[#dc2626] text-white'
															>
																<XCircle className='w-4 h-4 mr-2' />
																Decline
															</Button>
															<Button
																type='button'
																onClick={() => handleDeleteApplication(application._id, giveaway._id)}
																className='flex-1 bg-[#111827] hover:bg-[#1f2937] text-white border border-[#334155]'
															>
																<Trash2 className='w-4 h-4 mr-2' />
																Delete
															</Button>
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								) : applications[giveaway._id] ? (
									<p className='text-sm text-[#D3D3D3] text-center py-4'>
										No applications for this giveaway yet.
									</p>
								) : null}
							</div>
						))}
					</div>
				) : (
					<div className='text-center py-12'>
						<ShieldAlert className='w-16 h-16 mx-auto mb-4 text-[#AF2D03]' />
						<h2 className='mb-2 text-2xl font-bold text-[#EA6D0C]'>
							No Giveaways Found
						</h2>
						<p className='text-[#AF2D03]'>
							No giveaways match your search.
						</p>
					</div>
				)}
			</main>

			{selectedVideo && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4'>
					<button
						type='button'
						className='absolute inset-0 cursor-default'
						onClick={() => {
							setSelectedVideo(null);
							setSelectedVideoUser(null);
						}}
						aria-label='Close video viewer'
					/>
					<div className='relative z-10 w-full max-w-4xl rounded-xl border border-[#AF2D03] bg-[#000000] p-4 shadow-2xl'>
						<div className='mb-4 flex items-center justify-between gap-4'>
							<div>
								<h2 className='text-xl font-bold text-white'>Deposit Proof Video</h2>
								<p className='text-sm text-[#D3D3D3]'>
									{selectedVideoUser?.name} · {selectedVideoUser?.discord}
								</p>
							</div>
							<Button
								type='button'
								onClick={() => {
									setSelectedVideo(null);
									setSelectedVideoUser(null);
								}}
								className='bg-[#EA6D0C] text-black hover:bg-[#AF2D03]'
							>
								Close
							</Button>
						</div>
						<video
							src={selectedVideo}
							className='max-h-[75vh] w-full rounded-lg border border-[#AF2D03] object-contain'
							controls
						/>
					</div>
				</div>
			)}
			<Footer />
		</div>
	);
}

export default AdminDashboard;

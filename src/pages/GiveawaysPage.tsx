import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GiveawayCard } from "@/components/GiveawayCard";
import { useGiveawayStore } from "@/store/useGiveawayStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Gift, Search, Filter, Upload, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import HomeStyleBackground from "@/components/HomeStyleBackground";

type ApplicationFormState = {
	csgoName: string;
	discordName: string;
	depositProofImage: string;
};

const readFileAsDataUrl = (file: File) =>
	new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = () => reject(new Error("Failed to read file"));
		reader.readAsDataURL(file);
	});

function GiveawaysPage() {
	const {
		giveaways,
		fetchGiveaways,
		enterGiveaway,
		createGiveaway,
		submitApplication,
	} = useGiveawayStore();
	const { user } = useAuthStore();
	const { toast } = useToast();

	const [searchQuery, setSearchQuery] = useState("");
	const [filter, setFilter] = useState<
		"all" | "active" | "completed" | "upcoming"
	>("all");
	const [newTitle, setNewTitle] = useState("");
	const [newImageUrl, setNewImageUrl] = useState("");
	const [newEndTime, setNewEndTime] = useState("");
	const [newMaxPlayers, setNewMaxPlayers] = useState("50");
	const [newDepositRequirement, setNewDepositRequirement] = useState("");
	const [applicationForms, setApplicationForms] = useState<
		Record<string, ApplicationFormState>
	>({});

	useEffect(() => {
		fetchGiveaways();
	}, []);

	const getApplicationForm = (giveawayId: string): ApplicationFormState => {
		const current = applicationForms[giveawayId];
		return {
			csgoName: current?.csgoName ?? user?.csgoName ?? "",
			discordName: current?.discordName ?? user?.discordUsername ?? "",
			depositProofImage: current?.depositProofImage ?? "",
		};
	};

	const updateApplicationForm = (
		giveawayId: string,
		field: keyof ApplicationFormState,
		value: string
	) => {
		setApplicationForms((current) => ({
			...current,
			[giveawayId]: {
				...getApplicationForm(giveawayId),
				[field]: value,
			},
		}));
	};

	const handleImageUpload = async (
		file: File | undefined,
		setter: (value: string) => void
	) => {
		if (!file) return;
		const dataUrl = await readFileAsDataUrl(file);
		setter(dataUrl);
	};

	const filteredGiveaways = giveaways.filter((giveaway) => {
		const matchesSearch = giveaway.title
			.toLowerCase()
			.includes(searchQuery.toLowerCase());
		const matchesStatus = filter === "all" || giveaway.status === filter;
		return matchesSearch && matchesStatus;
	});

	const handleEnter = async (id: string) => {
		if (!user) {
			toast({
				title: "Not Logged In",
				description: "Please log in to enter the giveaway.",
				variant: "destructive",
			});
			return;
		}
		await enterGiveaway(id, toast);
	};

	const handleCreateGiveaway = async () => {
		if (!newTitle || !newImageUrl || !newEndTime || !newMaxPlayers || !newDepositRequirement) {
			toast({
				title: "Missing fields",
				description: "Please provide title, image, time, player limit, and deposit requirement.",
				variant: "destructive",
			});
			return;
		}
		await createGiveaway(
			newTitle,
			newImageUrl,
			newEndTime,
			Number(newMaxPlayers),
			newDepositRequirement,
			toast
		);
		setNewTitle("");
		setNewImageUrl("");
		setNewEndTime("");
		setNewMaxPlayers("50");
		setNewDepositRequirement("");
	};

		const handleSubmitApplication = async (giveawayId: string) => {
		const form = getApplicationForm(giveawayId);

			if (!form.csgoName || !form.discordName || !form.depositProofImage) {
			toast({
				title: "Missing fields",
					description: "Add your CSGO name, Discord name, and deposit proof image.",
				variant: "destructive",
			});
			return;
		}

			await submitApplication(giveawayId, form.csgoName, form.discordName, form.depositProofImage, toast);
		setApplicationForms((current) => ({
			...current,
			[giveawayId]: {
					csgoName: form.csgoName,
				discordName: form.discordName,
				depositProofImage: "",
			},
		}));
	};

	return (
		<div className='relative flex flex-col min-h-screen text-white'>
			<HomeStyleBackground />

			<Navbar />

			<main className='container relative z-10 flex-grow max-w-6xl px-4 py-8 mx-auto'>
				<div className='flex items-center gap-2 mb-8'>
					<Gift className='w-6 h-6 text-[#ffffff]' />
					<h1 className='text-3xl font-bold'>Giveaways</h1>
				</div>

				<div className='p-6 mb-8 rounded-lg bg-[#000000] border border-[#AF2D03]'>
					<p className='mb-6 text-[#ffffff]'>
						Admin can create giveaways with an image, player limit, and deposit
						requirement. Users submit a deposit proof application before joining.
					</p>

					{user?.role === "admin" && (
						<div className='mb-6'>
							<h2 className='mb-2 font-semibold text-[#ffffff]'>
								Create New Giveaway
							</h2>
							<Input
								placeholder='Giveaway name'
								value={newTitle}
								onChange={(e) => setNewTitle(e.target.value)}
								className='mb-2 bg-[#ffffff] border border-[#AF2D03] text-black placeholder:text-[#EA6D0C]'
							/>
							<Input
								placeholder='Image URL or data URL'
								value={newImageUrl}
								onChange={(e) => setNewImageUrl(e.target.value)}
								className='mb-2 bg-[#ffffff] border border-[#AF2D03] text-black placeholder:text-[#EA6D0C]'
							/>
							<div className='mb-2'>
								<label className='mb-2 flex items-center gap-2 text-sm text-[#ffffff]'>
									<Upload className='h-4 w-4' />
									Upload giveaway image
								</label>
								<Input
									type='file'
									accept='image/*'
									onChange={(e) => handleImageUpload(e.target.files?.[0], setNewImageUrl)}
									className='bg-[#ffffff] border border-[#AF2D03] text-black'
								/>
							</div>
							<Input
								type='datetime-local'
								value={newEndTime}
								onChange={(e) => setNewEndTime(e.target.value)}
								className='mb-2 bg-[#ffffff] border border-[#AF2D03] text-black placeholder:text-[#EA6D0C]'
							/>
							<Input
								type='number'
								min='1'
								placeholder='Max players'
								value={newMaxPlayers}
								onChange={(e) => setNewMaxPlayers(e.target.value)}
								className='mb-2 bg-[#ffffff] border border-[#AF2D03] text-black placeholder:text-[#EA6D0C]'
							/>
							<Input
								placeholder='Deposit requirement'
								value={newDepositRequirement}
								onChange={(e) => setNewDepositRequirement(e.target.value)}
								className='mb-2 bg-[#ffffff] border border-[#AF2D03] text-black placeholder:text-[#EA6D0C]'
							/>
							<Button
								onClick={handleCreateGiveaway}
								className='bg-[#ffffff] hover:bg-[#AF2D03] text-black'
							>
								Create Giveaway
							</Button>
						</div>
					)}

					<div className='flex flex-col gap-4 md:flex-row'>
						<div className='relative flex-1'>
							<Search className='absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-[#000000]' />
							<Input
								placeholder='Search giveaways...'
								className='pl-9 bg-[#ffffff] border border-[#AF2D03] text-white placeholder:text-[#ff0000]'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>

						<div className='flex items-center gap-2'>
							<Filter className='w-4 h-4 text-[#ffffff]' />
							<Tabs
								defaultValue='all'
								onValueChange={(val) => setFilter(val as any)}
								className=' border border-[#AF2D03] rounded-md'
							>
								<TabsList className='flex space-x-2 bg-black'>
									{["all", "active", "upcoming", "completed"].map((val) => (
										<TabsTrigger
											key={val}
											value={val}
											className='text-[#ffffff] data-[state=active]:bg-[#ffffff] data-[state=active]:text-black'
										>
											{val.charAt(0).toUpperCase() + val.slice(1)}
										</TabsTrigger>
									))}
								</TabsList>
							</Tabs>
						</div>
					</div>
				</div>

				{filteredGiveaways.length > 0 ? (
					<div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
						{filteredGiveaways.map((giveaway) => (
							<div
								key={giveaway._id}
								className='p-4 rounded-lg  border border-[#AF2D03] shadow-sm'
							>
								<GiveawayCard
									id={giveaway._id}
									title={giveaway.title}
									imageUrl={giveaway.imageUrl}
									prize='Surprise Prize'
									endTime={new Date(giveaway.endTime).toLocaleString()}
									participants={giveaway.totalParticipants}
									maxParticipants={giveaway.maxPlayers}
									depositRequirement={giveaway.depositRequirement}
									status={giveaway.status}
									isEntered={giveaway.isEntered}
									canEnter={Boolean(giveaway.isApproved)}
									onEnter={handleEnter}
								/>

								{user && user.role !== "admin" && !giveaway.isApproved && giveaway.status === "active" && (
									<div className='mt-4 rounded-lg border border-[#334155] bg-[#090909] p-4 text-white'>
										<div className='mb-3 flex items-center gap-2 text-sm text-[#EA6D0C]'>
											<ShieldCheck className='h-4 w-4' />
											{giveaway.applicationStatus?.status === "rejected"
												? "Your application was declined. You can apply again below."
												: giveaway.applicationStatus?.status === "pending"
													? "Your application is pending review."
													: "Submit your application to unlock entry"}
										</div>
										{giveaway.applicationStatus && (
											<div className='mb-3 rounded-md border border-[#334155] bg-[#111111] px-3 py-2 text-sm'>
												Your application status:{" "}
												<span
													className={
														giveaway.applicationStatus.status === "approved"
															? "text-[#22c55e] font-semibold"
															: giveaway.applicationStatus.status === "rejected"
															? "text-[#ef4444] font-semibold"
															: "text-[#EA6D0C] font-semibold"
													}
												>
													{giveaway.applicationStatus.status}
												</span>
											</div>
										)}
										{(!giveaway.applicationStatus || giveaway.applicationStatus.status === "rejected") && (
											<div className='space-y-2'>
											<Input
												placeholder='Your CSGO name'
												value={getApplicationForm(giveaway._id).csgoName}
												onChange={(e) =>
													updateApplicationForm(giveaway._id, "csgoName", e.target.value)
												}
												className='bg-[#ffffff] border border-[#AF2D03] text-black placeholder:text-[#EA6D0C]'
											/>
											<Input
												placeholder='Discord name'
												value={getApplicationForm(giveaway._id).discordName}
												onChange={(e) =>
													updateApplicationForm(giveaway._id, "discordName", e.target.value)
												}
												className='bg-[#ffffff] border border-[#AF2D03] text-black placeholder:text-[#EA6D0C]'
											/>
											<Input
												type='file'
												accept='image/*'
												onChange={async (e) => {
													const file = e.target.files?.[0];
													if (!file) return;
													const dataUrl = await readFileAsDataUrl(file);
													updateApplicationForm(giveaway._id, "depositProofImage", dataUrl);
												}}
												className='bg-[#ffffff] border border-[#AF2D03] text-black'
											/>
											{getApplicationForm(giveaway._id).depositProofImage && (
												<img
													src={getApplicationForm(giveaway._id).depositProofImage}
													alt='Deposit proof preview'
													className='h-32 w-full rounded-md object-cover'
												/>
											)}
											<Button
												onClick={() => handleSubmitApplication(giveaway._id)}
												className='w-full bg-[#EA6D0C] hover:bg-[#AF2D03] text-black'
											>
												{giveaway.applicationStatus?.status === "rejected" ? "Reapply" : "Send Application"}
											</Button>
										</div>
									)}
									</div>
								)}

								{giveaway.winner && (
									<p className='mt-2 text-sm text-[#EA6D0C]'>
										🎉 Winner: <strong>{giveaway.winner.csgoName}</strong>
									</p>
								)}
							</div>
						))}
					</div>
				) : (
					<div className='py-12 text-center'>
						<Gift className='w-16 h-16 mx-auto mb-4 text-[#AF2D03]' />
						<h2 className='mb-2 text-2xl font-bold text-[#EA6D0C]'>
							No Giveaways Found
						</h2>
						<p className='text-[#AF2D03]'>
							{searchQuery || filter !== "all"
								? "No giveaways match your filters."
								: "Check back soon for exciting giveaways!"}
						</p>
					</div>
				)}
			</main>

			<Footer />
		</div>
	);
}

export default GiveawaysPage;

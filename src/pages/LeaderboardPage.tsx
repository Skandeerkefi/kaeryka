import React, { useEffect, useState } from "react";
import { Trophy, Crown, Medal, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRoobetStore } from "../store/RoobetStore";
import GraphicalBackground from "@/components/GraphicalBackground";

const LeaderboardPage: React.FC = () => {
	const { leaderboard, loading, error, fetchLeaderboard } = useRoobetStore();

	useEffect(() => {
		fetchLeaderboard();
	}, []);
	// Timer state + logic
	const [timeLeft, setTimeLeft] = useState("");

	useEffect(() => {
		const updateTimer = () => {
			const now = new Date();
			const year = now.getFullYear();
			const month = now.getMonth();
			const endOfMonth = new Date(year, month + 1, 1, 0, 0, 0); // next month start
			const diff = endOfMonth.getTime() - now.getTime();

			const days = Math.floor(diff / (1000 * 60 * 60 * 24));
			const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
			const minutes = Math.floor((diff / (1000 * 60)) % 60);
			const seconds = Math.floor((diff / 1000) % 60);

			setTimeLeft(
				`${days}d ${hours.toString().padStart(2, "0")}h ${minutes
					.toString()
					.padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`
			);
		};

		updateTimer();
		const interval = setInterval(updateTimer, 1000);
		return () => clearInterval(interval);
	}, []);

	const top3 = leaderboard?.data?.slice(0, 3) || [];
	// Podium order: top2, top1, top3
	const podiumOrder = [top3[1], top3[0], top3[2]];

	const socialLinks = [
		{ name: "Roobet", url: "https://roobet.com/?ref=kaeryka" },
		{ name: "Twitch", url: "https://www.twitch.tv/kaeryka" },
		{ name: "YouTube", url: "https://www.youtube.com/@kaeryka" },
		{ name: "Twitter", url: "https://x.com/kaeryyka" },
		{ name: "Discord", url: "https://discord.gg/kxT4fq4rda" },
	];

	const iconMap = [Crown, Trophy, Medal];
	const colorMap = ["text-[#c63352]", "text-[#eab5ab]", "text-[#c63352]"];
	const prizeMap = ["100$", "50$", "25$"];

	return (
		<div className='relative min-h-screen text-white p-6 md:p-10 flex flex-col items-center overflow-hidden'>
			{/* 🌌 Animated Background */}
			<GraphicalBackground />

			{/* 🏆 HERO SECTION */}
			<section className='relative z-10 max-w-4xl space-y-6 text-center'>
				<h1 className='text-5xl md:text-6xl font-extrabold text-[#c63352]'>
					KAERYKA
				</h1>
			</section>

			{/* Divider */}
			<div className='w-24 h-[3px] bg-[#c63352] my-12 rounded-full relative z-10'></div>

			{/* 🥇 LEADERBOARD SECTION */}
			<section className='relative z-10 w-full max-w-5xl space-y-10'>
				{/* Leaderboard Title */}
				<div className='space-y-2 text-center'>
					<h2 className='text-4xl font-bold text-[#c63352]'>
						KAERYKA Leaderboard Roobet
					</h2>
					<p className='text-[#eab5ab] text-base'>
						Track your ranking and see the current top players!
					</p>
				</div>

				<Card className='relative overflow-hidden bg-black/90 border border-[#c63352]/40 shadow-lg'>
					{/* Transparent Road Background */}
					<div
						className='absolute inset-0 bg-center bg-cover opacity-10'
						style={{
							backgroundImage:
								"url('https://i.ibb.co/5XF5zJgS/Capture-d-cran-2025-10-08-141143.png')",
						}}
					></div>

					{/* Chickens (fully visible, not transparent) */}
					<img
						src='https://i.ibb.co/CX3znrf/Capture-d-cran-2025-10-08-141941-removebg-preview.png'
						alt='chicken'
						className='absolute w-16 top-2 left-4 drop-shadow-lg animate-bounce'
					/>
					<img
						src='https://i.ibb.co/pBVS3cpp/Capture-d-cran-2025-10-08-141937-removebg-preview.png'
						alt='chicken'
						className='absolute w-16 delay-150 top-2 right-4 drop-shadow-lg animate-bounce'
					/>

					{/* Foreground Content */}
					<div className='relative z-10'>
						<CardHeader className='text-center'>
							<div className='w-24 h-24 mx-auto bg-[#c63352]/20 rounded-full flex items-center justify-center mb-4'>
								<Crown className='w-12 h-12 text-[#c63352]' />
							</div>
							<CardTitle className='text-3xl font-bold text-[#c63352]'>
								JOIN US
							</CardTitle>
						</CardHeader>

						<CardContent>
							<div className='flex flex-wrap justify-center gap-3'>
								{socialLinks.map((link) => (
									<Button
										key={link.name}
										variant='outline'
										size='lg'
										className='border-[#c63352]/40 text-[#eab5ab] hover:text-[#c63352] hover:border-[#c63352] transition-colors font-semibold'
										asChild
									>
										<a
											href={link.url}
											target='_blank'
											rel='noopener noreferrer'
										>
											{link.name}
										</a>
									</Button>
								))}
							</div>
						</CardContent>
					</div>
				</Card>

				{/* Rules */}
				<Card className='bg-black/90 border border-[#c63352]/30 shadow-md'>
					<CardHeader>
						<CardTitle className='flex items-center gap-2 text-[#c63352]'>
							<Info className='w-6 h-6' />
							Leaderboard Rules
						</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4 text-[#eab5ab]'>
						<p className='text-white font-medium'>
							Your wagers on Roobet count towards the leaderboard based on game
							RTP (Return to Player):
						</p>
						<div className='space-y-3'>
							<div className='flex items-center gap-3 p-3 bg-[#c63352]/10 rounded-lg'>
								<div className='w-3 h-3 bg-[#c63352] rounded-full' />
								<span>
									<strong>Games with RTP ≤ 97%</strong> →{" "}
									<strong className='text-[#c63352]'>100%</strong> of wager
								</span>
							</div>
							<div className='flex items-center gap-3 p-3 bg-[#c63352]/10 rounded-lg'>
								<div className='w-3 h-3 bg-[#eab5ab] rounded-full' />
								<span>
									<strong>Games with RTP &gt; 97%</strong> →{" "}
									<strong className='text-[#c63352]'>50%</strong> of wager
								</span>
							</div>
							<div className='flex items-center gap-3 p-3 bg-[#c63352]/10 rounded-lg'>
								<div className='w-3 h-3 bg-[#c63352] rounded-full' />
								<span>
									<strong>Games with RTP ≥ 98%</strong> →{" "}
									<strong className='text-[#c63352]'>10%</strong> of wager
								</span>
							</div>
						</div>
						<p className='text-sm bg-[#c63352]/10 p-3 rounded-lg border-l-4 border-[#c63352] text-[#eab5ab]'>
							<strong>Note:</strong> Only Slots and House games count (Dice is
							excluded)
						</p>
					</CardContent>
				</Card>

				{/* Top 3 Players Podium */}
				<div className='space-y-6'>
					<h3 className='text-2xl font-bold text-center text-[#c63352]'>
						Current Top 3 Players
					</h3>
					<div className='mt-2 text-center'>
						<p className='text-[#eab5ab] text-sm italic'>
							Showing leaderboard for{" "}
							{new Date().toLocaleString("default", {
								month: "long",
								year: "numeric",
							})}
						</p>
						<p className='text-[#c63352] text-sm font-semibold mt-1'>
							⏳ Resets in: {timeLeft}
						</p>
					</div>

					{loading && <p className='text-center'>Loading leaderboard...</p>}
					{error && <p className='text-center text-red-400'>{error}</p>}

					<div className='grid items-end gap-6 md:grid-cols-3'>
						{podiumOrder.map((player, index) => {
							if (!player) return null;
							const originalIndex = top3.indexOf(player);
							const IconComponent = iconMap[originalIndex] || Trophy;
							const color = colorMap[originalIndex] || "text-[#c63352]";
							const prize = prizeMap[originalIndex] || "$500";

							return (
								<Card
									key={player.uid}
									className={`bg-black/90 border border-[#c63352]/30 text-center transition-transform hover:scale-105 ${
										originalIndex === 0
											? "shadow-lg border-[#c63352]/60 md:scale-110"
											: "md:mt-6"
									}`}
								>
									<CardHeader className='pb-3'>
										<div className='relative'>
											<div
												className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
													originalIndex === 0
														? "bg-gradient-to-tr from-[#c63352] to-[#eab5ab]"
														: "bg-[#c63352]/20"
												}`}
											>
												<IconComponent className={`w-8 h-8 ${color}`} />
											</div>
											<Badge
												variant='secondary'
												className='absolute -top-2 -right-2 text-xs font-bold bg-[#c63352]/20 text-[#c63352]'
											>
												#{originalIndex + 1}
											</Badge>
										</div>
										<CardTitle className='text-xl text-white'>
											{player.username}
										</CardTitle>
									</CardHeader>
									<CardContent className='space-y-4'>
										<div className='space-y-2'>
											<div className='space-y-2'>
												<div className='text-sm text-[#eab5ab]'>
													Total Wagered
												</div>
												<div className='text-2xl font-bold text-white'>
													{player.wagered.toLocaleString()}$
												</div>

												<div className='text-sm text-[#eab5ab] pt-2 border-t border-[#c63352]/20'>
													Weighted Wagered
												</div>
												<div className='text-xl font-semibold text-[#c63352]'>
													{player.weightedWagered.toLocaleString()}$
												</div>
											</div>
										</div>
										<div className='pt-4 border-t border-[#c63352]/30'>
											<div className='text-sm text-[#eab5ab] mb-1'>
												Prize Pool
											</div>
											<div
												className={`text-xl font-bold ${
													originalIndex === 0
														? "text-[#c63352]"
														: "text-white"
												}`}
											>
												{prize}
											</div>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</div>
			</section>

			<br />

			{/* CTA */}
			<div className='relative z-10 space-y-4 text-center'>
				<a
					href='https://roobet.com/?ref=kaeryka'
					target='_blank'
					rel='noopener noreferrer'
				>
					<Button
						size='lg'
						className='bg-[#c63352] hover:bg-[#eab5ab] hover:text-black text-white text-lg px-8 py-6 font-bold shadow-lg hover:shadow-xl transition-all'
					>
						Start Playing on Roobet
					</Button>
				</a>
				<p className='text-sm text-[#eab5ab]'>
					Place your wagers and climb the leaderboard for amazing prizes!
				</p>
			</div>
		</div>
	);
};

export default LeaderboardPage;
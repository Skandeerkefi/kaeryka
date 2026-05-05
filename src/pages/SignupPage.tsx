import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import HomeStyleBackground from "@/components/HomeStyleBackground";

function SignupPage() {
	const [twitchUsername, setTwitchUsername] = useState("");
	const [discordUsername, setDiscordUsername] = useState("");
	const [csgoName, setCsgoName] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [agreedToTerms, setAgreedToTerms] = useState(false);
	const [passwordError, setPasswordError] = useState("");
	const { signup, isLoading } = useAuthStore();
	const { toast } = useToast();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!twitchUsername || !discordUsername || !csgoName || !password || !confirmPassword) return;

		if (password !== confirmPassword) {
			setPasswordError("Passwords do not match");
			return;
		}

		if (!agreedToTerms) return;

		try {
			const success = await signup(
				twitchUsername,
				discordUsername,
				csgoName,
				password,
				confirmPassword
			);
			if (success) {
				toast({
					title: "Account Created",
					description: "Your account has been created successfully!",
				});
				navigate("/login");
			}
		} catch (error: any) {
			toast({
				title: "Signup Failed",
				description: error.message || "Unexpected error occurred.",
				variant: "destructive",
			});
		}
	};

	return (
		<div className='relative flex flex-col min-h-screen'>
			<HomeStyleBackground />

			<Navbar />

			<main className='container flex items-center justify-center flex-grow py-12'>
				<Card className='w-full max-w-md bg-white/90 border border-[#E0E0E0] text-[#000000] shadow-md rounded-xl backdrop-blur-md'>
					<CardHeader className='space-y-1'>
						<div className='flex items-center justify-center gap-2 mb-2'>
							<UserPlus className='w-6 h-6 text-[#000000]' />
							<CardTitle className='text-2xl text-[#000000]'>
								Create an Account
							</CardTitle>
						</div>
						<CardDescription className='text-center text-[#000000]'>
							Enter your Twitch, Discord, and CSGO details to register and join the
							community
						</CardDescription>
					</CardHeader>

					<form onSubmit={handleSubmit}>
						<CardContent className='space-y-4'>
							{/* Twitch Username */}
							<div className='space-y-2'>
								<Label htmlFor='twitchUsername' className='text-[#000000]'>
									Twitch Username
								</Label>
								<Input
									id='twitchUsername'
									placeholder='Enter your Twitch username'
									value={twitchUsername}
									onChange={(e) => setTwitchUsername(e.target.value)}
									required
									className='bg-white border border-[#E0E0E0] text-[#000000] placeholder:text-[#999999]'
								/>
							</div>

							{/* Discord Username */}
							<div className='space-y-2'>
								<Label htmlFor='discordUsername' className='text-[#000000]'>
									Discord Username
								</Label>
								<Input
									id='discordUsername'
									placeholder='Enter your Discord username'
									value={discordUsername}
									onChange={(e) => setDiscordUsername(e.target.value)}
									required
									className='bg-white border border-[#E0E0E0] text-[#000000] placeholder:text-[#999999]'
								/>
							</div>

							{/* CSGO Name */}
							<div className='space-y-2'>
								<Label htmlFor='csgoName' className='text-[#000000]'>
									CSGO Name
								</Label>
								<Input
									id='csgoName'
									placeholder='Enter your CSGO name'
									value={csgoName}
									onChange={(e) => setCsgoName(e.target.value)}
									required
									className='bg-white border border-[#E0E0E0] text-[#000000] placeholder:text-[#999999]'
								/>
							</div>

							{/* Password */}
							<div className='space-y-2'>
								<Label htmlFor='password' className='text-[#000000]'>
									Password
								</Label>
								<Input
									id='password'
									type='password'
									placeholder='Create a password'
									value={password}
									onChange={(e) => {
										setPassword(e.target.value);
										setPasswordError("");
									}}
									required
									className='bg-white border border-[#E0E0E0] text-[#000000] placeholder:text-[#999999]'
								/>
							</div>

							{/* Confirm Password */}
							<div className='space-y-2'>
								<Label htmlFor='confirmPassword' className='text-[#000000]'>
									Confirm Password
								</Label>
								<Input
									id='confirmPassword'
									type='password'
									placeholder='Confirm your password'
									value={confirmPassword}
									onChange={(e) => {
										setConfirmPassword(e.target.value);
										setPasswordError("");
									}}
									required
									className='bg-white border border-[#E0E0E0] text-[#000000] placeholder:text-[#999999]'
								/>
								{passwordError && (
									<p className='mt-1 text-xs text-[#AF2D03]'>{passwordError}</p>
								)}
							</div>

							{/* Terms Agreement */}
							<div className='flex items-center space-x-2'>
								<Checkbox
									id='terms'
									checked={agreedToTerms}
									onCheckedChange={(checked) =>
										setAgreedToTerms(checked as boolean)
									}
									className='border-[#E0E0E0]'
								/>
								<label
									htmlFor='terms'
									className='text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
								>
									I agree to the{" "}
									<Link to='/terms' className='text-[#000000] hover:underline'>
										Terms of Service
									</Link>{" "}
									and{" "}
									<Link
										to='/privacy'
										className='text-[#000000] hover:underline'
									>
										Privacy Policy
									</Link>
								</label>
							</div>
						</CardContent>

						<CardFooter className='flex flex-col space-y-4'>
							<Button
								type='submit'
								className='w-full bg-[#000000] hover:bg-[#222222] text-white'
								disabled={isLoading || !agreedToTerms}
							>
								{isLoading ? "Creating Account..." : "Create Account"}
							</Button>

							<div className='text-sm text-center text-[#222222]'>
								Already have an account?{" "}
								<Link
									to='/login'
									className='text-[#000000] hover:underline font-semibold'
								>
									Sign In
								</Link>
							</div>
						</CardFooter>
					</form>
				</Card>
			</main>

			<Footer />
		</div>
	);
}

export default SignupPage;

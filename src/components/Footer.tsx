import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { FaTwitch, FaYoutube } from "react-icons/fa"; // Updated icons
import { FaInstagram, FaDiscord, FaXTwitter } from "react-icons/fa6"; // Socials

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className='bg-black border-t border-[#c63352]/30 text-[#eab5ab]'>
			<div className='container px-6 py-12 mx-auto'>
				<div className='grid grid-cols-1 gap-10 md:grid-cols-3'>
					{/* Gambling Warning */}
					<div>
						<h3 className='mb-3 text-lg font-bold text-[#c63352]'>BEWARE GAMBLING</h3>
						<div className='text-sm text-[#eab5ab]/80 space-y-2'>
							<p>We are not responsible for illegal gambling activities.</p>
							<p>Play responsibly. Gambling involves financial risks.</p>
							<p>Ensure compliance with your local laws before engaging in any activities.</p>
							<p>Seek help if you experience issues related to gambling.</p>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className='mb-3 text-lg font-bold text-[#c63352]'>Quick Links</h3>
						<div className='grid grid-cols-1 gap-2'>
							{[
								{ to: "/", label: "Home" },
								{ to: "/bonuses", label: "Bonuses" },
								{ to: "/Leaderboard", label: "Leaderboards" },
							].map(({ to, label }) => (
								<Link
									key={label}
									to={to}
									className='text-sm text-[#eab5ab]/80 hover:text-[#c63352] transition-colors duration-200'
								>
									{label}
								</Link>
							))}
						</div>
					</div>

					{/* Social Links */}
					<div>
						<h3 className='mb-3 text-lg font-bold text-[#c63352]'>Social Links</h3>
						<div className='flex gap-3'>
							{[
								{
									href: "https://discord.gg/kxT4fq4rda",
									icon: <FaDiscord className='w-5 h-5' />,
									label: "Discord"
								},
								{
									href: "https://www.youtube.com/@kaeryka",
									icon: <FaYoutube className='w-5 h-5' />,
									label: "YouTube"
								},
								{
									href: "https://www.twitch.tv/kaeryka",
									icon: <FaTwitch className='w-5 h-5' />,
									label: "Twitch"
								},
								{
									href: "https://x.com/kaeryyka",
									icon: <FaXTwitter className='w-5 h-5' />,
									label: "Twitter"
								},
							].map(({ href, icon, label }, i) => (
								<a
									key={i}
									href={href}
									aria-label={label}
									target='_blank'
									rel='noreferrer'
									className='flex items-center justify-center w-9 h-9 rounded-full bg-[#c63352]/20 text-[#eab5ab] transition-all hover:bg-[#c63352] hover:text-white hover:scale-110 duration-200'
								>
									{icon}
								</a>
							))}
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className='pt-6 mt-12 border-t border-[#c63352]/30 text-center text-sm text-[#eab5ab]/70'>
					<p className='flex flex-wrap items-center justify-center gap-1'>
						© {currentYear} KAERYKA.Site. All rights reserved. Made with
						<Heart className='w-3 h-3 mx-1 text-[#c63352]' />
						by{" "}
						<a
							href='https://www.linkedin.com/in/skander-kefi/'
							target='_blank'
							rel='noreferrer'
							className='font-medium text-[#eab5ab] hover:text-[#c63352] transition-colors duration-200'
						>
							Skander
						</a>
					</p>
				</div>
			</div>
		</footer>
	);
}
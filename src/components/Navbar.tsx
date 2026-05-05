import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Crown, Dices, Gift, LogIn, LogOut, MessageSquare, UserPlus, ShieldAlert } from "lucide-react";
import useMediaQuery from "@/hooks/use-media-query";
import { useAuthStore } from "@/store/useAuthStore";

export function Navbar() {
	const location = useLocation();
	const navigate = useNavigate();
	const isMobile = useMediaQuery("(max-width: 768px)");
	const [isOpen, setIsOpen] = useState(false);
	const { user, logout } = useAuthStore();

	useEffect(() => {
		setIsOpen(false);
	}, [location.pathname, isMobile]);

	const baseItems = [
		{ path: "/", name: "Home", icon: <Dices className='w-5 h-5' /> },
		{ path: "/leaderboard", name: "Leaderboard", icon: <Crown className='w-5 h-5' /> },
	];

	const getMenuItems = () => {
		if (!user) {
			return [
				...baseItems,
				{ path: "/giveaways", name: "Giveaways", icon: <Gift className='w-5 h-5' /> },
				{ path: "/login", name: "Login", icon: <LogIn className='w-5 h-5' /> },
				{ path: "/signup", name: "Sign Up", icon: <UserPlus className='w-5 h-5' /> },
			];
		}

		if (user.role === "admin") {
			return [
				...baseItems,
				{ path: "/admin", name: "Admin Dashboard", icon: <ShieldAlert className='w-5 h-5' /> },
				{ path: "/giveaways", name: "Giveaways", icon: <Gift className='w-5 h-5' /> },
			];
		}

		return [
			...baseItems,
			{ path: "/giveaways", name: "Giveaways", icon: <Gift className='w-5 h-5' /> },
		];
	};

	const menuItems = getMenuItems();

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	const renderLink = (item: { path: string; name: string; icon: JSX.Element }) => {
		const isActive = location.pathname === item.path;

		return (
			<NavLink
				key={item.path}
				to={item.path}
				className={`flex items-center gap-2 rounded-xl px-5 py-2 transition-all duration-300 ${
					isActive
						? "bg-[#2a0f1a] text-[#eab5ab] shadow-lg shadow-[#c63352]/20"
						: "text-[#eab5ab] hover:text-[#c63352]"
				}`}
			>
				{item.icon}
				<span>{item.name}</span>
			</NavLink>
		);
	};

	return (
		<>
			<nav className='fixed top-0 z-50 h-20 w-full border-b border-[#c63352]/30 bg-black/95 font-sans shadow-2xl shadow-black/70 backdrop-blur-sm'>
				<div className='container relative mx-auto flex h-full items-center justify-between px-6'>
					<Link to='/' className='flex select-none items-center space-x-3'>
						<img
							src='https://i.ibb.co/KjxywBMB/logogif.gif'
							alt='Kaeryka Logo'
							className='h-12 w-12 rounded-full border-2 border-[#c63352] object-cover shadow-[0_0_15px_rgba(198,51,82,0.5)]'
						/>
						<span className='text-3xl font-bold tracking-wider text-white'>KAERYKA</span>
					</Link>

					{!isMobile && (
						<ul className='flex items-center space-x-4 font-semibold text-white'>
							{menuItems.map(renderLink)}
							{user ? (
								<button
									onClick={handleLogout}
									className='flex items-center gap-2 rounded-xl bg-[#c63352] px-5 py-2 text-white transition hover:bg-[#eab5ab] hover:text-black'
								>
									<LogOut className='h-5 w-5' />
									<span>Logout</span>
								</button>
							) : null}
						</ul>
					)}

					<div className='flex items-center space-x-4'>
						<a
							href='https://discord.gg/kxT4fq4rda'
							target='_blank'
							rel='noopener noreferrer'
							className='hidden items-center space-x-2 rounded-xl bg-[#c63352] px-6 py-3 text-lg font-bold text-white shadow-2xl shadow-[#c63352]/40 transition transform hover:scale-105 hover:bg-[#eab5ab] hover:text-black active:scale-95 md:flex'
						>
							<MessageSquare className='h-5 w-5' />
							<span>Join Discord</span>
						</a>

						{isMobile && (
							<button
								onClick={() => setIsOpen(!isOpen)}
								className='relative z-50 flex h-8 w-8 flex-col items-center justify-center gap-1.5'
							>
								<span
									className={`block h-1 w-8 rounded bg-[#eab5ab] transition-transform duration-300 ${isOpen ? "translate-y-2.5 rotate-45 bg-[#c63352]" : ""}`}
								/>
								<span
									className={`block h-1 w-8 rounded bg-[#eab5ab] transition-opacity duration-300 ${isOpen ? "opacity-0" : "opacity-100"}`}
								/>
								<span
									className={`block h-1 w-8 rounded bg-[#eab5ab] transition-transform duration-300 ${isOpen ? "-translate-y-2.5 -rotate-45 bg-[#c63352]" : ""}`}
								/>
							</button>
						)}
					</div>
				</div>
			</nav>

			{isMobile && (
				<div
					className={`fixed inset-0 z-40 flex translate-x-0 flex-col items-center justify-start space-y-6 bg-black/95 pt-24 text-xl font-semibold text-white backdrop-blur-md transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
				>
					{menuItems.map(renderLink)}
					{user ? (
						<button
							onClick={handleLogout}
							className='mt-6 flex items-center gap-2 rounded-xl bg-[#c63352] px-8 py-3 text-lg font-bold text-white shadow-xl shadow-[#c63352]/40 transition hover:bg-[#eab5ab] hover:text-black'
						>
							<LogOut className='h-5 w-5' />
							<span>Logout</span>
						</button>
					) : null}
					<a
						href='https://discord.gg/kxT4fq4rda'
						target='_blank'
						rel='noopener noreferrer'
						className='mt-2 flex items-center space-x-2 rounded-xl bg-[#c63352] px-8 py-3 text-lg font-bold text-white shadow-xl shadow-[#c63352]/40 transition hover:bg-[#eab5ab] hover:text-black'
					>
						<MessageSquare className='h-5 w-5' />
						<span>Join Discord</span>
					</a>
				</div>
			)}

			<div className='h-20' />
		</>
	);
}

export function HomeStyleBackground() {
	return (
		<>
			<div
				className='fixed inset-0 z-0 bg-center bg-no-repeat bg-contain opacity-44'
				style={{
					backgroundImage: `url('https://i.ibb.co/KjxywBMB/logogif.gif')`,
					backgroundColor: "#000",
				}}
			/>
			<div className='fixed inset-0 z-0 bg-gradient-to-b from-black/80 via-black/90 to-black' />
		</>
	);
}

export default HomeStyleBackground;
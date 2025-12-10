import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Instagram, Twitch, Twitter, Youtube } from "lucide-react";

const HomePage = () => {
  return (
    <div className="text-white min-h-screen flex flex-col relative">
      {/* Full Page GIF Background */}
      <div
        className="fixed inset-0 bg-contain bg-center bg-no-repeat opacity-44 z-0"
        style={{
          backgroundImage: `url('https://i.ibb.co/KjxywBMB/logogif.gif')`,
          backgroundColor: "#000"
        }}
      ></div>

      
      {/* Gradient Overlay for better readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-black/90 to-black z-0"></div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        {/* HERO SECTION */}
        <section className="relative flex flex-col items-center justify-center text-center py-28 px-6 overflow-hidden">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-extrabold text-[#c63352] drop-shadow-[0_0_20px_rgba(198,51,82,0.4)] tracking-widest"
          >
            KAERYKA
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-5 text-xl md:text-2xl text-[#eab5ab] max-w-2xl"
          >
            Wager under code <span className="text-[#c63352] font-bold">'kaeryka'</span> for
            prizes, rewards, and 1000C leaderboard glory.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-5 mt-10"
          >
            <Button
              className="bg-[#c63352] hover:bg-[#eab5ab] hover:text-black text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-[#eab5ab]/40 transition-all"
              onClick={() => window.open("https://roobet.com/?ref=kaeryka", "_blank")}
            >
              Join Leaderboard
            </Button>

            <Button
              variant="outline"
              className="border-2 border-[#eab5ab] text-[#eab5ab] hover:bg-[#eab5ab] hover:text-black px-8 py-4 rounded-2xl text-lg font-semibold transition-all"
              onClick={() => window.open("https://discord.gg/kxT4fq4rda", "_blank")}
            >
              Claim Bonus
            </Button>
          </motion.div>
        </section>

        {/* FEATURE CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 px-8 py-20 text-center">
          {[
            {
              title: "Leaderboard",
              desc: "Compete weekly and climb to the top of the ranks.",
            },
            {
              title: "Exclusive Rewards",
              desc: "Earn unique bonuses, prizes, and special giveaways.",
            },
            {
              title: "Join the Team",
              desc: "Become part of the ever-growing KAERYKA community.",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="rounded-2xl bg-gradient-to-b from-black/70 to-black/50 border border-[#c63352]/30 backdrop-blur-md p-8 shadow-md hover:shadow-[#eab5ab]/20 hover:-translate-y-1.5 transition-all"
            >
              <h3 className="text-2xl font-bold text-[#eab5ab] mb-3">
                {card.title}
              </h3>
              <p className="text-[#eab5ab] leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* SOCIAL SECTION */}
        <section className="py-20 px-6 text-center">
          <h2 className="text-3xl font-bold text-[#c63352] mb-10">
            Connect with Me 🌐
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                href: "https://www.youtube.com/@kaeryka",
                title: "YouTube",
                icon: <Youtube className="w-6 h-6" />,
                img: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
                desc: "Watch my latest videos and highlights.",
              },
              {
                href: "https://x.com/kaeryyka",
                title: "X (Twitter)",
                icon: <Twitter className="w-6 h-6" />,
                img: "https://i.ibb.co/p6bxjD0j/Twitter-X-Icon-PNG-removebg-preview.png",
                desc: "Stay updated with quick thoughts and stream news.",
              },
              {
                href: "https://www.twitch.tv/kaeryka",
                title: "Twitch",
                icon: <Twitch className="w-6 h-6" />,
                img: "https://cdn-icons-png.flaticon.com/512/2111/2111668.png",
                desc: "Watch my live streams and chat with the community.",
              },
              {
                href: "https://discord.gg/kxT4fq4rda",
                title: "Discord",
                icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.18.33.25c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z"/></svg>,
                img: "https://cdn-icons-png.flaticon.com/512/5968/5968756.png",
                desc: "Join our community and chat with fellow fans.",
              },
            ].map((social, i) => (
              <motion.a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center rounded-2xl bg-gradient-to-b from-black/70 to-black/50 border border-[#c63352]/30 overflow-hidden shadow-md hover:shadow-[#eab5ab]/20 transition-all"
              >
                <div className="w-full h-36 bg-black flex items-center justify-center">
                  <img
                    src={social.img}
                    alt={social.title}
                    className="h-16 object-contain opacity-80 hover:opacity-100 transition-all"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-[#c63352] font-semibold text-lg">
                      {social.title}
                    </span>
                    {social.icon}
                  </div>
                  <p className="text-[#eab5ab] text-sm">{social.desc}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        {/* STREAM SECTION */}
        <section className="py-20 px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-[#c63352] mb-10"
          >
            Watch My Streams 🎮
          </motion.h2>
          <div className="flex justify-center">
            <motion.iframe
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ delay: 0.3 }}
  src="https://player.twitch.tv/?channel=kaeryka&parent=https://www.kaerykarewards.com"
  frameBorder="0"
  allowFullScreen
  className="w-full max-w-5xl h-[420px] rounded-3xl border border-[#c63352]/40 shadow-[0_0_25px_rgba(198,51,82,0.3)] hover:shadow-[#eab5ab]/30 transition-all"
/>

          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
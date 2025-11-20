import React, { useEffect, useState } from "react";
import { useCSGOLeadStore } from "../store/CSGOLeadStore";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";

const CSGOWinPage: React.FC = () => {
  const { leaderboard, loading, error, fetchLeaderboard } = useCSGOLeadStore();
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // Fixed event period
  const eventStart = "November 20, 2025";
  const eventEnd = "December 3, 2025";

  // Countdown timer until December 3, 2025
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const endDate = new Date(2025, 11, 3, 23, 59, 59); // December 3, 2025
      const diff = endDate.getTime() - now.getTime();

      const totalSeconds = Math.max(0, Math.floor(diff / 1000));
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch leaderboard for the fixed period
  useEffect(() => {
    fetchLeaderboard(10, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const topTenPlayers = leaderboard?.length > 0 ? leaderboard.slice(0, 10) : [];

  // Prize distribution
  const getPrizeForRank = (rank: number) => {
    switch (rank) {
      case 1:
        return 325;
      case 2:
        return 175;
      case 3:
        return 90;
      case 4:
        return 45;
      case 5:
        return 30;
      case 6:
        return 25;
      case 7:
      case 8:
        return 20;
      case 9:
      case 10:
        return 10;
      default:
        return 0;
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen text-white overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 bg-contain bg-center bg-no-repeat opacity-70 z-0"
        style={{
          backgroundImage: `url('https://i.ibb.co/KjxywBMB/logogif.gif')`,
          backgroundColor: "#000",
        }}
      ></div>

      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-black/90 to-black z-0"></div>

      <div className="relative z-10">
        <Navbar />

        <main className="relative z-10 flex-grow w-full px-6 py-12 mx-auto max-w-7xl text-center">
          {/* Header */}
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#c63352] mb-2">
            $750 CSGOWIN LEADERBOARD
          </h1>
          <p className="text-[#eab5ab] mb-2 text-lg">
            {eventStart} - {eventEnd} 🗓️
          </p>
          <p className="text-[#eab5ab] mb-8 text-lg">
            Use code <span className="font-bold text-[#c63352]">"kaeryka"</span> to compete for top
            spots and win prizes!
          </p>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <Button
              className="bg-[#c63352] hover:bg-[#eab5ab] hover:text-black text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all"
              onClick={() =>
                window.open("https://csgowin.com/?ref=kaeryka", "_blank", "noopener noreferrer")
              }
            >
              Join Now
            </Button>
            <Button
              className="bg-transparent border border-[#c63352] hover:bg-[#c63352]/10 text-[#c63352] px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-all"
              onClick={() => setShowHowItWorks(true)}
            >
              <Info className="w-4 h-4" />
              How It Works
            </Button>
          </div>

          {/* Status messages */}
          {loading && <p className="text-center text-[#c63352]">Loading leaderboard...</p>}
          {error && <p className="text-center text-[#c63352]">{error}</p>}

          {/* TOP 10 LEADERBOARD */}
          {topTenPlayers.length > 0 ? (
            <>
              <div className="overflow-x-auto bg-black/80 backdrop-blur-md rounded-2xl border border-[#c63352] shadow-lg mb-6">
                <table className="w-full border-collapse text-sm md:text-base table-fixed">
                  <thead className="bg-[#c63352] text-white uppercase">
                    <tr>
                      <th className="w-[10%] p-4 text-center">Rank</th>
                      <th className="w-[30%] p-4 text-left">Player</th>
                      <th className="w-[20%] p-4 text-right">Wagered</th>
                      <th className="w-[20%] p-4 text-right">Deposited</th>
                      <th className="w-[20%] p-4 text-right">Prize</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topTenPlayers.map((player, index) => {
                      const rank = index + 1;
                      const basePrize = getPrizeForRank(rank);
                      const bonus = Math.floor(player.wagered / 10000) * 15;
                      const totalPrize = basePrize + bonus;

                      return (
                        <tr
                          key={player.name}
                          className="border-t border-[#c63352]/20 hover:bg-[#c63352]/10 transition-all"
                        >
                          <td className="p-4 text-center font-bold text-[#c63352]">#{rank}</td>
                          <td className="p-4 font-semibold text-left break-all text-white">{player.name}</td>
                          <td className="p-4 text-right text-white">${player.wagered.toLocaleString()}</td>
                          <td className="p-4 text-right text-[#eab5ab]">
                            ${player.deposited.toLocaleString()}
                          </td>
                          <td className="p-4 text-right text-[#c63352] font-semibold">
                            ${totalPrize}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* 💰 Bonus Info */}
              <div className="text-center bg-[#c63352]/10 border border-[#c63352]/40 rounded-xl py-3 px-4 mt-2 mb-12 text-[#c63352] font-semibold shadow-lg">
                💰 Earn an extra <span className="text-[#c63352]">+ $15</span> for every{" "}
                <span className="text-[#eab5ab]">$10,000</span> wagered!
              </div>
            </>
          ) : (
            !loading &&
            !error && (
              <p className="text-center text-[#eab5ab] mb-12">
                No players yet for this event.
              </p>
            )
          )}

          {/* Countdown Timer */}
          <div className="mb-12">
            <h3 className="text-2xl text-[#c63352] font-bold mb-2">
              Leaderboard Ends In
            </h3>
            <div className="flex justify-center gap-4 text-2xl font-extrabold text-[#c63352]">
              <TimerBox label="Days" value={timeLeft.days} />
              <TimerBox label="Hours" value={timeLeft.hours} />
              <TimerBox label="Minutes" value={timeLeft.minutes} />
              <TimerBox label="Seconds" value={timeLeft.seconds} />
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* 🪟 HOW IT WORKS MODAL */}
      <Dialog open={showHowItWorks} onOpenChange={setShowHowItWorks}>
        <DialogContent className="bg-black border border-[#c63352]/30 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#c63352] text-2xl font-bold text-center">
              How the Leaderboard Works
            </DialogTitle>
            <DialogDescription className="text-[#eab5ab] text-center mb-4">
              Compete by wagering on CSGOWin games during the event period.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-[#eab5ab]">
            <p>🏆 <strong>Top 10 players</strong> by wagered amount win cash prizes</p>
            <p>💰 <strong>1st place:</strong> $325 + $15 per $10,000 wagered</p>
            <p>💰 <strong>2nd place:</strong> $175 + $15 per $10,000 wagered</p>
            <p>💰 <strong>3rd place:</strong> $90 + $15 per $10,000 wagered</p>
            <p>🎯 Use code <strong className="text-[#c63352]">"kaeryka"</strong> when signing up</p>
            <p className="text-sm border-t border-[#c63352]/30 pt-3">
              ⚠️ Event period: <strong>{eventStart} - {eventEnd}</strong>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Timer Box
const TimerBox = ({ label, value }: { label: string; value: number }) => (
  <div className="flex flex-col items-center bg-[#c63352]/10 px-4 py-2 rounded-xl">
    <span className="text-3xl">{String(value).padStart(2, "0")}</span>
    <span className="text-xs uppercase text-[#eab5ab]">{label}</span>
  </div>
);

export default CSGOWinPage;
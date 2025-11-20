import React, { useEffect, useState } from "react";
import { useRoobetStore } from "../store/RoobetStore";
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

const RoobetPage: React.FC = () => {
  const { leaderboard, loading, error, fetchLeaderboard } = useRoobetStore();
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // Dynamic month & year
  const now = new Date();
  const currentMonth = now.toLocaleString("default", { month: "long" });
  const currentYear = now.getFullYear();

  // Countdown timer until the end of the current month
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const diff = endOfMonth.getTime() - now.getTime();

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

  // Fetch leaderboard for the current month
  useEffect(() => {
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];
    fetchLeaderboard(startDate, endDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ✅ fetch only once when page loads

  const topTenPlayers = leaderboard?.data ? leaderboard.data.slice(0, 10) : [];

  return (
    <div className="relative flex flex-col min-h-screen text-white overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 bg-contain bg-center bg-no-repeat opacity-70 z-0"
        style={{
          backgroundImage: `url('https://i.ibb.co/XrDRLV7S/acloseupof-subject-1-smokingacigarettewiththesmokemoving-ezgif-com-gif-maker.gif')`,
          backgroundColor: "#000",
        }}
      ></div>

      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#040704]/80 via-[#040704]/90 to-[#040704] z-0"></div>

      <div className="relative z-10">
        <Navbar />

        <main className="relative z-10 flex-grow w-full px-6 py-12 mx-auto max-w-7xl text-center">
          {/* Header */}
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#EFA813] mb-2">
            $750 ROOBET MONTHLY LEADERBOARD
          </h1>
          <p className="text-[#EFA813]/80 mb-2 text-lg">
            {currentMonth} {currentYear} Edition 🗓️
          </p>
          <p className="text-[#EFA813]/80 mb-8 text-lg">
            Use code <span className="font-bold text-[#E84D06]">"tacopoju"</span> to compete for top
            spots and win prizes every month!
          </p>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <Button
              className="bg-[#E84D06] hover:bg-[#EFA813] text-white px-6 py-3 rounded-full font-semibold shadow-lg"
              onClick={() =>
                window.open("https://roobet.com/?ref=tacopoju", "_blank", "noopener noreferrer")
              }
            >
              Join Now
            </Button>
            <Button
              className="bg-transparent border border-[#EFA813] hover:bg-[#EFA813]/10 text-[#EFA813] px-6 py-3 rounded-full font-semibold flex items-center gap-2"
              onClick={() => setShowHowItWorks(true)}
            >
              <Info className="w-4 h-4" />
              How It Works
            </Button>
          </div>

          {/* Status messages */}
          {loading && <p className="text-center text-[#EFA813]">Loading leaderboard...</p>}
          {error && <p className="text-center text-[#E84D06]">{error}</p>}

          {/* TOP 10 LEADERBOARD */}
          {topTenPlayers.length > 0 ? (
            <>
              <div className="overflow-x-auto bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl border border-[#547E25] shadow-lg mb-6">
                <table className="w-full border-collapse text-sm md:text-base table-fixed">
                  <thead className="bg-[#EFA813] text-[#040704] uppercase">
                    <tr>
                      <th className="w-[10%] p-4 text-center">Rank</th>
                      <th className="w-[30%] p-4 text-left">Player</th>
                      <th className="w-[20%] p-4 text-right">Wagered</th>
                      <th className="w-[20%] p-4 text-right">Weighted</th>
                      <th className="w-[20%] p-4 text-right">Prize</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topTenPlayers.map((player) => {
                      const rank = player.rankLevel;
                      let basePrize = 0;

                      switch (rank) {
                        case 1:
                          basePrize = 325;
                          break;
                        case 2:
                          basePrize = 175;
                          break;
                        case 3:
                          basePrize = 90;
                          break;
                        case 4:
                          basePrize = 45;
                          break;
                        case 5:
                          basePrize = 30;
                          break;
                        case 6:
                          basePrize = 25;
                          break;
                        case 7:
                        case 8:
                          basePrize = 20;
                          break;
                        case 9:
                        case 10:
                          basePrize = 10;
                          break;
                        default:
                          basePrize = 0;
                      }

                      const bonus = Math.floor(player.wagered / 10000) * 15;
                      const totalPrize = basePrize + bonus;

                      return (
                        <tr
                          key={player.uid}
                          className="border-t border-[#E84D06]/20 hover:bg-[#E84D06]/10 transition-all"
                        >
                          <td className="p-4 text-center font-bold text-[#EFA813]">#{rank}</td>
                          <td className="p-4 font-semibold text-left break-all">{player.username}</td>
                          <td className="p-4 text-right">${player.wagered.toLocaleString()}</td>
                          <td className="p-4 text-right text-[#EFA813]/80">
                            {player.weightedWagered.toLocaleString()}
                          </td>
                          <td className="p-4 text-right text-[#547E25] font-semibold">
                            ${totalPrize}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* 💰 Bonus Info */}
              <div className="text-center bg-[#E84D06]/10 border border-[#EFA813]/40 rounded-xl py-3 px-4 mt-2 mb-12 text-[#EFA813] font-semibold shadow-lg">
                💰 Earn an extra <span className="text-[#E84D06]">+ $15</span> for every{" "}
                <span className="text-[#EFA813]">$10,000</span> wagered!
              </div>
            </>
          ) : (
            !loading &&
            !error && (
              <p className="text-center text-[#EFA813]/70 mb-12">
                No players yet for this month.
              </p>
            )
          )}

          {/* Countdown Timer */}
          <div className="mb-12">
            <h3 className="text-2xl text-[#EFA813] font-bold mb-2">
              Leaderboard Ends In
            </h3>
            <div className="flex justify-center gap-4 text-2xl font-extrabold text-[#E84D06]">
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
        <DialogContent className="bg-[#0a0a0a] border border-[#EFA813]/30 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#EFA813] text-2xl font-bold text-center">
              How the Leaderboard Works
            </DialogTitle>
            <DialogDescription className="text-[#EFA813]/80 text-center mb-4">
              Weighted wagers based on RTP determine your monthly leaderboard score.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-[#fffefe]/90">
            <p>🎯 Games with an RTP of <strong>97% or less</strong> contribute <strong className="text-[#EFA813]">100%</strong> of the wagered amount.</p>
            <p>🎯 Games with an RTP <strong>above 97%</strong> contribute <strong className="text-[#EFA813]">50%</strong>.</p>
            <p>🎯 Games with an RTP of <strong>98% and above</strong> contribute <strong className="text-[#EFA813]">10%</strong>.</p>
            <p className="text-sm border-t border-[#EFA813]/30 pt-3">
              ⚠️ Only <strong>Slots</strong> and <strong>Housegames</strong> count (Dice excluded).
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Timer Box
const TimerBox = ({ label, value }: { label: string; value: number }) => (
  <div className="flex flex-col items-center bg-[#EFA813]/10 px-4 py-2 rounded-xl">
    <span className="text-3xl">{String(value).padStart(2, "0")}</span>
    <span className="text-xs uppercase text-[#EFA813]/70">{label}</span>
  </div>
);

export default RoobetPage;

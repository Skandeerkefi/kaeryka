import React, { useEffect, useState } from "react";
import { useCSGOLeadStore } from "@/store/csgoleadStore";
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
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import duration from "dayjs/plugin/duration";

dayjs.extend(utc);
dayjs.extend(duration);

const CSGOWinPage: React.FC = () => {
  const { leaderboard, loading, error, fetchLeaderboard, dateStart, dateEnd } =
    useCSGOLeadStore();

  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [prizes, setPrizes] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState("");

  // Fetch leaderboard + prizes
  useEffect(() => {
    const load = async () => {
      await fetchLeaderboard(10);

      const res = await fetch(
        "https://kaerykadata-production.up.railway.app/api/leaderboard/csgowinn"
      );
      const data = await res.json();
      const currentLB = data.leaderboards?.[0];

      if (currentLB) {
        setPrizes(currentLB.prizes);
      }
    };

    load();
  }, []);

  // Countdown (same style as Roobet)
  useEffect(() => {
    const tick = () => {
      if (!dateEnd) return;

      const now = dayjs.utc();
      const end = dayjs.utc(dateEnd);
      const diff = end.diff(now);

      if (diff <= 0) {
        setTimeLeft("Resetting...");
        return;
      }

      const d = dayjs.duration(diff);
      setTimeLeft(
        `${Math.floor(d.asDays())}d ${d.hours()}h ${d.minutes()}m ${d.seconds()}s`
      );
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [dateEnd]);

  const topTen = leaderboard.slice(0, 10);
  const totalPrize = prizes.reduce((a, b) => a + b, 0);

  return (
    <div className="relative flex flex-col min-h-screen text-white overflow-hidden">
      {/* Background same as Roobet */}
      <div
        className="fixed inset-0 bg-contain bg-center bg-no-repeat opacity-70 z-0"
        style={{
          backgroundImage: `url('https://i.ibb.co/KjxywBMB/logogif.gif')`,
          backgroundColor: "#000",
        }}
      ></div>

      <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-black/90 to-black z-0"></div>

      <div className="relative z-10">
        <Navbar />

        <main className="relative z-10 flex-grow w-full px-6 py-12 mx-auto max-w-7xl text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#c63352] mb-2">
            CSGOWIN LEADERBOARD
          </h1>

          <p className="text-[#eab5ab] mb-2 text-lg">{dateStart} → {dateEnd}</p>

          <p className="mb-4 text-lg text-[#eab5ab]">
            Use code <span className="font-bold text-[#c63352]">"kaeryka"</span> to compete and win!
          </p>

          {/* Prize Pool + Countdown under the code */}
          <div className="mt-2 mb-10 flex flex-col items-center gap-3">
            <div className="bg-black/70 backdrop-blur-md border border-[#c63352]/40 rounded-xl px-6 py-3 shadow-lg text-center">
              <p className="text-xl font-bold text-[#c63352]">
                Total Prize Pool: {totalPrize.toLocaleString()} C
              </p>
            </div>

            <div className="bg-black/70 backdrop-blur-md border border-[#c63352]/40 rounded-xl px-6 py-3 shadow-lg text-center">
              <p className="text-sm text-[#eab5ab]">Ends In</p>
              <p className="text-2xl font-extrabold text-[#eab5ab]">{timeLeft}</p>
            
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <Button
              className="bg-[#c63352] hover:bg-[#eab5ab] hover:text-black text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all"
              onClick={() =>
                window.open("https://csgowin.com/?ref=kaeryka", "_blank")
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

          {/* Status */}
          {loading && <p className="text-[#c63352]">Loading...</p>}
          {error && <p className="text-[#c63352]">{error}</p>}

          {/* Leaderboard */}
          {topTen.length > 0 ? (
            <div className="overflow-x-auto bg-black/80 backdrop-blur-md rounded-2xl border border-[#c63352] shadow-lg mb-6">
              <table className="w-full border-collapse text-sm md:text-base table-fixed">
                <thead className="bg-[#c63352] text-white uppercase">
                  <tr>
                    <th className="p-4 text-center">Rank</th>
                    <th className="p-4 text-left">Player</th>
                    <th className="p-4 text-right">Wagered</th>
                    <th className="p-4 text-right">Prize</th>
                  </tr>
                </thead>

                <tbody>
                  {topTen.map((p, index) => (
                    <tr
                      key={p.name}
                      className="border-t border-[#c63352]/20 hover:bg-[#c63352]/10 transition-all"
                    >
                      <td className="p-4 text-center font-bold text-[#c63352]">
                        #{index + 1}
                      </td>
                      <td className="p-4 text-left font-semibold break-all">{p.name}</td>
                      <td className="p-4 text-right text-white">
                        {p.wagered.toLocaleString()}
                      </td>
                      <td className="p-4 text-right text-[#c63352] font-bold">
                        {prizes[index] ? prizes[index].toLocaleString() : "—"} C
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !loading &&
            !error && <p className="text-[#eab5ab]">No players yet.</p>
          )}

          <Footer />
        </main>
      </div>

      {/* Modal */}
      <Dialog open={showHowItWorks} onOpenChange={setShowHowItWorks}>
        <DialogContent className="bg-black border border-[#c63352]/30 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#c63352] text-2xl font-bold text-center">
              How the Leaderboard Works
            </DialogTitle>
            <DialogDescription className="text-[#eab5ab] text-center mb-4">
              Earn prizes by wagering during the event.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-[#eab5ab]">
            <p>🏆 Top 6 players earn prizes</p>
            <p>🎯 Use code <strong className="text-[#c63352]">kaeryka</strong></p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CSGOWinPage;

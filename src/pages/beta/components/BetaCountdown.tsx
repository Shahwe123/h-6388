
import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const BetaCountdown = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 7,
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return {
            ...prev,
            seconds: prev.seconds - 1
          };
        } else if (prev.minutes > 0) {
          return {
            ...prev,
            minutes: prev.minutes - 1,
            seconds: 59
          };
        } else if (prev.hours > 0) {
          return {
            ...prev,
            hours: prev.hours - 1,
            minutes: 59,
            seconds: 59
          };
        } else if (prev.days > 0) {
          return {
            ...prev,
            days: prev.days - 1,
            hours: 23,
            minutes: 59,
            seconds: 59
          };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center gap-4 mb-8">
      <div className="bg-black/50 p-4 rounded-lg w-20">
        <div className="text-3xl font-mono font-bold text-neon-pink">{timeLeft.days}</div>
        <div className="text-xs text-neutral-400">DAYS</div>
      </div>
      <div className="bg-black/50 p-4 rounded-lg w-20">
        <div className="text-3xl font-mono font-bold text-neon-pink">{timeLeft.hours}</div>
        <div className="text-xs text-neutral-400">HOURS</div>
      </div>
      <div className="bg-black/50 p-4 rounded-lg w-20">
        <div className="text-3xl font-mono font-bold text-neon-pink">{timeLeft.minutes}</div>
        <div className="text-xs text-neutral-400">MINUTES</div>
      </div>
      <div className="bg-black/50 p-4 rounded-lg w-20">
        <div className="text-3xl font-mono font-bold text-neon-pink">{timeLeft.seconds}</div>
        <div className="text-xs text-neutral-400">SECONDS</div>
      </div>
    </div>
  );
};

export default BetaCountdown;

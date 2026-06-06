import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { getTimeRemaining, formatCountdown } from '@/utils/time';

interface CountdownTimerProps {
  deadline: string;
  onExpire?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function CountdownTimer({ deadline, onExpire, size = 'md' }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(() => getTimeRemaining(deadline));

  useEffect(() => {
    const timer = setInterval(() => {
      const r = getTimeRemaining(deadline);
      setRemaining(r);
      if (r.isExpired) {
        clearInterval(timer);
        onExpire?.();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline, onExpire]);

  if (remaining.isExpired) {
    return (
      <div className="flex items-center gap-2 text-chalk/60">
        <Clock size={size === 'sm' ? 14 : 18} />
        <span className={`font-chalk chalk-text ${size === 'lg' ? 'text-xl' : size === 'sm' ? 'text-sm' : 'text-base'}`}>
          已截止
        </span>
      </div>
    );
  }

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div
      className={`flex items-center gap-2 ${remaining.isUrgent ? 'text-chalk-orange animate-pulse-warning' : 'text-chalk'}`}
    >
      <Clock size={size === 'sm' ? 14 : size === 'lg' ? 24 : 18} />
      <span
        className={`font-chalk chalk-text animate-flip ${sizeClasses[size]}`}
        key={`${remaining.hours}-${remaining.minutes}-${remaining.seconds}`}
      >
        {formatCountdown(remaining)}
      </span>
    </div>
  );
}

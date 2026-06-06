export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  return `${month}月${day}日 ${hour}:${minute}`;
}

export function formatTime(iso: string): string {
  const date = new Date(iso);
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  return `${hour}:${minute}`;
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return `${month}月${day}日 ${weekDays[date.getDay()]}`;
}

export function getTodayChinese(): string {
  return formatDate(new Date().toISOString());
}

export function getDefaultDeadline(): string {
  const now = new Date();
  const deadline = new Date(now);
  if (now.getHours() >= 11) {
    deadline.setDate(deadline.getDate() + 1);
  }
  deadline.setHours(11, 30, 0, 0);
  return deadline.toISOString();
}

export function getTimeRemaining(deadlineIso: string): {
  total: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  isUrgent: boolean;
} {
  const total = new Date(deadlineIso).getTime() - Date.now();
  const isExpired = total <= 0;
  const isUrgent = total > 0 && total <= 5 * 60 * 1000;

  if (isExpired) {
    return { total: 0, hours: 0, minutes: 0, seconds: 0, isExpired, isUrgent: false };
  }

  const hours = Math.floor(total / (1000 * 60 * 60));
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((total % (1000 * 60)) / 1000);

  return { total, hours, minutes, seconds, isExpired, isUrgent };
}

export function formatCountdown(remaining: { hours: number; minutes: number; seconds: number }): string {
  const parts: string[] = [];
  if (remaining.hours > 0) parts.push(`${remaining.hours}小时`);
  if (remaining.minutes > 0 || remaining.hours > 0) parts.push(`${remaining.minutes}分`);
  parts.push(`${remaining.seconds}秒`);
  return parts.join('');
}

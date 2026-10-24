import { useState, useEffect } from 'react';

const STORAGE_KEY = 'visaprep_deal_deadline';
const FIVE_HOURS_MS = 5 * 60 * 60 * 1000;

export function getOrSetDeadline() {
  if (typeof window === 'undefined') return Date.now() + FIVE_HOURS_MS;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = parseInt(saved, 10);
    // If the saved deadline is still in the future, retain it
    if (parsed > Date.now()) {
      return parsed;
    }
  }
  // If expired or first visit, start a fresh 5-hour deadline
  const newDeadline = Date.now() + FIVE_HOURS_MS;
  localStorage.setItem(STORAGE_KEY, String(newDeadline));
  return newDeadline;
}

export function useCountdown() {
  const [timeLeft, setTimeLeft] = useState(() => {
    const deadline = getOrSetDeadline();
    return Math.max(0, Math.floor((deadline - Date.now()) / 1000));
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const deadline = getOrSetDeadline();
      const diff = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
      setTimeLeft(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const pad = (n) => String(n).padStart(2, '0');
  const formatted = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  return {
    hours,
    minutes,
    seconds,
    formatted,
    isExpired: timeLeft <= 0,
  };
}

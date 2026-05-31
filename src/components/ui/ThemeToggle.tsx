'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

export function ThemeToggle() {
  const { theme, resolved, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const options = [
    { key: 'light' as const, icon: '☀️', label: 'Light' },
    { key: 'dark' as const, icon: '🌙', label: 'Dark' },
    { key: 'system' as const, icon: '💻', label: 'System' },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm border transition-colors"
        style={{ borderColor: 'var(--border-primary)', color: 'var(--text-secondary)' }}
        aria-label="Toggle theme"
      >
        <span>{resolved === 'dark' ? '🌙' : '☀️'}</span>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 w-32 rounded-xl shadow-lg border py-1 z-50"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
        >
          {options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => { setTheme(opt.key); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${opt.key === theme ? 'font-semibold' : ''}`}
              style={{
                backgroundColor: opt.key === theme ? 'var(--accent-light)' : 'transparent',
                color: 'var(--text-primary)',
              }}
            >
              <span>{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

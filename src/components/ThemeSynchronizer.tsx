'use client';

import { useEffect, useRef } from 'react';

interface ThemeSynchronizerProps {
  themeColor: string;
}

export default function ThemeSynchronizer({ themeColor }: ThemeSynchronizerProps) {
  const lastColorRef = useRef<string>('');

  useEffect(() => {
    if (!themeColor || themeColor === lastColorRef.current) {
      return;
    }
    lastColorRef.current = themeColor;

    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', themeColor);
  }, [themeColor]);

  return null;
}

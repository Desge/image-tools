'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 根路径 → 重定向到默认语言
export default function RootPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/en/');
  }, [router]);
  return null;
}

'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export default function Spinner({ size = 'md', className, label }: SpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <Loader2 className={cn('animate-spin text-indigo-500', sizes[size])} />
      {label && <p className="text-gray-400 text-sm mt-2">{label}</p>}
    </div>
  );
}

export function FullPageSpinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Spinner size="lg" label={label} />
    </div>
  );
}

export function ButtonSpinner() {
  return <Loader2 className="w-4 h-4 animate-spin" />;
}

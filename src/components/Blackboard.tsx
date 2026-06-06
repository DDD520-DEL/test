import type { ReactNode } from 'react';

interface BlackboardProps {
  children: ReactNode;
  className?: string;
}

export default function Blackboard({ children, className = '' }: BlackboardProps) {
  return (
    <div className="min-h-screen py-4 px-3 sm:py-8 sm:px-6">
      <div className="wood-frame rounded-lg p-3 sm:p-5 mx-auto max-w-3xl">
        <div
          className={`chalk-border rounded bg-blackboard min-h-[calc(100vh-4rem)] sm:min-h-[600px] p-4 sm:p-8 ${className}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

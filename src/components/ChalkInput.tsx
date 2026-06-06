import type { InputHTMLAttributes } from 'react';

interface ChalkInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function ChalkInput({ label, className = '', ...props }: ChalkInputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block font-chalk text-chalk/80 text-base chalk-text">
          {label}
        </label>
      )}
      <input className={`input-chalk ${className}`} {...props} />
    </div>
  );
}

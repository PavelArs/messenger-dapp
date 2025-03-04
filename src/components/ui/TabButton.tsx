import { ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const tabButtonVariants = cva(
  'px-4 py-2 border rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
  {
    variants: {
      active: {
        true: 'bg-primary text-white border-primary',
        false: 'bg-white text-text-dark border-border hover:bg-gray-50',
      },
      size: {
        default: 'text-sm',
        lg: 'text-base px-6',
        sm: 'text-xs px-3 py-1',
      },
    },
    defaultVariants: {
      active: false,
      size: 'default',
    },
  }
);

export interface TabButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof tabButtonVariants> {
  active?: boolean;
}

export function TabButton({ className, active, size, ...props }: TabButtonProps) {
  return (
    <button 
      className={cn(tabButtonVariants({ active, size, className }))} 
      {...props} 
    />
  );
}
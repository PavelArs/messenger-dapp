import { ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const tabButtonVariants = cva(
  'px-4 py-2 border rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  {
    variants: {
      active: {
        true: 'bg-blue-600 text-white border-blue-600 shadow-sm',
        false: 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50',
      },
      size: {
        default: 'text-sm',
        lg: 'text-base px-6',
        sm: 'text-xs px-3 py-1',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      }
    },
    defaultVariants: {
      active: false,
      size: 'default',
      fullWidth: false,
    },
  }
);

export interface TabButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof tabButtonVariants> {
  active?: boolean;
  fullWidth?: boolean;
}

export function TabButton({ className, active, size, fullWidth, ...props }: TabButtonProps) {
  return (
    <button 
      className={cn(tabButtonVariants({ active, size, fullWidth, className }))} 
      {...props} 
    />
  );
}
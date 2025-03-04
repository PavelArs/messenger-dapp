import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div 
      className={cn(
        'border border-border rounded-lg p-4 mb-4 bg-white shadow-sm',
        className
      )} 
      {...props} 
    />
  )
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div 
      className={cn('mb-2 pb-2 border-b border-border', className)} 
      {...props} 
    />
  )
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export function CardContent({ className, ...props }: CardContentProps) {
  return (
    <div className={cn('', className)} {...props} />
  )
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div 
      className={cn('mt-4 pt-2 border-t border-border', className)} 
      {...props} 
    />
  )
}
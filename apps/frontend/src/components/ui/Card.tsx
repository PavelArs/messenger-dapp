import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div 
      className={cn(
        'rounded-lg border border-gray-200 bg-white p-4 mb-4 shadow-sm',
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
      className={cn('mb-2 pb-2 border-b border-gray-200', className)} 
      {...props} 
    />
  )
}

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3 
      className={cn('text-xl font-semibold leading-none tracking-tight', className)} 
      {...props} 
    />
  )
}

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <p 
      className={cn('text-sm text-gray-500', className)} 
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
      className={cn('mt-4 pt-2 border-t border-gray-200', className)} 
      {...props} 
    />
  )
}
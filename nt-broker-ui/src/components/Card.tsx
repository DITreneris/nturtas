import React from 'react'

export type CardVariant = 'form' | 'output' | 'community' | 'footer'

export interface CardProps {
  variant: CardVariant
  children: React.ReactNode
  className?: string
  as?: 'div' | 'section' | 'footer'
}

const variantClass: Record<CardVariant, string> = {
  form: 'form-card',
  output: 'output-card',
  community: 'community',
  footer: 'footer-card',
}

export function Card({
  variant,
  children,
  className = '',
  as: Component = 'div',
}: CardProps) {
  const classNames = [variantClass[variant], className].filter(Boolean).join(' ')
  return <Component className={classNames}>{children}</Component>
}

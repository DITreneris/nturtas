import React from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'nav'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: React.ReactNode
  className?: string
}

const variantClass: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  nav: 'btn-nav',
}

export function Button({
  variant = 'primary',
  children,
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  const classNames = [variantClass[variant], className].filter(Boolean).join(' ')
  return (
    <button type={type} className={classNames} {...rest}>
      {children}
    </button>
  )
}

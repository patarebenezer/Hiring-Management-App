
import React from 'react'
import clsx from 'clsx'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default'|'primary'|'success'|'danger'
}

export default function Button({ className, variant='default', ...props }: ButtonProps) {
  return <button className={clsx('btn', {
    'primary': variant==='primary',
    'success': variant==='success',
    'danger': variant==='danger',
  }, className)} {...props} />
}

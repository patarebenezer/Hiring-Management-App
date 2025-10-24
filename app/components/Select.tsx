
import React from 'react'

export default function Select(
  { label, error, children, ...props }:
  React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string, error?: string, children?: React.ReactNode }
) {
  return (
    <div className="col">
      {label && <label className="label">{label}</label>}
      <select className="select" {...props}>{children}</select>
      {error && <div className="error">{error}</div>}
    </div>
  )
}


import React from 'react'

export default function Input(
  { label, error, help, ...props }:
  React.InputHTMLAttributes<HTMLInputElement> & { label?: string, error?: string, help?: string }
) {
  return (
    <div className="col">
      {label && <label className="label">{label}</label>}
      <input className="input" {...props} />
      {help && <div className="help">{help}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  )
}

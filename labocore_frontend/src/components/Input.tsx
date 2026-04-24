import React from 'react'

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }> = ({ label, error, ...props }) => {
  return (
    <label className="field">
      {label && <div className="field-label">{label}</div>}
      <input className={`input ${error ? 'input-error' : ''}`} {...props} />
      {error && <div className="error-message">{error}</div>}
    </label>
  )
}

export default Input

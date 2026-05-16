import React, { useState, useId } from 'react';

interface FloatingInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  className?: string;
  autoComplete?: string;
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  type        = 'text',
  value,
  onChange,
  error,
  hint,
  placeholder,
  disabled,
  required,
  readOnly,
  icon,
  iconRight,
  className   = '',
  autoComplete,
}) => {
  const [focused, setFocused] = useState(false);
  const id      = useId();
  const lifted  = focused || value.length > 0;

  return (
    <div className={`fi-wrapper ${error ? 'fi-error' : ''} ${disabled ? 'fi-disabled' : ''} ${className}`}>
      <div className={`fi-field ${focused ? 'fi-focused' : ''} ${lifted ? 'fi-lifted' : ''} ${icon ? 'fi-has-icon' : ''}`}>
        {icon && <span className="fi-icon-left">{icon}</span>}

        <input
          id={id}
          type={type}
          className="fi-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={lifted ? (placeholder ?? '') : ''}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          autoComplete={autoComplete}
        />

        <label htmlFor={id} className="fi-label">
          {label}
          {required && <span className="fi-required" aria-hidden="true"> *</span>}
        </label>

        {iconRight && <span className="fi-icon-right">{iconRight}</span>}

        {/* Focus underline bar */}
        <span className="fi-bar" />
      </div>

      {error && (
        <p className="fi-hint fi-hint-error" role="alert">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </p>
      )}
      {!error && hint && <p className="fi-hint">{hint}</p>}
    </div>
  );
};

export default FloatingInput;

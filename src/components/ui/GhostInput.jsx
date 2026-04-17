import React from 'react';

/**
 * GhostInput — bottom-border-only input per design system.
 * Focuses to gold (#f9d07a) border.
 */
export default function GhostInput({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = '',
  required = false,
  disabled = false,
  prefix = null,
  className = '',
  autoComplete = 'off',
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="font-stretch text-[9px] tracking-widest text-[#d1c5b3] uppercase block"
        >
          {label}
          {required && <span className="text-[#f9d07a] ml-1">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-0 text-[#f9d07a] font-bold text-lg select-none">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`
            input-ghost text-[#e2e2e2] text-base w-full
            ${prefix ? 'pl-7' : ''}
            ${error ? 'border-b-[#ffb4ab]' : ''}
            ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
          `}
          style={error ? { borderBottomColor: '#ffb4ab' } : {}}
        />
      </div>
      {error && (
        <p className="text-[#ffb4ab] text-[10px] font-stretch tracking-wide mt-1">
          ⚠ {error}
        </p>
      )}
    </div>
  );
}

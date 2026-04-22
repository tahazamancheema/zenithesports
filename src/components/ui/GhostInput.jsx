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
          className="font-teko text-[16px] tracking-widest text-[#dbb462] uppercase block opacity-60"
        >
          {label}
          {required && <span className="text-[#dbb462] ml-1">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-0 text-[#dbb462] font-bebas text-xl select-none">
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
            input-ghost text-[#f2f2f2] text-lg w-full font-body
            ${prefix ? 'pl-7' : ''}
            ${error ? 'border-b-[#ffb4ab]' : ''}
            ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
          `}
          style={error ? { borderBottomColor: '#ffb4ab' } : {}}
        />
      </div>
      {error && (
        <p className="text-[#ffb4ab] text-[12px] font-teko tracking-wide mt-1 uppercase">
          ⚠ {error}
        </p>
      )}
    </div>
  );
}

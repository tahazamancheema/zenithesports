import React from 'react';

/**
 * GradientButton — Primary CTA with Zenith gold gradient.
 * Props: onClick, disabled, type, className, children, icon (Lucide component)
 */
export default function GradientButton({
  children,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  icon: Icon = null,
  size = 'md',
}) {
  const sizes = {
    sm: 'px-6 py-2 text-xs',
    md: 'px-8 py-4 text-xs',
    lg: 'px-12 py-5 text-sm',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        zenith-gradient text-[#402d00] font-stretch tracking-widest
        inline-flex items-center justify-center gap-2
        ${sizes[size]}
        hover:brightness-110
        active:scale-95
        transition-all duration-150
        disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
        ${className}
      `}
    >
      {Icon && <Icon size={16} strokeWidth={2.5} />}
      {children}
    </button>
  );
}

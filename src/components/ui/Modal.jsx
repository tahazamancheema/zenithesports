import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Modal — glassmorphism frosted obsidian overlay.
 * Props: isOpen, onClose, title, children, maxWidth
 */
export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`relative w-full ${maxWidth} glass-obsidian border border-[rgba(78,70,56,0.3)] animate-page-enter`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[rgba(78,70,56,0.2)]">
          <h2 className="font-stretch text-xs tracking-[0.3em] text-[#f9d07a]">{title}</h2>
          <button
            onClick={onClose}
            className="text-[#d1c5b3] hover:text-[#f9d07a] transition-colors p-1"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}

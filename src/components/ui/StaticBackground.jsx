import React from 'react';

/**
 * StaticBackground — High-performance CSS-based background system.
 * Uses a combination of mesh patterns and radial gradients to create depth
 * without JavaScript overhead or cursor-tracking performance hits.
 */
export default function StaticBackground({ variant = 'mesh' }) {
  return (
    <div 
      className={`absolute inset-0 pointer-events-none z-0 ${variant === 'grid' ? 'static-grid' : 'static-mesh'}`} 
      aria-hidden="true"
    >
      {/* Subtle depth gradients */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-transparent opacity-60" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#131313] to-transparent" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#131313] to-transparent" />
    </div>
  );
}

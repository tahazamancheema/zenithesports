import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#131313] px-6">
      <div className="text-center animate-page-enter">
        <span className="font-teko text-[#f9d07a] text-[10px] tracking-[0.4em] block mb-4">ERROR 404</span>
        <h1 className="font-bebas text-[20vw] md:text-[15vw] font-black italic tracking-tighter leading-tight pb-2 text-[#e2e2e2] mb-4">
          404
        </h1>
        <p className="font-bebas text-3xl italic text-[#d1c5b3] opacity-60 mb-8 tracking-tighter">
          SECTOR NOT FOUND
        </p>
        <p className="text-[#d1c5b3] opacity-40 text-sm mb-12 max-w-xs mx-auto">
          This page doesn't exist. The link may be broken or the page may have been removed.
        </p>
        <Link
          to="/"
          className="zenith-gradient text-[#402d00] font-teko text-xs px-10 py-5 tracking-widest hover:brightness-110 active:scale-95 transition-all inline-block"
        >
          RETURN TO BASE
        </Link>
      </div>
    </div>
  );
}

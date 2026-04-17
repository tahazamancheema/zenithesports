import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Sidebar — left navigation panel for dashboard pages.
 * Props: links = [{ icon: LucideIcon, label, to }], bottomButton?
 */
export default function Sidebar({ links = [], bottomContent = null }) {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#131313] border-r border-[rgba(78,70,56,0.15)] shrink-0 h-[calc(100vh-5rem)] sticky top-20">
      <nav className="flex-1 pt-8 space-y-1">
        {links.map(({ icon: Icon, label, to }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`
                flex items-center gap-4 px-8 py-4
                font-stretch text-[10px] tracking-widest
                transition-all duration-200 ease-out
                ${active
                  ? 'text-[#f9d07a] bg-[#1f1f1f] border-l-4 border-[#f9d07a]'
                  : 'text-[#d1c5b3] opacity-50 hover:opacity-100 hover:bg-[#2a2a2a]'
                }
              `}
            >
              {Icon && <Icon size={18} />}
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {bottomContent && (
        <div className="px-6 pb-8">
          {bottomContent}
        </div>
      )}
    </aside>
  );
}

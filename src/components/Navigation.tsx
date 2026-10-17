'use client';

import React, { useState } from 'react';
import type { ChapterId } from '@/types/scene';

interface NavigationProps {
  activeChapter: ChapterId;
  paused: boolean;
  onTogglePaused: () => void;
  progressBarRef: React.RefObject<HTMLDivElement>;
}

const NAV_ITEMS: Array<{ id: ChapterId; label: string }> = [
  { id: 'apps', label: 'Our apps' },
  { id: 'vision', label: 'Our thinking' },
  { id: 'frontier', label: 'The frontier' },
  { id: 'studio', label: 'Studio' },
];

export default function Navigation({
  activeChapter,
  paused,
  onTogglePaused,
  progressBarRef,
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="site-header">
      <div
        ref={progressBarRef}
        className="scroll-progress-bar"
        style={{ transform: 'scaleX(0.01)' }}
        aria-hidden="true"
      />
      <div className="site-header-inner">
        <a href="#top" className="brand-link" aria-label="AppverseSI — Return to top">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-name">APPVERSE.SI</span>
          <span className="brand-subtitle">SUPERINTELLIGENCE</span>
        </a>

        <nav className="primary-nav" aria-label="Primary site navigation">
          <ul className="nav-list">
            {NAV_ITEMS.map((item) => {
              const isActive = activeChapter === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`nav-link ${isActive ? 'is-active' : ''}`}
                    aria-current={isActive ? 'location' : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            onClick={onTogglePaused}
            className="scene-control-btn"
            aria-pressed={paused}
            title={paused ? 'Resume real-time 3D universe simulation' : 'Pause real-time 3D scene'}
          >
            <span className="scene-status-dot" data-paused={paused} aria-hidden="true" />
            <span>{paused ? 'Resume scene' : 'Pause scene'}</span>
          </button>

          <a href="#inquiry" className="header-cta">
            Request a project <span aria-hidden="true">↗</span>
          </a>

          <button
            type="button"
            className="mobile-menu-toggle"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          id="mobile-navigation-drawer"
          className="mobile-nav-drawer"
          aria-label="Mobile navigation"
        >
          <ul className="mobile-nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`mobile-nav-link ${activeChapter === item.id ? 'is-active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#inquiry"
                className="mobile-nav-link is-highlight"
                onClick={closeMobileMenu}
              >
                Request a project ↗
              </a>
            </li>
          </ul>
          <div className="mobile-nav-footer">
            <button
              type="button"
              onClick={() => {
                onTogglePaused();
                closeMobileMenu();
              }}
              className="scene-control-btn mobile-full"
              aria-pressed={paused}
            >
              <span className="scene-status-dot" data-paused={paused} aria-hidden="true" />
              <span>{paused ? 'Resume 3D Scene' : 'Pause 3D Scene'}</span>
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}

'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import BlackHoleCanvas from '@/components/BlackHoleCanvas';
import Navigation from '@/components/Navigation';
import ThemeSynchronizer from '@/components/ThemeSynchronizer';
import ContactSection from '@/components/ContactSection';
import {
  CORE_PRINCIPLES,
  FRONTIER_FIELDS,
  PRODUCT_PIPELINE,
  ROADMAP_PILLARS,
  STUDIO_CAPABILITIES,
  STUDIO_STEPS,
} from '@/lib/siteContent';
import type { ChapterId } from '@/types/scene';

export default function ScrollNarrative() {
  const [activeChapter, setActiveChapter] = useState<ChapterId>('top');
  const [themeColor, setThemeColor] = useState<string>('#030408');
  const [paused, setPaused] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  const progressBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleMediaChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  const handleChapterChange = useCallback(
    (chapter: ChapterId, nextThemeColor: string) => {
      setActiveChapter(chapter);
      setThemeColor(nextThemeColor);
    },
    []
  );

  const handleTogglePaused = useCallback(() => {
    setPaused((prev) => !prev);
  }, []);

  return (
    <div className="experience-shell">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <ThemeSynchronizer themeColor={themeColor} />

      <BlackHoleCanvas
        paused={paused}
        forceReducedMotion={reducedMotion}
        onChapterChange={handleChapterChange}
        progressBarRef={progressBarRef}
      />

      <Navigation
        activeChapter={activeChapter}
        paused={paused}
        onTogglePaused={handleTogglePaused}
        progressBarRef={progressBarRef}
      />

      <main id="main-content" className="narrative-main">
        {/* HERO / ARRIVAL SECTION */}
        <section
          id="top"
          aria-labelledby="hero-heading"
          className="cosmos-section hero-section"
        >
          <div className="section-inner">
            <div className="hero-content-panel">
              <div className="eyebrow-pill">
                <span className="beacon-dot" aria-hidden="true" />
                <span>APPVERSE SUPERINTELLIGENCE / BUILDING WHAT COMES NEXT</span>
              </div>

              <h1 id="hero-heading" className="hero-title">
                Tomorrow, made real.
              </h1>

              <p className="hero-subtitle">
                Apps for today. A bigger vision for tomorrow.
              </p>

              <p className="hero-description">
                We&apos;re creating useful in-house products now, exploring how digital experiences
                can work better together as ambitious super-apps, and partnering with businesses to
                engineer flagship web applications and custom software.
              </p>

              <div className="hero-cta-row">
                <a href="#inquiry" className="btn-primary">
                  Request a project <span aria-hidden="true">↗</span>
                </a>
                <a href="#apps" className="btn-secondary">
                  Explore our apps <span aria-hidden="true">→</span>
                </a>
              </div>

              <div className="hero-telemetry-bar">
                <span className="telemetry-label">REAL-TIME 3D — SCROLL TO TRAVEL</span>
                <span className="telemetry-divider" aria-hidden="true">|</span>
                <button
                  type="button"
                  onClick={handleTogglePaused}
                  className="telemetry-toggle"
                  aria-pressed={paused}
                >
                  {paused ? 'Resume scene' : 'Pause scene'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 01: OUR PRODUCTS & SUPER-APP ROADMAP */}
        <section
          id="apps"
          aria-labelledby="apps-heading"
          className="cosmos-section"
        >
          <div className="section-inner">
            <div className="section-header-panel">
              <div className="section-meta-row">
                <span className="mono-tag">01 / OUR PRODUCTS · BUILT IN-HOUSE · RELEASED WHEN READY</span>
                <span className="mono-subtag">INDEPENDENT BY DESIGN</span>
              </div>
              <h2 id="apps-heading" className="section-title">
                Useful by design. Built for what&apos;s next.
              </h2>
              <p className="section-lead">
                A growing portfolio of useful apps is our focus now. Over time, we are architecting
                our products to work together more naturally—opening the door to richer, connected
                super-app experiences.
              </p>
            </div>

            <div className="cards-grid-three" role="list">
              {PRODUCT_PIPELINE.map((item) => (
                <article key={item.code} className="cosmos-card" role="listitem">
                  <div className="card-top-meta">
                    <span className="mono-code">{item.code}</span>
                    <span className="status-pill">{item.status}</span>
                  </div>
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-tagline">{item.tagline}</p>
                  <p className="card-body">{item.description}</p>
                  <ul className="card-spec-list">
                    {item.specs.map((spec) => (
                      <li key={spec}>{spec}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="pillars-strip" role="list" aria-label="Product roadmap pillars">
              {ROADMAP_PILLARS.map((pillar) => (
                <div key={pillar.index} className="pillar-strip-item" role="listitem">
                  <span className="mono-index">{pillar.index} /</span>
                  <div>
                    <h4 className="pillar-strip-title">{pillar.title}</h4>
                    <p className="pillar-strip-detail">{pillar.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 02: OUR THINKING / POINT OF VIEW */}
        <section
          id="vision"
          aria-labelledby="vision-heading"
          className="cosmos-section"
        >
          <div className="section-inner align-end">
            <div className="section-header-panel wide-panel">
              <div className="section-meta-row">
                <span className="mono-tag">02 / THE POINT OF VIEW · A DIFFERENT SCALE OF THINKING</span>
                <span className="mono-subtag">THINK IN UNIVERSES.</span>
              </div>
              <h2 id="vision-heading" className="section-title">
                Don&apos;t just add to the noise. Change the signal.
              </h2>
              <p className="section-lead">
                The most interesting questions are rarely the small ones. We are exploring how
                software can become more capable, more intuitive, and more human—while staying
                grounded in things that are genuinely useful.
              </p>
              <p className="section-body-copy">
                The aim is not spectacle alone. It is to make the extraordinary useful, and to
                build with enough care that the technology gets out of the way.
              </p>
            </div>

            <div className="cards-grid-three" role="list">
              {CORE_PRINCIPLES.map((principle) => (
                <article key={principle.index} className="cosmos-card" role="listitem">
                  <div className="card-top-meta">
                    <span className="mono-code">{principle.index}</span>
                    <span className="mono-label">{principle.label}</span>
                  </div>
                  <h3 className="card-title">{principle.title}</h3>
                  <p className="card-body">{principle.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 03: THE FRONTIER */}
        <section
          id="frontier"
          aria-labelledby="frontier-heading"
          className="cosmos-section"
        >
          <div className="section-inner">
            <div className="section-header-panel">
              <div className="section-meta-row">
                <span className="mono-tag">03 / THE FRONTIER · THE NEXT CHAPTER IS FORMING</span>
                <span className="mono-subtag">INTELLIGENCE IN FORMATION · STATE: EVOLVING</span>
              </div>
              <h2 id="frontier-heading" className="section-title">
                A new universe is taking shape.
              </h2>
              <p className="section-lead">
                A new generation of software should feel less like operating a machine and more
                like extending what a person can do. That is the direction we are working toward.
              </p>
            </div>

            <div className="cards-grid-three" role="list">
              {FRONTIER_FIELDS.map((field) => (
                <article key={field.code} className="cosmos-card frontier-card" role="listitem">
                  <div className="card-top-meta">
                    <span className="mono-code">FIELD / {field.code}</span>
                    <span className="status-pill">{field.status}</span>
                  </div>
                  <h3 className="card-title">{field.title}</h3>
                  <p className="card-body">{field.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 04: THE STUDIO / BUILD WITH APPVERSESI */}
        <section
          id="studio"
          aria-labelledby="studio-heading"
          className="cosmos-section"
        >
          <div className="section-inner">
            <div className="section-header-panel">
              <div className="section-meta-row">
                <span className="mono-tag">04 / THE STUDIO · WEBSITES, APPS &amp; CUSTOM SOFTWARE</span>
                <span className="mono-subtag">FOR BUSINESS PROJECTS</span>
              </div>
              <h2 id="studio-heading" className="section-title">
                Clear goals. Careful delivery.
              </h2>
              <p className="section-lead">
                Businesses can request websites, web applications, and custom software from us. We
                take on selected projects where the goal is clear and the scope is right for our
                team.
              </p>
              <div className="studio-availability-banner">
                <span className="status-beacon" aria-hidden="true" />
                <span>OPEN TO A SMALL NUMBER OF WELL-SUITED PROJECTS</span>
                <a href="#inquiry" className="inline-cta-link">
                  Start a conversation →
                </a>
              </div>
            </div>

            <div className="cards-grid-three" role="list">
              {STUDIO_CAPABILITIES.map((cap) => (
                <article key={cap.index} className="cosmos-card" role="listitem">
                  <div className="card-top-meta">
                    <span className="mono-code">{cap.index}</span>
                  </div>
                  <h3 className="card-title">{cap.title}</h3>
                  <p className="card-body">{cap.description}</p>
                  <ul className="card-spec-list">
                    {cap.deliverables.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="pillars-strip four-col" role="list" aria-label="How we work">
              {STUDIO_STEPS.map((s) => (
                <div key={s.step} className="pillar-strip-item" role="listitem">
                  <span className="mono-index">{s.step} /</span>
                  <div>
                    <h4 className="pillar-strip-title">{s.title}</h4>
                    <p className="pillar-strip-detail">{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 05: BUSINESS ENQUIRIES / CONTACT */}
        <section
          id="inquiry"
          aria-labelledby="inquiry-heading"
          className="cosmos-section inquiry-section"
        >
          <div className="section-inner">
            <div className="section-header-panel">
              <div className="section-meta-row">
                <span className="mono-tag">05 / BUSINESS ENQUIRIES · REQUEST A PROJECT</span>
                <span className="mono-subtag">FOR WEBSITES, APPS &amp; CUSTOM SOFTWARE</span>
              </div>
              <h2 id="inquiry-heading" className="section-title">
                What do you need built?
              </h2>
              <p className="section-lead">
                Tell us what you need, what it should do, and who it is for. We review each project
                enquiry and respond when the work is a good fit.
              </p>
            </div>

            <ContactSection />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="footer-brand-col">
            <div className="footer-brand-row">
              <span className="brand-mark" aria-hidden="true" />
              <span className="footer-brand-name">APPVERSE.SI</span>
            </div>
            <p className="footer-tagline">
              A new universe of software. A long view of intelligence.
            </p>
            <p className="footer-copyright">
              © 2026 APPVERSE.SI · INDEPENDENT BY NATURE · FUTURE-FOCUSED BY DESIGN
            </p>
          </div>

          <nav className="footer-nav" aria-label="Footer navigation">
            <a href="#apps" className="footer-link">Our apps</a>
            <a href="#vision" className="footer-link">Our thinking</a>
            <a href="#frontier" className="footer-link">The frontier</a>
            <a href="#studio" className="footer-link">Studio</a>
            <a href="#inquiry" className="footer-link">Business enquiries ↗</a>
            <a href="#top" className="footer-link back-to-orbit">BACK TO ORBIT ↑</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

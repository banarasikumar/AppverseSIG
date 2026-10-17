import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="not-found-shell">
      <div className="not-found-card">
        <p className="mono-tag">404 / BEYOND KNOWN COORDINATES</p>
        <h1 className="section-title">This trajectory does not exist.</h1>
        <p className="section-lead">
          The page or coordinate you requested could not be located in the AppverseSI system.
        </p>
        <div className="hero-cta-row">
          <Link href="/" className="btn-primary">
            Return to AppverseSI Orbit →
          </Link>
        </div>
      </div>
    </main>
  );
}

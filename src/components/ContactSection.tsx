'use client';

import React, { useState } from 'react';
import type { ContactSubmissionPayload } from '@/types/scene';

type SubmissionState = 'idle' | 'submitting' | 'delivered' | 'fallback' | 'error';

interface ApiContactResponse {
  ok?: boolean;
  delivered?: boolean;
  message?: string;
  error?: string;
  mailtoSubject?: string;
  mailtoBody?: string;
}

export default function ContactSection() {
  const [formData, setFormData] = useState<ContactSubmissionPayload>({
    name: '',
    email: '',
    company: '',
    projectType: 'web-app',
    scope: 'full-product',
    message: '',
    website: '',
  });
  const [status, setStatus] = useState<SubmissionState>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  const configuredEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || '';

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatSummaryText = () => {
    return [
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      `Company: ${formData.company || 'Independent / Not specified'}`,
      `Project Type: ${formData.projectType}`,
      `Estimated Scope: ${formData.scope || 'Not specified'}`,
      '',
      'Project Details:',
      formData.message,
    ].join('\n');
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(formatSummaryText());
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 3000);
    } catch {
      setCopiedSummary(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'submitting') return;

    setStatus('submitting');
    setFeedbackMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = (await response.json()) as ApiContactResponse;

      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Please check your form entries and try again.');
      }

      if (result.delivered) {
        setStatus('delivered');
        setFeedbackMessage(
          result.message ||
            'Your project enquiry has been delivered to AppverseSI. We will review your scope and respond to your email.'
        );
        setFormData({
          name: '',
          email: '',
          company: '',
          projectType: 'web-app',
          scope: 'full-product',
          message: '',
          website: '',
        });
      } else {
        // Honest fallback when no server webhook/mail provider is configured yet in Vercel env
        setStatus('fallback');
        setFeedbackMessage(
          result.message ||
            'Your enquiry details are validated and ready. Because direct server webhook delivery is not yet configured in this deployment environment, please use the instant mail launcher or copy your structured brief below.'
        );
      }
    } catch (err) {
      setStatus('error');
      setFeedbackMessage(
        err instanceof Error
          ? err.message
          : 'Unable to validate your enquiry right now. Please check your entries.'
      );
    }
  };

  return (
    <div className="inquiry-layout">
      <div className="inquiry-info-card">
        <div className="card-corner-mark top-left" aria-hidden="true">+</div>
        <p className="mono-tag">05 / BUSINESS ENQUIRIES · REQUEST A PROJECT</p>
        <h3 className="inquiry-card-heading">Built with clarity, from first conversation to launch.</h3>
        <p className="inquiry-card-copy">
          Tell us what you need built, what it should achieve, and who it is for. We review every
          project enquiry directly and respond when the goals and scope are a strong fit.
        </p>

        <div className="inquiry-pillars">
          <div className="inquiry-pillar-item">
            <span className="mono-label">WHAT WE BUILD FOR PARTNERS</span>
            <p>Flagship 3D &amp; interactive websites, custom web applications, AI-enabled workflows, and scalable software foundations.</p>
          </div>
          <div className="inquiry-pillar-item">
            <span className="mono-label">AVAILABILITY STATUS</span>
            <p className="availability-inline">
              <span className="status-beacon" aria-hidden="true" />
              Open to a select number of well-suited business projects
            </p>
          </div>
          <div className="inquiry-pillar-item">
            <span className="mono-label">PRIVACY COMMITMENT</span>
            <p>Your information is used strictly to evaluate and respond to your project enquiry.</p>
          </div>
        </div>
      </div>

      <form className="inquiry-form-card" onSubmit={handleSubmit} noValidate>
        <div className="card-corner-mark top-right" aria-hidden="true">+</div>

        {/* Honeypot field hidden from human visitors */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="inquiry-website">Website</label>
          <input
            id="inquiry-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={formData.website}
            onChange={handleChange}
          />
        </div>

        <div className="form-grid-two">
          <div className="form-group">
            <label htmlFor="inquiry-name">Name *</label>
            <input
              id="inquiry-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="inquiry-email">Email address *</label>
            <input
              id="inquiry-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-grid-two">
          <div className="form-group">
            <label htmlFor="inquiry-company">Company (Optional)</label>
            <input
              id="inquiry-company"
              name="company"
              type="text"
              autoComplete="organization"
              placeholder="Company or project name"
              value={formData.company}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="inquiry-projectType">Project type *</label>
            <select
              id="inquiry-projectType"
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
            >
              <option value="web-app">Custom Web Application / SaaS</option>
              <option value="website-3d">Flagship Website / 3D Interactive Experience</option>
              <option value="custom-software">Custom Software Engineering</option>
              <option value="ai-workflow">AI-Enabled Product or Workflow</option>
              <option value="partnership">Long-Term Product Partnership</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="inquiry-scope">Approximate scope (Optional)</label>
          <select
            id="inquiry-scope"
            name="scope"
            value={formData.scope}
            onChange={handleChange}
          >
            <option value="full-product">End-to-End Product Design &amp; Engineering</option>
            <option value="focused-mvp">Focused V1 / Initial Launch</option>
            <option value="long-term-partner">Ongoing Engineering &amp; Architecture Partner</option>
            <option value="undecided">Exploring Scope / Need Guidance</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="inquiry-message">Project details *</label>
          <textarea
            id="inquiry-message"
            name="message"
            rows={4}
            required
            placeholder="Tell us what you want to build, what it should do, and who it is for..."
            value={formData.message}
            onChange={handleChange}
          />
        </div>

        <div className="form-footer-row">
          <button
            type="submit"
            className="btn-primary"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Validating enquiry...' : 'Send project enquiry →'}
          </button>

          <p className="form-disclaimer">
            Your information is used only to respond to your inquiry.
          </p>
        </div>

        {status !== 'idle' && feedbackMessage && (
          <div
            className={`form-feedback-box is-${status}`}
            role={status === 'error' ? 'alert' : 'status'}
            aria-live="polite"
          >
            <p>{feedbackMessage}</p>
            {status === 'fallback' && (
              <div className="fallback-actions">
                {configuredEmail && (
                  <a
                    href={`mailto:${configuredEmail}?subject=${encodeURIComponent(
                      `Project Enquiry (${formData.projectType}) — ${
                        formData.company || formData.name
                      }`
                    )}&body=${encodeURIComponent(formatSummaryText())}`}
                    className="btn-secondary btn-sm"
                  >
                    Open in Mail Client ↗
                  </a>
                )}
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="btn-secondary btn-sm"
                >
                  {copiedSummary ? 'Copied Project Brief ✓' : 'Copy Structured Brief'}
                </button>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

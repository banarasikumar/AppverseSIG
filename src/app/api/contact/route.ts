import { NextResponse } from 'next/server';
import type { ContactSubmissionPayload } from '@/types/scene';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ContactSubmissionPayload>;

    // Silent success on honeypot spam field
    if (body.website && body.website.trim().length > 0) {
      return NextResponse.json({
        ok: true,
        delivered: true,
        message: 'Enquiry received.',
      });
    }

    const name = (body.name ?? '').trim();
    const email = (body.email ?? '').trim();
    const company = (body.company ?? '').trim();
    const projectType = body.projectType ?? 'web-app';
    const scope = body.scope ?? 'full-product';
    const message = (body.message ?? '').trim();

    if (name.length < 2) {
      return NextResponse.json(
        { ok: false, error: 'Please enter your name (at least 2 characters).' },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { ok: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (message.length < 12) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Please share a brief description of what you need built (at least 12 characters).',
        },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
    const resendApiKey = process.env.RESEND_API_KEY;
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL;

    let delivered = false;

    if (webhookUrl) {
      const hookRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'appverse.si',
          submittedAt: new Date().toISOString(),
          name,
          email,
          company,
          projectType,
          scope,
          message,
        }),
      });
      if (hookRes.ok) {
        delivered = true;
      }
    }

    if (!delivered && resendApiKey && receiverEmail) {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'AppverseSI Website <onboarding@resend.dev>',
          to: [receiverEmail],
          reply_to: email,
          subject: `AppverseSI Project Enquiry (${projectType}) — ${company || name}`,
          text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || 'N/A'}\nProject Type: ${projectType}\nScope: ${scope}\n\nMessage:\n${message}`,
        }),
      });
      if (resendRes.ok) {
        delivered = true;
      }
    }

    if (delivered) {
      return NextResponse.json({
        ok: true,
        delivered: true,
        message:
          'Your project enquiry has been sent to AppverseSI. We review every enquiry and will respond to your email when the work is a good fit.',
      });
    }

    // Truthful response when no backend webhook/email key is configured in environment variables yet
    return NextResponse.json({
      ok: true,
      delivered: false,
      message:
        'Your enquiry details are validated. Set CONTACT_WEBHOOK_URL or RESEND_API_KEY in Vercel environment variables to enable automatic server delivery, or copy your structured brief below.',
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: 'Unable to process your request payload. Please verify your entries and try again.',
      },
      { status: 400 }
    );
  }
}

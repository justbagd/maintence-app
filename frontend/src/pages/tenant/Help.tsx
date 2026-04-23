import { usePageTitle } from '@/hooks/usePageTitle';

export default function Help() {
  usePageTitle('Help');

  const faqs = [
    {
      q: 'How do I submit a request?',
      a: 'Click "New Request" in the sidebar, fill out the form, and hit Submit.',
    },
    {
      q: 'How long does it take?',
      a: 'Urgent requests are addressed within 24 hours. Standard requests within 3–5 business days.',
    },
    {
      q: 'Can I reopen a completed request?',
      a: "Yes — view the request detail and click \"Reopen Request\" if the issue wasn't resolved.",
    },
    {
      q: 'How do I cancel a request?',
      a: 'Open the request detail and click "Cancel Request" while it\'s still Pending or Assigned.',
    },
  ];

  return (
    <div>
      <h1 className="text-[26px] font-bold text-[var(--color-text)] mb-1">
        Help &amp; Support
      </h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-6">Frequently asked questions and contact information.</p>

      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <h2 className="text-sm font-semibold text-[var(--color-text)] mb-5">FAQs</h2>
        <dl className="flex flex-col gap-5">
          {faqs.map(f => (
            <div key={f.q}>
              <dt className="text-sm font-semibold text-[var(--color-text)] mb-1">{f.q}</dt>
              <dd className="text-sm text-[var(--color-text-muted)]">{f.a}</dd>
            </div>
          ))}
          <div>
            <dt className="text-sm font-semibold text-[var(--color-text)] mb-1">Contact</dt>
            <dd className="text-sm text-[var(--color-text-muted)]">
              <a href="mailto:maintenance@apartmentcare.com" className="text-[var(--color-accent)] hover:underline">
                maintenance@apartmentcare.com
              </a>
              &nbsp;|&nbsp; (555) 123-4567
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

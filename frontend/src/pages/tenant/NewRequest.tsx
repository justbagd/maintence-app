import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { requestsApi } from '@/api/requests';
import { usePageTitle } from '@/hooks/usePageTitle';
import { toast } from 'sonner';
import type { Category, LocationInUnit, Priority, PreferredTime } from '@/types';

export default function NewRequest() {
  const { user } = useAuth();
  const navigate = useNavigate();
  usePageTitle('New Request');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    category: '' as Category | '',
    priority: 'MEDIUM' as Priority,
    location: '' as LocationInUnit | '',
    description: '',
    preferredDate: '',
    preferredTime: 'ANY_TIME' as PreferredTime,
    allowEntry: false,
  });

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm(f => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.category || !form.location || !form.description.trim()) {
      toast.error('Please fill in Category, Location, and Description.');
      return;
    }
    if (!user) return;
    setLoading(true);
    try {
      await requestsApi.create({
        tenantId: user.id,
        category: form.category as Category,
        locationInUnit: form.location as LocationInUnit,
        description: form.description.trim(),
        priority: form.priority,
        preferredTime: form.preferredTime,
        preferredDate: form.preferredDate || null,
        allowEntry: form.allowEntry,
      });
      toast.success('Request submitted successfully!');
      setTimeout(() => navigate('/tenant'), 1200);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-[26px] font-bold text-[var(--color-text)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
        Submit New Request
      </h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-6">
        Provide detailed information about the issue you're experiencing.
      </p>

      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Category *">
              <select value={form.category} onChange={e => set('category', e.target.value as Category)} className={fieldCls} required>
                <option value="">Select a category</option>
                <option value="PLUMBING">Plumbing</option>
                <option value="ELECTRICAL">Electrical</option>
                <option value="HVAC">HVAC</option>
                <option value="APPLIANCE">Appliance</option>
                <option value="STRUCTURAL">Structural</option>
                <option value="PEST_CONTROL">Pest Control</option>
                <option value="OTHER">Other</option>
              </select>
            </Field>

            <Field label="Priority Level *">
              <select value={form.priority} onChange={e => set('priority', e.target.value as Priority)} className={fieldCls}>
                <option value="LOW">Low — Not urgent</option>
                <option value="MEDIUM">Medium — Within a week</option>
                <option value="HIGH">High — Within 48 hours</option>
                <option value="URGENT">Urgent — Immediate attention</option>
              </select>
            </Field>

            <Field label="Location in Unit *" className="sm:col-span-2">
              <select value={form.location} onChange={e => set('location', e.target.value as LocationInUnit)} className={fieldCls} required>
                <option value="">Select location</option>
                <option value="KITCHEN">Kitchen</option>
                <option value="BATHROOM">Bathroom</option>
                <option value="BEDROOM">Bedroom</option>
                <option value="LIVING_ROOM">Living Room</option>
                <option value="HALLWAY">Hallway</option>
                <option value="EXTERIOR">Exterior</option>
                <option value="OTHER">Other</option>
              </select>
            </Field>

            <Field label="Description *" className="sm:col-span-2">
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Describe the issue in detail — when it started, any sounds/smells, and what you've tried…"
                maxLength={2000}
                rows={4}
                className={fieldCls + ' resize-y min-h-[100px]'}
                required
              />
            </Field>

            <Field label="Preferred Date (Optional)">
              <input type="date" value={form.preferredDate} onChange={e => set('preferredDate', e.target.value)} className={fieldCls} />
            </Field>

            <Field label="Preferred Time">
              <select value={form.preferredTime} onChange={e => set('preferredTime', e.target.value as PreferredTime)} className={fieldCls}>
                <option value="ANY_TIME">Any time</option>
                <option value="MORNING">Morning (8am–12pm)</option>
                <option value="AFTERNOON">Afternoon (12pm–5pm)</option>
                <option value="EVENING">Evening (5pm–8pm)</option>
              </select>
            </Field>

            <div className="sm:col-span-2 flex items-center gap-3">
              <input
                type="checkbox"
                id="allowEntry"
                checked={form.allowEntry}
                onChange={e => set('allowEntry', e.target.checked)}
                className="w-4 h-4 rounded accent-[var(--color-accent)]"
              />
              <label htmlFor="allowEntry" className="text-sm text-[var(--color-text)]">
                Allow entry if I'm not home
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--color-border)]">
            <button
              type="button"
              onClick={() => navigate('/tenant')}
              className="px-4 py-2 rounded-[10px] text-sm font-medium text-[var(--color-text-secondary)] bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-surface-subtle)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-[10px] text-sm font-semibold text-white bg-[var(--color-navy-mid)] hover:bg-[var(--color-navy-hover)] shadow-[0_2px_8px_rgba(29,52,97,0.30)] transition-all disabled:opacity-60"
            >
              {loading ? 'Submitting…' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const fieldCls = `w-full border border-[var(--color-border)] rounded-[10px] px-3 py-2.5 text-sm text-[var(--color-text)] bg-[var(--color-surface)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/12 transition-all`;

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ''}`}>
      <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

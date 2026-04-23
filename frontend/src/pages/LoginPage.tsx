import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

type Tab = 'signin' | 'signup';

const DEMO = [
  { role: 'Tenant',    email: 'tenant@demo.com',      password: 'password' },
  { role: 'Staff',     email: 'maintenance@demo.com',  password: 'password' },
  { role: 'Staff',     email: 'jane@demo.com',         password: 'password' },
  { role: 'Staff',     email: 'carlos@demo.com',       password: 'password' },
  { role: 'Admin',     email: 'admin@demo.com',        password: 'password' },
];

export default function LoginPage() {
  useEffect(() => { document.title = 'ApartmentCare'; }, []);
  const { login, signup } = useAuth();
  const [tab, setTab] = useState<Tab>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'signup') {
        await signup(name, email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : tab === 'signup' ? 'Could not create account' : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col flex-[0_0_50%] bg-[#EBE6DA] p-12 relative overflow-hidden">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-16">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-navy-mid)] flex items-center justify-center text-white text-sm font-bold">AC</div>
          <span className="text-[var(--color-navy-mid)] font-semibold text-base" style={{ fontFamily: 'var(--font-display)' }}>ApartmentCare</span>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-sm">
          <h1 className="text-[clamp(34px,3.8vw,52px)] font-extrabold leading-[1.07] tracking-tight text-[var(--color-navy-mid)] mb-5" style={{ fontFamily: 'var(--font-display)' }}>
            Your home,<br />taken care of.
          </h1>
          <p className="text-[15.5px] font-light leading-relaxed text-[#7B7E96] max-w-[340px]">
            Submit requests, track progress, and communicate with your maintenance team — all in one place.
          </p>

          <ul className="mt-10 flex flex-col gap-4">
            {[
              'Real-time status updates',
              'Instant in-app notifications',
              'Staff assigned in minutes',
            ].map(item => (
              <li key={item} className="flex items-center gap-3 text-sm text-[var(--color-navy-mid)]">
                <span className="w-5 h-5 rounded-full bg-[var(--color-accent)] flex items-center justify-center shrink-0">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Decorative towers */}
        <div className="absolute bottom-0 right-0 opacity-[0.07] pointer-events-none">
          <svg width="300" height="220" viewBox="0 0 300 220" fill="none">
            <rect x="20" y="80" width="40" height="140" fill="#1D3461"/>
            <rect x="30" y="60" width="20" height="20" fill="#1D3461"/>
            <rect x="80" y="40" width="60" height="180" fill="#1D3461"/>
            <rect x="95" y="20" width="30" height="20" fill="#1D3461"/>
            <rect x="160" y="70" width="50" height="150" fill="#1D3461"/>
            <rect x="230" y="100" width="45" height="120" fill="#1D3461"/>
            <rect x="245" y="80" width="15" height="20" fill="#1D3461"/>
          </svg>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 bg-[#FAF9F7]">
        <div className="w-full max-w-[372px]">
          {/* Mobile brand */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-navy-mid)] flex items-center justify-center text-white text-xs font-bold">AC</div>
            <span className="text-[var(--color-navy-mid)] font-semibold" style={{ fontFamily: 'var(--font-display)' }}>ApartmentCare</span>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-[#E5E1D6] rounded-[9px] p-[3px] mb-7 w-fit">
            {(['signin', 'signup'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-[18px] py-[7px] rounded-[7px] text-[13px] font-medium transition-all duration-200 ${
                  tab === t
                    ? 'bg-[#FAF9F7] text-[var(--color-navy-mid)] shadow-sm'
                    : 'text-[#7B7E96] hover:text-[var(--color-navy-mid)]'
                }`}
              >
                {t === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-[var(--color-navy-mid)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            {tab === 'signin' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="text-sm text-[#7B7E96] mb-7">
            {tab === 'signin' ? 'Sign in to your ApartmentCare account' : 'Join ApartmentCare today'}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {tab === 'signup' && (
              <div className={`flex items-center bg-[#F2EFE8] border-[1.5px] rounded-[10px] px-[14px] py-[11px] gap-2.5 transition-all ${
                error ? 'border-[#C94040]' : 'border-transparent focus-within:border-[var(--color-accent)] focus-within:bg-[#FFFEF9]'
              }`}>
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="flex-1 bg-transparent border-none outline-none text-[14.5px] text-[#1A2540] placeholder-[#C0BAB0]"
                />
              </div>
            )}

            <div className={`flex items-center bg-[#F2EFE8] border-[1.5px] rounded-[10px] px-[14px] py-[11px] gap-2.5 transition-all ${
              error ? 'border-[#C94040]' : 'border-transparent focus-within:border-[var(--color-accent)] focus-within:bg-[#FFFEF9]'
            }`}>
              <svg className="w-4 h-4 text-[#C0BAB0] shrink-0" viewBox="0 0 16 16" fill="none"><path d="M2 4a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4z" stroke="currentColor" strokeWidth="1.2"/><path d="M2 5l6 4 6-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="flex-1 bg-transparent border-none outline-none text-[14.5px] text-[#1A2540] placeholder-[#C0BAB0]"
              />
            </div>

            <div className={`flex items-center bg-[#F2EFE8] border-[1.5px] rounded-[10px] px-[14px] py-[11px] gap-2.5 transition-all ${
              error ? 'border-[#C94040]' : 'border-transparent focus-within:border-[var(--color-accent)] focus-within:bg-[#FFFEF9]'
            }`}>
              <svg className="w-4 h-4 text-[#C0BAB0] shrink-0" viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="flex-1 bg-transparent border-none outline-none text-[14.5px] text-[#1A2540] placeholder-[#C0BAB0]"
              />
            </div>

            {error && <p className="text-sm text-[#C94040]">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-[13px] bg-[var(--color-navy-mid)] text-[#FAF9F7] rounded-[10px] text-[14.5px] font-bold tracking-tight mt-1 transition-all hover:-translate-y-px hover:bg-[var(--color-navy-hover)] hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {loading ? (tab === 'signup' ? 'Creating account…' : 'Signing in…') : tab === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-7 pt-6 border-t border-[#DDD9CF]">
            <p className="text-xs font-semibold text-[#7B7E96] uppercase tracking-wider mb-3">Demo accounts</p>
            <div className="flex flex-col gap-1.5">
              {DEMO.map(d => (
                <button
                  key={d.role}
                  type="button"
                  onClick={() => { setEmail(d.email); setPassword(d.password); setTab('signin'); }}
                  className="flex items-center gap-3 px-3 py-2 rounded-[8px] bg-[#F2EFE8] hover:bg-[#E9E5DC] transition-colors text-left w-full"
                >
                  <span className="text-[11.5px] font-semibold text-[var(--color-navy-mid)] w-12 shrink-0">{d.role}</span>
                  <span className="text-[11.5px] text-[#7B7E96] flex-1 truncate">{d.email}</span>
                  <span className="text-[11px] font-medium text-[var(--color-accent)] shrink-0">Use →</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

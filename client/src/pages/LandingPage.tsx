import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  ZapOff,
  Coffee,
  Clock,
  Award,
  Sun,
  Moon,
  ChevronRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-void-950 text-gray-900 dark:text-gray-100 transition-colors duration-200 selection:bg-indigo-500 selection:text-white overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 -left-48 w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-gray-200/80 dark:border-void-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
              <span className="text-xl">🧘</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xl tracking-wider text-gray-900 dark:text-white">
                NOTHING
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">
                ENTERPRISE
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-void-800 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-void-800 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Announcing NOTHING Enterprise 2.0 • 0% Output Certified</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-gray-950 dark:text-white uppercase font-sans">
          NOTHING
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-xl sm:text-2xl font-medium text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          A complete software system for doing absolutely nothing.
        </p>

        {/* Big CTA Button */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={isAuthenticated ? "/dashboard" : "/register"}
            className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-extrabold text-lg sm:text-xl tracking-wider uppercase shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 group"
          >
            <span>START DOING NOTHING</span>
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-card font-semibold text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
          >
            Existing Non-Doer? Log In
          </Link>
        </div>

        {/* Real-time zero indicator */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>0 Tasks Assigned</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>0 Deliverables Due</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span>100% Void Efficiency</span>
          </div>
        </div>
      </section>

      {/* What Can You Accomplish? Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-gray-200/60 dark:border-void-800">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Performance Metrics
          </h2>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">
            What can you accomplish?
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Empirical data verified by leading inactivity researchers across the globe.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
          {[
            { number: "0", label: "tasks", desc: "Done or planned" },
            { number: "0", label: "goals", desc: "Unencumbered by ambition" },
            { number: "0", label: "meetings", desc: "Could have been an email (which was also 0)" },
            { number: "0", label: "achievements", desc: "Pure unbroken calm" },
            { number: "100%", label: "nothing", desc: "Statistically sound inactivity" },
          ].map((stat, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-6 text-center transition-all hover:scale-105"
            >
              <div className="text-4xl sm:text-5xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                {stat.number}
              </div>
              <div className="text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200 mt-2">
                {stat.label}
              </div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-tight">
                {stat.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Nothing? Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-gray-200/60 dark:border-void-800">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Core Value Propositions
          </h2>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">
            Why Nothing?
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Traditional software forces you to do things. NOTHING is the only platform brave enough to do the opposite.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: ZapOff,
              title: "No productivity required",
              desc: "Throw away your to-do list. Here, your lack of effort is celebrated as peak performance."
            },
            {
              icon: Coffee,
              title: "No experience necessary",
              desc: "Anyone from entry-level interns to C-suite executives can effortlessly do absolutely nothing."
            },
            {
              icon: Clock,
              title: "No goals",
              desc: "Objectives are an anti-pattern. Experience the liberation of having no milestones to fail."
            },
            {
              icon: ShieldCheck,
              title: "No motivation",
              desc: "Don't feel like doing anything? Perfect. You are already an advanced user."
            },
            {
              icon: Award,
              title: "No results",
              desc: "We guarantee with 100% mathematical certainty that no output will be produced."
            },
            {
              icon: Sparkles,
              title: "Enterprise Dark Mode",
              desc: "Stare blankly into a beautifully styled high-contrast void for hours on end."
            }
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="glass-card rounded-2xl p-6 transition-all hover:translate-y-[-2px]"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-void-850 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Enterprise Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-gray-200/60 dark:border-void-800">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Customer Validation
          </h2>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">
            Trusted by World-Class Non-Achievers
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-6 relative">
            <div className="text-3xl text-indigo-400 mb-2">“</div>
            <p className="text-sm text-gray-700 dark:text-gray-300 italic mb-4 leading-relaxed">
              We deployed NOTHING across 10,000 corporate employees. Productivity dropped to zero almost instantly. Best SaaS investment our board ever made.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-void-800 flex items-center justify-center text-lg">
                🦥
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">Jane Doe</p>
                <p className="text-[11px] text-gray-400">Chief Executive Sloth, Global Inactivity Corp</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 relative">
            <div className="text-3xl text-indigo-400 mb-2">“</div>
            <p className="text-sm text-gray-700 dark:text-gray-300 italic mb-4 leading-relaxed">
              Before NOTHING, I used to feel terrible whenever I procrastinated. Now, I have charts and analytics proving I wasted 4 hours with enterprise professionalism.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-void-800 flex items-center justify-center text-lg">
                🛋️
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900 dark:text-white">Alex Smith</p>
                <p className="text-[11px] text-gray-400">Senior Procrastination Architect</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Pricing ($0/mo) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-gray-200/60 dark:border-void-800">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Transparent Pricing
          </h2>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-2">
            Invest in Inactivity
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            All plans come with 0 hidden fees and 0 features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Amateur Tier",
              price: "$0",
              desc: "For individuals taking their first baby steps into doing nothing.",
              features: ["Unlimited Nothing clicks", "Basic 0% analytics", "Gentle procrastination", "Community silence"]
            },
            {
              name: "Professional Pro",
              price: "$0",
              popular: true,
              desc: "For seasoned slackers who want advanced inactivity metrics.",
              features: ["Everything in Amateur", "Live stopwatch timer", "Humorous level progression", "0% productivity guarantee", "Dark mode void"]
            },
            {
              name: "Enterprise Void",
              price: "$0",
              desc: "For large enterprises aiming to eliminate all employee output.",
              features: ["Dedicated inaction advisor", "Custom 0-KPI dashboards", "SLA: 99.99% dormancy", "Certificate of Non-Achievement"]
            }
          ].map((tier, i) => (
            <div
              key={i}
              className={`glass-card rounded-2xl p-6 relative flex flex-col justify-between ${
                tier.popular ? 'border-2 border-indigo-500 shadow-indigo-500/20 shadow-xl scale-105' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider">
                  Most Inactive
                </div>
              )}
              <div>
                <h3 className="font-bold text-base text-gray-900 dark:text-white">{tier.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black font-mono text-gray-900 dark:text-white">{tier.price}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">/ forever</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{tier.desc}</p>
                <div className="border-t border-gray-100 dark:border-void-800 my-4" />
                <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                  {tier.features.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8">
                <Link
                  to={isAuthenticated ? "/dashboard" : "/register"}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-center block transition-all ${
                    tier.popular
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-gray-100 dark:bg-void-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-void-700'
                  }`}
                >
                  Adopt Nothing
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Big Final CTA */}
      <section className="py-20 px-4 text-center border-t border-gray-200/60 dark:border-void-800">
        <div className="max-w-2xl mx-auto glass-card rounded-3xl p-10 relative overflow-hidden border border-indigo-500/20">
          <div className="text-4xl mb-4">🧘</div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Ready to accomplish absolutely nothing?
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 max-w-md mx-auto">
            Join thousands of professionals worldwide who have successfully reduced their productivity to zero.
          </p>
          <div className="mt-8">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-base tracking-wider uppercase shadow-xl hover:shadow-indigo-500/30 transition-all inline-flex items-center gap-2"
            >
              <span>Get Started for Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

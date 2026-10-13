import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHistory } from '../services/api';

const features = [
  {
    to: '/upload',
    title: 'Upload & Convert',
    description: 'Upload a .txt file and convert it to a PDF document instantly.',
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    color: 'from-brand-500 to-brand-600',
    shadow: 'shadow-brand-500/30',
  },
  {
    to: '/form',
    title: 'Form to PDF',
    description: 'Fill out a simple form and generate a PDF with your information.',
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: 'from-accent-400 to-accent-600',
    shadow: 'shadow-accent-500/30',
  },
  {
    to: '/history',
    title: 'History',
    description: 'View and manage all your previous transformations.',
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'from-brand-400 to-accent-500',
    shadow: 'shadow-brand-500/30',
  },
];

interface Stats {
  total: number;
  txtToPdf: number;
  formToPdf: number;
}

export default function Home() {
  const [stats, setStats] = useState<Stats>({ total: 0, txtToPdf: 0, formToPdf: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory()
      .then((data) => {
        const history = data.history;
        setStats({
          total: history.length,
          txtToPdf: history.filter((h) => h.type === 'txt-to-pdf').length,
          formToPdf: history.filter((h) => h.type === 'form-to-pdf').length,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative py-16 text-center sm:py-24">
        {/* Floating orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl animate-float" />
          <div className="absolute -right-20 top-40 h-64 w-64 rounded-full bg-accent-500/10 blur-3xl animate-float-delayed" />
          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/5 blur-3xl" />
        </div>

        <div className="relative">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-accent-500 text-white shadow-2xl shadow-brand-500/30 animate-bounce-gentle">
            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-surface-900 dark:text-white sm:text-5xl">
            File & Form Transformer
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-surface-500 dark:text-surface-400">
            Transform your files and forms into PDF documents quickly and easily.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-12 grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Total Conversions', value: stats.total, color: 'text-brand-600 dark:text-brand-400' },
          { label: 'TXT to PDF', value: stats.txtToPdf, color: 'text-accent-600 dark:text-accent-400' },
          { label: 'Form to PDF', value: stats.formToPdf, color: 'text-brand-500 dark:text-brand-300' },
        ].map((stat, i) => (
          <div key={stat.label} className={`card p-6 text-center animate-stagger-${i + 1}`}>
            {loading ? (
              <div className="skeleton mx-auto mb-2 h-10 w-16" />
            ) : (
              <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
            )}
            <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Feature Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Link
            key={feature.to}
            to={feature.to}
            className={`group card card-hover animate-stagger-${index + 4} p-8`}
          >
            <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg ${feature.shadow} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
              {feature.icon}
            </div>
            <h3 className="mb-2 text-xl font-semibold text-surface-800 dark:text-white">{feature.title}</h3>
            <p className="text-surface-500 dark:text-surface-400">{feature.description}</p>
            <div className="mt-4 flex items-center text-sm font-medium text-brand-600 opacity-0 transition-all duration-500 group-hover:opacity-100 dark:text-brand-400">
              Get started
              <svg className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

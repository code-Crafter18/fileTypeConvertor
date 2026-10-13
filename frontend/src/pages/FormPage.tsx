import { useState, FormEvent } from 'react';
import { generatePdfFromForm, UploadResult, FormData } from '../services/api';
import { useToast } from '../context/ToastContext';

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  description: '',
};

export default function FormPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await generatePdfFromForm(formData);
      setSuccess(result);
      addToast('success', 'PDF generated successfully!');
      setFormData(initialFormData);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      const message = axiosError.response?.data?.error || 'Failed to generate PDF from form';
      setError(message);
      addToast('error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8 animate-slide-down">
        <h2 className="text-3xl font-bold text-surface-900 dark:text-white">Form to PDF</h2>
        <p className="mt-2 text-surface-500 dark:text-surface-400">
          Fill out the form below and generate a PDF document.
        </p>
      </div>

      {error && <div className="alert-error mb-6 animate-slide-down">{error}</div>}

      {success && (
        <div className="alert-success mb-6 animate-slide-down">{success.message}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="animate-stagger-1">
            <label htmlFor="name" className="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-300">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="John Doe"
            />
          </div>

          <div className="animate-stagger-2">
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-300">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="animate-stagger-3">
            <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-300">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div className="animate-stagger-4">
            <label htmlFor="address" className="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-300">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="input-field"
              placeholder="123 Main St, City"
            />
          </div>
        </div>

        <div className="animate-stagger-5">
          <label htmlFor="description" className="mb-2 block text-sm font-semibold text-surface-700 dark:text-surface-300">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="input-field resize-none"
            placeholder="Enter any additional details..."
          />
        </div>

        <div className="animate-stagger-6">
          <button type="submit" disabled={loading} className="btn-gradient">
            {loading ? (
              <>
                <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Generate PDF
              </>
            )}
          </button>
        </div>
      </form>

      {loading && (
        <div className="mt-8 flex items-center justify-center gap-3 text-surface-500 dark:text-surface-400">
          <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Generating your PDF...
        </div>
      )}

      {success && (
        <div className="mt-8 animate-slide-up rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-8 text-center dark:border-emerald-800/50 dark:from-emerald-900/20 dark:to-teal-900/20">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 animate-bounce-gentle">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-300">PDF Generated!</h3>
          <p className="mt-1 text-emerald-600 dark:text-emerald-400">Your PDF has been created successfully.</p>
          <a
            href={success.downloadUrl}
            download
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </a>
        </div>
      )}
    </div>
  );
}

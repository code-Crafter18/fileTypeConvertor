import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { uploadFile, UploadResult } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);
    setSuccess(null);

    if (selectedFile) {
      if (!selectedFile.name.endsWith('.txt')) {
        setError('Only .txt files are allowed');
        setFile(null);
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (!droppedFile.name.endsWith('.txt')) {
        setError('Only .txt files are allowed');
        return;
      }
      if (droppedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setFile(droppedFile);
      setError(null);
      setSuccess(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setProgress(0);
    setError(null);
    setSuccess(null);

    try {
      const result = await uploadFile(file, (percent) => {
        setProgress(percent);
      });
      setSuccess(result);
      addToast('success', 'File converted successfully!');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      const message = axiosError.response?.data?.error || 'Failed to upload and convert file';
      setError(message);
      addToast('error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8 animate-slide-down">
        <h2 className="text-3xl font-bold text-surface-900 dark:text-white">Upload & Convert</h2>
        <p className="mt-2 text-surface-500 dark:text-surface-400">
          Upload a .txt file and convert it to PDF format.
        </p>
      </div>

      {error && <div className="alert-error mb-6 animate-slide-down">{error}</div>}

      {success && (
        <div className="alert-success mb-6 animate-slide-down">{success.message}</div>
      )}

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-500 ${
          dragOver
            ? 'border-brand-400 bg-brand-50 scale-[1.02] dark:border-brand-500 dark:bg-brand-900/20'
            : 'border-surface-300 bg-white hover:border-brand-300 hover:bg-surface-50 dark:border-surface-600 dark:bg-surface-900 dark:hover:border-brand-500 dark:hover:bg-surface-800/50'
        }`}
      >
        <input
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 transition-transform duration-500 hover:scale-110">
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <p className="text-lg font-medium text-surface-700 dark:text-surface-200">
          Drag & drop your file here, or <span className="text-brand-600 dark:text-brand-400">browse</span>
        </p>
        <p className="mt-1 text-sm text-surface-400 dark:text-surface-500">
          Only .txt files up to 5MB
        </p>
        {file && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 animate-scale-in">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {file.name}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {loading && (
        <div className="mt-6 animate-slide-up">
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-medium text-surface-600 dark:text-surface-300">Uploading...</span>
            <span className="font-medium text-brand-600 dark:text-brand-400">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-200 dark:bg-surface-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 via-brand-400 to-accent-500 bg-300% transition-all duration-300 animate-gradient-shift"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Convert Button */}
      <div className="mt-8">
        <button onClick={handleUpload} disabled={loading || !file} className="btn-gradient">
          {loading ? (
            <>
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Converting...
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Convert to PDF
            </>
          )}
        </button>
      </div>

      {/* Download Section */}
      {success && (
        <div className="mt-8 animate-slide-up rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-8 text-center dark:border-emerald-800/50 dark:from-emerald-900/20 dark:to-teal-900/20">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 animate-bounce-gentle">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-300">Conversion Complete!</h3>
          <p className="mt-1 text-emerald-600 dark:text-emerald-400">Your PDF has been generated successfully.</p>
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

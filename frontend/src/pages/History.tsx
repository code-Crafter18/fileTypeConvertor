import { useState, useEffect, useMemo } from 'react';
import { getHistory, deleteHistoryEntry, HistoryItem } from '../services/api';
import { useToast } from '../context/ToastContext';
import { SkeletonTable } from '../components/Skeleton';

export default function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'txt-to-pdf' | 'form-to-pdf'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getHistory();
      setHistory(data.history);
      setError(null);
    } catch {
      setError('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteHistoryEntry(id);
      setHistory((prev) => prev.filter((item) => item._id !== id));
      addToast('success', 'Entry deleted successfully');
      setDeleteConfirm(null);
    } catch {
      addToast('error', 'Failed to delete entry');
    }
  };

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesSearch = item.originalName.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'all' || item.type === filter;
      return matchesSearch && matchesFilter;
    });
  }, [history, search, filter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="mb-8 animate-slide-down">
          <h2 className="text-3xl font-bold text-surface-900 dark:text-white">Transformation History</h2>
          <p className="mt-2 text-surface-500 dark:text-surface-400">View all your previous conversions.</p>
        </div>
        <SkeletonTable />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8 animate-slide-down">
        <h2 className="text-3xl font-bold text-surface-900 dark:text-white">Transformation History</h2>
        <p className="mt-2 text-surface-500 dark:text-surface-400">
          View all your previous file conversions and form submissions.
        </p>
      </div>

      {error && <div className="alert-error mb-6 animate-slide-down">{error}</div>}

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row animate-slide-up">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by file name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'txt-to-pdf', 'form-to-pdf'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                filter === f
                  ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
                  : 'bg-white text-surface-600 hover:bg-surface-100 dark:bg-surface-800 dark:text-surface-400 dark:hover:bg-surface-700'
              }`}
            >
              {f === 'all' ? 'All' : f === 'txt-to-pdf' ? 'TXT to PDF' : 'Form to PDF'}
            </button>
          ))}
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-20 animate-scale-in">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-100 text-surface-400 dark:bg-surface-800 dark:text-surface-500">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-surface-600 dark:text-surface-400">
            {search || filter !== 'all' ? 'No matching results' : 'No transformations yet'}
          </p>
          <p className="mt-1 text-surface-400 dark:text-surface-500">
            {search || filter !== 'all' ? 'Try adjusting your search or filter' : 'Start by uploading a file or filling out the form!'}
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden animate-slide-up">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200 bg-surface-50 dark:border-surface-700 dark:bg-surface-800/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Original Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">File Size</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-700/50">
                {filteredHistory.map((item, index) => (
                  <tr key={item._id} className="transition-all duration-300 hover:bg-surface-50 dark:hover:bg-surface-800/50" style={{ animationDelay: `${index * 50}ms` }}>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        item.type === 'txt-to-pdf'
                          ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400'
                          : 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400'
                      }`}>
                        {item.type === 'txt-to-pdf' ? 'TXT to PDF' : 'Form to PDF'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-surface-700 dark:text-surface-200">{item.originalName}</td>
                    <td className="px-6 py-4 text-surface-500 dark:text-surface-400">{formatFileSize(item.fileSize)}</td>
                    <td className="px-6 py-4 text-surface-500 dark:text-surface-400">{formatDate(item.createdAt)}</td>
                    <td className="px-6 py-4">
                      {deleteConfirm === item._id ? (
                        <div className="flex items-center gap-2 animate-scale-in">
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="rounded-lg bg-surface-100 px-3 py-1.5 text-xs font-semibold text-surface-600 hover:bg-surface-200 dark:bg-surface-700 dark:text-surface-300 dark:hover:bg-surface-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <a
                            href={`/generated/${item.generatedFile}`}
                            download
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-all duration-300 hover:bg-emerald-100 hover:scale-105 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download
                          </a>
                          <button
                            onClick={() => setDeleteConfirm(item._id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition-all duration-300 hover:bg-red-100 hover:scale-105 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

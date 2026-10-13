export default function Footer() {
  return (
    <footer className="border-t border-surface-200/60 bg-white/50 py-6 dark:border-surface-700/60 dark:bg-surface-950/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-surface-500 dark:text-surface-400">
            &copy; {new Date().getFullYear()} File & Form Transformer. Built with React & Tailwind CSS.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-surface-400 dark:text-surface-500">
              Press <kbd className="rounded border border-surface-300 bg-surface-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-surface-600 dark:bg-surface-800">1</kbd> <kbd className="rounded border border-surface-300 bg-surface-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-surface-600 dark:bg-surface-800">2</kbd> <kbd className="rounded border border-surface-300 bg-surface-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-surface-600 dark:bg-surface-800">3</kbd> for quick navigation
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

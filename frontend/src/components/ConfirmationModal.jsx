import React from 'react';
import { Sparkles, AlertTriangle, X, RefreshCw } from 'lucide-react';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  type = 'info' // 'info' | 'danger' | 'warning'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={loading ? undefined : onClose}></div>

      {/* Modal Box */}
      <div className="w-full max-w-md glass-panel p-6 sm:p-8 rounded-2xl border border-slate-205 dark:border-slate-800 shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        {!loading && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-500 hover:text-slate-805 dark:hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Icon Header */}
        <div className="flex items-center justify-center mb-5">
          {type === 'info' ? (
            <div className="bg-brand-500/10 text-brand-655 text-brand-600 dark:text-brand-400 p-3.5 rounded-2xl border border-brand-500/20">
              <Sparkles className="h-6 w-6" />
            </div>
          ) : (
            <div className="bg-red-50/10 dark:bg-red-500/10 text-red-655 dark:text-red-400 p-3.5 rounded-2xl border border-red-500/20">
              <AlertTriangle className="h-6 w-6" />
            </div>
          )}
        </div>

        {/* Text */}
        <div className="text-center mb-6">
          <h3 className="text-slate-905 dark:text-white text-slate-900 font-extrabold text-lg sm:text-xl">
            {title}
          </h3>
          <p className="text-slate-555 dark:text-slate-400 text-slate-500 text-sm mt-2 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 btn-secondary text-sm py-2.5 rounded-xl justify-center"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 btn-primary text-sm py-2.5 rounded-xl justify-center ${
              type === 'danger' ? 'from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-red-500/10' : ''
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

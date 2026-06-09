export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  variant = 'primary',
  isLoading = false,
}) {
  if (!isOpen) return null;

  const variantClasses = {
    primary: 'bg-plm-pink text-plm-charcoal shadow-[4px_4px_0px_0px_rgba(33,33,33,1)] hover:bg-plm-charcoal hover:text-white',
    danger: 'bg-red-500 text-white shadow-[4px_4px_0px_0px_rgba(33,33,33,1)] hover:bg-plm-charcoal',
  };

  const confirmButtonClass = variantClasses[variant] || variantClasses.primary;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-plm-charcoal bg-opacity-40 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal centering trick */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal panel */}
        <div className="inline-block align-middle bg-white border-4 border-plm-charcoal rounded-[40px] shadow-[20px_20px_0px_0px_rgba(33,33,33,1)] text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-8 pt-10 pb-8">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-3xl font-serif font-bold text-plm-charcoal lowercase italic mb-6" id="modal-title">
                  {title}<span className="text-plm-pink">.</span>
                </h3>
                <div className="mt-2">
                  <div className="text-sm font-medium text-plm-charcoal/70 leading-relaxed uppercase tracking-widest">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-plm-cream px-8 py-6 flex flex-col sm:flex-row-reverse gap-4">
            <button
              type="button"
              disabled={isLoading}
              className={`w-full inline-flex justify-center border-2 border-plm-charcoal rounded-full px-8 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-300 active:shadow-none active:translate-x-1 active:translate-y-1 ${confirmButtonClass} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={onConfirm}
            >
              {isLoading ? 'Wait...' : confirmLabel}
            </button>
            <button
              type="button"
              disabled={isLoading}
              className="w-full inline-flex justify-center border-2 border-plm-charcoal rounded-full px-8 py-3 bg-white text-xs font-bold uppercase tracking-widest text-plm-charcoal hover:bg-plm-charcoal hover:text-white transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(33,33,33,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
              onClick={onClose}
            >
              {cancelLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

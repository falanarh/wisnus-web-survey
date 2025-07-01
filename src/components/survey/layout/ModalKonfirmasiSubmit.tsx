import React from "react";

const ModalKonfirmasiSubmit = ({ open, onCancel, onConfirm, sessionId }: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  sessionId?: string | null;
}) => {
  if (!open) return null;
  const noSession = !sessionId;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 mx-6 max-w-md w-full flex flex-col items-center animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4 shadow">
          <svg className="w-8 h-8 text-blue-500 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2 text-center">
          {noSession ? 'Tidak Bisa Submit' : 'Selesaikan Survei?'}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
          {noSession
            ? 'Anda belum memulai survei. Silakan mulai survei terlebih dahulu sebelum submit.'
            : 'Pastikan semua jawaban sudah benar. Setelah submit, Anda tidak dapat mengubah jawaban.'}
        </p>
        <div className={`flex gap-4 w-full ${noSession ? 'justify-center' : ''}`}>
          <button
            onClick={onCancel}
            className={`py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition ${
              noSession ? 'px-8' : 'flex-1'
            }`}
          >
            Batal
          </button>
          {!noSession && (
            <button
              onClick={onConfirm}
              className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
            >
              Ya, Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalKonfirmasiSubmit; 
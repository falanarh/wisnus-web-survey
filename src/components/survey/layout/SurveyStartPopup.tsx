import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { validateUniqueSurveyCode } from '@/services/survey/surveyService';

interface SurveyStartPopupProps {
  darkMode: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const SurveyStartPopup: React.FC<SurveyStartPopupProps> = ({
  darkMode,
  onConfirm,
  onCancel,
  isLoading
}) => {
  const [uniqueCode, setUniqueCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    if (value.length <= 5) {
      setUniqueCode(value);
      setCodeError('');
    }
  };

  const handleConfirm = async () => {
    if (!uniqueCode.trim()) {
      setCodeError('Kode unik harus diisi');
      return;
    }
    if (uniqueCode.length !== 5) {
      setCodeError('Kode unik harus terdiri dari 5 karakter');
      return;
    }
    setIsValidating(true);
    setCodeError('');
    try {
      const response = await validateUniqueSurveyCode(uniqueCode);
      if (response.success) {
        localStorage.setItem('uniqueSurveyCode', uniqueCode);
        onConfirm();
      } else {
        setCodeError(response.message || 'Kode unik tidak valid');
      }
    } catch {
      setCodeError('Terjadi kesalahan saat memvalidasi kode');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`w-full max-w-md rounded-lg shadow-xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="p-6">
          <div className="flex items-start mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className={`text-lg font-semibold mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Mulai Survei?
              </h3>
              <p className={`text-sm mb-4 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Anda akan memulai sesi survei baru. Pastikan Anda memiliki waktu yang cukup untuk menyelesaikan survei ini.
              </p>
              
              <div className="mt-4">
                <label
                  htmlFor="uniqueCode"
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Masukkan Kode Unik (5 Karakter)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="uniqueCode"
                    value={uniqueCode}
                    onChange={handleInputChange}
                    maxLength={5}
                    className={`w-full px-3 py-2 border rounded-md uppercase tracking-wider font-mono ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      codeError ? 'border-red-500' : ''
                    }`}
                    placeholder="XXXXX"
                    disabled={isValidating || isLoading}
                  />
                  <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {uniqueCode.length}/5
                  </div>
                </div>
                {codeError && (
                  <p className="mt-2 text-sm text-red-500">{codeError}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                darkMode 
                  ? 'text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              disabled={isValidating || isLoading}
            >
              Nanti Saja
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading || isValidating}
              className={`px-4 py-2 text-sm font-medium rounded-md 
                bg-blue-600 text-white hover:bg-blue-700 
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center
              `}
            >
              {isLoading || isValidating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isValidating ? 'Memvalidasi...' : 'Memulai...'}
                </>
              ) : (
                'Mulai Sekarang'
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SurveyStartPopup;
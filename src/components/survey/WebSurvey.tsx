"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import PersetujuanTab from './tabs/PersetujuanTab';
import SurveiTab from './tabs/SurveiTab';
import KarakteristikTab from './tabs/KarakteristikTab';
import SurveyStartPopup from './layout/SurveyStartPopup';
import { SurveyProvider } from '@/context/SurveyContext';
import { useTheme } from '@/components/other/ThemeProvider';
import SurveyLayout from './layout/SurveyLayout';
import { startSurveySession, submitSurveyResponse, updateTimeConsumed } from '@/services/survey/surveyService';
import { getUserData, updateUserProperty } from '@/services/auth';

const WebSurvey = () => {
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();
  
  // Initialize activeTab with a function to prevent unnecessary initial renders
  const [activeTab, setActiveTab] = useState(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      return localStorage.getItem('surveyActiveTab') || 'persetujuan';
    }
    return 'persetujuan';
  });

  const [showStartPopup, setShowStartPopup] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('surveySessionStarted') === 'true';
    }
    return false;
  });

  const [timeConsumed, setTimeConsumed] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('timeConsumed');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Error parsing timeConsumed from localStorage:', e);
        }
      }
    }
    return { survei: 0, karakteristik: 0 };
  });
  const lastTab = React.useRef('persetujuan');
  const lastSwitchTime = React.useRef(Date.now());
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Ambil sessionId dari userData
  useEffect(() => {
    const userData = getUserData();
    if (userData?.activeSurveySessionId) {
      setSessionId(userData.activeSurveySessionId);
      console.log(`[LOG] SessionId diambil dari userData: ${userData.activeSurveySessionId}`);
    }
  }, []);

  // Monitor sessionId changes
  useEffect(() => {
    console.log(`[LOG] SessionId state berubah: ${sessionId}`);
  }, [sessionId]);

  // Inisialisasi timer saat pertama kali masuk ke tab survei/karakteristik
  useEffect(() => {
    // Hanya inisialisasi jika ini adalah pertama kali masuk ke tab survei/karakteristik
    if ((activeTab === 'survei' || activeTab === 'karakteristik') && 
        lastTab.current !== activeTab &&
        (lastTab.current === 'persetujuan' || 
         (lastTab.current === 'survei' && activeTab === 'karakteristik') ||
         (lastTab.current === 'karakteristik' && activeTab === 'survei'))) {
      lastTab.current = activeTab;
      lastSwitchTime.current = Date.now();
      console.log(`[LOG] Inisialisasi timer pada tab '${activeTab}'`);
    }
  }, [activeTab]);

  // Update waktu konsumsi saat tab berpindah
  const handleTabChange = async (tab: string) => {
    const now = Date.now();
    console.log(`[LOG] handleTabChange dipanggil: dari '${lastTab.current}' ke '${tab}'`);
    console.log(`[LOG] sessionId: ${sessionId}`);
    console.log(`[LOG] lastTab.current: ${lastTab.current}`);
    
    // Update waktu untuk tab sebelumnya jika itu adalah survei atau karakteristik
    if (lastTab.current === 'survei' || lastTab.current === 'karakteristik') {
      console.log(`[LOG] Kondisi update waktu terpenuhi untuk tab: ${lastTab.current}`);
      
      const prevKey = lastTab.current as 'survei' | 'karakteristik';
      const timeSpent = now - lastSwitchTime.current;
      const updated = {
        ...timeConsumed,
        [prevKey]: timeConsumed[prevKey] + timeSpent
      };
      
      console.log(`[LOG] Waktu yang dihabiskan di tab '${prevKey}': ${timeSpent}ms`);
      console.log(`[LOG] Total waktu tab '${prevKey}': ${updated[prevKey]}ms`);
      console.log(`[LOG] Data yang akan dikirim:`, updated);
      
      if (sessionId) {
        console.log(`[LOG] sessionId ada, akan memanggil updateTimeConsumed...`);
        try {
          const result = await updateTimeConsumed(sessionId, updated);
          console.log(`[LOG] Hasil updateTimeConsumed:`, result);
          if (result.success) {
            console.log(`[LOG] Update waktu tab '${prevKey}' berhasil:`, updated[prevKey], 'ms');
          } else {
            console.error(`[LOG] Update waktu tab '${prevKey}' gagal:`, result.message);
          }
        } catch (error) {
          console.error('[LOG] Error updating time consumed:', error);
        }
      } else {
        console.log(`[LOG] sessionId tidak ada, tidak akan memanggil updateTimeConsumed`);
      }
      setTimeConsumed(updated);
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('timeConsumed', JSON.stringify(updated));
        console.log(`[LOG] localStorage timeConsumed diupdate:`, updated);
      }
    } else {
      console.log(`[LOG] Kondisi update waktu TIDAK terpenuhi. lastTab.current: ${lastTab.current}`);
    }
    
    // Update lastTab dan lastSwitchTime untuk tab baru
    lastTab.current = tab;
    lastSwitchTime.current = now;
    console.log(`[LOG] lastTab diupdate ke: ${tab}, lastSwitchTime diupdate ke: ${now}`);
    
    // Lanjutkan logika ganti tab
    if ((tab === 'survei' || tab === 'karakteristik') && !sessionStarted) {
      console.log(`[LOG] Menampilkan popup start survey`);
      setShowStartPopup(true);
      return;
    }
    setActiveTab(tab);
    localStorage.setItem('surveyActiveTab', tab);
    console.log(`[LOG] activeTab diupdate ke: ${tab}`);
  };

  // Update terakhir saat user menutup tab
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!sessionId) return;
      const now = Date.now();
      const prevKey = lastTab.current as 'survei' | 'karakteristik';
      const updated = { ...timeConsumed };
      if (lastTab.current === 'survei' || lastTab.current === 'karakteristik') {
        updated[prevKey] += now - lastSwitchTime.current;
        lastSwitchTime.current = now;
        console.log(`[LOG] Sebelum unload, waktu tab '${prevKey}':`, updated[prevKey], 'ms');
      }
      if (navigator.sendBeacon && sessionId) {
        navigator.sendBeacon(
          `${process.env.NEXT_PUBLIC_API_URL}/api/survey-sessions/${sessionId}/time-consumed`,
          new Blob([JSON.stringify(updated)], { type: 'application/json' })
        );
        console.log(`[LOG] sendBeacon dipanggil untuk tab '${prevKey}' dengan nilai:`, updated);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [sessionId, timeConsumed]);

  const handleStartConfirm = async () => {
    try {
      setIsStarting(true);
      console.log(`[LOG] Memulai pembuatan sesi survei...`);
      const response = await startSurveySession();

      if (response.success && response.data) {
        console.log(`[LOG] Sesi survei berhasil dibuat:`, response.data);
        setSessionStarted(true);
        localStorage.setItem('surveySessionStarted', 'true');
        
        // Update user data dengan sessionId baru
        const updateSuccess = updateUserProperty('activeSurveySessionId', response.data._id);
        console.log(`[LOG] Update userData dengan sessionId: ${response.data._id}, success: ${updateSuccess}`);
        
        // Update sessionId state immediately
        setSessionId(response.data._id);
        console.log(`[LOG] SessionId state diupdate: ${response.data._id}`);

        // Submit kode unik ke sesi survei baru
        const uniqueCode = localStorage.getItem('uniqueSurveyCode');
        if (uniqueCode) {
          console.log(`[LOG] Submitting kode unik: ${uniqueCode}`);
          await submitSurveyResponse(response.data._id, {
            question_code: 'UCODE',
            valid_response: uniqueCode,
          });
        }

        // Close popup and switch to karakteristik tab
        setShowStartPopup(false);
        setActiveTab('karakteristik');
        localStorage.setItem('surveyActiveTab', 'karakteristik');
        toast.success('Sesi survei berhasil dimulai');
      } else {
        throw new Error(response.message || 'Gagal memulai sesi survei');
      }
    } catch (error) {
      console.error(`[LOG] Error saat membuat sesi survei:`, error);
      toast.error(error instanceof Error ? error.message : 'Gagal memulai sesi survei');
      setActiveTab('persetujuan');
      localStorage.setItem('surveyActiveTab', 'persetujuan');
    } finally {
      setIsStarting(false);
    }
  };

  const handleStartCancel = () => {
    setShowStartPopup(false);
    setActiveTab('persetujuan');
    localStorage.setItem('surveyActiveTab', 'persetujuan');
  };

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      const userData = getUserData();
      if (userData?.activeSurveySessionId) {
        setSessionStarted(true);
        localStorage.setItem('surveySessionStarted', 'true');
      }
    };
    
    checkExistingSession();
  }, []);

  const isDarkMode = theme === 'dark';

  const tabs = [
    { id: 'persetujuan', label: 'Persetujuan' },
    { id: 'karakteristik', label: 'Karakteristik Responden' },
    { id: 'survei', label: 'Survei' },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'persetujuan':
        return <PersetujuanTab darkMode={isDarkMode} />;
      case 'survei':
        return <SurveiTab darkMode={isDarkMode} />;
      case 'karakteristik':
        return <KarakteristikTab darkMode={isDarkMode} />;
      default:
        return <PersetujuanTab darkMode={isDarkMode} />;
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <SurveyProvider>
      <SurveyLayout
        darkMode={isDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        tabs={tabs}
      >
        {renderActiveTab()}
        {showStartPopup && (
          <SurveyStartPopup
            darkMode={isDarkMode}
            onConfirm={handleStartConfirm}
            onCancel={handleStartCancel}
            isLoading={isStarting}
          />
        )}
      </SurveyLayout>
    </SurveyProvider>
  );
};

export default WebSurvey;
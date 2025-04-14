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
import { startSurveySession } from '@/services/survey/surveyService';
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

  // Handle tab changes with session check
  const handleTabChange = async (tab: string) => {
    if ((tab === 'survei' || tab === 'karakteristik') && !sessionStarted) {
      setShowStartPopup(true);
      return;
    }
    
    setActiveTab(tab);
    localStorage.setItem('surveyActiveTab', tab);
  };

  const handleStartConfirm = async () => {
    try {
      setIsStarting(true);
      const response = await startSurveySession();

      if (response.success && response.data) {
        setSessionStarted(true);
        localStorage.setItem('surveySessionStarted', 'true');
        updateUserProperty('activeSurveySessionId', response.data._id);
        
        // Close popup and switch to survey tab
        setShowStartPopup(false);
        setActiveTab('survei');
        localStorage.setItem('surveyActiveTab', 'survei');
        
        toast.success('Sesi survei berhasil dimulai');
      } else {
        throw new Error(response.message || 'Gagal memulai sesi survei');
      }
    } catch (error) {
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
    { id: 'survei', label: 'Survei' },
    { id: 'karakteristik', label: 'Karakteristik Responden' },
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
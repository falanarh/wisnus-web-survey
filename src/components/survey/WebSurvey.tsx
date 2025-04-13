"use client";

import React, { useState, useEffect } from 'react';
import PersetujuanTab from './tabs/PersetujuanTab';
import SurveiTab from './tabs/SurveiTab';
import KarakteristikTab from './tabs/KarakteristikTab';
import { SurveyProvider } from '@/context/SurveyContext';
import { useTheme } from '@/components/other/ThemeProvider';
import SurveyLayout from './layout/SurveyLayout';

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

  // Handle tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem('surveyActiveTab', tab);
  };

  // Handle hydration
  useEffect(() => {
    setMounted(true);
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
        setActiveTab={handleTabChange} // Use the new handler
        tabs={tabs}
      >
        {renderActiveTab()}
      </SurveyLayout>
    </SurveyProvider>
  );
};

export default WebSurvey;
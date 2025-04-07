"use client";

import React, { useState } from 'react';
import PersetujuanTab from './tabs/PersetujuanTab';
import SurveiTab from './tabs/SurveiTab';
import KarakteristikTab from './tabs/KarakteristikTab';
import SurveyLayout from './layout/SurveyLayout';

const WebSurvey = () => {
  const [activeTab, setActiveTab] = useState('persetujuan');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    { id: 'persetujuan', label: 'Persetujuan' },
    { id: 'survei', label: 'Survei' },
    { id: 'karakteristik', label: 'Karakteristik Responden' },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'persetujuan':
        return <PersetujuanTab darkMode={darkMode} />;
      case 'survei':
        return <SurveiTab darkMode={darkMode} />;
      case 'karakteristik':
        return <KarakteristikTab darkMode={darkMode} />;
      default:
        return <PersetujuanTab darkMode={darkMode} />;
    }
  };

  return (
    <SurveyLayout
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      tabs={tabs}
    >
      {renderActiveTab()}
    </SurveyLayout>
  );
};

export default WebSurvey;
"use client";

import React, { useState } from 'react';

const WebSurveyPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('persetujuan');
    const [darkMode, setDarkMode] = useState(false);

    const tabs = [
        { id: 'persetujuan', label: 'Persetujuan' },
        { id: 'survei', label: 'Survei' },
        { id: 'karakteristik', label: 'Karakteristik Responden' },
        { id: 'reward', label: 'Reward' },
    ];

    return (
        <div className={`flex w-full h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            {/* Sidebar */}
            <aside className={`hidden md:flex flex-col basis-1/4 min-w-[250px] max-w-[300px] border-r ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white'}`}>
                {/* Sidebar Header */}
                <div className="p-8 pb-4">
                    <p className={`text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>WISNUS 2024</p>
                </div>

                {/* Sidebar Navigation */}
                <div className="flex flex-col flex-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`text-left rounded-lg my-1 mx-5 p-3 ${activeTab === tab.id
                                ? 'bg-[#05548d] text-white'
                                : darkMode
                                    ? 'text-gray-300 hover:bg-gray-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Survey Stats */}
                <div className="mt-auto p-8">
                    <div className="flex justify-around mb-6">
                        <div className="text-center">
                            <p className={`text-4xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>12</p>
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Answer</p>
                        </div>
                        <div className="text-center">
                            <p className={`text-4xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>11</p>
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Blank</p>
                        </div>
                    </div>
                    <div className="flex justify-around mb-6">
                        <div className="text-center">
                            <p className={`text-4xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>0</p>
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Error</p>
                        </div>
                        <div className="text-center">
                            <p className={`text-4xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>0</p>
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Remark</p>
                        </div>
                    </div>
                    <button className="w-full bg-teal-400 text-white py-3 rounded-md hover:bg-teal-500 transition">
                        Submit
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 w-full md:w-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} relative`}>
                {/* Header */}
                <header className={`border-b flex justify-between items-center ${darkMode ? 'border-gray-700' : 'border-gray-300'} p-7`}>
                    <h1 className={`text-2xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>
                        SURVEI WISATAWAN NUSANTARA 2024
                    </h1>

                    {/* Dark Mode Toggle */}
                    <div className="flex items-center">
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input
                                type="checkbox"
                                name="toggle"
                                id="darkModeToggle"
                                checked={darkMode}
                                onChange={() => setDarkMode(!darkMode)}
                                className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                style={{
                                    top: '0',
                                    right: darkMode ? '0' : '4px',
                                    transition: 'right 0.2s ease-in'
                                }}
                            />
                            <label
                                htmlFor="darkModeToggle"
                                className={`block overflow-hidden h-6 rounded-full cursor-pointer ${darkMode ? 'bg-blue-500' : 'bg-gray-300'
                                    }`}
                            ></label>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <section className="p-7">
                    {activeTab === 'persetujuan' && (
                        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-6 rounded-md`}>
                            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Persetujuan</h2>
                            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                                Hai, yuk ikut berpartisipasi dalam Survei Wisatawan Nusantara 2024 yang diselenggarakan oleh Badan Pusat Statistik (BPS). Anda hanya perlu meluangkan waktu sekitar 10 (sepuluh) menit untuk mengisi survei ini.
                            </p>
                            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 font-semibold`}>
                                Ayo segera isi dengan lengkap dan submit survei ini. Jadilah bagian dari responden yang BERUNTUNG dan dapatkan rewards sesuai pilihan Anda.
                            </p>


                        </div>
                    )}

                    {activeTab === 'survei' && (
                        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-6 rounded-md`}>
                            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Survei</h2>
                            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                Pertanyaan-pertanyaan survei akan ditampilkan di sini.
                            </p>


                        </div>
                    )}

                    {activeTab === 'karakteristik' && (
                        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-6 rounded-md`}>
                            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Karakteristik Responden</h2>
                            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                Form untuk data karakteristik responden.
                            </p>


                        </div>
                    )}

                    {activeTab === 'reward' && (
                        <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-6 rounded-md`}>
                            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Reward</h2>
                            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                Informasi tentang reward untuk peserta survei.
                            </p>


                        </div>
                    )}
                </section>

                {/* Tab Navigation with Arrows - Fixed at bottom */}
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10 w-1/2 bg-gray-100/50 rounded-full p-2 mb-4 flex justify-center items-center`}>
                    <div className='flex items-center justify-between'>
                        {/* Previous button */}
                        <button
                            className={`flex items-center justify-center h-10 w-10 ${tabs.findIndex(tab => tab.id === activeTab) === 0
                                ? 'opacity-50 cursor-not-allowed'
                                : 'cursor-pointer'
                                } bg-blue-600 text-white rounded-full mr-6`}
                            onClick={() => {
                                const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                                if (currentIndex > 0) {
                                    setActiveTab(tabs[currentIndex - 1].id);
                                }
                            }}
                            disabled={tabs.findIndex(tab => tab.id === activeTab) === 0}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {/* Current tab name */}
                        <div className={`text-center flex-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            {tabs.find(tab => tab.id === activeTab)?.label}
                        </div>

                        {/* Next button */}
                        <button
                            className={`flex items-center justify-center h-10 w-10 ${tabs.findIndex(tab => tab.id === activeTab) === tabs.length - 1
                                ? 'opacity-50 cursor-not-allowed'
                                : 'cursor-pointer'
                                } bg-blue-600 text-white rounded-full ml-6`}
                            onClick={() => {
                                const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                                if (currentIndex < tabs.length - 1) {
                                    setActiveTab(tabs[currentIndex + 1].id);
                                }
                            }}
                            disabled={tabs.findIndex(tab => tab.id === activeTab) === tabs.length - 1}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default WebSurveyPage;
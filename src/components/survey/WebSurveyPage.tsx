"use client";

import ThemeSwitch from '@/components/survey/ThemeSwitch';
import React, { useState } from 'react';

const WebSurvey = () => {
    const [activeTab, setActiveTab] = useState('persetujuan');
    const [darkMode, setDarkMode] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const tabs = [
        { id: 'persetujuan', label: 'Persetujuan' },
        { id: 'survei', label: 'Survei' },
        { id: 'karakteristik', label: 'Karakteristik Responden' },
    ];

    return (
        <div className={`flex w-full min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            {/* Sidebar - Hidden on mobile unless toggled */}
            <aside
                className={`${sidebarOpen ? 'fixed inset-0 z-40' : 'hidden'} md:relative md:flex md:flex-col md:basis-1/4 md:min-w-[250px] md:max-w-[300px] border-r ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white'} transition-all duration-300 ease-in-out`}
            >
                {/* Overlay for mobile - closes sidebar when clicking outside */}
                <div
                    className={`${sidebarOpen ? 'block fixed inset-0 bg-black bg-opacity-50 z-30' : 'hidden'} md:hidden`}
                    onClick={() => setSidebarOpen(false)}
                ></div>

                {/* Sidebar content container */}
                <div className={`relative h-full w-[85vw] max-w-[300px] ${darkMode ? 'bg-gray-800' : 'bg-white'} z-40 md:w-auto md:max-w-none flex flex-col`}>
                    {/* Close button - mobile only */}
                    <button
                        className="absolute top-4 right-4 md:hidden text-gray-500 hover:text-gray-700"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Sidebar Header */}
                    <div className="p-8 pb-4">
                        <p className={`text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>WISNUS 2024</p>
                    </div>

                    {/* Sidebar Navigation */}
                    <div className="flex flex-col flex-1 overflow-y-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`text-left rounded-lg my-1 mx-5 p-3 ${activeTab === tab.id
                                    ? 'bg-blue-800 text-white'
                                    : darkMode
                                        ? 'text-gray-300 hover:bg-gray-700'
                                        : 'text-[#565656] hover:bg-gray-100'
                                    }`}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setSidebarOpen(false); // Close sidebar on mobile after selection
                                }}
                            >
                                <p className='text-md font-bold'>
                                    {tab.label}
                                </p>
                                {tab.label === 'Persetujuan' && (
                                    <p className='text-sm'>
                                        {tab.label}
                                    </p>
                                )}

                                {tab.label === 'Karakteristik Responden' && (
                                    <p className='text-sm'>
                                        {tab.label}
                                    </p>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Survey Stats */}
                    <div className="mt-auto p-8">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="text-center">
                                <p className={`text-4xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>12</p>
                                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Answer</p>
                            </div>
                            <div className="text-center">
                                <p className={`text-4xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>11</p>
                                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Blank</p>
                            </div>
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
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 w-full md:w-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} relative`}>
                {/* Header */}
                <header className={`border-b flex justify-between items-center ${darkMode ? 'border-gray-700' : 'border-gray-300'} p-4 md:p-7`}>
                    {/* Mobile sidebar toggle button */}
                    {!sidebarOpen && (<button
                        className={`md:hidden p-2 rounded-md ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-700'} shadow-md`}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>)}

                    <h1 className={`text-lg md:text-2xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-600'} ml-3 md:ml-0`}>
                        SURVEI WISATAWAN NUSANTARA 2024
                    </h1>

                    {/* Dark Mode Toggle - Replaced with new component */}
                    <div className="flex items-center">
                        <ThemeSwitch
                            checked={darkMode}
                            onChange={() => setDarkMode(!darkMode)}
                        />
                    </div>
                </header>

                {/* Content */}
                <section className="overflow-hidden h-[calc(100vh-89px)] pb-24 md:pb-20">
                    <div className="flex flex-col h-full overflow-y-auto">
                        {activeTab === 'persetujuan' && (
                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 md:p-6`}>
                                <div className={`flex flex-col justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 md:p-6 rounded-md shadow-sm ${darkMode ? 'text-gray-300' : 'text-[#565656]'} text-justify`}>
                                    <h2 className={`mb-4 text-base md:text-lg font-medium`}>
                                        Hai, yuk ikut berpartisipasi dalam Survei Wisatawan Nusantara 2024 yang diselenggarakan oleh Badan Pusat Statistik (BPS). Anda hanya perlu meluangkan waktu sekitar 10 (sepuluh) menit untuk mengisi survei ini.
                                    </h2>

                                    <p className={`mb-6 font-bold text-base md:text-lg`}>
                                        Ayo segera isi dengan lengkap dan submit survei ini. Jadilah bagian dari responden yang BERUNTUNG dan dapatkan rewards sesuai pilihan Anda.
                                    </p>

                                    <p className={`mb-6 text-base`}>
                                        Dengan mengikuti survei ini, Anda memberikan persetujuan kepada BPS untuk menyimpan dan menganalisis jawaban atas pertanyaan survei. Mohon kerja samanya untuk menjawab pertanyaan berikut secara benar.
                                    </p>

                                    <p className={`mb-6 text-base`}>
                                        Kerahasiaan jawaban Anda dilindungi Undang-undang No.16 Tahun 1997 tentang Statistik. Partisipasi dan jawaban Anda sangat bermanfaat untuk menentukan arah kebijakan kepariwisataan di Indonesia.
                                    </p>

                                    <p className="text-base">
                                        Mohon centang kotak &quot;Saya setuju&quot; dengan mengklik kotak yang tersedia dan lanjut ke halaman berikutnya dengan mengklik tombol panah kanan biru
                                        <span className="inline-flex items-center justify-center h-8 w-8 bg-blue-800 text-white rounded-full mx-2 align-middle">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                className="h-5 w-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </span>
                                        jika Anda setuju untuk memulai pengisian survei.
                                    </p>

                                </div>
                                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-5 rounded-md shadow-sm my-6 ${darkMode ? 'text-gray-300' : 'text-[#565656]'} text-justify`}>
                                    <h3 className={`text-center font-semibold mb-3 text-lg`}>Persetujuan Penggunaan Data Pribadi</h3>
                                    <h4 className={`mb-4 text-base`}>Dari Responden Survei Wisatawan Nusantara 2024</h4>

                                    <p className={`mb-4 text-base`}>
                                        Dengan penuh kesadaran dan tanpa paksaan, bersedia secara sukarela untuk memberikan informasi dan data pribadi saya yang meliputi:
                                    </p>

                                    <ol className="list-decimal pl-6 mb-6 space-y-2 text-base">
                                        <li>Nomor telepon</li>
                                        <li>Kode Provinsi dan Kabupaten/Kota asal, Kode Provinsi dan Kabupaten/Kota tujuan perjalanan (Untuk selanjutnya disebut &quot;Kode Lokasi&quot;)</li>
                                        <li>Data terkait perjalanan pada periode Januari-Maret 2024</li>
                                    </ol>
                                </div>
                            </div>
                        )}

                        {activeTab === 'survei' && (
                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-5 md:p-6 rounded-md m-4 shadow-md`}>
                                <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Survei</h2>
                                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-base`}>
                                    Pertanyaan-pertanyaan survei akan ditampilkan di sini.
                                </p>
                            </div>
                        )}

                        {activeTab === 'karakteristik' && (
                            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-5 md:p-6 rounded-md m-4 shadow-md`}>
                                <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Karakteristik Responden</h2>
                                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-base`}>
                                    Form untuk data karakteristik responden.
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Tab Navigation with Arrows - Fixed at bottom - Responsive width */}
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10 w-[90%] md:w-1/2 ${darkMode ? 'bg-gray-700/45' : 'bg-[#b3b3b345]'} backdrop-blur-sm rounded-full p-2 mb-4 flex justify-center items-center`}>
                    <div className='flex items-center justify-between px-4 gap-1 md:gap-3'>
                        {/* Previous button */}
                        {activeTab !== "persetujuan" && (<button
                            className={`flex items-center justify-center h-8 w-8 md:h-10 md:w-10 ${tabs.findIndex(tab => tab.id === activeTab) === 0
                                ? 'opacity-50 cursor-not-allowed'
                                : 'cursor-pointer'
                                } bg-blue-800 text-white rounded-full`}
                            onClick={() => {
                                const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                                if (currentIndex > 0) {
                                    setActiveTab(tabs[currentIndex - 1].id);
                                }
                            }}
                            disabled={tabs.findIndex(tab => tab.id === activeTab) === 0}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5 md:h-6 md:w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>)}

                        {/* Tab name - visible on all devices */}
                        <div className={`text-center ${darkMode ? 'text-gray-200' : 'text-gray-700'} font-medium truncate px-2`}>
                            {tabs.find(tab => tab.id === activeTab)?.label}
                        </div>

                        {/* Next button */}
                        {activeTab !== "karakteristik" && (<button
                            className={`flex items-center justify-center h-8 w-8 md:h-10 md:w-10 ${tabs.findIndex(tab => tab.id === activeTab) === tabs.length - 1
                                ? 'opacity-50 cursor-not-allowed'
                                : 'cursor-pointer'
                                } bg-blue-800 text-white rounded-full`}
                            onClick={() => {
                                const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                                if (currentIndex < tabs.length - 1) {
                                    setActiveTab(tabs[currentIndex + 1].id);
                                }
                            }}
                            disabled={tabs.findIndex(tab => tab.id === activeTab) === tabs.length - 1}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5 md:h-6 md:w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>)}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default WebSurvey;
"use client";

import ThemeSwitch from '@/components/survey/ThemeSwitch';
import React, { useState } from 'react';

const WebSurveyPage = () => {
    const [activeTab, setActiveTab] = useState('persetujuan');
    const [darkMode, setDarkMode] = useState(false);

    const tabs = [
        { id: 'persetujuan', label: 'Persetujuan' },
        { id: 'survei', label: 'Survei' },
        { id: 'karakteristik', label: 'Karakteristik Responden' },
    ];

    return (
        <div className={`flex w-full min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
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
                                ? 'bg-blue-800 text-white'
                                : darkMode
                                    ? 'text-gray-300 hover:bg-text-[#565656]'
                                    : 'text-[#565656] hover:bg-gray-100'
                                }`}
                            onClick={() => setActiveTab(tab.id)}
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

                    {/* Dark Mode Toggle - Replaced with new component */}
                    <div className="flex items-center">
                        <ThemeSwitch
                            checked={darkMode}
                            onChange={() => setDarkMode(!darkMode)}
                        />
                    </div>
                </header>

                {/* Content */}
                <section className="overflow-hidden h-[calc(100vh-89px)]">
                    <div className="flex flex-col h-full overflow-y-auto">
                        {activeTab === 'persetujuan' && (
                            <div className={`bg-white p-6`}>
                                <div className={`flex flex-col justify-center bg-gray-100 p-6 rounded-sm ${darkMode ? 'text-gray-300' : 'text-[#565656]'}`}>
                                    <h2 className={`mb-4`}>
                                        Hai, yuk ikut berpartisipasi dalam Survei Wisatawan Nusantara 2024 yang diselenggarakan oleh Badan Pusat Statistik (BPS). Anda hanya perlu meluangkan waktu sekitar 10 (sepuluh) menit untuk mengisi survei ini.
                                    </h2>

                                    <p className={`mb-6 font-bold`}>
                                        Ayo segera isi dengan lengkap dan submit survei ini. Jadilah bagian dari responden yang BERUNTUNG dan dapatkan rewards sesuai pilihan Anda.
                                    </p>

                                    <p className={`mb-6`}>
                                        Dengan mengikuti survei ini, Anda memberikan persetujuan kepada BPS untuk menyimpan dan menganalisis jawaban atas pertanyaan survei. Mohon kerja samanya untuk menjawab pertanyaan berikut secara benar.
                                    </p>

                                    <p className={`mb-6`}>
                                        Kerahasiaan jawaban Anda dilindungi Undang-undang No.16 Tahun 1997 tentang Statistik. Partisipasi dan jawaban Anda sangat bermanfaat untuk menentukan arah kebijakan kepariwisataan di Indonesia.
                                    </p>

                                    <p>
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
                                <div className={`bg-gray-100 p-4 rounded-sm my-8 ${darkMode ? 'text-gray-300' : 'text-[#565656]'}`}>
                                    <h3 className={`text-center font-semibold mb-2`}>Persetujuan Penggunaan Data Pribadi</h3>
                                    <h4 className={`text-center mb-4 `}>Dari Responden Survei Wisatawan Nusantara 2024</h4>

                                    <p className={`mb-4 `}>
                                        Dengan penuh kesadaran dan tanpa paksaan, bersedia secara sukarela untuk memberikan informasi dan data pribadi saya yang meliputi:
                                    </p>

                                    <ol className="list-decimal pl-6 mb-4 space-y-1">
                                        <li>Nomor telepon</li>
                                        <li>Kode Provinsi dan Kabupaten/Kota asal, Kode Provinsi dan Kabupaten/Kota tujuan perjalanan (Untuk selanjutnya disebut &quot;Kode Lokasi&quot;)</li>
                                        <li>Data terkait perjalanan pada periode Januari-Maret 2024</li>
                                    </ol>
                                </div>
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
                    </div>
                </section>

                {/* Tab Navigation with Arrows - Fixed at bottom */}
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10 w-1/2  bg-[#b3b3b345] backdrop-blur-sm rounded-full p-2 mb-4 flex justify-center items-center`}>
                    <div className='flex items-center justify-between px-4 gap-3'>
                        {/* Previous button */}
                        {activeTab !== "persetujuan" && (<button
                            className={`flex items-center justify-center h-10 w-10 ${tabs.findIndex(tab => tab.id === activeTab) === 0
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
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>)}

                        {/* Current tab name */}
                        <div className={`text-center flex-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'} font-medium`}>
                            {tabs.find(tab => tab.id === activeTab)?.label}
                        </div>

                        {/* Next button */}
                        {activeTab !== "karakteristik" && (<button
                            className={`flex items-center justify-center h-10 w-10 ${tabs.findIndex(tab => tab.id === activeTab) === tabs.length - 1
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
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>)}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default WebSurveyPage;
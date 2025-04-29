import React from 'react';

interface PersetujuanTabProps {
  darkMode: boolean;
}

const PersetujuanTab: React.FC<PersetujuanTabProps> = ({ darkMode }) => {
  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 md:p-6`}>
      <div className={`flex flex-col justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 md:p-6 rounded-md shadow-sm ${darkMode ? 'text-gray-300' : 'text-[#565656]'} text-justify`}>
        <h2 className={`mb-4 text-base md:text-lg font-medium`}>
          Hai, yuk ikut berpartisipasi dalam Survei Wisatawan Nusantara 2025 yang diselenggarakan oleh Badan Pusat Statistik (BPS). Anda hanya perlu meluangkan waktu sekitar 10 (sepuluh) menit untuk mengisi survei ini.
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
        <h4 className={`mb-4 text-base`}>Dari Responden Survei Wisatawan Nusantara 2025</h4>

        <p className={`mb-4 text-base`}>
          Dengan penuh kesadaran dan tanpa paksaan, bersedia secara sukarela untuk memberikan informasi dan data pribadi saya yang meliputi:
        </p>

        <ol className="list-decimal pl-6 mb-6 space-y-2 text-base">
          <li>Nomor telepon</li>
          <li>Kode Provinsi dan Kabupaten/Kota asal, Kode Provinsi dan Kabupaten/Kota tujuan perjalanan (Untuk selanjutnya disebut &quot;Kode Lokasi&quot;)</li>
          <li>Data terkait perjalanan pada periode Januari-Maret 2025</li>
        </ol>
      </div>
    </div>
  );
};

export default PersetujuanTab;
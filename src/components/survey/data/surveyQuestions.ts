import { Question } from "@/service/types/Question";

export const surveyQuestions: Question[] = [
  {
    code: "S001",
    text: "Nomor handphone",
    type: "text",
    validation: {
      required: true,
      pattern: "/^(0[0-9]{7,14}|\+62[0-9]{7,12})$/",
    },
  },
  {
    code: "S002",
    text: "Di provinsi manakah Anda tinggal?",
    type: "select",
    multiple: false,
    options: [],
    validation: {
      required: true,
    },
  },
  {
    code: "S003",
    text: "Di Kabupaten/Kota manakah Anda tinggal?",
    type: "select",
    multiple: false,
    options: [],
    validation: {
      required: true,
    },
  },
  {
    code: "S004",
    text: "Provinsi manakah yang Anda kunjungi pada periode Januari 2025 - {$currentMonth}?",
    type: "select",
    multiple: false,
    options: [],
    validation: {
      required: true,
    },
  },
  {
    code: "S005",
    text: "Kabupaten/Kota mana yang Anda kunjungi pada perjalanan tersebut?",
    type: "select",
    multiple: false,
    options: [],
    validation: {
      required: true,
    },
  },
  {
    code: "S006",
    text: "Bulan apa saja Anda melakukan perjalanan ke {$kabkot}?",
    type: "select",
    multiple: true,
    instruction: "Isian boleh lebih dari satu",
    options: [
      "Januari 2025",
      "Februari 2025",
      "Maret 2025",
      "April 2025",
      "Mei 2025",
      "Juni 2025",
      "Juli 2025",
      "Agustus 2025",
      "September 2025",
      "Oktober 2025",
      "November 2025",
      "Desember 2025",
    ],
    validation: {
      required: true,
    },
  },
  {
    code: "S007",
    text: "Untuk menjawab pertanyaan berikutnya, pilihlah salah satu bulan perjalanan yang paling Anda ingat",
    type: "select",
    multiple: false,
    options: [],
    validation: {
      required: true,
    },
  },
  {
    code: "S008",
    text: "Pada perjalanan ke {$kabkot} pada Bulan {$bulan}, apakah Anda melakukan perjalanan Pulang-Pergi di hari yang sama?",
    type: "select",
    multiple: false,
    options: ["Ya", "Tidak"],
    validation: {
      required: true,
    },
  },
  {
    code: "S009",
    text: "Berapa malam Anda melakukan perjalanan tersebut?",
    type: "text",
    unit: "malam",
    additional_info:
      "Ket: Dihitung sejak Anda meninggalkan rumah sampai kembali lagi ke rumah. Pertambahan malam ditandai dengan pergantian tanggal.",
    validation: {
      required: true,
      input_type: "number",
      min: 0,
    },
  },
  {
    code: "S010",
    text: "Motivasi utama melakukan perjalanan ke {$kabkot} pada Bulan {$bulan}:",
    type: "select",
    multiple: false,
    options: [
      {
        text: "Untuk keperluan sendiri",
      },
      {
        text: "Mengikuti perjalanan orang lain",
        additional_info:
          "Misalnya: menemani orang tua berobat, mengantar anak kejuaraan, dll.",
      },
    ],
    validation: {
      required: true,
    },
  },
  {
    code: "S011",
    text: "Maksud utama melakukan perjalanan ke {$kabkot} pada Bulan {$bulan} adalah:",
    type: "select",
    multiple: false,
    options: [
      "Profesi/Bisnis",
      "Pertemuan/Kongres/Seminar",
      "Training/Pelatihan/Diklat",
      "Berlibur/Rekreasi",
      "Kursus",
      "Kesehatan/Berobat",
      "Kecantikan/Estetika",
      "Keagamaan (Termasuk Berziarah)",
      "Mengunjungi Teman/Famili",
      "Mudik/Pulkan Hari Raya",
      "Olahraga",
      "Kesenian",
      "Belanja/Shopping",
    ],
    additional_info:
      "Maksud atau tujuan utama melakukan perjalanan adalah motif atau tujuan utama atau yang menjadi sebab utama seseorang melakukan perjalanan.",
    allow_other: true,
    validation: {
      required: true,
    },
  },
  {
    code: "S012",
    text: "Apakah dalam perjalanan ke {$kabkot} pada Bulan {$bulan} membeli paket perjalanan/liburan/tour?",
    type: "select",
    multiple: false,
    options: ["Ya", "Tidak"],
    validation: {
      required: true,
    },
  },
  {
    code: "S013",
    text: "Paket perjalanan/liburan/tour yang digunakan saat melakukan perjalanan:",
    type: "select",
    multiple: true,
    instruction: "Paling sedikit dua pilihan",
    options: [
      "Transportasi",
      "Akomodasi/Penginapan",
      "Makan & Minum",
      "Pemandu Wisata/Tour Guide",
      "Objek Wisata",
      "Lainnya",
    ],
    validation: {
      required: true,
    },
  },
  {
    code: "S014",
    text: "Berapa harga paket perjalanan/liburan/tour yang Anda beli per orang?",
    type: "text",
    unit: "Rupiah",
    validation: {
      required: true,
      input_type: "number",
      min: 0,
    },
  },
  {
    code: "S015",
    text: "Selama melakukan perjalanan ke {$kabkot} pada Bulan {$bulan}, apa akomodasi utama (paling lama) yang Anda gunakan?",
    type: "select",
    multiple: false,
    options: [
      "Hotel Bintang 4 atau 5",
      "Hotel Bintang 3",
      "Penginapan lainnya",
      "Rumah teman/keluarga",
    ],
    additional_info:
      "Ket: Bermalam di kendaraan selama dalam perjalanan seperti di mobil, kapal, kereta api, dan sejenisnya, tidak dianggap menggunakan akomodasi.",
    validation: {
      required: true,
    },
  },
  {
    code: "S016",
    text: "Angkutan utama (paling jauh) apa yang Anda gunakan selama perjalanan ke {$kabkot} pada Bulan {$bulan}?",
    type: "select",
    multiple: false,
    options: [
      {
        text: "Angkutan udara",
        additional_info: "Misalnya pesawat",
      },
      {
        text: "Angkutan laut",
        additional_info: "Misalnya Kapal laut dengan rute jauh",
      },
      {
        text: "Angkutan sungai, danau, dan penyebrangan",
        additional_info:
          "Misalnya perahu kecil yang melayani rute di perairan sungai, danau, atau kapal feri penyebrangan selat",
      },
      {
        text: "Angkutan darat - kereta api/listrik",
        additional_info: "Misalnya kereta api jarak jauh, KRL, LRT, dan MRT",
      },
      {
        text: "Angkutan darat - umum",
        additional_info: "Misalnya angkot, bus, ojek online, taksi online, dll",
      },
      {
        text: "Angkutan darat - pribadi",
        additional_info:
          "Yaitu kendaraan milik pribadi yang dipakai sendiri atau bersama rombongan",
      },
      {
        text: "Angkutan darat - sewa tanpa sopir",
        additional_info:
          "Misalnya sewa motor atau sewa mobil tidak termasuk sopir",
      },
    ],
    validation: {
      required: true,
    },
  },
  {
    code: "S017",
    text: "Kegiatan apa saja yang Anda lakukan pada perjalanan ke {$kabkot} pada Bulan {$bulan}?",
    type: "select",
    instruction: "Dapat dipilih lebih dari satu",
    multiple: true,
    options: [
      "Wisata bahari",
      "Wisata petualangan",
      "Wisata kesenian",
      "Wisata kota dan pedesaan",
      "Wisata olahraga",
      "Wisata terintegrasi",
      "Wisata belanja",
      "Ekowisata",
      "Wisata sejarah/religi",
      "Wisata kuliner",
      "MICE(Meeting, Incentive, Conference, Exhibition)",
      "Wisata kesehatan",
      "Tidak melakukan satu pun kegiatan di atas",
    ],
    validation: {
      required: true,
    },
  },
  {
    code: "S018",
    text: "Apakah Anda berniat untuk mengulangi kembali perjalanan ke {$kabkot} di masa yang akan datang dengan alasan memiliki pengalaman yang positif selama berkunjung?",
    type: "select",
    multiple: false,
    options: ["Ya", "Tidak", "Belum Tahu"],
    validation: {
      required: true,
    },
  },
  {
    code: "S019",
    text: "Akomodasi/Penginapan",
    type: "text",
    unit: "Rp",
    instruction:
      "Wajib diisi. Jika tidak ada pengeluaran, isikan 0. Jika tidak tahu, mohon perkirakan.",
    validation: {
      required: true,
      input_type: "number",
      min: 0,
    },
  },
  {
    code: "S020",
    text: "Makanan/Minuman",
    type: "text",
    unit: "Rp",
    instruction: "Wajib diisi.",
    validation: {
      required: true,
      input_type: "number",
      min: 0,
    },
  },
  {
    code: "S021",
    text: "Transportasi/Angkutan",
    type: "text",
    unit: "Rp",
    additional_info:
      "Ket: Total pengeluaran untuk transportasi selama perjalanan. Jika menggunakan angkutan pribadi, isikan pengeluaran pembelian BBM dan biaya tol.",
    instruction: "Wajib diisi. Jika tidak ada pengeluaran, isikan 0.",
    validation: {
      required: true,
      input_type: "number",
      min: 0,
    },
  },
  {
    code: "S022",
    text: "Cinderamata/Oleh-oleh/Buah Tangan",
    type: "text",
    unit: "Rp",
    instruction: "Wajib diisi. Jika tidak ada pengeluaran, isikan 0.",
    validation: {
      required: true,
      input_type: "number",
      min: 0,
    },
  },
  {
    code: "S023",
    text: "Belanja (Tidak untuk Dijual Kembali)",
    type: "text",
    unit: "Rp",
    additional_info:
      "Ket: Termasuk belanja untuk keperluan pribadi selama perjalanan, seperti sabun, pasta gigi, sikat gigi, tisu, dsb",
    instruction: "Wajib diisi. Jika tidak ada pengeluaran, isikan 0.",
    validation: {
      required: true,
      input_type: "number",
      min: 0,
    },
  },
  {
    code: "S024",
    text: "Hiburan/Rekreasi",
    type: "text",
    unit: "Rp",
    additional_info:
      "Ket: Tiket masuk objek wisata atau atraksi, seperti museum, taman, kebun binatang, candi, pendakian gunung, tari-tarian, konser, pertunjukkan, diving, dll",
    instruction: "Wajib diisi. Jika tidak ada pengeluaran, isikan 0.",
    validation: {
      required: true,
      input_type: "number",
      min: 0,
    },
  },
  {
    code: "S025",
    text: "Kesehatan/Kecantikan/Olahraga",
    type: "text",
    unit: "Rp",
    instruction: "Wajib diisi. Jika tidak ada pengeluaran, isikan 0.",
    validation: {
      required: true,
      input_type: "number",
      min: 0,
    },
  },
  {
    code: "S026",
    text: "Pemandu Wisata/Tour Guide",
    type: "text",
    unit: "Rp",
    instruction: "Wajib diisi. Jika tidak ada pengeluaran, isikan 0.",
    validation: {
      required: true,
      input_type: "number",
      min: 0,
    },
  },
  {
    code: "S027",
    text: "Biaya Lainnya",
    type: "text",
    unit: "Rp",
    instruction: "Wajib diisi. Jika tidak ada pengeluaran, isikan 0.",
    validation: {
      required: true,
      input_type: "number",
      min: 0,
    },
  },
  {
    code: "S028",
    text: "Pengeluaran sebelum perjalanan",
    type: "text",
    unit: "Rp",
    additional_info:
      "Misalnya: pembelian pakaian dan makanan untuk keberangkatan wisata, buah tangan untuk teman/keluarga di daerah tujuan, stok obat, perawatan kendaraan sebelum perjalanan, dll.",
    instruction: "Wajib diisi. Jika tidak ada pengeluaran, isikan 0.",
    validation: {
      required: true,
      input_type: "number",
      min: 0,
    },
  },
  {
    code: "S029",
    text: "Pengeluaran setelah perjalanan",
    type: "text",
    unit: "Rp",
    additional_info:
      "Misalnya: laundry pakaian pada saat pulang, perawatan kendaraan setelah perjalanan, dll.",
    instruction: "Wajib diisi. Jika tidak ada pengeluaran, isikan 0.",
    validation: {
      required: true,
      input_type: "number",
      min: 0,
    },
  },
];

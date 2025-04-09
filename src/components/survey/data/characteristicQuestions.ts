import { Question } from "@/service/types/Question";

export const characteristicQuestions: Question[] = [
  {
    code: "KR001",
    text: "Jenis kelamin",
    type: "select",
    options: ["Laki-laki", "Perempuan"],
    validation: {
      required: true,
    },
  },
  {
    code: "KR002",
    text: "Usia",
    type: "text",
    unit: "tahun",
    additional_info: "Berdasarkan ulang tahun terakhir",
    validation: {
      required: true,
      input_type: "number",
      min: 0,
      max: 120,
    },
  },
  {
    code: "KR003",
    text: "Jenjang pendidikan tertinggi yang ditamatkan",
    type: "select",
    multiple: false,
    options: [
      "Tidak/Belum Sekolah/Tidak Tamat SD/MI",
      "SD/MI",
      "SMP/MTs",
      "SMA/MA/SMK",
      "D1/D2/D3",
      "D4/S1",
      "S2/S3",
    ],
    validation: {
      required: true,
    },
  },
  {
    code: "KR004",
    text: "Apa pekerjaan utama atau aktivitas utama Anda?",
    type: "select",
    multiple: false,
    options: [
      "Manajer/Pimpinan Organisasi",
      "Profesional",
      "Teknisi dan Asisten Profesional",
      "Tenaga Tata Usaha",
      "Tenaga Usaha Jasa dan Tenaga Penjualan",
      "Pekerja Terampil Pertanian, Kehutanan, dan Perikanan",
      "Operator dan Perakit Mesin",
      "Pekerja Kasar",
      "TNI dan Polri",
      "Mengurus Rumah Tangga",
      "Pensiunan",
      "Tidak Bekerja",
    ],
    additional_info:
      "Contoh kasus untuk ASN: \nManajer, yaitu Deputi, Direktur, Gubernur, Walikota, Bupati, Menteri. \nProfesional, yaitu Dosen, Guru, Statistisi. \nTeknisi, yaitu Pengawas perbatasan, Petugas imigrasi, Petugas bea cukai.",
    validation: {
      required: true,
    },
  },
  {
    code: "KR005",
    text: "Deskripsikan pekerjaan Anda",
    type: "text",
    additional_info:
      "Contoh: \nMengajar anak SD. \nSekretaris di Kantor kecamatan.",
    validation: {
      required: true,
    },
  },
  {
    code: "KR006",
    text: "Apakah Anda menerapkan prinsip eco-friendly saat melakukan perjalanan?",
    type: "select",
    multiple: false,
    options: ["Ya", "Tidak", "Kadang-kadang", "Tidak bersedia menjawab"],
    additional_info:
      "Misalnya: Mengurangi penggunaan plastik, bijak menggunakan energi, membuang sampah pada tempatnya, dll.",
    validation: {
      required: true,
    },
  },
];

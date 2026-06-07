import fs from 'fs';
import path from 'path';

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }
  Object.assign(target || {}, source);
  return target;
}

function updateDict(lang, data) {
  const file = path.join(process.cwd(), `src/i18n/dictionaries/${lang}.json`);
  let dict = {};
  if (fs.existsSync(file)) {
    dict = JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  
  dict = deepMerge(dict, data);
  
  fs.writeFileSync(file, JSON.stringify(dict, null, 2));
}

const en = {
  about: {
    mission: {
      tag: "Our Mission",
      title: "Creating Inspiring Journeys",
      points: [
        "Delivering exceptional service quality.",
        "Tailoring solutions to unique client needs.",
        "Ensuring safety and comfort at all times.",
        "Building long-term partnerships based on trust."
      ]
    },
    vision: {
      tag: "Our Vision",
      title: "Premier Travel Service Provider",
      points: [
        "To become the top choice for corporate travels.",
        "To continuously innovate our service offerings.",
        "To expand our reach globally with local expertise."
      ]
    }
  }
};

const id = {
  about: {
    mission: {
      tag: "Misi Kami",
      title: "Menciptakan Perjalanan yang Menginspirasi",
      points: [
        "Memberikan kualitas layanan yang luar biasa.",
        "Menyesuaikan solusi dengan kebutuhan unik klien.",
        "Memastikan keamanan dan kenyamanan setiap saat.",
        "Membangun kemitraan jangka panjang berdasarkan kepercayaan."
      ]
    },
    vision: {
      tag: "Visi Kami",
      title: "Penyedia Layanan Perjalanan Unggulan",
      points: [
        "Menjadi pilihan utama untuk perjalanan perusahaan.",
        "Terus berinovasi dalam penawaran layanan kami.",
        "Memperluas jangkauan global kami dengan keahlian lokal."
      ]
    }
  }
};

updateDict('en', en);
updateDict('id', id);
console.log('Restored missing fields!');

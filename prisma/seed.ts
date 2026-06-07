import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const rawProjects = [
  "PT. Equine Global Jakarta outing ke Bali",
  "PT. Niagaprima Paramitra outing ke Yogyakarta",
  "BNI KC BSD outing ke Bali",
  "PT. Xsis Mitra Utama outing Ke Belitung",
  "BNI KC Melawai Raya outing ke Yogyakarta",
  "PT. Agung Toyota Pusat outing ke Bali",
  "Ecomindo Sarana Cipta outing ke Yogyakarta",
  "PT. Equine Global X Tugu Insurance booth camp",
  "BNI KC Jakarta Pusat outing ke Yogyakarta",
  "Bank Mestika Jakarta outing ke Yogyakarta",
  "Mitratel outing Ke Thailand",
  "BNI KC BSD outing ke Yogyakarta",
  "PT. Aldevco outing ke Yogyakarta",
  "PT. Equine Global outing ke Ciwidey Bandung",
  "OJK Div.DPMV outing ke Bogor",
  "BNI KC Melawai Raya outing ke Bali",
  "CH Robinson outing ke Yogyakarta",
  "PT. Equine Global Jakarta outing ke Bandung",
  "OJK Div. GPSI outing ke Bali",
  "OJK Div. DPSI outing ke Lombok",
  "BNI KC Menteng outing ke Bali",
  "PT. Agung Toyota Pusat outing ke Sumatera Barat",
  "Astra Toll JOMO outing ke Bali",
  "PU Outing ke Lombok dan Malang",
  "IELTS Presso outing ke Bali",
  "BNI CMC JMR outing ke Bali",
  "PLN ICON Plus X BRIN meeting & tour ke Yogyakarta",
  "PT. Equine Global X Hokben booth camp di Bogor",
  "BNI CMC JMR Senayan outing ke Lampung",
  "PT. Niagaprima Paramitra outing ke Bali",
  "OJK Div. DPZT RAKOR ke Banyuwangi",
  "Prodia Lab Cab. Kramat outing ke Pulau Peucang",
  "SMK N 1 Bogor study tour ke Yogyakarta",
  "SMK N 1 Bogor study tour ke Malang",
  "Manulife outing ke Belitung",
  "FPAR UP SL 1 ke Desa Wisata Dieng Kulon & Tamansari",
  "Ortax outing ke Malang",
  "Apotek Guardian outing ke Pulau Pahawang",
  "PT. Adveli outing ke Pulau Sangiang",
  "Ortax outing ke Yoyakarta dan Semarang",
  "BNI KC Melawai Raya outing ke Belitung",
  "ADP BNI KC Melawai Raya leadership training di Dieng",
  "PT. Agung Toyota Pusat outing ke Bromo dan Malang",
  "PT. Agung Toyota Cab. Jambi outing ke Bandung",
  "PT. Agung Toyota Pusat outing ke Tana Toraja",
  "Agung Podomoro Land gathering ke Pulau Harapan",
  "Pensiunan Garuda Indonesia gathering ke Yogyakarta",
  "Ekpedisi Segaris ke 46 kota dari Sabang-Merauke",
  "Telkomsel treasure hunt bersama VP, AVP dan staff",
  "PT Mardohar family gathering ke Anyer",
  "Kimia Farma outing Ke Bromo dan Malang",
  "BNI KC Melawai Raya outing ke Bandung",
  "PT. Kontak Perkasa Futures outing ke Semarang",
  "FPAR UP SL 1 ke Desa Wisata Gubuk Klakah Malang",
  "FPAR UP SL 2 ke Desa Wisata Bilebante Lombok",
  "Astra Infra Solution (AIS) team building ke Bogor",
  "Anteraja outing ke Bogor",
  "CSO BNI Cab. Melawai Raya outing ke Semarang",
  "FPAR UP SL 1 ke Desa Wisata Dieng Kulon",
  "PT. Equine Global Jakarta outing ke Yogyakarta",
  "OJK Div. GPSI outing ke Lombok",
  "OJK Div. DPSI outing ke Bali",
  "OJK Div. DPSI outing ke Cirebon-Kuningan",
  "BNI Wil 10 Outing Ke Bandung",
  "PT ODI Outing ke Bromo Malang",
  "PT KAMI outing ke Labuan Bajo",
  "PT. Xsis Mitra Utama outing Ke Ciwidey",
  "Izidata Outing ke Bali",
  "PT. Equine Global outing ke Lombok",
  "CH Robinson outing ke Dieng",
  "Ecomindo Sarana Cipta outing ke Kuala Lumpur",
  "Asian Leader outing ke Pangalengan Bandung",
  "Koperasi OJK outing ke Bali",
  "CH Robinson outing ke Bogor",
  "Anteraja Kick Off Meeting",
  "TMS Consulting Outing & Kick Of Meeting di Yogyakarta",
  "Anabatic Digital Tecknologi outing ke Bandung",
  "BNI CMC Bandung outing ke Bandung",
  "FPAR UP SL 1 ke Desa Wisata Osing Kemiren",
  "Xsis Mitra Utama Gathering ke Yogyakarta",
  "Giga Cover Singapore Outing ke Bali",
  "OJK DPZT Outing ke Lampung",
  "Mitratel Outing ke Bangkok & Outing ke Lombok",
  "CH Robinson CSR ke Sentul & Sukabumi",
  "OJK Div. DPSI outing ke Ciwidey Bandung",
  "PT Teijien Frontier Outing ke Yogyakarta",
  "BNI KC Melawai Raya outing ke Yogyakarta",
  "BNI KC Mayestik Outing Ke Yogyakarta",
  "BNI KC Menteng Outing Ke Yogyakarta",
  "BNI BOP Outing ke Puncak Bogor",
  "PT Caldic Distribution Indonesia Outing ke Bandung",
  "RS Dedy Jaya Brebes Capacity Building ke Yogyakarta",
  "Soemadipradja & Taher Family Gathering ke Bandung"
];

const staticClients = [
  { name: "Equine Global", logoText: "EG", bgColor: "from-blue-700 to-indigo-800", textColor: "text-white" },
  { name: "Optima Data", logoText: "OPT", bgColor: "from-sky-900 to-slate-800", textColor: "text-white" },
  { name: "Niagaprima Paramitra", logoText: "NPP", bgColor: "from-[#0F2C59] to-[#0d274f]", textColor: "text-[#FF8225]" },
  { name: "Xsis Mitra Utama", logoText: "Xsis", bgColor: "from-[#1C1A5E] to-indigo-950", textColor: "text-white" },
  { name: "Ecomindo", logoText: "ECO", bgColor: "from-[#0092D2] to-sky-700", textColor: "text-white" },
  { name: "TMS", logoText: "TMS", bgColor: "from-teal-500 to-blue-600", textColor: "text-white" },
  { name: "Mitratel", logoText: "MT", bgColor: "from-red-600 to-red-800", textColor: "text-white" },
  { name: "BNI", logoText: "BNI", bgColor: "from-[#006675] to-teal-850", textColor: "text-[#F15A24]" },
  { name: "Astra Infra", logoText: "ASTRA", bgColor: "from-slate-100 to-slate-200", textColor: "text-[#E31E24]" },
  { name: "OJK", logoText: "OJK", bgColor: "from-[#9C2523] to-red-950", textColor: "text-[#D4AF37]" },
  { name: "BRIN", logoText: "BRIN", bgColor: "from-[#D62828] to-red-700", textColor: "text-white" },
  { name: "PLN Icon Plus", logoText: "PLN", bgColor: "from-sky-600 to-blue-700", textColor: "text-yellow-400" },
  { name: "Gigacover", logoText: "G", bgColor: "from-[#00D18B] to-emerald-600", textColor: "text-white" },
  { name: "Caldic", logoText: "CALDIC", bgColor: "from-orange-600 to-red-600", textColor: "text-white" },
  { name: "Agung Toyota", logoText: "AGUNG", bgColor: "from-amber-500 to-amber-600", textColor: "text-slate-900" },
  { name: "Kimia Farma", logoText: "KF", bgColor: "from-blue-900 to-indigo-900", textColor: "text-white" },
  { name: "Jasa Marga", logoText: "JM", bgColor: "from-[#004A8F] to-blue-800", textColor: "text-white" },
  { name: "Anteraja", logoText: "anter", bgColor: "from-[#EC008C] to-pink-600", textColor: "text-yellow-300" },
  { name: "Manulife", logoText: "ML", bgColor: "from-[#00A75A] to-emerald-600", textColor: "text-white" },
  { name: "Prodia", logoText: "Prodia", bgColor: "from-[#FFD100] to-yellow-500", textColor: "text-[#1E3060]" },
  { name: "HokBen", logoText: "HB", bgColor: "from-[#E21C26] to-red-600", textColor: "text-white" },
  { name: "PUPR", logoText: "PUPR", bgColor: "from-[#003366] to-blue-900", textColor: "text-[#FFCC00]" }
];

const testimonials = [
  { name: "Aditya Pratama", role: "HR Director", company: "PT. Equine Global Jakarta", trip: "Outing to Bali", content: "Luar biasa! Acara gathering kami di Bali kemarin dikemas sangat rapi. Dari welcoming dinner sampai team building di pantai, semua panitia F Travel sangat sigap.", rating: 5 },
  { name: "Rian Hidayat", role: "GA Manager", company: "PT. Niagaprima Paramitra", trip: "Outing to Yogyakarta", content: "Outing Jogja yang sangat berkesan! Jeep tour Merapi dan gala dinner-nya seru banget. Kerja sama tim jadi makin erat berkat game outbound yang kreatif.", rating: 5 },
  { name: "Fitri Handayani", role: "Branch Committee", company: "BNI KC BSD", trip: "Outing to Bali", content: "F Travel sukses banget bikin liburan kami di Bali jadi seru dan santai. Pelayanannya bintang lima, dari transportasi sampai hotel semuanya oke banget!", rating: 5 },
  { name: "Hendra Wijaya", role: "Employee Relations Specialist", company: "PT. Xsis Mitra Utama", trip: "Outing to Belitung", content: "Belitung trip was amazing! Hopping island, makan siang di pantai pasir putih, dan kulinernya mantap. F Travel bener-bener profesional ngurus segalanya.", rating: 5 },
  { name: "Sarah Safitri", role: "Operational Manager", company: "BNI KC Melawai Raya", trip: "Outing to Yogyakarta", content: "Sangat merekomendasikan F Travel untuk corporate outing. Koordinasi grup besar kami ke Jogja berjalan lancar, tertib, dan on-schedule!", rating: 5 },
  { name: "Budi Santoso", role: "Project Coordinator", company: "PT. Agung Toyota Pusat", trip: "Outing to Bali", content: "Gala dinner di Jimbaran dan agenda team building di Bali bener-bener top. Seluruh karyawan sangat enjoy dan puas dengan service-nya.", rating: 5 },
  { name: "Denny Setiawan", role: "CTO / Committee", company: "Ecomindo Sarana Cipta", trip: "Outing to Yogyakarta", content: "Dua jempol untuk F Travel! Team building di Jogja seru abis, program outbound interaktif dan mempererat bonding antar divisi.", rating: 5 },
  { name: "Amelia Putri", role: "L&D Specialist", company: "PT. Equine Global X Tugu Insurance", trip: "Booth Camp", content: "Kolaborasi booth camp berjalan sukses besar. Lokasinya strategis, fasilitas meeting lengkap, dan aktivitas ice breaking-nya fresh.", rating: 5 },
  { name: "Kevin Chandra", role: "Head of HR", company: "Bank Mestika Jakarta", trip: "Outing to Yogyakarta", content: "Event organizer paling responsif yang pernah kami pakai. Liburan Jogja kami lancar, aman, dan penuh keseruan dari awal sampai akhir.", rating: 5 },
  { name: "Linda Permatasari", role: "Corporate Secretary", company: "Mitratel", trip: "Outing to Thailand", content: "Outing luar negeri perdana bareng F Travel ke Thailand sukses besar! Pengurusan paspor group, akomodasi, dan guide lokal di Bangkok top banget.", rating: 5 },
  { name: "Ahmad Fauzi", role: "Department Head", company: "OJK Div.DPMV", trip: "Outing to Bogor", content: "Outing Bogor yang menyegarkan pikiran. Program outbound menantang tapi seru. Makanan enak dan vila yang disediakan sangat nyaman.", rating: 5 },
  { name: "Jessica Irene", role: "People Operations", company: "PT. Equine Global", trip: "Outing to Ciwidey Bandung", content: "Dinginnya Ciwidey langsung hangat dengan kebersamaan tim. Games outbound-nya seru banget dan mengasah problem solving kelompok.", rating: 5 }
];

const teamMembers = [
  { name: "Wahyu Prabowo", role: "Chief Executive Officer", quote: "Experienced in managing 100+ events across Indonesia.", image: "/team/wahyu_ceo.png" },
  { name: "Wiwit Novia Susanti", role: "Managing Director", quote: "Ensuring F-Travel runs efficiently and provides the best service.", image: "/team/wiwit_md.png" },
  { name: "Farras Alaydrus", role: "Event Coordinator", quote: "Specialized in planning and organizing events.", image: "/team/farras_event.png" },
  { name: "Fajri Alaydrus", role: "Tour Leader Coordinator", quote: "Committed to making every trip run perfectly.", image: "/team/fajri_tour.png" }
];

function cleanText(text: string) {
  return text.trim();
}

function parseProject(raw: string, idx: number) {
  let client = "";
  let activity = "";
  let location = "";
  let category = "Outing & Gathering"; 

  const lowercase = raw.toLowerCase();

  if (lowercase.includes("booth camp") || lowercase.includes("boot camp") || lowercase.includes("team building") || lowercase.includes("treasure hunt") || lowercase.includes("leadership training")) {
    category = "Team Building & Bootcamp";
  } else if (lowercase.includes("study tour")) {
    category = "Study & Special Tour";
  } else if (lowercase.includes("meeting") || lowercase.includes("rakor") || lowercase.includes("capacity building")) {
    category = "Meeting & Conference";
  } else if (lowercase.includes("gathering") || lowercase.includes("family gathering")) {
    category = "Outing & Gathering";
  } else if (lowercase.includes("csr")) {
    category = "Outing & Gathering";
  } else if (lowercase.includes("ekpedisi") || lowercase.includes("ekspedisi")) {
    category = "Study & Special Tour";
  }

  if (lowercase.includes("family gathering")) activity = "Family Gathering";
  else if (lowercase.includes("gathering")) activity = "Gathering";
  else if (lowercase.includes("booth camp") || lowercase.includes("boot camp")) activity = "Bootcamp";
  else if (lowercase.includes("team building")) activity = "Team Building";
  else if (lowercase.includes("study tour")) activity = "Study Tour";
  else if (lowercase.includes("kick off meeting") || lowercase.includes("kick of meeting")) activity = "Kick-Off Meeting";
  else if (lowercase.includes("rakor")) activity = "Rapat Koordinasi (RAKOR)";
  else if (lowercase.includes("meeting")) activity = "Meeting & Tour";
  else if (lowercase.includes("csr")) activity = "Corporate Social Responsibility (CSR)";
  else if (lowercase.includes("leadership training")) activity = "Leadership Training";
  else if (lowercase.includes("capacity building")) activity = "Capacity Building";
  else if (lowercase.includes("treasure hunt")) activity = "Treasure Hunt";
  else if (lowercase.includes("ekpedisi") || lowercase.includes("ekspedisi")) activity = "Expedition Roadshow";
  else if (lowercase.includes("outing")) activity = "Corporate Outing";
  else activity = "Outing";

  let locMatch = raw.match(/(?:\s[kK]e\s|\sdi\s|\sdi Desa Wisata\s|\sbersama\s)(.+)$/i);
  if (locMatch) {
    location = cleanText(locMatch[1]);
  } else {
    if (lowercase.includes("booth camp") && lowercase.includes("insurance")) {
      location = "Bogor";
    } else if (lowercase.includes("treasure hunt") && lowercase.includes("telkomsel")) {
      location = "Jakarta";
    } else {
      location = "Yogyakarta";
    }
  }

  const splitKeywords = [
    " outing", " Outing", " gathering", " Gathering", " study tour",
    " booth camp", " boot camp", " meeting", " rakor", " RAKOR",
    " leadership training", " team building", " Kick Off", " Kick Of",
    " CSR", " capacity building", " Capacity Building", " treasure hunt", " ekpedisi", " ke "
  ];

  let clientPart = raw;
  for (const kw of splitKeywords) {
    const splitIdx = clientPart.indexOf(kw);
    if (splitIdx !== -1) {
      clientPart = clientPart.substring(0, splitIdx);
      break;
    }
  }
  client = cleanText(clientPart);

  if (!client) client = "F-Travel Client";

  if (location.startsWith("Desa Wisata ")) {
    location = location.replace("Desa Wisata ", "");
  }

  if (location.endsWith(",")) {
    location = location.substring(0, location.length - 1);
  }

  return {
    client,
    activity,
    location,
    category,
    original: raw,
    year: (2023 + (idx % 3)).toString(),
    status: "PUBLISHED"
  };
}

async function main() {
  console.log('Seeding database...')

  // Clear existing items
  await prisma.portfolioProject.deleteMany();
  await prisma.client.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.travelPackage.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.user.deleteMany();

  // Create SUPER_ADMIN
  const hashedPassword = await bcrypt.hash('F-Travel2026#', 10)
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@ftravel.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  })
  
  console.log({ superAdmin })
  
  // Seed sample Destination
  const destination = await prisma.destination.create({
    data: {
      title: 'Bali',
      slug: 'bali-indonesia',
      country: 'Indonesia',
      city: 'Bali',
      description: 'The Island of the Gods, a tropical paradise featuring pristine beaches, rich heritage, and vibrant corporate facilities.',
      status: 'PUBLISHED',
      category: 'Island',
      featuredImage: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2070&auto=format&fit=crop'
    }
  })

  // Seed sample Travel Package
  const travelPackage = await prisma.travelPackage.create({
    data: {
      title: 'Bali Paradise Escape - 7 Days',
      slug: 'bali-paradise-escape-7-days',
      destinationId: destination.id,
      price: 1500.00,
      duration: 7,
      shortDescription: 'Experience the best of Bali with this 7-day tour.',
      fullDescription: 'A complete journey covering beaches, temples, and rice terraces.',
      itinerary: JSON.stringify([
        { day: 1, title: 'Arrival', description: 'Arrive and check in' },
        { day: 2, title: 'Ubud Tour', description: 'Explore Ubud' }
      ]),
      included: JSON.stringify(['Hotel', 'Breakfast', 'Tour Guide']),
      excluded: JSON.stringify(['Flights', 'Personal Expenses']),
      status: 'PUBLISHED',
      featuredImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop'
    }
  })

  console.log({ destination, travelPackage })

  // Seed site settings
  const settingsList = [
    { key: 'site_name', value: 'F Travel' },
    { key: 'contact_email', value: 'hello@ftravel.com' },
    { key: 'phone', value: '+62 (274) 555-678' },
    { key: 'whatsapp', value: '+628123456789' },
    { key: 'address', value: 'Jl. Malioboro No. 45, Yogyakarta, Indonesia' },
    { key: 'seo_description', value: 'Premium Tour Organizer, Travel Consultant, and Event Planner based in Yogyakarta.' },
    { key: 'facebook_url', value: 'https://facebook.com/ftravel' },
    { key: 'instagram_url', value: 'https://instagram.com/ftravel' },
    { key: 'twitter_url', value: 'https://twitter.com/ftravel' },
    
    // Hero config
    { key: 'hero_title', value: 'Your Next Adventure Begins with F-Travel' },
    { key: 'hero_subtitle', value: '“Find Your Experience”' },
    { key: 'hero_video', value: '/If you want to go far, go together. Celebrating Ecomindo’s Silver Milestone, 25 years of excelle.mp4' },
    
    // Stats
    { key: 'stat_customers', value: '10M+' },
    { key: 'stat_experience_years', value: '09+' },
    { key: 'stat_destinations', value: '12K' },
    { key: 'stat_rating', value: '5.0' },

    // Why Choose Us
    { key: 'why_choose_us_1_title', value: 'Safety & Legality' },
    { key: 'why_choose_us_1_desc', value: 'Operating under the official legal entity PT Dua Rasi Nusantara, ensuring your transactions and journeys are fully secured and legally protected.' },
    { key: 'why_choose_us_2_title', value: 'Experienced Team' },
    { key: 'why_choose_us_2_desc', value: 'Supported by professional Tour Leaders and Event Planners who master the field, ensuring maximum comfort and seamless execution on site.' },
    { key: 'why_choose_us_3_title', value: 'Flexible Programs' },
    { key: 'why_choose_us_3_desc', value: 'From budget requirements to itinerary specifics, everything can be flexibly customized to meet your team\'s unique operational needs.' },

    // Legal Specs
    { key: 'legal_name', value: 'PT Dua Rasi Nusantara' },
    { key: 'brand_name', value: 'F-Travel (Trip Organizer & Travel Consultant)' },
    { key: 'legal_sku', value: 'AHU-004271.AH.01.30.Tahun 2021' },
    { key: 'legal_nib', value: '0112210037644' },
    { key: 'legal_cert', value: '01122100376440001' }
  ];

  for (const s of settingsList) {
    await prisma.siteSetting.create({ data: s });
  }

  // Seed Team
  for (let i = 0; i < teamMembers.length; i++) {
    await prisma.teamMember.create({
      data: {
        ...teamMembers[i],
        order: i,
        status: "PUBLISHED"
      }
    });
  }

  // Seed Clients
  for (let i = 0; i < staticClients.length; i++) {
    await prisma.client.create({
      data: {
        name: staticClients[i].name,
        logoText: staticClients[i].logoText,
        bgColor: staticClients[i].bgColor,
        textColor: staticClients[i].textColor,
        order: i,
        status: "PUBLISHED"
      }
    });
  }

  // Seed Testimonials
  for (let i = 0; i < testimonials.length; i++) {
    await prisma.testimonial.create({
      data: {
        clientName: testimonials[i].name,
        clientRole: testimonials[i].role,
        company: testimonials[i].company,
        trip: testimonials[i].trip,
        content: testimonials[i].content,
        rating: testimonials[i].rating,
        status: "PUBLISHED"
      }
    });
  }

  // Seed 92 Portfolio Outing Projects
  const parsedProjects = rawProjects.map((raw, idx) => parseProject(raw, idx));
  for (const p of parsedProjects) {
    await prisma.portfolioProject.create({ data: p });
  }

  // Seed Gallery Images
  const categories = ["Nature", "City", "Beach", "Culture"];
  for (let i = 0; i < 12; i++) {
    await prisma.galleryImage.create({
      data: {
        url: `https://images.unsplash.com/photo-${1500000000000 + i * 100000}?q=80&w=800&auto=format&fit=crop`,
        alt: `Travel Moment ${i + 1}`,
        category: categories[i % categories.length]
      }
    });
  }

  // Clear blog tables first
  await prisma.blogPost.deleteMany();
  await prisma.blogCategory.deleteMany();

  // Seed Blog Categories
  const category1 = await prisma.blogCategory.create({
    data: { name: 'Travel Guide', slug: 'travel-guide' }
  });
  const category2 = await prisma.blogCategory.create({
    data: { name: 'Tips & Tricks', slug: 'tips-and-tricks' }
  });
  const category3 = await prisma.blogCategory.create({
    data: { name: 'Company News', slug: 'company-news' }
  });

  // Seed Blog Post
  await prisma.blogPost.create({
    data: {
      title: '7 Essential Items for Your Next Corporate Outing',
      slug: '7-essential-items-for-your-next-corporate-outing',
      excerpt: 'Prepare your team for an unforgettable outing with this comprehensive packing list and guide.',
      content: 'Planning a corporate outing requires preparation. Make sure to pack comfortable clothing, power banks, personal medicines, and team spirit! F Travel organizes everything else for you.',
      categoryId: category2.id,
      tags: 'Outing, Corporate, Guide',
      status: 'PUBLISHED',
      seoTitle: 'Essential Items for Corporate Outing | F Travel',
      seoDescription: 'Read our ultimate packing and preparation list for corporate team building outings.',
      featuredImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935&auto=format&fit=crop'
    }
  });

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

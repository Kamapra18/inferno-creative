import {
  FaCamera,
  FaPhotoVideo,
  FaRegImages,
  FaHeart,
  FaRing,
  FaGraduationCap,
  FaCalendarAlt,
  FaBirthdayCake,
  FaImage,
  FaPrint,
  FaPenNib,
} from "react-icons/fa";

export const services = [
  {
    title: "Foto & Video",
    desc: "Dokumentasi wedding, prewedding, dan event dengan hasil cinematic dan storytelling yang kuat.",
    icon: FaCamera,
    href: "/jasa-foto-video-bali",
  },
  {
    title: "Photobooth",
    desc: "Photobooth interaktif dengan hasil foto instan untuk meramaikan acara dan menciptakan pengalaman seru.",
    icon: FaPhotoVideo,
    href: "/photobooth-bali",
  },
  {
    title: "Undangan Digital",
    desc: "Undangan online modern dengan fitur lengkap seperti RSVP, galeri foto, dan musik.",
    icon: FaRegImages,
    href: "/undangan-digital-bali",
  },
];

export const serviceDokumentasi = [
  {
    title: "Wedding",
    slug: "wedding",
    desc: "Dokumentasi pernikahan dengan konsep cinematic dan storytelling.",
    icon: FaHeart,
  },
  {
    title: "Prewedding",
    slug: "prewedding",
    desc: "Sesi foto/video sebelum pernikahan dengan konsep kreatif.",
    icon: FaRing,
  },
  {
    title: "Graduation",
    slug: "graduation",
    desc: "Abadikan momen kelulusan dengan hasil profesional.",
    icon: FaGraduationCap,
  },
  {
    title: "Event",
    slug: "event",
    desc: "Dokumentasi acara kampus, gathering, dan lainnya.",
    icon: FaCalendarAlt,
  },
];

export const servicePhotobooth = [
  {
    title: "Wedding Photobooth",
    slug: "wedding",
    desc: "Photobooth untuk acara pernikahan.",
    icon: FaHeart,
  },
  {
    title: "Birthday",
    slug: "birthday",
    desc: "Photobooth seru untuk ulang tahun.",
    icon: FaBirthdayCake,
  },
  {
    title: "Graduation",
    slug: "graduation",
    desc: "Photobooth seru untuk wisuda.",
    icon: FaGraduationCap,
  },
];

export const serviceUndangan = [
  {
    title: "Undangan Digital",
    slug: "digital",
    desc: "Undangan berbasis website.",
    icon: FaImage,
  },
  {
    title: "Undangan Cetak",
    slug: "cetak",
    desc: "Desain dan cetak undangan fisik.",
    icon: FaPrint,
  },
  {
    title: "Desain Undangan",
    slug: "desain",
    desc: "Desain undangan sesuai keinginan Anda.",
    icon: FaPenNib,
  },
];

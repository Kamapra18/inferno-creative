export interface KatalogItem {
  id: number;
  category: "fotoVideo" | "photobooth" | "undangan";
  type: string;
  image: string;
  title: string;
  demoUrl?: string;
}

/* ========================= */
/* PER CATEGORY */
/* ========================= */

export const katalogFotoVideo: KatalogItem[] = [
  {
    id: 1,
    category: "fotoVideo",
    type: "yudisium",
    image: "/katalog/dokumentasi/inferno-yudisium.jpg",
    title: "Yudisium Citra Primakara",
  },
  {
    id: 2,
    category: "fotoVideo",
    type: "event",
    image: "/katalog/dokumentasi/inferno-family-event.jpg",
    title: "Upacara Nyekah",
  },
  {
    id: 6,
    category: "fotoVideo",
    type: "wedding",
    image: "/katalog/dokumentasi/inferno-wedding-mika-&-krisna.jpg",
    title: "Wedding Mika & Krisna",
  },
  {
    id: 7,
    category: "fotoVideo",
    type: "event",
    image: "/katalog/dokumentasi/inferno-model-shoot.jpg",
    title: "Model Shoot",
  },
];

export const katalogPhotobooth: KatalogItem[] = [
  // {
  //   id: 1,
  //   category: "photobooth",
  //   type: "wedding",
  //   image: "/katalog/photobooth/Inferno-wedding-krisna-&-mika.jpg",
  //   title: "Wedding Krisna & Mika",
  // },
  {
    id: 3,
    category: "photobooth",
    type: "wedding",
    image: "/katalog/photobooth/Inferno-wedding-krisna-&-mika-2.jpg",
    title: "Wedding Krisna & Mika",
  },
  {
    id: 4,
    category: "photobooth",
    type: "wedding",
    image: "/katalog/photobooth/Inferno-wedding-ikumi-&-cok.jpg",
    title: "Wedding Ikumi & Cok",
  },
  {
    id: 10,
    category: "photobooth",
    type: "event",
    image: "/katalog/photobooth/inferno-event-stt-putra-presada.jpg",
    title: "Event STT Putra Presada",
  },
  {
    id: 11,
    category: "photobooth",
    type: "event",
    image: "/katalog/photobooth/Inferno-open-campus-primakara.jpg",
    title: "Event Open Campus Primakara",
  },
  {
    id: 12,
    category: "photobooth",
    type: "wedding",
    image: "/katalog/photobooth/Inferno-wedding-yande-&-melly.jpg",
    title: "Wedding Yande & Melly",
  },
  {
    id: 13,
    category: "photobooth",
    type: "event",
    image: "/katalog/photobooth/Inferno-pameran-dkv-primakara.jpg",
    title: "Event Pameran DKV Primakara",
  },
];

export const katalogUndangan: KatalogItem[] = [
  {
    id: 5,
    category: "undangan",
    type: "digital",
    image: "/katalog/web.png",
    title: "Undangan Digital Modern",
    demoUrl:
      "https://www.inferno-production.com/undangan/tema2/index.html?to=Kamu",
  },
  {
    id: 6,
    category: "undangan",
    type: "digital",
    image: "/katalog/web1.png",
    title: "Undangan Elegan",
    demoUrl:
      "https://www.inferno-production.com/undangan/tema2/index.html?to=Kamu",
  },
  {
    id: 8,
    category: "undangan",
    type: "digital",
    image: "/katalog/web2.png",
    title: "Undangan Elegan",
    demoUrl:
      "https://www.inferno-production.com/undangan/tema2/index.html?to=Kamu",
  },
];

/* ========================= */
/* ALL (GABUNGAN) */
/* ========================= */

export const katalogAll: KatalogItem[] = [
  ...katalogFotoVideo,
  ...katalogPhotobooth,
  ...katalogUndangan,
];

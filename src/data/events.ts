export type Event = {
  id: number;
  slug: string;
  name: string;
  video?: string;
  frame: string;
  raw?: string;
};

export const events: Event[] = [
  // {
  //   id: 1,
  //   slug: "STT-Presada",
  //   name: "Ulang Tahun STT Presada",
  //   frame:
  //     "https://drive.google.com/drive/folders/1WDnfb2Raz-q51SOow_TY9hdQM7kU59iz?usp=drive_link",
  // },
  // {
  //   id: 2,
  //   slug: "Krisna-&-Mika",
  //   name: "Wedding Krisna & Mika",
  //   frame:
  //     "https://drive.google.com/drive/folders/1UHd4isEkKLVhyr8GW174t9zEXW7s6Vpf?usp=drive_link",
  // },
  // {
  //   id: 3,
  //   slug: "Yande-&-Melly",
  //   name: "Wedding Yande & Melly",
  //   frame:
  //     "https://drive.google.com/drive/folders/1CdmLTpp3yvWASTLp94PVtnVCc72oxzyl?usp=drive_link",
  // },
  // {
  //   id: 4,
  //   slug: "Open-Campus-Primakara",
  //   name: "Event Open Campus Primakara",
  //   frame:
  //     "https://drive.google.com/drive/folders/1JRH7ytfI4c95BsPhnjtKEBHsJTK_Ig2E?usp=drive_link",
  // },
  // {
  //   id: 5,
  //   slug: "Pameran-DKV-Primakara",
  //   name: "Event Pameran DKV Primakara",
  //   frame:
  //     "https://drive.google.com/drive/folders/1gYMSQXmVqoYwauFNlS2t0BiEDOH5Q7bF?usp=drive_link",
  // },

  {
    id: 6,
    slug: "Sitefest",
    name: "Sitefest 2026",
    frame:
      "https://drive.google.com/drive/folders/1t3Bvzwv1TBJMf7zDBR7HD4tdVOro_8YQ?usp=drive_link",
    video:
      "https://drive.google.com/drive/folders/1bHFlcGFpsVb9uU3PU0oKQuxbCV0zooZL?usp=drive_link",
    raw: "https://drive.google.com/drive/folders/1hbV_J9uQxM6nZ3gyg0-ArRgeuzC4MSG9?usp=drive_link",
  },
];

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
    slug: "BSE-2026",
    name: "Bali Startup Expo 2026",
    frame:
      "https://drive.google.com/drive/folders/1KCRAZ3RrDGOHmzhCiVkj9UeYU0tNMITs",
    video:
      "https://drive.google.com/drive/folders/1lDCelZBjFTXC901N1lag22OmAgAMWJ5g",
    raw: "https://drive.google.com/drive/folders/1TJXleqnRPM9qI7XKVRtoHs5I0BC6erhk",
  },
];

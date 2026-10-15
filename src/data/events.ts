export type Event = {
  id: number;
  slug: string;
  name: string;
  video?: string;
  frame: string;
  raw?: string;
};

export const events: Event[] = [
  {
    id: 1,
    slug: "Bayu & Cintya",
    name: "Wedding and Metatah Widyana & Zeilani Rai Budha",
    frame:
      "https://drive.google.com/drive/folders/1f2zUmm7dosXfRpCnBaWM6EKankjN0f6q",
    video:
      "https://drive.google.com/drive/folders/1r2-ZwQGwEDgUn6y8Wmmkp3jZvph80yLg",
    raw: "https://drive.google.com/drive/folders/1IDJNjWpd3-oRMHc62BbWvfdf2oSRnSb9",
  },
];

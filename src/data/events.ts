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
    slug: "DekMbar & Ria",
    name: "Wedding DekMbar & Ria",
    frame:
      "https://drive.google.com/drive/folders/17ZTQA6KYPbWvJhms4bXJDQ6kQft5t2Re?usp=drive_link",
    video:
      "https://drive.google.com/drive/folders/1G9QWcm2duKbGtSmod79yiIcBvyeijk4u?usp=drive_link",
    raw: "https://drive.google.com/drive/folders/1N0wL2gPZtJ_vL1kwYUq-oJlQfbB3-5b9?usp=drive_link",
  },
];

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
    slug: "ojk-dahsyat",
    name: "OJK DahSyat",
    frame:
      "https://drive.google.com/drive/folders/12l3Ma2wFYCUBwv-QQQB5POgpwOLnyQsu",
    video:
      "https://drive.google.com/drive/folders/1OOyJoZuiajunBZ5D_MOyprDwISTAB6Jc",
    raw: "https://drive.google.com/drive/folders/1VWAdX3PY4GpR5cLel2AG9fmbS-zSjv8J",
  },
];

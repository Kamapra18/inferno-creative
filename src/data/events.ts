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
    slug: "Junet-&-Fenny",
    name: "Wedding Junet & Fenny",
    frame:
      "https://drive.google.com/drive/folders/1SmE0oyJfhvrwiQo_mwtWIY-C0iFN5DX8",
    video:
      "https://drive.google.com/drive/folders/1T5J4l28OZfs3NpVRwvBJflsPQLeZmfMB",
    raw: "https://drive.google.com/drive/folders/18ipVd2tIOs2jV6x7jZUU-TUB5tfateAU",
  },
];

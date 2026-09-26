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
    slug: "Arkamara Dijiwa",
    name: "Gatering Arkamara Dijiwa",
    frame:
      "https://drive.google.com/drive/folders/1uzmBY3PUGA5aiwUdqFf_FgPqz0rLyCQl?usp=sharing",
    video:
      "https://drive.google.com/drive/folders/1UlXm3SpO9j51r7-yEyIzIJXMhAc7pZUU?usp=sharing",
    raw: "https://drive.google.com/drive/folders/12yYL4XHCQXuhps_WgRppf6pXg1fekRj7?usp=drive_link",
  },
];

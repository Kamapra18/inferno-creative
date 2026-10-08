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
      "https://drive.google.com/drive/folders/1Un_UnNkyM0EhYkz6oAp-WECOHXELZfqF",
    video:
      "https://drive.google.com/drive/folders/1LlcQpVmM7-fdq0HzdXOCtyj1HJfdJbRF",
    raw: "https://drive.google.com/drive/folders/1t48TlXt_vCG89TBlv8fVqWo0xXwnpa5w",
  },
];

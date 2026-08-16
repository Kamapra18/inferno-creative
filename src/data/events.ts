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
    slug: "Arma & Andriani",
    name: "Wedding Arma & Andriani",
    frame:
      "https://drive.google.com/drive/folders/1uB6ip_YferarVgcQpSBCu_oA_3RK1_A9",
    video:
      "https://drive.google.com/drive/folders/1VzBEHsrGRMLGTrXCnSi1AC3HLJNELBx-",
    raw: "https://drive.google.com/drive/folders/1vfrJlfydvTltD4rfhIuVYKM1B4lCPIAd",
  },
];

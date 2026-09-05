export type Merch = {
  name: string;
  price: string;
  desc: string;
  status: "Wyprzedane" | "Tylko Elite" | "Zaginęło w transporcie";
  emoji: string;
};

export const merch: Merch[] = [
  {
    name: "Koszulka „Undetected od 412 dni"",
    price: "119 zł",
    desc: "Bawełna 100%, nadruk 100%, szansa na kupienie 0%.",
    status: "Wyprzedane",
    emoji: "👕",
  },
  {
    name: "Kubek „Smooth 18"",
    price: "59 zł",
    desc: "Kawa w nim stygnie idealnie płynnie, bez szarpnięć.",
    status: "Wyprzedane",
    emoji: "☕",
  },
  {
    name: "Zestaw naklejek Kurczak Pack",
    price: "29 zł",
    desc: "12 naklejek, w tym jedna świecąca w ciemności jak nasze chamsy.",
    status: "Tylko Elite",
    emoji: "🐔",
  },
  {
    name: "Poduszka-kurczak XXL",
    price: "189 zł",
    desc: "Przytul, gdy dostaniesz bana na cheacie konkurencji.",
    status: "Zaginęło w transporcie",
    emoji: "🛋️",
  },
  {
    name: "Podkładka pod mysz 90×40",
    price: "149 zł",
    desc: "Powierzchnia gładka jak nasz bypass. Krawędzie chrupiące.",
    status: "Wyprzedane",
    emoji: "🖱️",
  },
  {
    name: "Czapka z daszkiem „HvH ready"",
    price: "89 zł",
    desc: "Daszek zasłania monitor przeciwnika przy LAN-ie.",
    status: "Tylko Elite",
    emoji: "🧢",
  },
  {
    name: "Bluza „0 banów w 2026"",
    price: "249 zł",
    desc: "Ciepła, wygodna, statystycznie nieprawdziwa.",
    status: "Wyprzedane",
    emoji: "🧥",
  },
  {
    name: "Brelok w kształcie skrzydełka",
    price: "19 zł",
    desc: "Nie pachnie. Serio sprawdzaliśmy.",
    status: "Tylko Elite",
    emoji: "🔑",
  },
];

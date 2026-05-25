export type FortuneResult = {
  level: number;
  stars: string;
  title: string;
  luckyHorseNumbers: number[];
  luckyGateNumber: number;
  luckyGateColor: string;
  luckyGateColorName: string;
  luckyRacecourse: string;
  luckyBetType: string;
  luckyColor: string;
  luckyColorCode: string;
  message: string;
  subMessage: string;
  zodiac: string;
  element: string;
};

const RACECOURSES = ["札幌", "函館", "福島", "新潟", "中山", "東京", "中京", "京都", "阪神", "小倉"];

const BET_TYPES = ["単勝", "複勝", "ワイド", "馬連", "馬単", "3連複", "3連単"];

const LUCKY_COLORS = [
  { name: "ターフグリーン", code: "#2d6a4f" },
  { name: "ロイヤルゴールド", code: "#d4a017" },
  { name: "ルビーレッド", code: "#c0392b" },
  { name: "サファイアブルー", code: "#1a5276" },
  { name: "サンセットオレンジ", code: "#e67e22" },
  { name: "ミステリアスパープル", code: "#6c3483" },
  { name: "ピュアホワイト", code: "#f0f0f0" },
  { name: "シャンパンゴールド", code: "#c8a97e" },
  { name: "エメラルドグリーン", code: "#1abc9c" },
  { name: "スカイブルー", code: "#2980b9" },
];

const GATE_COLORS = [
  { name: "白", code: "#f5f5f5", textColor: "#333" },
  { name: "黒", code: "#1a1a1a", textColor: "#fff" },
  { name: "赤", code: "#e53e3e", textColor: "#fff" },
  { name: "青", code: "#2b6cb0", textColor: "#fff" },
  { name: "黄", code: "#ecc94b", textColor: "#333" },
  { name: "緑", code: "#276749", textColor: "#fff" },
  { name: "橙", code: "#dd6b20", textColor: "#fff" },
  { name: "桃", code: "#d53f8c", textColor: "#fff" },
];

const FORTUNE_TITLES = [
  "大凶 - 今日は見送りが吉",
  "凶 - 慎重に行動を",
  "小吉 - ちょっとだけ運がある",
  "吉 - 良い流れが来ている",
  "大吉 - 絶好調！全力で攻めよ",
];

const MESSAGES = [
  [
    "今日は馬券から距離を置くのが賢明です。無理に勝負せず、レース観戦を楽しんで情報収集に徹しましょう。",
    "無駄な出費を避けることで、次のチャンスに向けた資金を守ることができます。",
  ],
  [
    "慎重な姿勢が吉と出る日。人気馬を中心に堅く組み立てることをおすすめします。",
    "穴馬を追いかけるより、安定した配当を積み重ねるスタイルが今日は合っています。",
  ],
  [
    "じわじわと運気が上昇しています。ラッキー馬番を軸に少額から試してみましょう。",
    "今日の経験が明日の大勝利への布石となるはず。焦らず着実に進めましょう。",
  ],
  [
    "追い風が吹いています！ラッキー馬番と枠番を組み合わせた馬券が面白い。",
    "直感を信じる勇気が大切な日。第一感で選んだ馬が期待に応えてくれるでしょう。",
  ],
  [
    "今日はあなたの日です！ラッキー競馬場で全力投球しましょう。星が輝いています。",
    "運命の馬があなたを待っています。ラッキー馬番を信じて、思い切った勝負に出ましょう！",
  ],
];

const ZODIAC_SIGNS = [
  { sign: "山羊座", start: [1, 1], end: [1, 19], element: "土" },
  { sign: "水瓶座", start: [1, 20], end: [2, 18], element: "風" },
  { sign: "魚座", start: [2, 19], end: [3, 20], element: "水" },
  { sign: "牡羊座", start: [3, 21], end: [4, 19], element: "火" },
  { sign: "牡牛座", start: [4, 20], end: [5, 20], element: "土" },
  { sign: "双子座", start: [5, 21], end: [6, 20], element: "風" },
  { sign: "蟹座", start: [6, 21], end: [7, 22], element: "水" },
  { sign: "獅子座", start: [7, 23], end: [8, 22], element: "火" },
  { sign: "乙女座", start: [8, 23], end: [9, 22], element: "土" },
  { sign: "天秤座", start: [9, 23], end: [10, 22], element: "風" },
  { sign: "蠍座", start: [10, 23], end: [11, 21], element: "水" },
  { sign: "射手座", start: [11, 22], end: [12, 21], element: "火" },
  { sign: "山羊座", start: [12, 22], end: [12, 31], element: "土" },
];

function getZodiac(birthMonth: number, birthDay: number): { sign: string; element: string } {
  for (const z of ZODIAC_SIGNS) {
    const afterStart = birthMonth > z.start[0] || (birthMonth === z.start[0] && birthDay >= z.start[1]);
    const beforeEnd = birthMonth < z.end[0] || (birthMonth === z.end[0] && birthDay <= z.end[1]);
    if (afterStart && beforeEnd) {
      return { sign: z.sign, element: z.element };
    }
  }
  return { sign: "山羊座", element: "土" };
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return ((s >>> 0) / 0xffffffff);
  };
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

export function calculateFortune(birthYear: number, birthMonth: number, birthDay: number): FortuneResult {
  const today = new Date();
  const todayNum = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const seed = birthYear * 100000000 + birthMonth * 1000000 + birthDay * 10000 + todayNum % 10000;
  const rng = seededRandom(seed);

  const level = Math.floor(rng() * 5);
  const stars = "★".repeat(level + 1) + "☆".repeat(4 - level);

  const horseCount = [2, 2, 3, 3, 4][level];
  const horseNums: number[] = [];
  while (horseNums.length < horseCount) {
    const n = Math.floor(rng() * 18) + 1;
    if (!horseNums.includes(n)) horseNums.push(n);
  }
  horseNums.sort((a, b) => a - b);

  const gateIdx = Math.floor(rng() * 8);
  const gateColor = GATE_COLORS[gateIdx];

  const racecourse = pick(RACECOURSES, rng);
  const betType = pick(BET_TYPES, rng);
  const color = pick(LUCKY_COLORS, rng);

  const { sign, element } = getZodiac(birthMonth, birthDay);
  const msgs = MESSAGES[level];

  return {
    level,
    stars,
    title: FORTUNE_TITLES[level],
    luckyHorseNumbers: horseNums,
    luckyGateNumber: gateIdx + 1,
    luckyGateColor: gateColor.code,
    luckyGateColorName: gateColor.name,
    luckyRacecourse: racecourse,
    luckyBetType: betType,
    luckyColor: color.name,
    luckyColorCode: color.code,
    message: msgs[0],
    subMessage: msgs[1],
    zodiac: sign,
    element,
  };
}

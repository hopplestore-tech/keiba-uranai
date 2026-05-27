"use client";
import { useState } from "react";
import { trackEvent } from "@/app/lib/gtag";
import { RACES, type Race, type Horse } from "@/app/lib/races";

function calcLifePath(dateStr: string) {
  const digits = dateStr.replace(/-/g, "").split("").map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  while (sum > 9) sum = String(sum).split("").map(Number).reduce((a, b) => a + b, 0);
  return sum || 9;
}

const LIFEPATH_DESC: Record<number, string> = {
  1:"リーダーシップと独立を象徴する数。逃げ・先行で単独先頭に立つ馬と縁がある。",
  2:"協調と直感を司る数。展開に乗る柔軟な馬が吉。",
  3:"創造と表現の数。華やかな末脚を持つ馬を引き寄せる。",
  4:"安定と忍耐の数。粘り強く差してくる馬と相性が良い。",
  5:"変化と自由の数。展開次第で激走する穴馬と縁がある。",
  6:"調和と責任の数。堅実に力を発揮する本命馬が吉。",
  7:"探求と神秘を司る数。直感で動く馬、データ外の馬と縁がある。",
  8:"力と物質を象徴する数。重厚な末脚を持つ馬が吉。",
  9:"完成と叡智の数。経験豊富な古馬、重賞実績馬と縁がある。",
};

function getSunSign(dateStr: string) {
  const [, m, d] = dateStr.split("-").map(Number);
  const signs = [
    { name:"山羊座", el:"土", end:[1,19],  desc:"忍耐と上昇を象徴。粘り強く差す馬と相性が良い。" },
    { name:"水瓶座", el:"風", end:[2,18],  desc:"革新と独自性の星座。データ外の穴馬を引き寄せる。" },
    { name:"魚座",   el:"水", end:[3,20],  desc:"直感と夢の星座。流れに乗る差し・追込馬が吉。" },
    { name:"牡羊座", el:"火", end:[4,19],  desc:"開拓と瞬発の星座。先行・逃げ馬のスピードと共鳴。" },
    { name:"牡牛座", el:"土", end:[5,20],  desc:"安定と持久の星座。長距離を粘り切る馬と縁がある。" },
    { name:"双子座", el:"風", end:[6,20],  desc:"変化と機転の星座。展開が鍵を握るレースで輝く。" },
    { name:"蟹座",   el:"水", end:[7,22],  desc:"感受性と直感の星座。内側から差してくる馬が吉。" },
    { name:"獅子座", el:"火", end:[8,22],  desc:"華やかさと情熱の星座。人気馬・話題馬と縁がある。" },
    { name:"乙女座", el:"土", end:[9,22],  desc:"分析と実直さの星座。堅実なデータ馬を引き寄せる。" },
    { name:"天秤座", el:"風", end:[10,22], desc:"調和とバランスの星座。接戦を制す馬と共鳴する。" },
    { name:"蠍座",   el:"水", end:[11,21], desc:"深みと執念の星座。しぶとく追込む馬が吉。" },
    { name:"射手座", el:"火", end:[12,21], desc:"冒険と拡大の星座。大きく狙う穴馬・長距離馬が吉。" },
    { name:"山羊座", el:"土", end:[12,31], desc:"忍耐と上昇を象徴。粘り強く差す馬と相性が良い。" },
  ];
  return signs.find(s => m < s.end[0] || (m === s.end[0] && d <= s.end[1]));
}

function getEto(dateStr: string) {
  const year = parseInt(dateStr.split("-")[0]);
  const etos  = ["申","酉","戌","亥","子","丑","寅","卯","辰","巳","午","未"];
  const gogyos: Record<string, string> = { 申:"金",酉:"金",戌:"土",亥:"水",子:"水",丑:"土",寅:"木",卯:"木",辰:"土",巳:"火",午:"火",未:"土" };
  const etoDesc: Record<string, string> = {
    申:"行動力と機転の干支。素早い先行馬と縁がある。",酉:"鋭さと美しさの干支。切れ味鋭い差し馬が吉。",
    戌:"忠実と粘りの干支。堅実に力を出す馬と共鳴。",亥:"力強さと勇気の干支。重厚な末脚を持つ馬が吉。",
    子:"知恵と適応の干支。展開に柔軟に対応する馬が吉。",丑:"忍耐と信頼の干支。長距離・タフな条件で輝く馬と縁。",
    寅:"勇気と情熱の干支。果敢に逃げる馬を引き寄せる。",卯:"機敏と優雅の干支。軽快に動く先行・差し馬が吉。",
    辰:"壮大と幸運の干支。大舞台で輝く本命馬と縁がある。",巳:"直感と変容の干支。穴馬・一発逆転の馬を引き寄せる。",
    午:"活力とスピードの干支。逃げ・先行の快速馬が吉。",未:"温和と粘りの干支。差し・追込でじわじわ来る馬と縁。",
  };
  const eto = etos[(year - 1956) % 12];
  return { eto, gogyo: gogyos[eto], desc: etoDesc[eto] };
}

function getMoonPhase() {
  const now = new Date();
  const known = new Date("2000-01-06");
  const diff = (now.getTime() - known.getTime()) / (1000*60*60*24);
  const phase = diff % 29.53;
  const phases = [
    { phase:"新月",    emoji:"🌑", energy:"瞬発型エネルギー", raceType:"スタートダッシュ・逃げ馬と縁が深い",  typeKey:"瞬発" as const },
    { phase:"三日月",  emoji:"🌒", energy:"先行型エネルギー", raceType:"好位・先行馬と縁が深い",              typeKey:"先行" as const },
    { phase:"上弦の月",emoji:"🌓", energy:"先行型エネルギー", raceType:"好位・先行馬と縁が深い",              typeKey:"先行" as const },
    { phase:"満月前",  emoji:"🌔", energy:"先行型エネルギー", raceType:"好位・先行馬と縁が深い",              typeKey:"先行" as const },
    { phase:"満月",    emoji:"🌕", energy:"持続型エネルギー", raceType:"末脚・追い込み馬と縁が深い",          typeKey:"持続" as const },
    { phase:"満月後",  emoji:"🌖", energy:"差し型エネルギー", raceType:"流れに乗る差し馬と縁が深い",          typeKey:"差し" as const },
    { phase:"下弦の月",emoji:"🌗", energy:"差し型エネルギー", raceType:"流れに乗る差し馬と縁が深い",          typeKey:"差し" as const },
    { phase:"晦日月",  emoji:"🌘", energy:"瞬発型エネルギー", raceType:"スタートダッシュ・逃げ馬と縁が深い",  typeKey:"瞬発" as const },
  ];
  const idx = Math.min(Math.floor(phase / (29.53/8)), 7);
  return phases[idx];
}

function calcGogyo(dateStr: string): { gogyo: "木" | "火" | "土" | "金" | "水"; label: string; emoji: string } {
  const year = new Date(dateStr).getFullYear();
  const jikkan = year % 10;
  const map: Record<number, ["木"|"火"|"土"|"金"|"水", string, string]> = {
    4: ["木", "木（もく）", "🌱"],
    5: ["木", "木（もく）", "🌱"],
    6: ["火", "火（か）",   "🔥"],
    7: ["火", "火（か）",   "🔥"],
    8: ["土", "土（ど）",   "⛰️"],
    9: ["土", "土（ど）",   "⛰️"],
    0: ["金", "金（きん）", "⚙️"],
    1: ["金", "金（きん）", "⚙️"],
    2: ["水", "水（すい）", "💧"],
    3: ["水", "水（すい）", "💧"],
  };
  const [gogyo, label, emoji] = map[jikkan];
  return { gogyo, label, emoji };
}

type UserProfile = {
  lifePath: number;
  sunSign: string;
  element: string;
  sunDesc: string;
  etoDesc: string;
  eto: string;
  gogyo: string;
  jikkanGogyo: "木" | "火" | "土" | "金" | "水";
  jikkanLabel: string;
  jikkanEmoji: string;
};

type ScoredHorse = {
  umaban: number;
  wakuban: number;
  name: string;
  birthdate?: string;
  score: number;
};

function getGogyoFromDate(dateStr?: string): string | null {
  if (!dateStr) return null;
  const year = parseInt(dateStr.split("-")[0]);
  const etos = ["申","酉","戌","亥","子","丑","寅","卯","辰","巳","午","未"];
  const gogyoMap: Record<string, string> = { 申:"金",酉:"金",戌:"土",亥:"水",子:"水",丑:"土",寅:"木",卯:"木",辰:"土",巳:"火",午:"火",未:"土" };
  const eto = etos[(year - 1956) % 12];
  return gogyoMap[eto];
}

function calcGogyoAffinity(userGogyo: string, horseGogyo: string | null): number {
  if (!horseGogyo) return 0;
  const sojo:   Record<string, string> = { 木:"火", 火:"土", 土:"金", 金:"水", 水:"木" };
  const sokoku: Record<string, string> = { 木:"土", 土:"水", 水:"火", 火:"金", 金:"木" };
  if (sojo[userGogyo]   === horseGogyo) return 30;  // 相生（ユーザーが馬を生む）
  if (sojo[horseGogyo]  === userGogyo)  return 20;  // 相生（馬がユーザーを生む）
  if (sokoku[userGogyo] === horseGogyo) return -10; // 相剋
  if (userGogyo === horseGogyo)         return 15;  // 比和（同じ五行）
  return 0;
}

function scoreHorse(horse: { umaban: number; wakuban: number; birthdate?: string }, up: UserProfile) {
  let s = 0;
  if (up.lifePath % 2 === horse.umaban % 2) s += 20;
  if (horse.umaban === up.lifePath) s += 30;
  const elementWaku: Record<string, number[]> = { 火:[1,5], 土:[3,7], 風:[2,6], 水:[4,8] };
  if (elementWaku[up.element]?.includes(horse.wakuban)) s += 25;
  s += Math.floor(Math.sin(horse.umaban * up.lifePath * 7) * 10 + 10);
  s += Math.floor(Math.cos(horse.wakuban * up.lifePath * 3) * 8 + 8);
  const horseGogyo = getGogyoFromDate(horse.birthdate);
  s += calcGogyoAffinity(up.gogyo, horseGogyo);
  return s;
}

// ─── Race attribute & deterministic comment helpers ────────────────────────
type RaceAttr = { surface: "turf"|"dirt"; distClass: "sprint"|"mile"|"middle"|"long"; isG1: boolean };

function getRaceAttr(race: Race): RaceAttr {
  const m = race.distance.match(/\d+/);
  const dist = m ? parseInt(m[0]) : 1600;
  const surface: "turf"|"dirt" = race.distance.startsWith("ダ") ? "dirt" : "turf";
  const distClass: "sprint"|"mile"|"middle"|"long" =
    dist <= 1400 ? "sprint" : dist <= 1600 ? "mile" : dist < 2100 ? "middle" : "long";
  return { surface, distClass, isG1: race.grade === "G1" };
}

function cSeed(lifePath: number, gogyo: string, raceId: string, salt = 0): number {
  const s = `${lifePath}:${gogyo}:${raceId}:${salt}`;
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return h;
}

const GOGYO_DESC: Record<string, string> = {
  木: "「木」は柔軟と成長を象徴。変化に対応できる差し・追込馬と深く共鳴します。",
  火: "「火」は瞬発力と情熱を象徴。先行・逃げ馬のスピードと強く共鳴します。",
  土: "「土」は安定と持久を象徴。長距離を粘り切る馬や重厚な末脚の馬と縁があります。",
  金: "「金」は鋭さと決断を象徴。切れ味鋭い差し馬、堅実なデータ馬と共鳴します。",
  水: "「水」は柔軟と流れを象徴。展開に乗る器用な馬、流れを読む馬との縁が深い。",
};

const GOGYO_DISPLAY_DESC: Record<string, string> = {
  木: "成長と柔軟性。流れを読みながら着実に伸びるタイプ。",
  火: "情熱と直感。瞬発的なエネルギーで勝負どころを制する。",
  土: "安定と粘り。どんな流れにも対応できる底力を持つ。",
  金: "鋭さと決断力。ここぞの場面で切れ味鋭く動く。",
  水: "知恵と適応力。状況を読んで最適な動きができる。",
};

function gogyoRaceNote(gogyo: string, attr: RaceAttr): string {
  const t: Record<string, Record<string, string>> = {
    dirt:   { 木:"ダートと「木」は相剋の関係。展開力でカバーする馬を見極めて。", 火:"ダートと「火」の力強さが共鳴。先行馬がレースを支配しやすい一戦。", 土:"ダートと「土」は同じ大地の属性。最高の相性です。", 金:"ダートと「金」は砂を制する強さで共鳴。力強い馬が輝く。", 水:"ダートと「水」は流れを読む力で共鳴。展開次第で動く一戦。" },
    long:   { 木:"長距離と「木」の粘り強さが共鳴。根を張るように走り切る馬が吉。", 火:"長距離では「火」の瞬発力を持続力に変えて。終盤の爆発に期待。", 土:"長距離と「土」の持久力は最高の組み合わせ。スタミナ馬を信頼して。", 金:"長距離で「金」の不屈の意志が試される。諦めない馬との縁が深まる。", 水:"長距離と「水」の持続エネルギーは一致。終盤を制す馬を狙え。" },
    short:  { 木:"短距離・マイルで「木」の機動力が光る。素早い動きを見せる馬が吉。", 火:"短距離・マイルと「火」の瞬発力は最高の相性。切れ味鋭い馬を狙え。", 土:"短距離で「土」の安定感がフィット。堅実に走り抜く馬が吉。", 金:"短距離・マイルで「金」の鋭さが冴える。キレ味No.1の馬を探せ。", 水:"短距離で「水」の流動的な動きが光る。展開利を得る馬が有利。" },
    middle: { 木:"中距離で「木」の柔軟性が活きる。様々な展開に対応できる馬を信頼。", 火:"中距離で「火」の情熱が持続。先行から押し切る馬との縁が深まる。", 土:"中距離と「土」の安定力は相性良好。堅実な本命馬の力が発揮される。", 金:"中距離で「金」の判断力が光る。精度の高い競馬をする馬との縁がある。", 水:"中距離で「水」の読みが冴える。展開を制する馬が最終的に勝利する。" },
  };
  if (attr.surface === "dirt") return t.dirt[gogyo] ?? "";
  if (attr.distClass === "long") return t.long[gogyo] ?? "";
  if (attr.distClass === "sprint" || attr.distClass === "mile") return t.short[gogyo] ?? "";
  return t.middle[gogyo] ?? "";
}

function genComment(rank: number, horse: ScoredHorse, up: UserProfile, moon: ReturnType<typeof getMoonPhase>, race: Race): string {
  const attr = getRaceAttr(race);
  const seed = cSeed(up.lifePath, up.gogyo, race.id, rank * 100 + horse.umaban);
  const horseGogyo = getGogyoFromDate(horse.birthdate);
  const sojo:   Record<string, string> = { 木:"火", 火:"土", 土:"金", 金:"水", 水:"木" };
  const sokoku: Record<string, string> = { 木:"土", 土:"水", 水:"火", 火:"金", 金:"木" };
  const g1 = attr.isG1 ? `${race.name}の大舞台で、` : "";
  const d = race.distance;

  // 五行相性パート（馬との縁を主語に）
  let affinityLine = "";
  if (horseGogyo) {
    if (sojo[up.gogyo] === horseGogyo) {
      affinityLine = `あなたの「${up.gogyo}」が${horse.name}の「${horseGogyo}」を生む相生の縁。`;
    } else if (sojo[horseGogyo] === up.gogyo) {
      affinityLine = `${horse.name}の「${horseGogyo}」があなたの「${up.gogyo}」を高める相生の縁。`;
    } else if (up.gogyo === horseGogyo) {
      affinityLine = `同じ「${up.gogyo}」のエネルギー同士。波長が合い、馬の走りが手に取るようにわかる。`;
    } else if (sokoku[up.gogyo] === horseGogyo) {
      affinityLine = `「${up.gogyo}」と「${horseGogyo}」は相剋の関係。その緊張感が穴馬候補の予感を漂わせる。`;
    } else {
      affinityLine = `「${up.gogyo}」の気が${horse.name}と静かに縁を結ぶ。`;
    }
  }

  if (rank === 0) {
    const suffixes = attr.surface === "dirt"
      ? [`${g1}ライフパス${up.lifePath}と${horse.umaban}番がダート${d}の力勝負で共鳴。${moon.phase}の今日、力強い走りが全てを制します。`,
         `${g1}${d}の大地でライフパス${up.lifePath}が${horse.umaban}番を引き寄せます。${moon.energy}が後押しする一戦。`]
      : attr.distClass === "long"
      ? [`${g1}ライフパス${up.lifePath}と${horse.umaban}番の縁が${d}の長丁場で輝きます。${moon.phase}の${moon.energy}が底力を引き出します。`,
         `${g1}${d}の持久戦でライフパス${up.lifePath}が${horse.umaban}番と深く結びつきます。${moon.raceType}。`]
      : attr.distClass === "sprint"
      ? [`${g1}ライフパス${up.lifePath}の瞬発力が${horse.umaban}番と共鳴。${d}の速い流れで${moon.energy}がスピードを爆発させます。`,
         `${g1}${d}の短距離でライフパス${up.lifePath}が${horse.umaban}番の切れ味と直結。${moon.raceType}。`]
      : [`${g1}ライフパス${up.lifePath}と${horse.umaban}番の波動が${d}の舞台で深く共鳴。${moon.phase}の${moon.energy}がこの縁を確かなものにします。`,
         `${g1}${d}の舞台でライフパス${up.lifePath}が${horse.umaban}番を指し示しています。${moon.raceType}。`];
    const suffix = suffixes[seed % suffixes.length];
    return affinityLine ? `${affinityLine} ${suffix}` : suffix;
  }

  if (rank === 1) {
    const suffixes = attr.surface === "dirt"
      ? [`${up.sunSign}の力がダート${d}の${horse.wakuban}枠と結びつきます。1着馬との馬連が手堅い一手。`,
         `${d}の力比べで${up.sunSign}が${horse.name}との縁を深めます。1着馬との組み合わせで押さえて。`]
      : attr.distClass === "long"
      ? [`${up.sunSign}の粘り強さが${d}の${horse.wakuban}枠と共鳴します。1着馬との馬連で対抗として押さえて。`,
         `${d}の持久戦で${up.sunSign}が${horse.name}との縁を深めます。1着馬と合わせた馬連が一手。`]
      : [`${up.sunSign}が${d}の${horse.wakuban}枠と縁を結びます。1着馬との組み合わせを対抗として押さえる一手。`,
         `${up.sunSign}の感性が${horse.name}と共鳴。${d}の流れで1着馬との馬連が面白い。`];
    const suffix = suffixes[seed % suffixes.length];
    return affinityLine ? `${affinityLine} ${suffix}` : suffix;
  }

  const g1b = attr.isG1 ? "G1の大舞台だからこそ、" : "";
  const suffixes = attr.surface === "dirt"
    ? [`${g1b}ダート${d}の荒れ展開で${horse.name}が激走する可能性を秘めています。${moon.phase}の今日、少額で夢を買う一手に。`,
       `${g1b}${d}の力比べで${horse.name}が浮上する一場面を描いています。穴が開くかもしれません。`]
    : attr.distClass === "long"
    ? [`${g1b}${d}の底力勝負で${horse.name}が激走する一場面を描いています。少額で夢を。`,
       `${g1b}${d}のスタミナ戦、${horse.name}が持ち前の粘りで浮上します。${moon.raceType}。`]
    : [`${g1b}${d}の展開で${horse.name}が激走する可能性を秘めています。少額で夢を買う一手に。`,
       `${g1b}${moon.phase}の今日、${d}の流れで${horse.name}が穴を開けるかもしれません。`];
  const suffix = suffixes[seed % suffixes.length];
  return affinityLine ? `${affinityLine} ${suffix}` : suffix;
}

const WAKU_BG: Record<number, string>   = {0:"rgba(255,255,255,0.1)",1:"#fff",2:"#111",3:"#e22",4:"#36c",5:"#fc0",6:"#3a3",7:"#f84",8:"#f48",9:"#aaa",10:"#7a5230"};
const WAKU_TEXT: Record<number, string> = {0:"#b0a880",1:"#111",2:"#fff",3:"#fff",4:"#fff",5:"#111",6:"#fff",7:"#fff",8:"#fff",9:"#111",10:"#fff"};
const RANK_EMOJI = ["🥇","🥈","🥉"];
const RANK_LABEL = ["大本命","対抗","穴狙い"];
const BAKEN_TYPE = ["単勝・複勝でまず試して","馬連（1着馬と組み合わせて）","ワイド（大穴を少額で）"];

export default function KeibaUranai() {
  const [step, setStep] = useState("top");
  const [selectedRaceId, setSelectedRaceId] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<{ up: UserProfile; ranked: ScoredHorse[]; moon: ReturnType<typeof getMoonPhase> } | null>(null);
  const [showUnlock, setShowUnlock] = useState(false);
  const [openProfile, setOpenProfile] = useState<string | null>(null);

  const selectedRace = RACES.find(r => r.id === selectedRaceId);

  function handleDivine() {
    if (!birthDate || !selectedRace) return;
    trackEvent("divination_started", { race_id: selectedRaceId });
    setStep("loading");
    setTimeout(() => {
      const lifePath  = calcLifePath(birthDate);
      const sunSign   = getSunSign(birthDate);
      const etoData   = getEto(birthDate);
      const gogyoData = calcGogyo(birthDate);
      const moon      = getMoonPhase();
      const up: UserProfile = {
        lifePath, sunSign: sunSign!.name, element: sunSign!.el, sunDesc: sunSign!.desc,
        etoDesc: etoData.desc, eto: etoData.eto, gogyo: etoData.gogyo,
        jikkanGogyo: gogyoData.gogyo, jikkanLabel: gogyoData.label, jikkanEmoji: gogyoData.emoji,
      };
      const ranked = [...selectedRace.horses]
        .map(h => ({ ...h, score: scoreHorse(h, up) }))
        .sort((a, b) => b.score - a.score);
      setResult({ up, ranked, moon });
      trackEvent("divination_completed", { race_id: selectedRaceId, top_horse: ranked[0]?.name });
      setStep("result");
    }, 2200);
  }

  const BG = "linear-gradient(160deg,#0d1117 0%,#131828 55%,#0f1a10 100%)";
  const cardBase: React.CSSProperties = { background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:14, padding:"20px" };
  const goldCard: React.CSSProperties = { background:"rgba(200,160,50,0.11)", border:"1px solid rgba(200,160,50,0.28)", borderRadius:14, padding:"18px 20px" };
  const btn: React.CSSProperties = { width:"100%", padding:"17px", borderRadius:12, border:"none", background:"linear-gradient(135deg,#c8a040,#e8d070)", color:"#080808", fontWeight:900, fontSize:16, cursor:"pointer", letterSpacing:1 };
  const btnGhost: React.CSSProperties = { width:"100%", padding:"13px", borderRadius:12, border:"1px solid rgba(255,255,255,0.08)", background:"transparent", color:"#605850", cursor:"pointer", fontSize:13 };

  return (
    <div style={{ minHeight:"100vh", background:BG, fontFamily:"'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif", color:"#f0ead6", paddingBottom:64, overflow:"hidden" }}>
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, background:"radial-gradient(ellipse 55% 35% at 15% 15%,rgba(180,140,50,.13) 0%,transparent 70%),radial-gradient(ellipse 45% 55% at 85% 85%,rgba(50,110,50,.10) 0%,transparent 70%)" }} />
      <div style={{ position:"relative", zIndex:1, maxWidth:420, margin:"0 auto", padding:"0 20px" }}>
        <div style={{ textAlign:"center", paddingTop:44, paddingBottom:28 }}>
          <div style={{ fontSize:11, letterSpacing:7, color:"#806840", marginBottom:8, textTransform:"uppercase" }}>Celestial Racing</div>
          <h1 style={{ fontSize:30, fontWeight:900, margin:0, letterSpacing:2, lineHeight:1.25, background:"linear-gradient(135deg,#d4a830,#f0e0a0,#b89030)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>星と馬の縁を占う</h1>
          <div style={{ marginTop:8, fontSize:12, color:"#6a6050" }}>生年月日から、あなたと縁ある馬を鑑定</div>
        </div>

        {step === "top" && (
          <div>
            <div style={{ ...goldCard, marginBottom:16 }}>
              <div style={{ fontSize:10, letterSpacing:3, color:"#907040", marginBottom:10 }}>今週の主要レース</div>
              {RACES.map(r => (
                <div key={r.id} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                  {r.grade && <span style={{ fontSize:10, padding:"2px 7px", borderRadius:10, background:"rgba(200,160,50,0.2)", color:"#c8a040", fontWeight:700 }}>{r.grade}</span>}
                  <span style={{ fontSize:13 }}>{r.name}</span>
                  <span style={{ fontSize:11, color:"#706050", marginLeft:"auto" }}>{r.date.replace("2026年","")}</span>
                </div>
              ))}
            </div>
            <div style={{ ...cardBase, marginBottom:20 }}>
              <div style={{ fontSize:11, color:"#907040", marginBottom:12 }}>無料でできること</div>
              {["レースをドロップダウンで選ぶ","生年月日を入力するだけ","縁ある馬 TOP3 を鑑定"].map((t,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:i<2?10:0 }}>
                  <div style={{ width:5, height:5, borderRadius:"50%", background:"#c8a040", flexShrink:0 }} />
                  <div style={{ fontSize:14 }}>{t}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setStep("input")} style={btn}>✨ 鑑定をはじめる</button>
          </div>
        )}

        {step === "input" && (
          <div>
            <div style={{ ...cardBase, marginBottom:14 }}>
              <label style={{ fontSize:12, color:"#907040", display:"block", marginBottom:8, letterSpacing:1 }}>レースを選ぶ</label>
              <select value={selectedRaceId} onChange={e => { setSelectedRaceId(e.target.value); if (e.target.value) trackEvent("race_selected", { race_id: e.target.value }); }}
                style={{ width:"100%", padding:"14px 16px", borderRadius:10, border:"1px solid rgba(200,160,50,0.3)", background:"#1e1e2e", color: selectedRaceId ? "#f0ead6" : "#706050", fontSize:15, outline:"none", boxSizing:"border-box", appearance:"none", cursor:"pointer" }}>
                <option value="">-- レースを選択してください --</option>
                {RACES.map(r => (
                  <option key={r.id} value={r.id}>{r.status === "finished" ? "【終了】" : ""}{r.grade ? `【${r.grade}】` : ""}{r.name}　{r.date.replace("2026年","")}</option>
                ))}
              </select>
              {selectedRace && (
                <div style={{ marginTop:12, padding:"12px", borderRadius:10, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize:11, color:"#706050", marginBottom:8 }}>{selectedRace.venue}　{selectedRace.distance}　{selectedRace.horses.length}頭</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                    {selectedRace.horses.slice(0,8).map(h => (
                      <span key={h.umaban} style={{ fontSize:11, padding:"3px 8px", borderRadius:20, background:WAKU_BG[h.wakuban], color:WAKU_TEXT[h.wakuban], fontWeight:700 }}>{h.umaban}.{h.name}</span>
                    ))}
                    {selectedRace.horses.length > 8 && <span style={{ fontSize:11, padding:"3px 8px", borderRadius:20, background:"rgba(255,255,255,0.07)", color:"#706050" }}>他{selectedRace.horses.length - 8}頭</span>}
                  </div>
                </div>
              )}
              <label style={{ fontSize:12, color:"#907040", display:"block", marginTop:20, marginBottom:8, letterSpacing:1 }}>あなたの生年月日</label>
              <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} max="2010-12-31"
                style={{ width:"100%", padding:"14px 16px", borderRadius:10, border:"1px solid rgba(200,160,50,0.3)", background:"rgba(255,255,255,0.05)", color:"#f0ead6", fontSize:16, outline:"none", boxSizing:"border-box" }} />
            </div>
            <button onClick={handleDivine}
              disabled={!birthDate || !selectedRaceId || selectedRace?.status === "finished"}
              style={{ ...btn, background: (birthDate && selectedRaceId && selectedRace?.status !== "finished") ? "linear-gradient(135deg,#c8a040,#e8d070)" : "rgba(255,255,255,0.07)", color: (birthDate && selectedRaceId && selectedRace?.status !== "finished") ? "#080808" : "#504840", cursor: (birthDate && selectedRaceId && selectedRace?.status !== "finished") ? "pointer" : "not-allowed" }}>
              星の配置を読み解く →
            </button>
            {selectedRace?.status === "finished" && (
              <div style={{ textAlign:"center", marginTop:8, fontSize:12, color:"#907040" }}>このレースは終了しました</div>
            )}
            <button onClick={() => setStep("top")} style={{ ...btnGhost, marginTop:10 }}>もどる</button>
          </div>
        )}

        {step === "loading" && (
          <div style={{ textAlign:"center", paddingTop:80 }}>
            <div style={{ width:72, height:72, borderRadius:"50%", margin:"0 auto 24px", border:"1.5px solid rgba(200,160,50,0.15)", borderTop:"1.5px solid #c8a040", animation:"spin 1.2s linear infinite" }} />
            <div style={{ color:"#907040", fontSize:13, letterSpacing:3 }}>星の配置を読み解いています…</div>
            <div style={{ marginTop:8, fontSize:11, color:"#504030" }}>{selectedRace?.name} · {selectedRace?.horses.length}頭を鑑定中</div>
            <style>{`@keyframes spin { to{transform:rotate(360deg)} }`}</style>
          </div>
        )}

        {step === "result" && result && (() => {
          const top3 = result.ranked.slice(0, 3);
          const maxScore = top3[0].score;
          const raceAttr = getRaceAttr(selectedRace!);
          const rNote = gogyoRaceNote(result.up.gogyo, raceAttr);
          const profileItems = [
            { key:"lifepath", emoji:"🔢", label:`ライフパス ${result.up.lifePath}`,             desc: LIFEPATH_DESC[result.up.lifePath],              gogyoNote:`あなたの五行は「${result.up.gogyo}」。${GOGYO_DESC[result.up.gogyo]}` },
            { key:"sign",     emoji:"⭐", label: result.up.sunSign,                              desc: result.up.sunDesc,                              gogyoNote:`${result.up.sunSign}と五行「${result.up.gogyo}」が今日の${selectedRace!.distance}に共鳴。${rNote}` },
            { key:"eto",      emoji:"🐾", label:`${result.up.eto}年（${result.up.gogyo}）`,      desc: result.up.etoDesc,                              gogyoNote:`干支${result.up.eto}の五行「${result.up.gogyo}」と${selectedRace!.distance}との相性—${rNote}` },
            { key:"gogyo",    emoji: result.up.jikkanEmoji, label:`五行 ${result.up.jikkanLabel}`, desc: GOGYO_DISPLAY_DESC[result.up.jikkanGogyo],   gogyoNote:`十干の「${result.up.jikkanLabel}」が${selectedRace!.distance}に共鳴。${gogyoRaceNote(result.up.jikkanGogyo, raceAttr)}` },
            { key:"moon",     emoji: result.moon.emoji,     label:`${result.moon.phase}（${result.moon.energy}）`, desc: result.moon.raceType,        gogyoNote:`${result.moon.phase}は「${result.up.gogyo}」の気を増幅します。${result.moon.raceType}。` },
          ];
          return (
            <div>
              <div style={{ ...goldCard, marginBottom:18 }}>
                <div style={{ fontSize:10, letterSpacing:3, color:"#907040", marginBottom:12 }}>YOUR STAR PROFILE</div>
                {profileItems.map(item => (
                  <div key={item.key}>
                    <div onClick={() => setOpenProfile(openProfile === item.key ? null : item.key)}
                      style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", cursor:"pointer", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                      <span style={{ fontSize:16 }}>{item.emoji}</span>
                      <span style={{ fontSize:13, flex:1 }}>{item.label}</span>
                      <span style={{ fontSize:11, color:"#907040" }}>{openProfile === item.key ? "▲" : "▼"}</span>
                    </div>
                    {openProfile === item.key && (
                      <div style={{ padding:"10px 12px", lineHeight:1.8, background:"rgba(200,160,50,0.06)", borderRadius:8, margin:"6px 0 4px" }}>
                        <div style={{ fontSize:12, color:"#b0a070" }}>{item.desc}</div>
                        <div style={{ marginTop:8, paddingTop:8, borderTop:"1px solid rgba(200,160,50,0.15)", fontSize:11, color:"#c8a855" }}>{item.gogyoNote}</div>
                      </div>
                    )}
                  </div>
                ))}
                <div style={{ marginTop:8, fontSize:11, color:"#504030" }}>▼ タップで詳細を見る</div>
              </div>
              <div style={{ fontSize:10, letterSpacing:4, color:"#907040", marginBottom:12 }}>DESTINED HORSES</div>
              {top3.map((horse, i) => (
                <div key={horse.umaban} style={{ background: i===0 ? "linear-gradient(135deg,rgba(200,160,50,0.13),rgba(200,160,50,0.04))" : "rgba(255,255,255,0.03)", border: i===0 ? "1px solid rgba(200,160,50,0.4)" : "1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"18px", marginBottom:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                      <div style={{ width:36, height:36, borderRadius:8, background:WAKU_BG[horse.wakuban], color:WAKU_TEXT[horse.wakuban], display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:14, flexShrink:0, marginTop:2 }}>{horse.umaban}</div>
                      <div>
                        <div style={{ fontSize:11, color:"#907040", marginBottom:3 }}>{RANK_EMOJI[i]} {RANK_LABEL[i]}</div>
                        <div style={{ fontSize:20, fontWeight:900 }}>{horse.name}</div>
                        <div style={{ fontSize:11, color:"#605040", marginTop:2 }}>{horse.umaban}番 · {horse.wakuban}枠</div>
                      </div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <div style={{ fontSize:22, fontWeight:900, color: i===0?"#c8a040":i===1?"#888":"#604020" }}>{horse.score}</div>
                      <div style={{ fontSize:10, color:"#504030" }}>縁スコア</div>
                    </div>
                  </div>
                  <div style={{ marginTop:12, height:3, borderRadius:2, background:"rgba(255,255,255,0.05)" }}>
                    <div style={{ height:"100%", borderRadius:2, width:`${(horse.score/maxScore)*100}%`, background: i===0?"linear-gradient(90deg,#c8a040,#f0d870)":i===1?"#666":"#403020", transition:"width 1s ease" }} />
                  </div>
                </div>
              ))}
              {!showUnlock ? (
                <div style={{ background:"rgba(255,255,255,0.02)", border:"1px dashed rgba(200,160,50,0.22)", borderRadius:14, padding:"24px 20px", textAlign:"center", marginTop:6 }}>
                  <div style={{ fontSize:22, marginBottom:8 }}>🔐</div>
                  <div style={{ fontWeight:700, fontSize:15, marginBottom:6 }}>詳細鑑定・買い方を見る</div>
                  <div style={{ fontSize:12, color:"#706050", lineHeight:1.8, marginBottom:18 }}>縁の理由・おすすめ馬券の種類<br />全{selectedRace?.horses.length}頭のランキングを個別鑑定</div>
                  <button onClick={() => { trackEvent("unlock_clicked", { race_id: selectedRaceId }); setShowUnlock(true); }} style={{ padding:"14px 32px", borderRadius:10, border:"none", background:"linear-gradient(135deg,#c8a040,#e8d070)", color:"#080808", fontWeight:900, fontSize:14, cursor:"pointer" }}>¥500 で詳細を見る</button>
                </div>
              ) : (
                <div style={{ ...goldCard, marginTop:6 }}>
                  <div style={{ fontSize:10, letterSpacing:4, color:"#907040", marginBottom:16 }}>FULL READING</div>
                  {top3.map((horse, i) => (
                    <div key={horse.umaban} style={{ marginBottom:i<2?20:0, paddingBottom:i<2?20:0, borderBottom:i<2?"1px solid rgba(255,255,255,0.05)":"none" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                        <div style={{ width:28, height:28, borderRadius:6, background:WAKU_BG[horse.wakuban], color:WAKU_TEXT[horse.wakuban], display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:11 }}>{horse.umaban}</div>
                        <div style={{ fontWeight:700 }}>{RANK_EMOJI[i]} {horse.name}</div>
                      </div>
                      <div style={{ fontSize:13, color:"#907060", lineHeight:1.8 }}>
                        {genComment(i, horse, result.up, result.moon, selectedRace!)}
                      </div>
                      <div style={{ marginTop:10, padding:"8px 12px", borderRadius:8, background:"rgba(200,160,50,0.08)", fontSize:12, color:"#c8a040" }}>💡 {BAKEN_TYPE[i]}</div>
                    </div>
                  ))}
                  <div style={{ marginTop:20 }}>
                    <div style={{ fontSize:10, letterSpacing:3, color:"#907040", marginBottom:12 }}>FULL RANKING（全{result.ranked.length}頭）</div>
                    {result.ranked.map((horse, i) => (
                      <div key={horse.umaban} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:7 }}>
                        <div style={{ width:18, fontSize:11, color:"#504030", textAlign:"right", flexShrink:0 }}>{i+1}</div>
                        <div style={{ width:26, height:26, borderRadius:6, background:WAKU_BG[horse.wakuban], color:WAKU_TEXT[horse.wakuban], display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:11, flexShrink:0 }}>{horse.umaban}</div>
                        <div style={{ flex:1, fontSize:13 }}>{horse.name}</div>
                        <div style={{ fontSize:12, color:i<3?"#c8a040":"#504030", fontWeight:i<3?700:400 }}>{horse.score}pt</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <button onClick={() => { setResult(null); setShowUnlock(false); setBirthDate(""); setStep("input"); }} style={{ ...btnGhost, marginTop:16 }}>もう一度占う</button>
            </div>
          );
        })()}
      </div>
      <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} } @keyframes spin { to{transform:rotate(360deg)} } input[type="date"]::-webkit-calendar-picker-indicator { filter:invert(.5); } select option { background:#181018; color:#f0ead6; }`}</style>
    </div>
  );
}

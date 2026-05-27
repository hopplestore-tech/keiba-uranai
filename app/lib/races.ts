export type Horse = {
  umaban: number;
  wakuban: number;
  name: string;
  birthdate?: string;
};

export type Race = {
  id: string;
  name: string;
  date: string;
  venue: string;
  distance: string;
  grade: "G1" | "G2" | "G3" | null;
  status: "upcoming" | "finished";
  horses: Horse[];
};

export const RACES: Race[] = [
  {
    id: "20260531_tokyo_11",
    name: "日本ダービー（東京優駿）",
    date: "2026年5月31日",
    venue: "東京11R",
    distance: "芝2400m",
    grade: "G1",
    status: "upcoming",
    horses: [
      { umaban:1,  wakuban:1, name:"ロブチェン",         birthdate:"2023-04-09" },
      { umaban:2,  wakuban:1, name:"リアライズシリウス",  birthdate:"2023-03-14" },
      { umaban:3,  wakuban:2, name:"ゴーイントゥスカイ",  birthdate:"2023-03-01" },
      { umaban:4,  wakuban:2, name:"ライヒスアドラー",    birthdate:"2023-02-20" },
      { umaban:5,  wakuban:3, name:"フォルテアンジェロ",  birthdate:"2023-03-05" },
      { umaban:6,  wakuban:3, name:"アウダーシア",        birthdate:"2023-04-02" },
      { umaban:7,  wakuban:4, name:"コンジェスタス",      birthdate:"2023-02-15" },
      { umaban:8,  wakuban:4, name:"グリーンエナジー",    birthdate:"2023-03-22" },
      { umaban:9,  wakuban:5, name:"メイショウハチコウ",  birthdate:"2023-04-15" },
      { umaban:10, wakuban:5, name:"パントルナイーフ",    birthdate:"2022-02-21" },
      { umaban:11, wakuban:6, name:"マテンロウゲイル",    birthdate:"2023-02-28" },
      { umaban:12, wakuban:6, name:"バステール",          birthdate:"2023-03-18" },
      { umaban:13, wakuban:7, name:"ジャスティンビスタ",  birthdate:"2023-02-10" },
      { umaban:14, wakuban:7, name:"エムズビギン",        birthdate:"2023-04-20" },
      { umaban:15, wakuban:8, name:"ショウナンガルフ",    birthdate:"2023-03-08" },
      { umaban:16, wakuban:8, name:"アスクエジンバラ",    birthdate:"2023-02-25" },
      { umaban:17, wakuban:9, name:"アルトラムス",        birthdate:"2023-03-30" },
      { umaban:18, wakuban:9, name:"カフジエメンタール",  birthdate:"2023-04-05" },
    ],
  },
  {
    id: "20260607_tokyo_11",
    name: "安田記念",
    date: "2026年6月7日",
    venue: "東京11R",
    distance: "芝1600m",
    grade: "G1",
    status: "upcoming",
    horses: [
      { umaban:0, wakuban:0, name:"アドマイヤズーム",   birthdate:"2022-02-28" },
      { umaban:0, wakuban:0, name:"アスクイキゴミ",     birthdate:"2023-01-31" },
      { umaban:0, wakuban:0, name:"ウォーターリヒト",   birthdate:"2021-03-24" },
      { umaban:0, wakuban:0, name:"オフトレイル",       birthdate:"2021-05-14" },
      { umaban:0, wakuban:0, name:"ガイアフォース",     birthdate:"2019-02-21" },
      { umaban:0, wakuban:0, name:"サクラトゥジュール", birthdate:"2017-01-01" },
      { umaban:0, wakuban:0, name:"シックスペンス",     birthdate:"2021-04-17" },
      { umaban:0, wakuban:0, name:"シャンパンカラー",   birthdate:"2020-03-03" },
      { umaban:0, wakuban:0, name:"シリウスコルト",     birthdate:"2021-03-22" },
      { umaban:0, wakuban:0, name:"スズハローム",       birthdate:"2020-03-11" },
      { umaban:0, wakuban:0, name:"ステレンボッシュ",   birthdate:"2021-02-12" },
      { umaban:0, wakuban:0, name:"セイウンハーデス",   birthdate:"2019-04-08" },
      { umaban:0, wakuban:0, name:"ドラゴンブースト",   birthdate:"2022-03-17" },
      { umaban:0, wakuban:0, name:"トロヴァトーレ",     birthdate:"2021-04-30" },
      { umaban:0, wakuban:0, name:"パンジャタワー",     birthdate:"2022-02-21" },
      { umaban:0, wakuban:0, name:"ルクソールカフェ",   birthdate:"2022-02-26" },
      { umaban:0, wakuban:0, name:"レーベンスティール", birthdate:"2020-03-08" },
      { umaban:0, wakuban:0, name:"ロングラン",         birthdate:"2018-02-09" },
      { umaban:0, wakuban:0, name:"ワールズエンド",     birthdate:"2021-02-14" },
    ],
  },
  {
    id: "20260524_tokyo_12",
    name: "丹沢S（3勝クラス）",
    date: "2026年5月24日",
    venue: "東京12R",
    distance: "ダ2100m",
    grade: null,
    status: "upcoming",
    horses: [
      { umaban:1,  wakuban:1,  name:"インジケーター" },
      { umaban:2,  wakuban:1,  name:"オメガタキシード" },
      { umaban:3,  wakuban:2,  name:"ギュルヴィ" },
      { umaban:4,  wakuban:2,  name:"サンセットブライト" },
      { umaban:5,  wakuban:3,  name:"ジェイエルマスター" },
      { umaban:6,  wakuban:3,  name:"ジャスパーグレイト" },
      { umaban:7,  wakuban:4,  name:"タイセイアディクト" },
      { umaban:8,  wakuban:4,  name:"ダカラフェスティヴ" },
      { umaban:9,  wakuban:5,  name:"タンゴバイラリン" },
      { umaban:10, wakuban:5,  name:"テーオーマルコーニ" },
      { umaban:11, wakuban:6,  name:"ニューバラード" },
      { umaban:12, wakuban:6,  name:"パカーラン" },
      { umaban:13, wakuban:7,  name:"ビップスコーピオン" },
      { umaban:14, wakuban:7,  name:"ファリーザ" },
      { umaban:15, wakuban:8,  name:"ホウオウバリスタ" },
      { umaban:16, wakuban:8,  name:"メイショウフジ" },
      { umaban:17, wakuban:9,  name:"ラオラシオン" },
      { umaban:18, wakuban:9,  name:"ロカヒ" },
      { umaban:19, wakuban:10, name:"ロングウェイホーム" },
      { umaban:20, wakuban:10, name:"ワンパット" },
    ],
  },
  {
    id: "20260524_kyoto_11",
    name: "鴨川S（3勝クラス）",
    date: "2026年5月24日",
    venue: "京都11R",
    distance: "芝2000m",
    grade: null,
    status: "upcoming",
    horses: [
      { umaban:1,  wakuban:1, name:"アルナシーム" },
      { umaban:2,  wakuban:1, name:"エアファンディタ" },
      { umaban:3,  wakuban:2, name:"カレンルシェルブル" },
      { umaban:4,  wakuban:2, name:"サトノグランツ" },
      { umaban:5,  wakuban:3, name:"シュトルーヴェ" },
      { umaban:6,  wakuban:3, name:"ダノンベルーガ" },
      { umaban:7,  wakuban:4, name:"ノースザワールド" },
      { umaban:8,  wakuban:4, name:"ハーツイストワール" },
      { umaban:9,  wakuban:5, name:"ブレイヴロッカー" },
      { umaban:10, wakuban:5, name:"マイネルラウレア" },
      { umaban:11, wakuban:6, name:"ルージュエヴァイユ" },
      { umaban:12, wakuban:6, name:"ワンダフルタウン" },
    ],
  },
];

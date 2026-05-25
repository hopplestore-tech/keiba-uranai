"use client";

import { FortuneResult } from "@/app/lib/fortune";

const LEVEL_GRADIENTS = [
  "from-gray-800 to-gray-900",
  "from-blue-900 to-indigo-900",
  "from-emerald-800 to-teal-900",
  "from-amber-700 to-orange-800",
  "from-yellow-500 via-red-500 to-pink-600",
];

const LEVEL_BADGE_COLORS = [
  "bg-gray-600 text-gray-100",
  "bg-blue-700 text-blue-100",
  "bg-emerald-600 text-emerald-50",
  "bg-orange-500 text-orange-50",
  "bg-gradient-to-r from-yellow-400 to-red-500 text-white",
];

type Props = { result: FortuneResult; birthdate: string };

export default function FortuneResultComponent({ result, birthdate }: Props) {
  const dateLabel = birthdate.replace(/-/g, "/");

  return (
    <div className="animate-fade-in-up w-full max-w-2xl mx-auto space-y-4">
      <div className={`rounded-2xl bg-gradient-to-br ${LEVEL_GRADIENTS[result.level]} p-6 shadow-2xl border border-white/10`}>
        <div className="text-center space-y-2 mb-6">
          <p className="text-white/60 text-sm">{dateLabel} 生まれの今日の運勢</p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-white/80 text-sm bg-white/10 px-3 py-1 rounded-full">
              {result.zodiac} / {result.element}の星座
            </span>
          </div>
          <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${LEVEL_BADGE_COLORS[result.level]}`}>
            {result.title}
          </div>
          <div className="text-4xl font-black text-yellow-300 tracking-widest drop-shadow-lg">
            {result.stars}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card label="ラッキー馬番" icon="🐎">
            <div className="flex flex-wrap gap-1.5 mt-1">
              {result.luckyHorseNumbers.map((n) => (
                <span
                  key={n}
                  className="w-8 h-8 rounded-full bg-white text-gray-900 font-black text-sm flex items-center justify-center shadow"
                >
                  {n}
                </span>
              ))}
            </div>
          </Card>

          <Card label="ラッキー枠番" icon="🚦">
            <div className="flex items-center gap-2 mt-1">
              <span
                className="w-9 h-9 rounded-lg font-black text-base flex items-center justify-center shadow-lg border border-white/20"
                style={{ backgroundColor: result.luckyGateColor, color: result.luckyGateNumber <= 2 || result.luckyGateNumber === 5 ? "#111" : "#fff" }}
              >
                {result.luckyGateNumber}
              </span>
              <span className="text-white/80 text-sm">{result.luckyGateColorName}枠</span>
            </div>
          </Card>

          <Card label="ラッキー競馬場" icon="🏟️">
            <p className="text-white font-bold text-xl mt-0.5">{result.luckyRacecourse}</p>
          </Card>

          <Card label="おすすめ券種" icon="🎟️">
            <p className="text-white font-bold text-xl mt-0.5">{result.luckyBetType}</p>
          </Card>
        </div>

        <div className="rounded-xl bg-white/10 p-4 mb-4 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex-shrink-0 border-2 border-white/30 shadow"
            style={{ backgroundColor: result.luckyColorCode }}
          />
          <div>
            <p className="text-white/60 text-xs">ラッキーカラー</p>
            <p className="text-white font-semibold">{result.luckyColor}</p>
          </div>
        </div>

        <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-2">
          <p className="text-white/90 text-sm leading-relaxed">{result.message}</p>
          <p className="text-white/60 text-xs leading-relaxed">{result.subMessage}</p>
        </div>
      </div>
    </div>
  );
}

function Card({ label, icon, children }: { label: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white/10 border border-white/10 p-3">
      <div className="flex items-center gap-1.5 text-white/60 text-xs mb-1">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      {children}
    </div>
  );
}

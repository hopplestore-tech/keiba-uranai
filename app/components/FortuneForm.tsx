"use client";

import { useState } from "react";
import { calculateFortune, FortuneResult } from "@/app/lib/fortune";
import FortuneResultComponent from "./FortuneResult";

export default function FortuneForm() {
  const [birthdate, setBirthdate] = useState("");
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!birthdate) {
      setError("生年月日を入力してください");
      return;
    }

    const [y, m, d] = birthdate.split("-").map(Number);
    const date = new Date(y, m - 1, d);

    if (isNaN(date.getTime()) || date.getFullYear() !== y) {
      setError("有効な日付を入力してください");
      return;
    }

    if (y < 1900 || y > new Date().getFullYear()) {
      setError("生年月日が正しくありません");
      return;
    }

    setLoading(true);
    setResult(null);

    setTimeout(() => {
      setResult(calculateFortune(y, m, d));
      setLoading(false);
    }, 800);
  }

  function handleReset() {
    setResult(null);
    setBirthdate("");
    setError("");
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
            <div>
              <label htmlFor="birthdate" className="block text-white/80 text-sm font-medium mb-2">
                あなたの生年月日
              </label>
              <input
                id="birthdate"
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                min="1900-01-01"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 text-base transition-colors"
              />
              {error && (
                <p className="mt-2 text-red-400 text-sm">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-black py-3.5 px-6 rounded-xl text-base transition-all shadow-lg hover:shadow-yellow-500/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" />
                  占い中...
                </span>
              ) : (
                "今日の競馬運を占う 🐎"
              )}
            </button>
          </div>

          <p className="text-center text-white/30 text-xs">
            同じ生年月日の運勢は一日を通じて同じ結果が表示されます
          </p>
        </form>
      ) : (
        <div className="space-y-4">
          <FortuneResultComponent result={result} birthdate={birthdate} />
          <div className="text-center">
            <button
              onClick={handleReset}
              className="text-white/60 hover:text-white text-sm underline underline-offset-2 transition-colors"
            >
              もう一度占う
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

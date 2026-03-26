"use client";

import { useState, useEffect } from "react";

const QUESTIONS = [
  {
    id: 1,
    question: "How many free hours do you have per week outside your main job?",
    options: [
      { label: "Less than 5 hours", value: 1 },
      { label: "5–10 hours", value: 2 },
      { label: "10–20 hours", value: 3 },
      { label: "20+ hours", value: 4 },
    ],
  },
  {
    id: 2,
    question: "Which best describes your most marketable skill?",
    options: [
      { label: "General / Admin work", value: 1 },
      { label: "Creative or content (design, writing, video)", value: 3 },
      { label: "Tech or coding (dev, data, AI)", value: 4 },
      { label: "Consulting / coaching in a specific niche", value: 4 },
    ],
  },
  {
    id: 3,
    question: "Have you ever sold anything online or to clients independently?",
    options: [
      { label: "Never tried", value: 1 },
      { label: "Explored but didn't close any deal", value: 2 },
      { label: "Made some money, inconsistently", value: 3 },
      { label: "Yes — I have paying clients", value: 4 },
    ],
  },
  {
    id: 4,
    question: "How comfortable are you with financial uncertainty?",
    options: [
      { label: "Very uncomfortable — I need stability", value: 1 },
      { label: "OK with minor ups and downs", value: 2 },
      { label: "Comfortable taking calculated risks", value: 3 },
      { label: "I thrive under uncertainty — it motivates me", value: 4 },
    ],
  },
  {
    id: 5,
    question: "What's your biggest blocker to starting a side hustle?",
    options: [
      { label: "I don't know what to offer", value: 1 },
      { label: "No time to commit to it", value: 2 },
      { label: "Fear of failure or judgment", value: 2 },
      { label: "Honestly, nothing — I just haven't started", value: 4 },
    ],
  },
];

const LOADING_MESSAGES = [
  "Analyzing your answers...",
  "Calculating income potential...",
  "Benchmarking against 12,400+ profiles...",
  "Identifying your best monetization path...",
  "Generating your personalized breakdown...",
];

type Stage = "landing" | "quiz" | "loading" | "result" | "email-gate" | "unlocked";

function getScoreData(score: number) {
  if (score >= 85) {
    return {
      tier: "HIGH FLYER",
      tierColor: "#00E676",
      tagline: "You're built for this.",
      summary: "Your combination of time, skills, and mindset puts you in the top tier. People with your profile typically generate $3,000–$8,000/month within 6 months of starting.",
      insights: [
        "🔥 Your skill set is directly monetizable — clients will pay premium rates",
        "⏳ You have enough time to treat this like a real business, not a hobby",
        "💡 Your risk tolerance means you won't quit when it gets hard",
      ],
      income: "$3,000–$8,000/mo",
      timeline: "3–6 months to $1K/mo",
    };
  } else if (score >= 65) {
    return {
      tier: "SOLID POTENTIAL",
      tierColor: "#00D9FF",
      tagline: "You have what it takes — with focus.",
      summary: "Strong foundations. A few adjustments in how you allocate time and position your skills could unlock serious income. Most people in your range hit $1,000–$3,000/month within 6–12 months.",
      insights: [
        "⚡ Your skills are marketable — the gap is packaging and pricing",
        "🎯 Time is your main constraint — block 3 focused hours/week to start",
        "📈 Past experience (even informal) gives you a massive head start",
      ],
      income: "$1,000–$3,000/mo",
      timeline: "6–12 months to $1K/mo",
    };
  } else if (score >= 40) {
    return {
      tier: "BUILDING BLOCKS",
      tierColor: "#FFB800",
      tagline: "The foundation is there. Time to build on it.",
      summary: "You have raw potential but a few key factors are holding you back. The good news: every one of them is fixable. Most people at this stage make $500–$1,500/month within their first year.",
      insights: [
        "🧱 Skill development is your #1 leverage point right now",
        "🕐 Even 5 hours/week is enough to start — consistency beats volume",
        "🛡️ Mindset is a learnable skill — most successful hustlers started scared",
      ],
      income: "$500–$1,500/mo",
      timeline: "9–15 months to $1K/mo",
    };
  } else {
    return {
      tier: "EARLY STAGE",
      tierColor: "#FF6B6B",
      tagline: "The starting line is exactly where you need to be.",
      summary: "Right now, the blockers are real — but not permanent. Every high-earner started here. The key is picking one thing, starting small, and building momentum.",
      insights: [
        "🌱 One marketable skill is all you need to start — pick one and go deep",
        "📚 Fastest ROI right now: a free course in a high-demand area",
        "✅ Set a 90-day goal: one paid project, even at a low rate",
      ],
      income: "$100–$500/mo",
      timeline: "12–18 months to $1K/mo",
    };
  }
}

export default function SideHustleScore() {
  const [stage, setStage] = useState<Stage>("landing");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [email, setEmail] = useState("");
  const [displayScore, setDisplayScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    if (stage !== "loading") return;
    let progress = 0;
    let step = 0;
    const interval = setInterval(() => {
      progress += 8;
      setLoadingProgress(Math.min(progress, 98));
      if (progress % 20 === 0 && step < LOADING_MESSAGES.length - 1) {
        step++;
        setLoadingStep(step);
      }
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setStage("result"), 300);
      }
    }, 130);
    return () => clearInterval(interval);
  }, [stage]);

  useEffect(() => {
    if (stage !== "result") return;
    let current = 0;
    const target = score;
    const increment = Math.ceil(target / 40);
    const t = setInterval(() => {
      current = Math.min(current + increment, target);
      setDisplayScore(current);
      if (current >= target) clearInterval(t);
    }, 35);
    return () => clearInterval(t);
  }, [stage, score]);

  function calcScore(ans: number[]): number {
    const raw = ans.reduce((a, b) => a + b, 0);
    const max = QUESTIONS.length * 4;
    return Math.round((raw / max) * 100);
  }

  function handleAnswer(value: number) {
    setSelectedOption(value);
    setTimeout(() => {
      const newAnswers = [...answers, value];
      setAnswers(newAnswers);
      setSelectedOption(null);
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        const s = calcScore(newAnswers);
        setScore(s);
        setStage("loading");
      }
    }, 400);
  }

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setStage("unlocked");
  }

  function resetAll() {
    setStage("landing");
    setAnswers([]);
    setCurrentQ(0);
    setScore(0);
    setDisplayScore(0);
    setLoadingStep(0);
    setLoadingProgress(0);
    setEmail("");
    setSelectedOption(null);
  }

  const scoreData = getScoreData(score);
  const circumference = 2 * Math.PI * 70;
  const shareText = `I just scored ${score}/100 on the Side Hustle Potential Test 🔥\n\nMy tier: ${scoreData?.tier}\nIncome potential: ${scoreData?.income}\n\nDiscover yours 👇`;
  const shareUrl = "https://side-hustle-potential-score.vercel.app";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem 1rem" }}>
      <div style={{ width: "100%", maxWidth: 448 }}>

        {stage === "landing" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9999, padding: "0.375rem 1rem", fontSize: "0.75rem", color: "#9ca3af", marginBottom: "1.5rem" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", display: "inline-block" }}></span>
                12,847+ people tested
              </div>
              <h1 style={{ fontSize: "2.25rem", fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: "1rem" }}>
                What&apos;s Your{" "}
                <span style={{ background: "linear-gradient(135deg, #a855f7, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Side Hustle</span>{" "}
                Potential Score?
              </h1>
              <p style={{ color: "#9ca3af", fontSize: "1.1rem", lineHeight: 1.6, marginBottom: "2rem" }}>
                Answer 5 questions. Discover your realistic income potential outside your 9-5 — and exactly what&apos;s holding you back.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "2rem" }}>
                {[{stat:"2 min",label:"to complete"},{stat:"Free",label:"no signup needed"},{stat:"100%",label:"anonymous"}].map((item) => (
                  <div key={item.label} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.75rem", padding: "0.75rem", textAlign: "center" }}>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: "1.1rem" }}>{item.stat}</div>
                    <div style={{ color: "#6b7280", fontSize: "0.7rem" }}>{item.label}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => setStage("quiz")} style={{ width: "100%", background: "linear-gradient(135deg, #a855f7, #06b6d4)", color: "#fff", fontWeight: 700, fontSize: "1.1rem", padding: "1rem", borderRadius: "1rem", border: "none", cursor: "pointer" }}>
                Get My Score →
              </button>
              <p style={{ color: "#4b5563", fontSize: "0.75rem", marginTop: "0.75rem" }}>No email required · Results in 2 minutes</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1rem", padding: "1.25rem" }}>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #a855f7, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, flexShrink: 0 }}>S</div>
                <div>
                  <div style={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem" }}>Sarah K. — UX Designer</div>
                  <div style={{ color: "#9ca3af", fontSize: "0.875rem", marginTop: "0.25rem" }}>&ldquo;Scored 78/100. Three months later I quit my job. The breakdown was eye-opening.&rdquo;</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {stage === "quiz" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", gap: "0.375rem", flex: 1 }}>
                {QUESTIONS.map((_, i) => (
                  <div key={i} style={{ height: 6, flex: 1, borderRadius: 9999, background: i < currentQ ? "linear-gradient(90deg, #a855f7, #06b6d4)" : i === currentQ ? "rgba(168,85,247,0.6)" : "rgba(255,255,255,0.1)", transition: "background 0.3s" }} />
                ))}
              </div>
              <span style={{ color: "#6b7280", fontSize: "0.875rem", whiteSpace: "nowrap" }}>{currentQ + 1}/{QUESTIONS.length}</span>
            </div>
            <div style={{ marginBottom: "2rem" }}>
              <p style={{ color: "#a855f7", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>Question {currentQ + 1}</p>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{QUESTIONS[currentQ].question}</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {QUESTIONS[currentQ].options.map((opt) => (
                <button key={opt.label} onClick={() => handleAnswer(opt.value)} style={{ width: "100%", textAlign: "left", padding: "1rem", borderRadius: "1rem", border: selectedOption === opt.value ? "1px solid #a855f7" : "1px solid rgba(255,255,255,0.1)", background: selectedOption === opt.value ? "rgba(168,85,247,0.2)" : "rgba(255,255,255,0.05)", color: selectedOption === opt.value ? "#fff" : "#d1d5db", fontSize: "1rem", cursor: "pointer", transition: "all 0.2s" }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {stage === "loading" && (
          <div style={{ textAlign: "center", padding: "3rem 0" }}>
            <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto 2rem" }}>
              <svg style={{ width: 160, height: 160, transform: "rotate(-90deg)" }} viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                <circle cx="80" cy="80" r="70" fill="none" stroke="url(#loadGrad)" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 70}`} strokeDashoffset={`${2 * Math.PI * 70 * (1 - loadingProgress / 100)}`} style={{ transition: "stroke-dashoffset 0.1s linear" }} />
                <defs><linearGradient id="loadGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#a855f7" /><stop offset="100%" stopColor="#06b6d4" /></linearGradient></defs>
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#fff", fontWeight: 800, fontSize: "2rem" }}>{loadingProgress}%</span>
              </div>
            </div>
            <h2 style={{ color: "#fff", fontWeight: 700, fontSize: "1.5rem", marginBottom: "0.5rem" }}>Calculating your score...</h2>
            <p style={{ color: "#a855f7", fontSize: "0.875rem" }}>{LOADING_MESSAGES[loadingStep]}</p>
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1rem", padding: "1.25rem", marginTop: "1.5rem", textAlign: "left" }}>
              {["Time availability","Skill monetization potential","Market demand alignment","Mindset & risk profile","Income trajectory model"].map((item, i) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.375rem 0", fontSize: "0.875rem", color: loadingProgress > i * 18 ? "#4ade80" : "#4b5563", transition: "color 0.3s" }}>
                  <span>{loadingProgress > i * 18 ? "✓" : "○"}</span><span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {stage === "result" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <p style={{ color: "#6b7280", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.5rem" }}>Your Score</p>
              <div style={{ position: "relative", width: 176, height: 176, margin: "0 auto 1.5rem" }}>
                <svg style={{ width: 176, height: 176, transform: "rotate(-90deg)" }} viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                  <circle cx="80" cy="80" r="70" fill="none" stroke="url(#scoreGrad)" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${circumference}`} strokeDashoffset={`${circumference * (1 - displayScore / 100)}`} style={{ transition: "stroke-dashoffset 0.03s linear" }} />
                  <defs><linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#a855f7" /><stop offset="100%" stopColor="#06b6d4" /></linearGradient></defs>
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#fff", fontWeight: 900, fontSize: "3rem", lineHeight: 1 }}>{displayScore}</span>
                  <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>/100</span>
                </div>
              </div>
              <div style={{ display: "inline-block", padding: "0.375rem 1rem", borderRadius: 9999, fontSize: "0.875rem", fontWeight: 700, marginBottom: "0.75rem", background: `${scoreData.tierColor}20`, color: scoreData.tierColor, border: `1px solid ${scoreData.tierColor}40` }}>{scoreData.tier}</div>
              <p style={{ color: "#e5e7eb", fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>{scoreData.tagline}</p>
              <p style={{ color: "#9ca3af", fontSize: "0.875rem", lineHeight: 1.6 }}>{scoreData.summary}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1rem", padding: "1rem" }}>
                <p style={{ color: "#6b7280", fontSize: "0.7rem", marginBottom: "0.25rem" }}>Income Potential</p>
                <p style={{ color: "#fff", fontWeight: 700 }}>{scoreData.income}</p>
              </div>
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1rem", padding: "1rem" }}>
                <p style={{ color: "#6b7280", fontSize: "0.7rem", marginBottom: "0.25rem" }}>Timeline</p>
                <p style={{ color: "#fff", fontWeight: 700, fontSize: "0.875rem" }}>{scoreData.timeline}</p>
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1rem", padding: "1.25rem", marginBottom: "1.5rem" }}>
              <p style={{ color: "#fff", fontWeight: 600, marginBottom: "1rem" }}>3 Key Insights for You</p>
              {scoreData.insights.map((insight) => (<div key={insight} style={{ color: "#d1d5db", fontSize: "0.875rem", lineHeight: 1.5, marginBottom: "0.5rem" }}>{insight}</div>))}
            </div>
            <div style={{ background: "linear-gradient(135deg, rgba(88,28,135,0.4), rgba(8,145,178,0.2))", border: "1px solid rgba(168,85,247,0.3)", borderRadius: "1rem", padding: "1.25rem", marginBottom: "1.5rem" }}>
              <p style={{ color: "#fff", fontWeight: 700, marginBottom: "0.75rem" }}>🔓 Unlock Your Full Breakdown</p>
              <ul style={{ color: "#9ca3af", fontSize: "0.875rem", marginBottom: "1rem", listStyle: "none", padding: 0 }}>
                <li style={{ marginBottom: "0.375rem" }}>✓ Your #1 best side hustle model</li>
                <li style={{ marginBottom: "0.375rem" }}>✓ 30/60/90 day action plan</li>
                <li style={{ marginBottom: "0.375rem" }}>✓ Best platforms to start on</li>
                <li>✓ Pricing benchmarks for your skill set</li>
              </ul>
              <button onClick={() => setStage("email-gate")} style={{ width: "100%", background: "linear-gradient(135deg, #a855f7, #06b6d4)", color: "#fff", fontWeight: 700, padding: "0.875rem", borderRadius: "0.75rem", border: "none", cursor: "pointer", fontSize: "1rem" }}>Unlock Full Results →</button>
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ color: "#6b7280", fontSize: "0.875rem", textAlign: "center", marginBottom: "0.75rem" }}>Share your score</p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {[
                  { label: "𝕏 Twitter", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}` },
                  { label: "in LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
                  { label: "💬 WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}` },
                ].map((s) => (<a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.75rem", padding: "0.625rem", textAlign: "center", color: "#d1d5db", fontSize: "0.8rem", textDecoration: "none", display: "block" }}>{s.label}</a>))}
              </div>
            </div>
            <button onClick={resetAll} style={{ width: "100%", background: "none", border: "none", color: "#4b5563", fontSize: "0.875rem", cursor: "pointer", padding: "0.5rem" }}>Take the test again</button>
          </div>
        )}

        {stage === "email-gate" && (
          <div style={{ padding: "2rem 0" }}>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔓</div>
              <h2 style={{ color: "#fff", fontWeight: 700, fontSize: "1.75rem", marginBottom: "0.75rem" }}>Unlock Your Full Breakdown</h2>
              <p style={{ color: "#9ca3af", lineHeight: 1.6 }}>Personalized action plan for your score of <strong style={{ color: "#fff" }}>{score}/100</strong>.</p>
            </div>
            <form onSubmit={handleEmailSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "0.75rem", padding: "1rem", color: "#fff", fontSize: "1rem", outline: "none" }} />
              <button type="submit" style={{ width: "100%", background: "linear-gradient(135deg, #a855f7, #06b6d4)", color: "#fff", fontWeight: 700, fontSize: "1.1rem", padding: "1rem", borderRadius: "0.75rem", border: "none", cursor: "pointer" }}>Send My Full Breakdown →</button>
              <p style={{ color: "#4b5563", fontSize: "0.75rem", textAlign: "center" }}>No spam. Unsubscribe anytime.</p>
            </form>
            <button onClick={() => setStage("result")} style={{ width: "100%", background: "none", border: "none", color: "#4b5563", fontSize: "0.875rem", cursor: "pointer", padding: "0.75rem", marginTop: "0.5rem" }}>← Go back</button>
          </div>
        )}

        {stage === "unlocked" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>🎉</div>
              <h2 style={{ color: "#fff", fontWeight: 700, fontSize: "1.75rem", marginBottom: "0.5rem" }}>Your Full Breakdown</h2>
              <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>Score: <strong style={{ color: "#fff" }}>{score}/100 · {scoreData.tier}</strong></p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1rem", padding: "1.25rem" }}>
                <p style={{ color: "#a855f7", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>Your Best Side Hustle Model</p>
                <p style={{ color: "#d1d5db", fontSize: "0.875rem", lineHeight: 1.6 }}>{score >= 65 ? "Consulting or service-based freelancing is your fastest path to income. You have the skills, tolerance for uncertainty, and enough time to land your first client within 30 days. Consider: tech consulting, content creation, or coaching in your niche." : "Productized services — small, clearly-scoped deliverables with a fixed price. This lowers sales complexity and fits into limited time. Think: SEO audit, 1-page website, branded templates, or a specific tutorial."}</p>
              </div>
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1rem", padding: "1.25rem" }}>
                <p style={{ color: "#06b6d4", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>Your 30/60/90 Day Plan</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem", color: "#d1d5db" }}>
                  {[
                    { label: "Day 1–30", color: "#a855f7", text: 'Define your offer. Pick one skill, one audience. Write your "I help X do Y" statement. Post it publicly.' },
                    { label: "Day 31–60", color: "#06b6d4", text: "Get 3 testimonials. Offer your service for free or discounted. Document results obsessively." },
                    { label: "Day 61–90", color: "#fff", text: "Start charging full price. Use testimonials as proof. Aim for 1 paying client at full rate." },
                  ].map((item) => (<div key={item.label} style={{ display: "flex", gap: "0.75rem" }}><span style={{ color: item.color, fontWeight: 700, whiteSpace: "nowrap", fontSize: "0.8rem" }}>{item.label}</span><span>{item.text}</span></div>))}
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1rem", padding: "1.25rem" }}>
                <p style={{ color: "#4ade80", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>Best Platforms to Start</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  {["LinkedIn (B2B outreach)","Upwork (first clients fast)","X/Twitter (build in public)","Substack (newsletter)"].map((p) => (<div key={p} style={{ background: "rgba(255,255,255,0.05)", borderRadius: "0.75rem", padding: "0.75rem", color: "#d1d5db", fontSize: "0.8rem" }}>{p}</div>))}
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1rem", padding: "1.25rem" }}>
                <p style={{ color: "#fbbf24", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>Pricing Benchmarks</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {[
                    { type: "Entry offer", price: score >= 65 ? "$150–$300" : "$50–$150" },
                    { type: "Core service", price: score >= 65 ? "$500–$1,500" : "$200–$500" },
                    { type: "Premium package", price: score >= 65 ? "$2,000–$5,000" : "$800–$2,000" },
                  ].map((item) => (<div key={item.type} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}><span style={{ color: "#9ca3af" }}>{item.type}</span><span style={{ color: "#fff", fontWeight: 700 }}>{item.price}</span></div>))}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
              {[
                { label: "𝕏 Share Score", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}` },
                { label: "💬 WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}` },
              ].map((s) => (<a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.75rem", padding: "0.75rem", textAlign: "center", color: "#d1d5db", fontSize: "0.875rem", textDecoration: "none", display: "block" }}>{s.label}</a>))}
            </div>
            <button onClick={resetAll} style={{ width: "100%", background: "none", border: "none", color: "#4b5563", fontSize: "0.875rem", cursor: "pointer", padding: "0.5rem" }}>Take the test again</button>
          </div>
        )}

      </div>
    </div>
  );
}

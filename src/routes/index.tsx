import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import heroBg from "@/assets/hero-bg.jpg";
import ornament from "@/assets/ornament.png";
import weddingMusic from "@/assets/leberch-invitation-wedding-375839.mp3";

function useBackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    const audio = new Audio(weddingMusic);
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;

    // Try to autoplay immediately
    audio.play().then(() => {
      startedRef.current = true;
    }).catch(() => {
      // Autoplay blocked — start on first user interaction
      const startOnInteraction = () => {
        if (!startedRef.current && audioRef.current) {
          audioRef.current.play().then(() => {
            startedRef.current = true;
          }).catch(() => {});
        }
        document.removeEventListener("click", startOnInteraction);
        document.removeEventListener("touchstart", startOnInteraction);
      };
      document.addEventListener("click", startOnInteraction, { once: true });
      document.addEventListener("touchstart", startOnInteraction, { once: true });
    });

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = muted;
  }, [muted]);

  return { muted, setMuted };
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aslam ♥ Safwana — Wedding Invitation" },
      { name: "description", content: "Join us in celebrating the wedding of Muhammed Aslam Wafy & Safwana Akbar — Sunday, 19 July 2026, KJM Auditorium, Vettikkattiri." },
      { property: "og:title", content: "Aslam ♥ Safwana — Wedding Invitation" },
      { property: "og:description", content: "You are cordially invited — 19 July 2026, KJM Auditorium, Vettikkattiri." },
    ],
  }),
  component: Invitation,
});

const WEDDING_DATE = new Date("2026-07-19T11:00:00+05:30");

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const minutes = Math.floor((diff / 60000) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, done: diff === 0 };
}

function Invitation() {
  const [opened, setOpened] = useState(false);
  const [rsvp, setRsvp] = useState<"yes" | "no" | null>(null);
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { muted, setMuted } = useBackgroundMusic();

  useEffect(() => {
    const saved = localStorage.getItem("wedding-rsvp");
    if (saved) {
      const p = JSON.parse(saved);
      setRsvp(p.rsvp); setName(p.name || ""); setSubmitted(true);
    }
  }, []);

  const cd = useCountdown(WEDDING_DATE);

  const openInvitation = () => {
    setOpened(true);
  };

  const submitRsvp = (choice: "yes" | "no") => {
    setRsvp(choice); setSubmitted(true);
    localStorage.setItem("wedding-rsvp", JSON.stringify({ rsvp: choice, name }));
  };

  const stars = useMemo(
    () => Array.from({ length: 40 }, () => ({
      top: Math.random() * 100, left: Math.random() * 100,
      delay: Math.random() * 3, size: 2 + Math.random() * 3,
    })), []
  );

  if (!opened) {
    return (
      <main
        className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(8,30,20,0.85), rgba(8,30,20,0.95)), url(${heroBg})`,
          backgroundSize: "cover", backgroundPosition: "center",
        }}
      >
        {stars.map((s, i) => (
          <span key={i} className="absolute rounded-full bg-gold twinkle pointer-events-none"
            style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }} />
        ))}
        <div className="text-center max-w-2xl float-in relative z-10">
          <p className="font-arabic text-3xl gold-text mb-4">السلام عليكم</p>
          <p className="text-gold-soft tracking-[0.4em] text-xs uppercase mb-6">An Invitation Awaits</p>
          <h1 className="font-display text-5xl md:text-7xl gold-text leading-tight mb-3">
            Aslam <span className="font-script text-4xl md:text-6xl">&amp;</span> Safwana
          </h1>
          <p className="text-gold-soft/80 italic mb-10">19 . 07 . 2026 — In sha Allah</p>
          <button
            onClick={openInvitation}
            className="group relative px-10 py-4 rounded-full border border-gold/60 bg-gold/10 backdrop-blur text-gold font-display text-lg tracking-widest uppercase hover:bg-gold hover:text-emerald-deep transition-all duration-500 glow-pulse"
          >
            Open Invitation
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative">
      {/* Fixed background */}
      <div className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `linear-gradient(rgba(8,30,20,0.92), rgba(8,30,20,0.97)), url(${heroBg})`,
          backgroundSize: "cover", backgroundAttachment: "fixed",
        }}
      />
      {stars.map((s, i) => (
        <span key={i} className="fixed rounded-full bg-gold twinkle pointer-events-none -z-10"
          style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }} />
      ))}

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 float-in">
        <p className="font-arabic text-4xl md:text-5xl gold-text mb-6">بسم الله الرحمن الرحيم</p>
        <p className="italic text-gold-soft/80 mb-2 max-w-md">"In the name of Allah, the Most Gracious and Merciful"</p>
        <div className="divider-ornament w-full max-w-md my-8"><span className="text-gold">❖</span></div>
        <p className="tracking-[0.3em] text-gold-soft/70 text-xs uppercase mb-4">Together with their families</p>
        <h1 className="font-display text-6xl md:text-8xl gold-text leading-none mb-2">Muhammed Aslam</h1>
        <p className="font-script text-5xl md:text-6xl text-gold my-4">&amp;</p>
        <h1 className="font-display text-6xl md:text-8xl gold-text leading-none mb-8">Safwana Akbar</h1>
        <p className="italic text-gold-soft max-w-xl">
          request the honour of your presence as they begin their journey together
        </p>
        <div className="mt-12 flex flex-col items-center gap-2">
          <p className="text-gold-soft/70 text-sm">SUNDAY • 19 JULY 2026 • 11:00 AM</p>
          <p className="text-gold-soft/50 text-xs">KJM Auditorium, Vettikkattiri</p>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="tracking-[0.3em] text-gold-soft/70 text-xs uppercase mb-3">Counting Every Moment</p>
          <h2 className="font-display text-4xl md:text-5xl gold-text mb-12">Until We Celebrate</h2>
          <div className="grid grid-cols-4 gap-3 md:gap-6">
            {[
              { label: "Days", value: cd.days },
              { label: "Hours", value: cd.hours },
              { label: "Minutes", value: cd.minutes },
              { label: "Seconds", value: cd.seconds },
            ].map((u) => (
              <div key={u.label} className="rounded-2xl border border-gold/30 bg-card/40 backdrop-blur p-4 md:p-8 glow-pulse">
                <div className="font-display text-4xl md:text-6xl gold-text tabular-nums">
                  {String(u.value).padStart(2, "0")}
                </div>
                <div className="text-gold-soft/70 text-xs md:text-sm tracking-widest uppercase mt-2">{u.label}</div>
              </div>
            ))}
          </div>
          {cd.done && <p className="mt-8 font-script text-4xl gold-text">Today is the day! 🎉</p>}
        </div>
      </section>

      {/* DETAILS */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <img src={ornament} alt="" className="w-64 mx-auto mb-6 opacity-80" loading="lazy" />
          <div className="rounded-3xl border border-gold/30 bg-card/50 backdrop-blur p-10 md:p-16 text-center">
            <p className="font-arabic text-2xl gold-text mb-4">إن شاء الله</p>
            <p className="italic text-gold-soft mb-8">'Insha Allah'</p>

            <div className="grid md:grid-cols-3 gap-8">
              <Detail icon="📅" title="When" lines={["Sunday", "19 July 2026", "(1448 Safar 05)"]} />
              <Detail icon="📍" title="Venue" lines={["KJM Auditorium,", "Vettikkattiri"]} />
              <Detail icon="🍽️" title="Lunch" lines={["11:00 AM —", "02:30 PM"]} />
            </div>

            <div className="divider-ornament my-10"><span className="text-gold">❖</span></div>

            <p className="text-gold-soft/80 italic leading-relaxed">
              Mr. Ali Allannoor &amp; Mrs. Suhara<br />
              Allannoor House, Attoor P.O, Thrissur Dist<br />
              <span className="text-gold-soft/60 text-sm">Mob: 9387102420</span>
            </p>
            <p className="text-gold-soft/80 italic mt-4 leading-relaxed">
              D/o Mr. Ali Akbar &amp; Mrs. Sabira Akbar<br />
              Pazhamkulam House, Chunangad, Pilathara,<br />
              Ottapalam – Palakkad
            </p>
          </div>
        </div>
      </section>

      {/* DUA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="font-display text-3xl gold-text mb-6">O' Allah</h3>
          <p className="italic text-gold-soft/90 leading-loose text-lg">
            Guide this Marriage to the best of understanding<br />
            — Happiness, Prosperity &amp; Success.
          </p>
        </div>
      </section>

      {/* RSVP */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="tracking-[0.3em] text-gold-soft/70 text-xs uppercase mb-3">Kindly Respond</p>
          <h2 className="font-display text-4xl md:text-5xl gold-text mb-4">Will You Join Us?</h2>
          <p className="text-gold-soft/70 italic mb-10">Your presence is the greatest blessing</p>

          {!submitted ? (
            <div className="rounded-3xl border border-gold/30 bg-card/50 backdrop-blur p-8 md:p-12">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border-b border-gold/40 text-center text-gold placeholder:text-gold-soft/40 py-3 mb-8 focus:outline-none focus:border-gold transition-colors font-display text-lg"
              />
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => submitRsvp("yes")}
                  className="px-8 py-4 rounded-full bg-gold text-emerald-deep font-display tracking-widest uppercase hover:scale-105 transition-transform glow-pulse"
                >
                  ✦ Joyfully Accept
                </button>
                <button
                  onClick={() => submitRsvp("no")}
                  className="px-8 py-4 rounded-full border border-gold/50 text-gold font-display tracking-widest uppercase hover:bg-gold/10 transition"
                >
                  Regretfully Decline
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-gold/30 bg-card/50 backdrop-blur p-10 float-in">
              {rsvp === "yes" ? (
                <>
                  <p className="font-script text-5xl gold-text mb-4">Alhamdulillah!</p>
                  <p className="text-gold-soft text-lg">
                    {name ? `Dear ${name}, your` : "Your"} acceptance fills our hearts with joy. See you on 19 July, In sha Allah. 💚
                  </p>
                </>
              ) : (
                <>
                  <p className="font-script text-5xl gold-text mb-4">We'll miss you</p>
                  <p className="text-gold-soft text-lg">
                    Thank you {name && `${name} `}for letting us know. Please keep us in your duas.
                  </p>
                </>
              )}
              <button
                onClick={() => { setSubmitted(false); localStorage.removeItem("wedding-rsvp"); }}
                className="mt-6 text-gold-soft/60 text-sm underline hover:text-gold"
              >
                Change response
              </button>
            </div>
          )}
        </div>
      </section>

      {/* COMPLIMENTS */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="divider-ornament mb-6"><span className="text-gold">❖</span></div>
          <p className="text-gold-soft/70 italic text-sm">With Best Compliments From</p>
          <p className="font-display text-gold-soft mt-3 leading-relaxed">
            Fasal Abid, Suhaila, Swalih, Shahana,<br />
            Izzah Mehaveen, Aysha Mihra &amp; Hawwa
          </p>
        </div>
      </section>

      <footer className="py-10 text-center text-gold-soft/40 text-xs tracking-widest">
        <p>MADE WITH 💚 FOR ASLAM &amp; SAFWANA</p>
      </footer>


    </main>
  );
}

function Detail({ icon, title, lines }: { icon: string; title: string; lines: string[] }) {
  return (
    <div>
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-gold tracking-widest uppercase text-xs mb-2">{title}</p>
      {lines.map((l, i) => (
        <p key={i} className="text-gold-soft/90 font-display">{l}</p>
      ))}
    </div>
  );
}

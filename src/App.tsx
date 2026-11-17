import { useEffect, useRef, useState, type CSSProperties } from "react";

const weddingTime = new Date("2026-12-19T18:00:00+05:30").getTime();
const directions =
  "https://www.google.com/maps/search/?api=1&query=Akbar+Auditorium+Ponnani+Kerala";

function Icon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === "arrow" ? (
        <>
          <path d="M5 12h14m-5-5 5 5-5 5" />
        </>
      ) : name === "down" ? (
        <path d="M12 4v16m-5-5 5 5 5-5" />
      ) : name === "calendar" ? (
        <>
          <rect x="4" y="5" width="16" height="16" rx="1" />
          <path d="M8 3v4m8-4v4M4 11h16m-11 4h.01M12 15h.01M15 15h.01" />
        </>
      ) : name === "pin" ? (
        <>
          <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
          <circle cx="12" cy="10" r="2.5" />
        </>
      ) : name === "heart" ? (
        <path d="M20.8 5.8a5 5 0 0 0-7.1 0L12 7.5l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 22l8.8-9.1a5 5 0 0 0 0-7.1Z" />
      ) : name === "music" ? (
        <>
          <path d="M9 18V5l11-2v13M9 8l11-2" />
          <ellipse cx="6" cy="18" rx="3" ry="2.5" />
          <ellipse cx="17" cy="16" rx="3" ry="2.5" />
        </>
      ) : (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </>
      )}
    </svg>
  );
}

function Ornament() {
  return (
    <div className="ornament" aria-hidden="true">
      <span />
      <svg width="38" height="22" viewBox="0 0 38 22" fill="none">
        <path
          d="M1 11c9 0 12-9 18-9s9 9 18 9c-9 0-12 9-18 9S10 11 1 11Z"
          stroke="currentColor"
          strokeWidth=".8"
        />
        <path d="m19 7 4 4-4 4-4-4 4-4Z" fill="currentColor" />
      </svg>
      <span />
    </div>
  );
}

function FloatingHearts() {
  return (
    <div className="floating-hearts" aria-hidden="true">
      {Array.from({ length: 12 }, (_, index) => (
        <span
          className="flying-heart"
          key={index}
          style={
            {
              left: `${[6, 91, 17, 82, 32, 69, 10, 95, 24, 76, 43, 58][index]}%`,
              "--flight-duration": `${19 + (index % 5) * 3}s`,
              "--flight-delay": `${-index * 4.7}s`,
              "--heart-size": `${12 + (index % 4) * 4}px`,
              "--heart-drift": `${(index % 2 ? -1 : 1) * (24 + (index % 3) * 18)}px`,
            } as CSSProperties
          }
        >
          <Icon name="heart" />
        </span>
      ))}
    </div>
  );
}

function saveDate() {
  const calendar = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Together With Love//Wedding//EN",
    "BEGIN:VEVENT",
    "UID:shibili-liya-nafla-fuad-20261219",
    "DTSTAMP:20260101T000000Z",
    "DTSTART:20261219T123000Z",
    "DTEND:20261219T163000Z",
    "SUMMARY:Shibili & Liya and Nafla & Fuad — Wedding Reception",
    "LOCATION:Akbar Auditorium\\, Ponnani\\, Kerala",
    "DESCRIPTION:Join us for a celebration of love. Reception from 6:00 PM onwards.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([calendar], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "our-wedding-19-december.ics";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function App() {
  const [remaining, setRemaining] = useState(Math.max(0, weddingTime - Date.now()));
  const [music, setMusic] = useState(false);
  const [calendarSaved, setCalendarSaved] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const player = audio.current;
    if (!player) return;
    player.volume = 0.4;

    function stopWaitingForInteraction() {
      document.removeEventListener("pointerdown", playOnInteraction);
      document.removeEventListener("keydown", playOnInteraction);
    }

    function syncPlaying() {
      setMusic(true);
      stopWaitingForInteraction();
    }

    function syncPaused() {
      setMusic(false);
    }

    function attemptPlayback() {
      // Browsers may require a user gesture before allowing audible playback.
      void player!.play().catch(() => {});
    }

    function playOnInteraction(event: Event) {
      // Let the sound button handle its own gesture without competing play requests.
      if (event.target instanceof Element && event.target.closest(".music-control")) return;
      if (event instanceof KeyboardEvent && (event.metaKey || event.ctrlKey || event.altKey))
        return;
      attemptPlayback();
    }

    player.addEventListener("playing", syncPlaying);
    player.addEventListener("pause", syncPaused);
    player.addEventListener("error", syncPaused);
    document.addEventListener("pointerdown", playOnInteraction, { passive: true });
    document.addEventListener("keydown", playOnInteraction);
    attemptPlayback();

    return () => {
      stopWaitingForInteraction();
      player.removeEventListener("playing", syncPlaying);
      player.removeEventListener("pause", syncPaused);
      player.removeEventListener("error", syncPaused);
    };
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const layers = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    let frame = 0;

    function updateParallax() {
      frame = 0;
      if (preference.matches) return;
      const mobileScale = window.innerWidth < 640 ? 0.45 : 1;
      // Measure the parent so an element's own translation cannot feed back into its position.
      const offsets = layers.map((layer) => {
        const bounds = layer.parentElement!.getBoundingClientRect();
        const distance = window.innerHeight / 2 - (bounds.top + bounds.height / 2);
        const offset = Math.max(
          -65,
          Math.min(65, distance * Number(layer.dataset.parallax) * mobileScale),
        );
        return `${offset.toFixed(2)}px`;
      });
      layers.forEach((layer, index) => layer.style.setProperty("--parallax-y", offsets[index]));
    }

    function scheduleUpdate() {
      if (!preference.matches && !frame) frame = requestAnimationFrame(updateParallax);
    }

    function resetMotion() {
      cancelAnimationFrame(frame);
      frame = 0;
      layers.forEach((layer) => layer.style.removeProperty("--parallax-y"));
      scheduleUpdate();
    }

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    preference.addEventListener("change", resetMotion);
    scheduleUpdate();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      preference.removeEventListener("change", resetMotion);
      layers.forEach((layer) => layer.style.removeProperty("--parallax-y"));
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(
      () => setRemaining(Math.max(0, weddingTime - Date.now())),
      1000,
    );
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => {
      clearInterval(timer);
      observer.disconnect();
    };
  }, []);

  async function toggleMusic() {
    if (!audio.current) return;
    if (!audio.current.paused) {
      audio.current.pause();
      setMusic(false);
    } else {
      try {
        await audio.current.play();
        setMusic(true);
      } catch {
        setMusic(false);
      }
    }
  }

  const countdown = [
    [Math.floor(remaining / 86400000), "Days"],
    [Math.floor(remaining / 3600000) % 24, "Hours"],
    [Math.floor(remaining / 60000) % 60, "Minutes"],
    [Math.floor(remaining / 1000) % 60, "Seconds"],
  ];

  return (
    <>
      <FloatingHearts />
      <main>
        <section id="home" className="hero">
          <div className="hero-frame" aria-hidden="true" />
          <img
            className="hero-floral floral-right"
            data-parallax="0.16"
            src="/images/floral.png"
            alt=""
          />
          <img
            className="hero-floral floral-left"
            data-parallax="-0.12"
            src="/images/floral.png"
            alt=""
          />
          <div className="hero-content" data-parallax="0.045">
            <div className="hero-intro">
              <span className="eyebrow">In the name of Allah, the most merciful</span>
              <p lang="ar" dir="rtl" className="bismillah">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            </div>
            <p className="hero-invite">Together with our families, we invite you to celebrate</p>
            <h1>
              <span>
                Shibili <em>&</em> Liya
              </span>
              <small>AND</small>
              <span>
                Nafla <em>&</em> Fuad
              </span>
            </h1>
            <p className="hero-tagline">Two beautiful beginnings. One unforgettable day.</p>
            <Ornament />
            <div className="date-display">
              <span>Saturday</span>
              <div>
                <span>December</span>
                <strong>19</strong>
                <span>2026</span>
              </div>
              <span>6:00 PM onwards</span>
            </div>
            <p className="hijri">
              10 Rajab 1448 AH <span>·</span> Akbar Auditorium, Ponnani
            </p>
            <a className="button primary" href="#invitation">
              You’re invited <Icon name="arrow" />
            </a>
          </div>
          <a href="#invitation" className="scroll-cue">
            <span>A beautiful beginning awaits</span>
            <Icon name="down" />
          </a>
          <span className="hero-side-note">A CELEBRATION OF LOVE & TOGETHERNESS</span>
        </section>

        <section id="invitation" className="invitation section-pad">
          <div className="reveal">
            <span className="eyebrow">With love, from our family to yours</span>
            <h2>A heartfelt invitation</h2>
            <Ornament />
            <p className="invitation-opening">By His grace, we begin.</p>
            <p className="hosts">
              Mr. Abdul Azeez <em>&</em> Mrs. Sareena Azeez
            </p>
            <p className="address">Thekkath Veedu (H), Kottathara, Ponnani</p>
            <p className="body-copy invite-copy">
              With grateful hearts and the blessings of Almighty Allah, we invite you to join us as
              our beloved children begin a new journey together.
            </p>
          </div>
          <div className="couples reveal">
            <div className="couple">
              <span className="eyebrow">A new chapter</span>
              <h3>
                Shibili <em>&</em> Liya
              </h3>
              <div className="small-line" />
              <p>D/o Mr. Sideeq & Mrs. Aminu Sideeq</p>
              <p className="address">
                Vilakkathra Valappil (H)
                <br />
                Athaloor (P.O.), Mathoor
              </p>
            </div>
            <div className="couple-join">
              <Icon name="heart" />
            </div>
            <div className="couple">
              <span className="eyebrow">A forever kind of love</span>
              <h3>
                Nafla <em>&</em> Fuad
              </h3>
              <div className="small-line" />
              <p>
                S/o Mr. Mohammed Ali &<br />
                Mrs. Nadeera Mohammed Ali
              </p>
              <p className="address">
                Ettika Parambil (H)
                <br />
                Thavanur (P.O.), Muvankara
              </p>
            </div>
          </div>
          <p className="invitation-note reveal">
            Your presence is our greatest blessing.
            <br />
            <span>We look forward to celebrating with you, In Sha Allah.</span>
          </p>
        </section>

        <section className="countdown-section">
          <div className="reveal countdown-inner">
            <div>
              <span className="eyebrow">Every moment brings us closer</span>
              <h2>{remaining > 0 ? "Until we celebrate" : "The celebration is here"}</h2>
            </div>
            <div className="countdown" aria-label="Countdown to the wedding reception">
              {countdown.map(([value, label]) => (
                <div key={label}>
                  <strong>{String(value).padStart(2, "0")}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="celebration" className="celebration section-pad">
          <div className="reveal">
            <span className="eyebrow">A day to remember</span>
            <h2>The celebration</h2>
            <p className="body-copy">An evening of joy, heartfelt duas, and beautiful memories.</p>
          </div>
          <div className="event-card reveal">
            <div className="event-date">
              <span>December</span>
              <strong>19</strong>
              <span>Saturday, 2026</span>
              <i>10 Rajab 1448 AH</i>
            </div>
            <div className="event-details">
              <span className="eyebrow">Together is a beautiful place to be</span>
              <h3>Wedding reception</h3>
              <p>
                <Icon name="clock" />
                6:00 PM onwards
              </p>
              <p>
                <Icon name="pin" />
                Akbar Auditorium, Ponnani
              </p>
              <button
                className="text-button"
                onClick={() => {
                  saveDate();
                  setCalendarSaved(true);
                }}
              >
                {calendarSaved ? "Calendar invitation downloaded" : "Add to your calendar"}
                <Icon name="calendar" />
              </button>
            </div>
            <div className="event-flower" data-parallax="0.1" aria-hidden="true">
              <img src="/images/floral.png" alt="" />
            </div>
          </div>
          <a
            className="text-button download-link"
            href="/images/invitation.jpg"
            download="Wedding-invitation.jpg"
          >
            View & download the invitation <Icon name="arrow" />
          </a>
        </section>

        <section className="blessing">
          <div className="reveal">
            <Ornament />
            <p>
              “And He placed between you
              <br />
              <em>affection and mercy.</em>”
            </p>
            <span className="eyebrow">Surah Ar-Rum · 30:21</span>
          </div>
        </section>

        <section id="venue" className="venue section-pad">
          <div className="venue-copy reveal">
            <span className="eyebrow">We’ll see you here</span>
            <h2>
              A place for
              <br />
              beautiful memories
            </h2>
            <p className="venue-name">Akbar Auditorium</p>
            <p className="body-copy">
              Ponnani, Kerala
              <br />
              Saturday, 19 December 2026 · 6:00 PM onwards
            </p>
            <a className="button primary" href={directions} target="_blank" rel="noreferrer">
              Get directions <Icon name="arrow" />
            </a>
            <div className="contact">
              <span>Need a little help finding us?</span>
              <a href="tel:+919539591242">+91 95395 91242</a>
              <a href="tel:+919539043811">+91 95390 43811</a>
            </div>
          </div>
          <a
            className="venue-map reveal"
            href={directions}
            target="_blank"
            rel="noreferrer"
            aria-label="Find Akbar Auditorium on Google Maps"
          >
            <div className="map-grid" />
            <div className="map-river" />
            <span className="map-label label-one">PONNANI</span>
            <span className="map-label label-two">Bharathapuzha</span>
            <div className="map-marker">
              <span>
                <Icon name="pin" />
              </span>
              <strong>Akbar Auditorium</strong>
              <small>Ponnani, Kerala</small>
            </div>
            <span className="map-link">
              Explore on Google Maps <Icon name="arrow" />
            </span>
          </a>
        </section>

        <footer>
          <img src="/images/floral.png" alt="" className="footer-floral" data-parallax="-0.12" />
          <div className="reveal">
            <span className="eyebrow">With love & duas</span>
            <h2>
              We can’t wait to celebrate
              <br />
              <em>with you.</em>
            </h2>
            <Ornament />
            <p className="footer-names">
              Shibili & Liya <span>·</span> Nafla & Fuad
            </p>
            <p className="footer-date">19 . 12 . 2026</p>
            <p className="warm-wishes">Warm wishes from Ashmiya, Aysha & Adam</p>
          </div>
          <div className="footer-bottom">
            <span>Two beginnings. One beautiful celebration.</span>
            <a href="#home">Back to top ↑</a>
          </div>
        </footer>
      </main>
      <audio ref={audio} src="/wedding-music.mp3" autoPlay loop preload="auto" />
      <button
        className={`music-control ${music ? "playing" : ""}`}
        onClick={toggleMusic}
        aria-label={music ? "Pause background music" : "Play background music"}
        aria-pressed={music}
      >
        <Icon name="music" />
        <span>{music ? "Sound on" : "Sound off"}</span>
        <span className="sound-bars">
          <i />
          <i />
          <i />
        </span>
      </button>
      <span className="sr-only" role="status">
        {calendarSaved ? "Your calendar invitation has been downloaded." : ""}
      </span>
    </>
  );
}

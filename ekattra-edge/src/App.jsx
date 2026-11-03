import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { CONTACT, CONTENT_CAPABILITIES, NAV, ORGANIC_CAPABILITIES, OUTCOMES, PILLARS, PREMISE, RHYTHM, STEPS } from "./content.js";
import { scrollToId, setScrollLocked, useActiveIndex, useDarkSection, useNavState, useReveal, useScrub, useSmoothScroll } from "./hooks.js";
import { sceneState } from "./three/store.js";

const Scene = lazy(() => import("./three/Scene.jsx"));
const pad = (n) => String(n + 1).padStart(2, "0");

function Link({ to, className, children, onClick }) {
  return (
    <a href={to === "top" ? "/" : `/${to}`} className={className}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
        setTimeout(() => scrollToId(to), 30);
      }}>
      {children}
    </a>
  );
}

function Nav() {
  const { hidden, scrolled } = useNavState();
  const [open, setOpen] = useState(false);
  useEffect(() => { document.documentElement.classList.toggle("menu-open", open); setScrollLocked(open); }, [open]);
  const links = (
    <>
      {NAV.map((n, i) => (
        <Link key={n.id} to={n.id} onClick={() => setOpen(false)}>
          <span className="nav-idx">{pad(i)}</span>{n.label}
        </Link>
      ))}
      <Link to="contact" className="nav-cta" onClick={() => setOpen(false)}>Start a story <span aria-hidden>→</span></Link>
    </>
  );
  return (
    <>
      <header className={`nav ${hidden && !open ? "is-hidden" : ""} ${scrolled && !open ? "is-scrolled" : ""}`}>
        <Link to="top" className="logo" onClick={() => setOpen(false)}>
          <span className="logo-name">Ekattra <em>Edge</em></span>
          <span className="logo-tagline">A Story Telling Company</span>
        </Link>
        <nav className="nav-links" aria-label="Primary">{links}</nav>
        <button className="menu-btn" aria-expanded={open} aria-controls="menu-sheet" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
          <span /><span />
        </button>
      </header>
      <nav id="menu-sheet" className={`menu-sheet ${open ? "open" : ""}`} aria-label="Menu" inert={!open}>{links}</nav>
    </>
  );
}

function Hero() {
  return (
    <section className="hero" data-stage id="top">
      <p className="eyebrow hero-meta"><span className="dot" />Organic media · branded content · And Beyond</p>
      <h1 className="hero-title">
        {["Content.", "Context.", "Conversation."].map((w, i) => (
          <span key={w} className={`line ${i === 1 ? "it" : ""}`} style={{ "--d": `${0.15 + i * 0.12}s` }}><span>{w}</span></span>
        ))}
      </h1>
      <div className="hero-foot">
        <p className="lead">
          Every brand has a story.<br />
          Not every story finds its audience.<br />
          Building brands through credibility and compelling stories.
        </p>
        <div className="ctas">
          <Link to="contact" className="btn btn-solid">Talk to us about your story <span aria-hidden>→</span></Link>
          <Link to="services" className="btn btn-ghost">See what we deliver</Link>
        </div>
      </div>
      <div className="scroll-cue" aria-hidden><span>Scroll</span><i /></div>
    </section>
  );
}

function Premise() {
  const ref = useRef(null);
  const p = useScrub(ref);
  const words = PREMISE.split(" ");
  return (
    <section className="premise section" data-stage id="about">
      <SectionHead n={0} label="The premise" />
      <h2 className="display" data-reveal>Attention is easy to buy.<br /><em>Trust is harder to earn.</em></h2>
      <p className="scrub" ref={ref}>
        {words.map((w, i) => <span key={i} className={i / words.length < p ? "lit" : ""}>{w} </span>)}
      </p>
      <div className="premise-turn" data-reveal>
        <p>The challenge is not simply to say more.</p>
        <p><em>It is to make every brand story count.</em></p>
      </div>
      <ul className="triplet" aria-label="What a brand needs">
        {["Visibility", "Credibility", "Relevance"].map((w, i) => (
          <li key={w} data-reveal style={{ "--d": `${i * 0.1}s` }}>{w}<span className="accent">.</span></li>
        ))}
      </ul>
    </section>
  );
}

function SectionHead({ n, label }) {
  return (
    <div className="section-head" data-reveal>
      <span className="idx">({pad(n)})</span>
      <span className="rule" />
      <span className="eyebrow">{label}</span>
    </div>
  );
}

function Pillars() {
  const refs = useRef([]);
  const active = useActiveIndex(refs);
  useEffect(() => { sceneState.active = active; }, [active]);
  useEffect(() => () => { sceneState.active = -1; }, []);
  return (
    <section className="pillars section" data-stage id="services">
      <SectionHead n={1} label="What we do" />
      <h2 className="display" data-reveal>Two disciplines.<br /><em>One connected story.</em></h2>
      <ol className="pillar-list">
        {PILLARS.map((p, i) => (
          <li key={p.name} ref={(el) => (refs.current[i] = el)} className="pillar" data-active={active === i || undefined} data-reveal>
            <span className="pillar-n">{pad(i)}</span>
            <div>
              <h3>{p.name}</h3>
              <p>{p.line}</p>
              <ul className="tags">{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
          </li>
        ))}
      </ol>
      <p className="pillar-close" data-reveal>
        Organic engagement earns credibility. Branded content scales the story. Together, they create a more consistent and trusted brand presence.
      </p>
      <div className="capability-groups">
        <CapabilityGroup title="01 / Strategic organic media engagement" items={ORGANIC_CAPABILITIES} />
        <CapabilityGroup title="02 / Strategic branded content" items={CONTENT_CAPABILITIES} />
      </div>
    </section>
  );
}

function CapabilityGroup({ title, items }) {
  return (
    <div className="capability-group" data-reveal>
      <h3 className="eyebrow">{title}</h3>
      <ul className="capability-list">
        {items.map((item) => <li key={item.name}><strong>{item.name}</strong><span>{item.line}</span></li>)}
      </ul>
    </div>
  );
}

function Marquee() {
  const row = ["Content", "Context", "Conversation"];
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee-track">
        {Array.from({ length: 4 }).flatMap((_, k) => row.map((w, i) => (
          <span key={`${k}-${i}`}>{i === 1 ? <em>{w}</em> : w}<i>✦</i></span>
        )))}
      </div>
    </div>
  );
}

function Engage() {
  return (
    <section className="engage section" data-stage id="engage">
      <SectionHead n={3} label="How we engage" />
      <h2 className="display" data-reveal>Nothing in isolation.<br /><em>Everything adds to the story.</em></h2>
      <ol className="steps">
        {STEPS.map((s, i) => (
          <li key={s.name} data-reveal style={{ "--d": `${i * 0.08}s` }}>
            <span className="step-n">{pad(i)}</span>
            <h3>{s.name}</h3>
            <p>{s.line}</p>
          </li>
        ))}
      </ol>
      <h3 className="eyebrow rhythm-heading" data-reveal>Consistency builds familiarity. Relevance builds credibility.</h3>
      <p className="rhythm-intro" data-reveal>Our media engagement rhythm stays active between the moments that matter.</p>
      <ul className="rhythm">
        {RHYTHM.map((r, i) => <li key={r.name} data-reveal style={{ "--d": `${i * 0.06}s` }}><strong>{r.name}</strong><span>{r.line}</span></li>)}
      </ul>
    </section>
  );
}

function Outcomes() {
  return (
    <section className="outcomes section" data-stage id="outcomes">
      <SectionHead n={4} label="The value for brands" />
      <h2 className="display" data-reveal>From being visible<br /><em>to being valued.</em></h2>
      <ul className="outcome-list">
        {OUTCOMES.map((o, i) => <li key={o.name} data-reveal style={{ "--d": `${i * 0.08}s` }}><span>{pad(i)}</span><div><h3>{o.name}</h3><p>{o.line}</p></div></li>)}
      </ul>
      <p className="pillar-close" data-reveal>Visibility creates an opportunity. <em>Credibility gives it value.</em></p>
    </section>
  );
}

function Contact() {
  const ref = useRef(null);
  useDarkSection(ref);
  return (
    <section className="contact section" data-stage id="contact" ref={ref}>
      <SectionHead n={5} label="Contact" />
      <h2 className="contact-title" data-reveal>Let's build<br /><em>a story that matters.</em></h2>
      <a className="contact-mail" href={`mailto:${CONTACT.email}`} data-reveal>{CONTACT.email}<span aria-hidden>↗</span></a>
      <div className="contact-meta" data-reveal>
        <div><span className="eyebrow">Call</span><a href={CONTACT.phoneHref}>{CONTACT.phone}</a></div>
        <div><span className="eyebrow">Location</span><span>{CONTACT.city}</span></div>
        <div><span className="eyebrow">Also reach us</span><a href={`mailto:${CONTACT.infoEmail}`}>{CONTACT.infoEmail}</a></div>
      </div>
      <footer className="foot">
        <span>© {new Date().getFullYear()} Ekattra Edge</span>
        <span className="foot-mark">एकत्र — <em>gathered, together</em></span>
        <Link to="top">Back to top ↑</Link>
      </footer>
    </section>
  );
}

export default function App() {
  useSmoothScroll();
  useReveal();
  return (
    <>
      <div className="bg" aria-hidden />
      <Suspense fallback={null}><Scene /></Suspense>
      <div className="grain" aria-hidden />
      <Nav />
      <main>
        <Hero />
        <Premise />
        <Pillars />
        <Marquee />
        <Engage />
        <Outcomes />
        <Contact />
      </main>
    </>
  );
}

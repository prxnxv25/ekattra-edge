import { Link } from 'react-router-dom'
import { company, story, pillars, sectors } from '../data/content.js'

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>
          <span className="w1">Content.</span>
          <span className="w2">Context.</span>
          <span className="w3">Conversation.</span>
        </h1>
        <p className="hero-intro">{company.intro}</p>
        <div className="actions">
          <Link className="btn" to="/contact">Talk to us about your story</Link>
          <Link className="btn ghost" to="/services">See what we deliver</Link>
        </div>
      </section>

      <section className="band">
        <div className="wrap split">
          <div>
            <h2>{story.heading}</h2>
            <p className="lead">{story.body}</p>
          </div>
          <div className="turn">
            <p>{story.turn[0]}<br />{story.turn[1]}</p>
            <ul className="outcomes">
              {story.outcomes.map((o) => <li key={o}>{o}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="wrap section">
        <h2>Three pillars, one story</h2>
        <div className="pillars">
          {pillars.map((p) => (
            <article key={p.name} className="pillar">
              <h3>{p.name}</h3>
              <p>{p.text}</p>
              <p className="tags">{p.tags.join(' | ')}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="dark">
        <div className="wrap split">
          <h2>{story.promise}</h2>
          <div>
            <p className="dark-label">We work with</p>
            <ul className="plain">
              {sectors.map((s) => <li key={s}>{s}</li>)}
            </ul>
            <Link className="btn light" to="/industries">How we engage</Link>
          </div>
        </div>
      </section>
    </>
  )
}

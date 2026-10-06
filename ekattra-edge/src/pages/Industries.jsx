import { Link } from 'react-router-dom'
import { sectors, sectorNote, engagements } from '../data/content.js'

export default function Industries() {
  return (
    <>
      <section className="wrap page-head">
        <h1>Who we work with</h1>
        <p className="lead">{sectorNote}</p>
      </section>

      <section className="wrap">
        <ul className="sector-list">
          {sectors.map((s) => <li key={s}>{s}</li>)}
        </ul>
      </section>

      <section className="band section-gap">
        <div className="wrap">
          <h2>How we engage</h2>
          <p className="lead">Flexible by design.</p>
          <div className="engage">
            {engagements.map((e) => (
              <article key={e.name}>
                <h3>{e.name}</h3>
                <p className="line">{e.line}</p>
                <p>{e.text}</p>
              </article>
            ))}
          </div>
          <Link className="btn" to="/contact">Start a conversation!</Link>
        </div>
      </section>
    </>
  )
}

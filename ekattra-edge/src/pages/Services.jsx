import { disciplines } from '../data/content.js'

export default function Services() {
  return (
    <>
      <section className="wrap page-head">
        <h1>Where the work happens</h1>
        <p className="lead">Four interconnected disciplines. Each one supports the others, so a story keeps building after it is first told.</p>
      </section>

      <section className="wrap">
        {disciplines.map((d) => (
          <article key={d.name} className="discipline">
            <div>
              <p className="tag">{d.tag}</p>
              <h2>{d.name}</h2>
              <p>{d.text}</p>
            </div>
            <ul>
              {d.items.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </article>
        ))}
      </section>
    </>
  )
}

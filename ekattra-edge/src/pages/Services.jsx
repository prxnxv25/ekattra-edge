import { disciplines } from '../data/content.js'

export default function Services() {
  return (
    <>
      <section className="wrap page-head">
        <h1>Two complementary ways to build brand value</h1>
        <p className="lead">Strategic organic media engagement builds reputation over time. Strategic branded content expands reach with greater control over story, context and audience.</p>
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

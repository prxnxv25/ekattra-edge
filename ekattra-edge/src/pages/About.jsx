import { story, approach } from '../data/content.js'

export default function About() {
  return (
    <>
      <section className="wrap page-head">
        <h1>{approach.heading}</h1>
        <p className="lead">{approach.body}</p>
      </section>

      <section className="band">
        <div className="wrap split">
          <div>
            <h2>The dots are already there</h2>
            <p className="chips">
              {approach.dots.map((d) => <span key={d}>{d}</span>)}
            </p>
          </div>
          <p className="lead">{approach.connect}</p>
        </div>
      </section>

      <section className="wrap section">
        <h2>Five questions we begin with</h2>
        <ol className="questions">
          {approach.questions.map((q) => <li key={q}>{q}</li>)}
        </ol>
      </section>

      <section className="dark">
        <div className="wrap">
          <p className="big">{approach.note}</p>
          <p className="dark-label">{story.promise}</p>
        </div>
      </section>
    </>
  )
}

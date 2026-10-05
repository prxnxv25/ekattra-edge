import { company } from '../data/content.js'

export default function Contact() {
  return (
    <section className="wrap page-head contact">
      <h1>Let's talk story.</h1>
      <p className="lead">
        We're just getting started, and always happy to talk. Whether you're building a new brand narrative,
        launching a campaign, or looking for a storytelling partner who brings both strategy and craft,
        we'd love to hear from you.
      </p>
      <dl className="details">
        <div><dt>Based in</dt><dd>{company.location}</dd></div>
        <div><dt>Email</dt><dd><a href={`mailto:${company.email}`}>{company.email}</a></dd></div>
        <div><dt>Phone</dt><dd><a href={`tel:${company.phone.replace(/-/g, '')}`}>{company.phone}</a></dd></div>
      </dl>
      <a className="btn" href={`mailto:${company.email}?subject=Let's talk story`}>Email Ekattra Edge</a>
    </section>
  )
}

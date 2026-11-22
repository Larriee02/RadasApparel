import React from 'react'
import { ABOUT_METRICS } from '../../data/raddasData'

function AboutSection({ onBookFitting, onOpenPage }) {
  return (
    <section id="about" aria-labelledby="house-story-title" className="house-story">
      <div className="house-story-spread">
        <header className="house-story-intro">
          <p className="house-story-place">Victoria Island, Lagos</p>
          <h1 id="house-story-title" className="font-serif-display">The house<br />of <em>Radas</em></h1>
          <p className="house-story-lead">In our Victoria Island workroom, we cut ceremonial agbadas and dinner jackets at the same table.</p>
          <div className="house-story-actions">
            <button onClick={() => onBookFitting('New Custom Measurement Profile')}>Book a fitting <span aria-hidden="true">↗</span></button>
            <button onClick={() => onOpenPage('contact')}>Contact the workroom</button>
          </div>
        </header>
        <figure className="house-story-portraits">
          <img className="house-story-look" src="/lookbook/agbada-wine.jpg" alt="The Sovereign wine agbada with gold embroidery" />
          <img className="house-story-detail" src="/lookbook/atelier-craft.jpg" alt="A tailor hand-stitching wine cloth at the worktable" />
        </figure>
      </div>
      <div className="house-story-notes">
        <h2 className="font-serif-display">Cloth, cut <em>&amp; finish</em></h2>
        <p>We work with high-twist European wool, Italian velvet and hand-loomed Aso-Oke. A bespoke agbada begins with a pattern drawn from the wearer’s measurements. Inside, our cutters finish the seams with Bemberg cupro satin piping.</p>
      </div>
      <dl className="house-story-facts">
        {ABOUT_METRICS.map(metric => (
          <div key={metric.label}>
            <dt>{metric.label}</dt>
            <dd><strong className="font-serif-display">{metric.figure}</strong>{metric.detail}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export default React.memo(AboutSection)

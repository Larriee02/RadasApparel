import React from 'react'
import { SALON_LOCATIONS } from '../../data/raddasData'

function AtelierFooter({ onBookFitting, onCookieSettings }) {
  return (
    <footer className="atelier-footer">
      <div className="footer-spread">
        <figure className="footer-workroom">
          <img src="/lookbook/atelier-craft.jpg" alt="Hands stitching wine cloth beside a tailor’s shears and measuring tape" loading="lazy" />
          <figcaption>Victoria Island workroom, Lagos</figcaption>
        </figure>

        <div className="footer-appointments">
          <h2 className="font-serif-display">
            <button type="button" onClick={() => onBookFitting()}>
              Book a <em>fitting</em><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 19 19 5M6 5h13v13" />
              </svg>
            </button>
          </h2>
          <div className="footer-salons">
            {SALON_LOCATIONS.map(({ city, address }) => (
              <div key={city}>
                <h3 className="font-serif-display">{city}</h3>
                <address>{address}</address>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="house-signature" className="footer-imprint">
        <div className="footer-signature font-serif-display">
          <span>Radas</span>
          <img src="/monogram-gold.png" width="48" height="40" alt="" />
          <em>Apparel</em>
        </div>
        <div className="footer-colophon">
          <small>© {new Date().getFullYear()} Radas Apparel</small>
          <small>Prices in Nigerian naira (₦)</small>
          <button type="button" onClick={onCookieSettings}>Cookie settings</button>
        </div>
      </div>
    </footer>
  )
}

export default React.memo(AtelierFooter)

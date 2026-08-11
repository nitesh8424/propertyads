export default function About() {
  return (
    <main className="about">
      <section className="pageHero">
        <h1>About Us</h1>
        <p>Trusted Property Partner</p>
      </section>
      <section className="aboutGrid">
        <div className="aboutPhoto"></div>
        <div>
          <h2>Who We Are</h2>
          <p>
            LandHub is a trusted platform for buying and selling land
            properties. We connect buyers with verified land owners across
            Maharashtra. Our mission is to make land buying simple, transparent
            and hassle-free.
          </p>
          <hr />
          <h2>Why Choose Us?</h2>
          <div className="why">
            <div>
              ◉ <b>Verified Properties</b>
              <small>All properties are verified</small>
            </div>
            <div>
              ◉ <b>Genuine Information</b>
              <small>100% transparent details</small>
            </div>
            <div>
              ◉ <b>Easy & Convenient</b>
              <small>Simple process to connect</small>
            </div>
            <div>
              ◉ <b>Trusted Support</b>
              <small>We are here to help</small>
            </div>
          </div>
        </div>
      </section>
      <section className="mission">
        <h2>Our Mission</h2>
        <p>
          To help people find the right land at the right price with complete
          transparency and trust.
        </p>
      </section>
    </main>
  );
}

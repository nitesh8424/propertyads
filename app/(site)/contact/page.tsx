"use client";
import { useState } from "react";
export default function Contact() {
  const [sent, setSent] = useState(false);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const r = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(fd)),
      headers: { "Content-Type": "application/json" },
    });
    if (r.ok) {
      setSent(true);
      e.currentTarget.reset();
    }
  };
  return (
    <main className="contact">
      <div className="contactInfo">
        <h1>Contact Us</h1>
        <p>
          Have questions or need assistance?
          <br />
          We're here to help!
        </p>
        <a href="tel:+919876543210">☎ +91 98765 43210</a>
        <a href="mailto:info@landhub.com">✉ info@landhub.com</a>
        <span>⌖ Kalamb, Maharashtra, India</span>
      </div>
      <form onSubmit={submit} className="contactForm">
        <div className="formGrid">
          <input name="name" required placeholder="Your name" />
          <input name="email" type="email" required placeholder="Your email" />
          <input name="mobile" required placeholder="Your mobile number" />
        </div>
        <textarea
          name="message"
          required
          rows={6}
          placeholder="Type your message here..."
        ></textarea>
        <button className="greenBtn">
          {sent ? "Message Sent ✓" : "Send Message"}
        </button>
      </form>
    </main>
  );
}

"use client";
import Link from "next/link";
import { useState } from "react";
export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <Link href="/" className="brand">
        ⌂ <span>LandHub</span>
      </Link>
      <button className="menu" onClick={() => setOpen(!open)}>
        ☰
      </button>
      <nav className={open ? "nav open" : "nav"}>
        <Link href="/">Home</Link>
        <Link href="/#properties">Properties</Link>
        <Link href="/about">About Us</Link>
        <Link href="/contact">Contact Us</Link>
        {/* <Link className="adminBtn" href="/admin/properties/new">
          Admin Login
        </Link> */}
      </nav>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div>
        <b>⌂ LandHub</b>
        <p>Your trusted partner in finding the perfect land and properties.</p>
      </div>
      <div>
        <b>Quick Links</b>
        <Link href="/">Home</Link>
        <Link href="/#properties">Properties</Link>
        <Link href="/about">About Us</Link>
        <Link href="/contact">Contact Us</Link>
      </div>
      <div>
        <b>Contact Info</b>
        <span>📍 Kalamb, Maharashtra, India</span>
        <span>☎ +91 98765 43210</span>
        <span>✉ info@landhub.com</span>
      </div>
      <div>
        <b>Newsletter</b>
        <p>Subscribe to get latest property updates.</p>
        <div className="newsletter">
          <input placeholder="Enter your email" />
          <button>➤</button>
        </div>
      </div>
      <small>© 2026 LandHub. All Rights Reserved.</small>
    </footer>
  );
}
export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

import styles from './Navbar.module.css';
import { Link } from "react-router-dom";
import React, { useState } from 'react';
import LogoutButton from "../LogoutButton";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className={styles.navbar}>
            {/* Left area */}
            <ul className={`${styles.navLinks} ${styles.navLinksLeft}`}>
                <li className={styles.mobileOnly}>
                    <button
                        className={styles.menuButton}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Menu"
                    >
                        Menu
                    </button>
                </li>
                <li className={styles.desktopOnly}><Link to="/"> Home </Link></li>
                <li className={styles.desktopOnly}><Link to="/places"> Categories </Link></li>
                <li className={styles.desktopOnly}><Link to="/map"> Map </Link></li>
                <li className={styles.desktopOnly}><Link to="/about"> About </Link></li>
                <li className={styles.desktopOnly}><Link to="/adminHome"> Admin </Link></li>
            </ul>

            {/* Logo */}
            <Link to="/" className={styles.logoLink} aria-label="Startseite">
                <img
                    src={"https://res.cloudinary.com/dgfycfxe1/image/upload/v1754420389/trailblaze_red_logo2_xlecjf.png"}
                    alt="Logo"
                    className={styles.logo}
                />
            </Link>

            {/* Right area */}
            <ul className={`${styles.navLinks} ${styles.navLinksRight}`}>
                <li><LogoutButton /></li>
            </ul>

            {/* Mobile menu dropdown */}
            {menuOpen && (
                <div className={styles.mobileMenu}>
                    <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                    <Link to="/places" onClick={() => setMenuOpen(false)}>Categories</Link>
                    <Link to="/map" onClick={() => setMenuOpen(false)}>Map</Link>
                    <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
                </div>
            )}
        </nav>
    );
}

export default Navbar;

import styles from './Navbar.module.css';
import { Link } from "react-router-dom";
import account from "../../assets/account.svg";
import search from "../../assets/search.svg";
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
                <li><Link to="/"><img src={search} alt="Search" className={styles.icons}/></Link></li>
                <li><Link to="/adminHome"><img src={account} alt="Account" className={styles.icons}/></Link></li>
                <LogoutButton />
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

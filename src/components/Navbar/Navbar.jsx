import styles from './Navbar.module.css';
import {Link} from "react-router-dom";
import account from "../../assets/account.svg"
import search from "../../assets/search.svg"

function Navbar ()  {
    return (
        <nav className={styles.navbar}>
            <ul className={`${styles.navLinks} ${styles.navLinksLeft}`}>
                <li><Link to="/"> Home </Link></li>
                <li><Link to="/places"> Categories </Link></li>
                <li><Link to="/map"> Map </Link></li>
                <li><Link to="/about"> About </Link></li>
            </ul>

            <Link to="/" className={styles.logoLink} aria-label="Startseite">
                <img src={"https://res.cloudinary.com/dgfycfxe1/image/upload/v1754420389/trailblaze_red_logo2_xlecjf.png"} alt="Logo" className={styles.logo} />
            </Link>

            <ul className={`${styles.navLinks} ${styles.navLinksRight}`}>
                <li><Link to="/">
                    <img src={search} alt="Search" className={styles.icons}/>
                </Link></li>
                <li><Link to="/adminHome">
                    <img src={account} alt="Account" className={styles.icons}/>
                </Link></li>
            </ul>
        </nav>
    )
}

export default Navbar
import styles from './Navbar.module.css';
import {Link} from "react-router-dom";

import logo from "../../assets/logo.svg";
import account from "../../assets/account.svg"
import search from "../../assets/search.svg"

function Navbar ()  {
    return (
        <nav className={styles.navbar}>
            <ul className={`${styles.navLinks} ${styles.navLinksLeft}`}>
                <li><Link to="/"> Home </Link></li>
                <li><Link to="/map"> Map </Link></li>
                <li><Link to="/about"> About </Link></li>
                <li><Link to="/place"> Place </Link></li>
                <li><Link to="/places"> Places </Link></li>
                <li><Link to="/addPlace"> AddPlace </Link></li>
            </ul>

            <Link to="/" className={styles.logoLink} aria-label="Startseite">
                <img src={logo} alt="Logo" className={styles.logo} />
            </Link>

            <ul className={`${styles.navLinks} ${styles.navLinksRight}`}>
                <li><Link to="/map">
                    <img src={account} alt="Account" className={styles.icons}/>
                </Link></li>
                <li><Link to="/">
                    <img src={search} alt="Search" className={styles.icons}/>
                </Link></li>
            </ul>
        </nav>
    )
}

export default Navbar
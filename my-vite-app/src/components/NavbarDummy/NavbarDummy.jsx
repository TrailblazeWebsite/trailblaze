import styles from '../Navbar/Navbar.module.css';

import logo from "../../assets/logo.png";
import account from "../../assets/account.svg"
import search from "../../assets/search.svg"

function NavbarDummy ()  {
    return (
        <nav className={styles.navbar}>
            <ul className={`${styles.navLinks} ${styles.navLinksLeft}`}>
                <li> Home </li>
                <li> Map </li>
                <li> Places </li>
                <li> Place </li>
                <li> About </li>
            </ul>

            <img src={logo} alt="Logo" className={styles.logo} />

            <ul className={`${styles.navLinks} ${styles.navLinksRight}`}>
                <li><img src={search} alt="Search" className={styles.icons}/></li>
                <li><img src={account} alt="Account" className={styles.icons}/></li>
            </ul>
        </nav>
    )
}

export default NavbarDummy
import styles from '../../../components/Navbar/Navbar.module.css';
import {Link} from "react-router-dom";

import logo from "../../../assets/logo.png";
import account from "../../../assets/account.svg"

function AdminNavbar ()  {
    return (
        <nav className={styles.navbar}>
            <ul className={`${styles.navLinks} ${styles.navLinksLeft}`}>
                <li><Link to="/addPlace"> AddPlace </Link></li>
                <li><Link to="/manageUser"> Manage User </Link></li>
            </ul>

            <Link to="/" className={styles.logoLink} aria-label="Startseite">
                <img src={logo} alt="Logo" className={styles.logo} />
            </Link>

            <ul className={`${styles.navLinks} ${styles.navLinksRight}`}>
                <li><Link to="/">
                    <img src={account} alt="Account" className={styles.icons}/>
                </Link></li>
            </ul>
        </nav>
    )
}

export default AdminNavbar
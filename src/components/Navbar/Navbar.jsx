import styles from './Navbar.css';
import {Link} from "react-router-dom";

function Navbar ()  {
    return (
        <nav className={styles.navbar}>
            <ul>
                <li>
                    <Link to="/" className={styles.navLink}>Home</Link>
                    <Link to="/about" className={styles.navLink}>About</Link>
                    <Link to="/map" className={styles.navLink}>Map</Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar
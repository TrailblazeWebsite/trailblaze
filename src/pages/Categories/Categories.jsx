import Navbar from "../../components/Navbar/Navbar";
import styles from "./Categories.module.css"
import {Link} from "react-router-dom";
import test from "../../Mock/Main.png";

function Categories() {
    return (
        <div>
            <Navbar />
            <div className={styles.places}>
                <Link to="/about" className={styles.newPlace} aria-label="New Place">
                    <img src={test} alt="Logo" />
                </Link>
                <Link to="/about" className={styles.newPlace} aria-label="New Place">
                    <img src={test} alt="Logo" />
                </Link>
                <Link to="/about" className={styles.newPlace} aria-label="New Place">
                    <img src={test} alt="Logo" />
                </Link>
                <Link to="/about" className={styles.newPlace} aria-label="New Place">
                    <img src={test} alt="Logo" />
                </Link>
            </div>
        </div>
    );
}

export default Categories
import Navbar from "../../components/Navbar/Navbar";
import styles from "../../components/Navbar/Navbar.module.css";

import test from "../../assets/logo.png"

function Place() {
    return (
        <div>
            <Navbar />
            <div>
                <img src={test} alt="Logo" className={styles.logo}/>
            </div>
        </div>
    );
}

export default Place
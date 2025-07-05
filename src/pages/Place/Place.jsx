import Navbar from "../../components/Navbar/Navbar";
import styles from "../../components/Navbar/Navbar.module.css";

const mainPicture = "../../Mock/Main.png"

function Place() {
    return (
        <div>
            <Navbar />
            <div>
                <img src={mainPicture} alt="Logo" className={styles.logo}/>

            </div>
        </div>
    );
}

export default Place
import styles from "./Home.module.css"
import Navbar from "../../components/Navbar/Navbar";
import Trailer from "../../assets/trailer.mp4"
import {Link} from "react-router-dom";

function Home() {
    return (
        <div className="App">
            <Navbar />
            <div className={styles.videoContainer}>
                <video autoPlay loop muted playsInline>
                    <source src={Trailer} type="video/mp4"/>
                </video>
            </div>
            <div className={styles.subtitle}>
                Newest Places
            </div>
            <div className={styles.newPlacesContainer}>
                <Link to="/about" className={styles.newPlace} aria-label="New Place">
                    <img src={"https://res.cloudinary.com/dgfycfxe1/image/upload/v1754151712/cld-sample-2.jpg"} alt="Logo" />
                </Link>
                <Link to="/about" className={styles.newPlace} aria-label="New Place">
                    <img src={"https://res.cloudinary.com/dgfycfxe1/image/upload/v1754151712/cld-sample-2.jpg"} alt="Logo" />
                </Link>
                <Link to="/about" className={styles.newPlace} aria-label="New Place">
                    <img src={"https://res.cloudinary.com/dgfycfxe1/image/upload/v1754151712/cld-sample-2.jpg"} alt="Logo" />
                </Link>
                <Link to="/about" className={styles.newPlace} aria-label="New Place">
                    <img src={"https://res.cloudinary.com/dgfycfxe1/image/upload/v1754151712/cld-sample-2.jpg"} alt="Logo" />
                </Link>
            </div>
        </div>
    );
}

export default Home
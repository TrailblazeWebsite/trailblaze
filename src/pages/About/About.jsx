import Navbar from "../../components/Navbar/Navbar";
import ReactMarkdown from "react-markdown";
import img from "../../Mock/wandern_creux_du_van.jpg"
import styles from "./About.module.css"


function About() {
    return (
        <div>
            <Navbar/>
            <div>
                <div className={styles.imgWrapper}>
                    <img src={img} alt="Image" className={styles.image}/>
                </div>
                <div className={styles.persons}>
                    <div className={styles.person}>
                        <h1>Manu</h1>

                    </div>
                    <div className={styles.person}>
                        <h1>Eru</h1>

                    </div>
                    <div className={styles.person}>
                        <h1>Silu</h1>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default About
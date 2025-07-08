import Navbar from "../../components/Navbar/Navbar";
import styles from "./Categories.module.css"
import picture from "../../Mock/wandern_creux_du_van.jpg"
import { categories } from "../../Backend/fetchCategories";
import {Link} from "react-router-dom";

export default function Categories() {
    return (
        <div>
            <Navbar/>
            <div className={styles.categories}>
                {categories.map(cat => (
                    <div className={styles.category}>
                        <div>
                            <h2><Link to="/">{cat.category}</Link></h2>
                            {cat.catDescription}
                        </div>
                        <img src={picture} className={styles.categoriesImage}/>
                    </div>
                ))}
            </div>
        </div>
    );
}

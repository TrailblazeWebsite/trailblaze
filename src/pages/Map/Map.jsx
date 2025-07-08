import Navbar from "../../components/Navbar/Navbar";
import MapBox from "../../components/MapBox/MapBox";
import styles from "./map.module.css"
import { markers } from "../../Backend/fetchMarkers";
import { categories } from "../../Backend/fetchCategories";

export default function Map() {
    return (
        <div>
            <Navbar />
            <div className={styles.mapContainer}>
                <MapBox markers={markers} categories={categories}/>
            </div>
        </div>
    );
}
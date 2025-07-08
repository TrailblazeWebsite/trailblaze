import styles from "./Place.module.css";
import googleMapsImage from "../../assets/GoogleMaps.png"
import Map from "../../components/MapBox/MapBox"
import Navbar from "../../components/Navbar/Navbar";
import {Link} from "react-router-dom";
import {place} from "../../Backend/fetchPlace";
import bild from "../../Mock/wandern_creux_du_van.jpg"

const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${place.coordinates.join(',')}`;

const marker = {
    name: place.name,
    coordinates: place.coordinates,
    description: place.shortDescription,
    category: place.category
}

export default function Place() {
    return (
        <div>
            <Navbar />
            <div className={styles.place}>
                <div className={styles.topContainer}>
                    <div>
                        <h1>{place.name}</h1>
                        <h3><Link to={'/${place.category}'}>{place.category}</Link></h3>
                        <p>{place.description}</p>
                    </div>
                    <div className={styles.imgWrapper}>
                        <img src={bild} alt="Logo" className={styles.mainImage}/>
                    </div>
                </div>
                <div className={styles.bottomContainer}>
                    <div className={styles.slideshow}>
                        <img src={bild} alt="Image"/>
                    </div>
                    <div className={styles.middleContainer}>
                        <div>
                            <Link
                                to={googleMapsLink}
                                target="_blank"
                                rel="nooper norefferer"
                            >
                                <img src={googleMapsImage} alt="Google Maps"/>
                            </Link>
                        </div>
                        <div>
                            StarRating
                        </div>
                    </div>
                    <div className={styles.map}>
                        <Map markers={[marker]} center={place.coordinates}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
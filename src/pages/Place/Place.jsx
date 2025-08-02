import styles from "./Place.module.css";
import googleMapsImage from "../../assets/GoogleMaps.png"
import Map from "../../components/MapBox/MapBox"
import Navbar from "../../components/Navbar/Navbar";
import {Link, useParams} from "react-router-dom";
import { supabase } from "../../Backend/supabaseClient";
import {useEffect, useState} from "react";

export default function Place() {

    const { id } = useParams()
    const [place, setPlace] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPlace = async () => {
            const { data, error } = await supabase
                .from('locations')
                .select(`
                    id,
                    name,
                    category:categories(name), 
                    rating,
                    coordinates,
                    short_description,
                    description,
                    image_url
                `)
                .eq('id', id)
                .single()

            if (error) {
                console.error("Fehler beim Laden:", error)
            } else {
                setPlace(data)
            }

            setLoading(false)
        }

        fetchPlace()
    }, [id])

    if (loading) return <div>⏳ Lädt...</div>
    if (!place) return <div>❌ Ort nicht gefunden</div>

    const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${place.coordinates.join(',')}`

    const marker = {
        name: place.name,
        coordinates: place.coordinates,
        description: place.short_description,
        category: place.category.name
    }

    return (
        <div>
            <Navbar />
            <div className={styles.place}>
                <div className={styles.topContainer}>
                    <div>
                        <h1>{place.name}</h1>
                        <h3><Link to={`/${place.category.name}`}>{place.category.name}</Link></h3>
                        <p>{place.description}</p>
                    </div>
                    <div className={styles.imgWrapper}>
                        <img src={place.image_url} alt={place.name} className={styles.mainImage} />
                    </div>
                </div>
                <div className={styles.bottomContainer}>
                    <div className={styles.slideshow}>
                        <img src={place.image_url} alt="Bild" />
                    </div>
                    <div className={styles.middleContainer}>
                        <div>
                            <a
                                href={googleMapsLink}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img src={googleMapsImage} alt="Google Maps" />
                            </a>
                        </div>
                        <div>
                            ⭐ Bewertung: {place.rating}
                        </div>
                    </div>
                    <div className={styles.map}>
                        <Map markers={[marker]} center={place.coordinates} />
                    </div>
                </div>
            </div>
        </div>
    )
}
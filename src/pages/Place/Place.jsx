import styles from "./Place.module.css";
import googleMapsImage from "../../assets/GoogleMaps.png";
import Map from "../../components/MapBox/MapBox";
import Navbar from "../../components/Navbar/Navbar";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../../Backend/supabaseClient";
import { useEffect, useState } from "react";

export default function Place() {
    const { id } = useParams();
    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlace = async () => {
            // 1. Ort laden
            const { data: placeData, error } = await supabase
                .from("locations")
                .select("*")
                .eq("id", parseInt(id, 10))
                .single()


            if (error || !placeData) {
                console.error("Fehler beim Laden:", error);
                setLoading(false);
                return;
            }

            // 2. Kategorie-Namen manuell laden (wenn nötig)
            if (placeData.category_id) {
                const { data: categoryData, error: categoryError } = await supabase
                    .from("categories")
                    .select("name")
                    .eq("id", placeData.category_id)
                    .single();

                if (!categoryError && categoryData) {
                    placeData.category = categoryData; // category.name verfügbar
                }
            }

            setPlace(placeData);
            setLoading(false);
        };

        fetchPlace();
    }, [id]);

    if (loading) return <div>⏳ Lädt...</div>;
    if (!place) return <div>❌ Ort nicht gefunden</div>;

    const marker = {
        name: place.name,
        coordinates: place.coordinates,
        description: place.short_description,
        category: place.category?.name || "Unbekannt"
    };

    const googleMapsLink = place.coordinates
        ? `https://www.google.com/maps/search/?api=1&query=${place.coordinates[1]},${place.coordinates[0]}`
        : "#";

    return (
        <div>
            <Navbar />
            <div className={styles.place}>
                <div className={styles.topContainer}>
                    <div>
                        <h1>{place.name}</h1>
                        {place.category && (
                            <h3>
                                <Link to={`/${place.category.name}`}>{place.category.name}</Link>
                            </h3>
                        )}
                        <p>{place.description}</p>
                    </div>
                    <div className={styles.imgWrapper}>
                        <img
                            src={place.image_url}
                            alt={place.name}
                            className={styles.mainImage}
                        />
                    </div>
                </div>

                <div className={styles.bottomContainer}>
                    <div className={styles.slideshow}>
                        <img src={place.image_url} alt="Bild" />
                    </div>

                    <div className={styles.middleContainer}>
                        <div>
                            {place.coordinates && (
                                <a
                                    href={googleMapsLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img src={googleMapsImage} alt="Google Maps" />
                                </a>
                            )}
                        </div>
                        <div>⭐ Bewertung: {place.rating}</div>
                    </div>

                    {place.coordinates && Array.isArray(place.coordinates) && place.coordinates.length === 2 ? (
                        <div className={styles.map}>
                            <Map
                                markers={[{
                                    name: place.name,
                                    coordinates: place.coordinates,
                                    description: place.short_description,
                                    category: place.category.name
                                }]}
                                center={[place.coordinates[1], place.coordinates[0]]}
                            />
                        </div>
                    ) : (
                        <div className={styles.map}>
                            <p>📍 Keine gültigen Koordinaten verfügbar</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

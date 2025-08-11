// src/pages/Place/Place.jsx
import styles from "./Place.module.css";
import googleMapsImage from "../../assets/GoogleMaps.png";
import Map from "../../components/MapBox/MapBox.jsx";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../../Backend/supabaseClient.js";
import { useEffect, useState } from "react";
import Slideshow from "../../components/Slideshow";

export default function Place({ initialPlace = null }) {
    const { slug } = useParams(); // slug from the URL
    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        if (initialPlace) {
            setPlace(initialPlace);
            setLoading(false);
            return;
        }

        if (!slug) {
            setPlace(null);
            setLoading(false);
            return;
        }

        const fetchPlace = async () => {
            const { data: placeData, error } = await supabase
                .rpc("get_location_with_geojson_by_slug", { p_slug: slug }) // pass slug directly
                .single();

            if (error || !placeData) {
                console.error("Fehler beim Laden:", error);
                setLoading(false);
                return;
            }

            // Normalize GeoJSON to plain [lng, lat]
            if (placeData?.coordinates?.coordinates) {
                placeData.coordinates = placeData.coordinates.coordinates;
            } else {
                placeData.coordinates = null;
            }

            setPlace(placeData);
            setLoading(false);
        };

        fetchPlace();
    }, [slug, initialPlace]);

    if (loading) return <div>⏳ Lädt...</div>;
    if (!place) return <div>❌ Ort nicht gefunden</div>;

    const googleMapsLink = place.coordinates
        ? `https://www.google.com/maps/search/?api=1&query=${place.coordinates[1]},${place.coordinates[0]}`
        : "#";

    return (
        <div>
            <div className={styles.place}>
                <div className={styles.topContainer}>
                    <div>
                        <h1>{place.name}</h1>
                        {place.category_name && (
                            <h3>
                                <Link to={`/categories/${place.category_slug}`}>
                                    {place.category_name}
                                </Link>
                            </h3>
                        )}
                        <p>{place.description}</p>s
                    </div>
                    <Slideshow
                        media={
                            Array.isArray(place.gallery_urls) && place.gallery_urls.length > 0
                                ? place.gallery_urls
                                : ["https://res.cloudinary.com/dgfycfxe1/image/upload/v1754151712/cld-sample-2.jpg"]
                        }
                        interval={3000}
                    />

                </div>

                <div className={styles.bottomContainer}>
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
                        <div>⭐ Bewertung: {place.rating ?? "Keine Bewertung"}</div>
                    </div>

                    {place.coordinates &&
                    Array.isArray(place.coordinates) &&
                    place.coordinates.length === 2 ? (
                        <div className={styles.map}>
                            <Map
                                markers={[{
                                    name: place.name,
                                    coordinates: [place.coordinates[1], place.coordinates[0]],
                                    description: place.short_description,
                                    category: place.category_name
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

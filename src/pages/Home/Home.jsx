import styles from "./Home.module.css"
import Navbar from "../../components/Navbar/Navbar.jsx";
import Trailer from "../../assets/trailer.mp4"
import { Link } from "react-router-dom";
import React, {useEffect, useState} from "react";
import {supabase} from "../../Backend/supabaseClient.js";

function Home() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategoryAndLocations = async () => {
            setLoading(true);

            // Fetch locations for that category
            const { data: locationsData, error: locError } = await supabase
                .from('locations')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(4);

            if (locError) {
                setError(locError.message);
            } else {
                setLocations(locationsData);
            }

            setLoading(false);
        };

        fetchCategoryAndLocations();
    }, []);

    if (loading) return <div>⏳ Lädt...</div>;
    if (error) return <div>❌ Fehler: {error}</div>;


    return (
        <div className="App">
            <div className={styles.videoContainer}>
                <video autoPlay loop muted playsInline>
                    <source src={Trailer} type="video/mp4"/>
                </video>
            </div>
            <div className={styles.subtitle}>
                Newest Places
            </div>
            <div className={styles.newPlacesContainer}>
                {locations.map(loc => (
                    <div key={loc.id} className={styles.locationItem}>
                        {loc.name && loc.id && (
                            <>
                                {loc.image_url && (
                                    <img
                                        src={loc.image_url}
                                        alt={loc.name}
                                        className={styles.locationImage}
                                    />
                                )}
                                <h3><Link to={`/place/${loc.id}`}>{loc.name}</Link></h3>
                                <p>{loc.short_description}</p>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home
import styles from "./Home.module.css";
import Trailer from "../../assets/trailer.mp4";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { supabase } from "../../Backend/supabaseClient.js";
import { useUserLocationContext } from "../../context/UserLocationContext.jsx";

function Home() {
    const [newest, setNewest] = useState([]);
    const [nearest, setNearest] = useState([]);
    const [bestRated, setBestRated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { location: userLocation } = useUserLocationContext();

    useEffect(() => {
        async function fetchData() {
            setLoading(true);

            try {
                // 1️⃣ Newest Places
                const { data: newestData, error: newestError } = await supabase
                    .from("locations")
                    .select("*")
                    .order("created_at", { ascending: false })
                    .limit(4);

                if (newestError) throw newestError;
                setNewest(newestData);

                // 2️⃣ Nearest Places (if we have user location)
                if (userLocation) {
                    const { data: nearestData, error: nearestError } = await supabase
                        .rpc("get_nearest_locations", {
                            user_lat: userLocation.lat,
                            user_lng: userLocation.lng,
                            limit_count: 4
                        });

                    if (nearestError) throw nearestError;
                    setNearest(nearestData);
                }

                // 3️⃣ Best Rated Places
                const { data: bestRatedData, error: bestRatedError } = await supabase
                    .from("locations")
                    .select("*")
                    .order("rating", { ascending: false })
                    .limit(4);

                if (bestRatedError) throw bestRatedError;
                setBestRated(bestRatedData);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [userLocation]);

    if (loading) return <div>⏳ Lädt...</div>;
    if (error) return <div>❌ Fehler: {error}</div>;

    // Helper to render location grid
    const renderGrid = (places) => (
        <div className={styles.newPlacesContainer}>
            {places.map(loc => (
                <div key={loc.id} className={styles.locationItem}>
                    {loc.image_url && (
                        <img src={loc.image_url} alt={loc.name} className={styles.locationImage} />
                    )}
                    <h3><Link to={`/place/${loc.slug}`}>{loc.name}</Link></h3>
                    <p>{loc.short_description}</p>
                </div>
            ))}
        </div>
    );

    return (
        <div className="App">
            <div className={styles.videoContainer}>
                <video autoPlay loop muted playsInline>
                    <source src={Trailer} type="video/mp4"/>
                </video>
            </div>

            <div className={styles.subtitle}>Newest Places</div>
            {renderGrid(newest)}

            {userLocation && (
                <>
                    <div className={styles.subtitle}>Nearest Places</div>
                    {renderGrid(nearest)}
                </>
            )}

            <div className={styles.subtitle}>Best Rated Places</div>
            {renderGrid(bestRated)}
        </div>
    );
}

export default Home;

// src/pages/Home/Home.jsx
import styles from "./Home.module.css";
import React, { useEffect, useState } from "react";
import { supabase } from "../../Backend/supabaseClient.js";
import { useUserLocationContext } from "../../context/UserLocationContext.jsx";
import PlaceEditPreview from "../../components/PlaceEditPreview/PlaceEditPreview.jsx";
import PlacePreview from "../../components/PlacePreview/PlacePreview";

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
            setError(null);

            try {
                // 1️⃣ Newest Places
                const { data: newestData, error: newestError } = await supabase
                    .rpc("get_newest_locations", { limit_count: 3 });
                if (newestError) throw newestError;
                setNewest(newestData || []);

                // 2️⃣ Nearest Places (only if user location exists)
                if (userLocation) {
                    const { data: nearestData, error: nearestError } = await supabase
                        .rpc("get_nearest_locations", {
                            user_lat: userLocation.lat,
                            user_lng: userLocation.lng,
                            limit_count: 3
                        });
                    if (nearestError) throw nearestError;
                    setNearest(nearestData || []);
                }

                // 3️⃣ Best Rated Places
                const { data: bestRatedData, error: bestRatedError } = await supabase
                    .rpc("get_best_rated_locations", { limit_count: 3 });
                if (bestRatedError) throw bestRatedError;
                setBestRated(bestRatedData || []);

            } catch (err) {
                console.error("Error fetching Home data:", err);
                setError(err.message || "Fehler beim Laden");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [userLocation]);

    if (loading) return <div>⏳ Lädt...</div>;
    if (error) return <div>❌ Fehler: {error}</div>;

    return (
        <div className="App">
            {/* Hero Video */}
            <div className={styles.videoContainer}>
                <video autoPlay loop muted playsInline>
                    <source
                        src="https://res.cloudinary.com/dgfycfxe1/video/upload/v1755212926/trailer_elfcas.mp4"
                        type="video/mp4"
                    />
                </video>
            </div>

            {/* Newest Places */}
            <div className={styles.subtitle}>Newest Places</div>
            <PlacePreview locations={newest} />

            {/* Nearest Places */}
            {userLocation && nearest.length > 0 && (
                <>
                    <div className={styles.subtitle}>Nearest Places</div>
                    <PlacePreview  locations={nearest} />
                </>
            )}

            {/* Best Rated Places */}
            <div className={styles.subtitle}>Best Rated Places</div>
            <PlacePreview  locations={bestRated} />
        </div>
    );
}

export default Home;

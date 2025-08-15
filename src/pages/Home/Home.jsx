import styles from "./Home.module.css";
import React, { useEffect, useState } from "react";
import { supabase } from "../../Backend/supabaseClient.js";
import { useUserLocationContext } from "../../context/UserLocationContext.jsx";
import PlacePreview from "../../components/PlacePreview/PlacePreview.jsx"; // ✅ import

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
                    .limit(3);

                if (newestError) throw newestError;
                setNewest(newestData);

                // 2️⃣ Nearest Places
                if (userLocation) {
                    const { data: nearestData, error: nearestError } = await supabase
                        .rpc("get_nearest_locations", {
                            user_lat: userLocation.lat,
                            user_lng: userLocation.lng,
                            limit_count: 3
                        });

                    if (nearestError) throw nearestError;
                    setNearest(nearestData);
                }

                // 3️⃣ Best Rated Places
                const { data: bestRatedData, error: bestRatedError } = await supabase
                    .from("locations")
                    .select("*")
                    .order("rating", { ascending: false })
                    .limit(3);

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

    return (
        <div className="App">
            <div className={styles.videoContainer}>
                <video autoPlay loop muted playsInline>
                    <source src={"https://res.cloudinary.com/dgfycfxe1/video/upload/v1755212926/trailer_elfcas.mp4"} type="video/mp4" />
                </video>
            </div>

            <div className={styles.subtitle}>Newest Places</div>
            <PlacePreview locations={newest} />

            {userLocation && (
                <>
                    <div className={styles.subtitle}>Nearest Places</div>
                    <PlacePreview locations={nearest} />
                </>
            )}

            <div className={styles.subtitle}>Best Rated Places</div>
            <PlacePreview locations={bestRated} />
        </div>
    );
}

export default Home;

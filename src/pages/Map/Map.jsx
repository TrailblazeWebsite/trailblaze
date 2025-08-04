import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import MapBox from "../../components/MapBox/MapBox";
import styles from "./map.module.css";
import { supabase } from "../../Backend/supabaseClient";

export default function Map() {
    const [markers, setMarkers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data, error } = await supabase
                    .rpc("get_all_locations_with_geojson"); // nutze hier deine eigene Funktion

                if (error) {
                    throw error;
                }
                console.log("Supabase data:", data);  // <<<<<< Check data here

                const transformed = data
                    .map(loc => {
                        const coords = loc.coordinates?.coordinates;
                        if (!coords) return null;

                        return {
                            name: loc.name,
                            coordinates: [coords[1], coords[0]], // Reihenfolge tauschen hier!
                            description: loc.short_description,
                            category: loc.category_name || "Unbekannt"
                        };
                    })
                    .filter(m => m !== null);


                setMarkers(transformed);

                const uniqueCategories = [...new Set(transformed.map(m => m.category))];
                const categoryObjects = uniqueCategories.map(cat => ({
                    category: cat,
                    color: "#3388ff", // evtl. dynamisch
                    visible: true
                }));

                setCategories(categoryObjects);
            } catch (err) {
                console.error("Fehler beim Laden der Marker:", err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) return <p>⏳ Lädt Karte...</p>;

    return (
        <div>
            <Navbar />
            <div className={styles.mapContainer}>
                <MapBox markers={markers} categories={categories} />
            </div>
        </div>
    );
}

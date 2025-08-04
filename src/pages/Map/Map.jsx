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
                    .rpc("get_all_locations_with_geojson");

                if (error) {
                    throw error;
                }
                console.log("✅ Rohe Daten von Supabase:");
                data.forEach((loc, index) => {
                    console.log(`📍 ${index + 1}:`, loc);
                });

                const transformed = data
                    .filter(loc =>
                        loc.coordinates &&
                        Array.isArray(loc.coordinates.coordinates) &&
                        loc.coordinates.coordinates.length === 2

                    )
                    .map(loc => ({
                        id: loc.id,
                        name: loc.name,
                        coordinates: [loc.coordinates.coordinates[1], loc.coordinates.coordinates[0]],
                        description: loc.short_description,
                        category: loc.category_name || "Unbekannt"
                    }));



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

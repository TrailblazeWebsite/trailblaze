import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import MapBox from "../../components/MapBox/MapBox";
import styles from "./map.module.css";



export default function Map() {
    const [markers, setMarkers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("/markers.json"); // oder dein API-Endpunkt
                const markersData = await response.json();
                setMarkers(markersData);

                const uniqueCategories = [...new Set(markersData.map(m => m.category))];

                const categoryObjects = uniqueCategories.map(cat => ({
                    category: cat,
                    color: "#3388ff",
                    visible: true
                }));

                setCategories(categoryObjects);
            } catch (err) {
                console.error("Fehler beim Laden der Marker:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) return <p>Loading map...</p>;

    return (
        <div>
            <Navbar />
            <div className={styles.mapContainer}>
                <MapBox markers={markers} categories={categories} />
            </div>
        </div>
    );
}

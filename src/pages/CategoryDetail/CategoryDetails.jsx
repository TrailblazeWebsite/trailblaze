import styles from "./CategoryDetails.module.css";
import { supabase } from "../../Backend/supabaseClient.js";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MapBox from "../../components/MapBox/MapBox.jsx";

export default function CategoryDetails() {
    const { slug } = useParams();
    const [category, setCategory] = useState(null);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        const fetchCategoryAndLocations = async () => {
            setLoading(true);

            // 1️⃣ Fetch category by slug
            const { data: categoryData, error: catError } = await supabase
                .from("categories")
                .select("*")
                .eq("slug", slug)
                .single();

            if (catError || !categoryData) {
                setError(catError?.message || "Kategorie nicht gefunden");
                setLoading(false);
                return;
            }
            setCategory(categoryData);

            // 2️⃣ Fetch locations with coordinates
            const { data: locationsData, error: locError } = await supabase
                .from("locations")
                .select("id, name, short_description, image_url, slug, coordinates")
                .eq("category_id", categoryData.id)
                .order("name", { ascending: true });

            if (locError) {
                setError(locError.message);
                setLoading(false);
                return;
            }
            setLocations(locationsData);

            // 3️⃣ Transform into marker format for MapBox
            const transformed = locationsData
                .filter(loc =>
                    loc.coordinates &&
                    Array.isArray(loc.coordinates.coordinates) &&
                    loc.coordinates.coordinates.length === 2
                )
                .map(loc => ({
                    id: loc.id,
                    name: loc.name,
                    coordinates: [
                        loc.coordinates.coordinates[1], // lat
                        loc.coordinates.coordinates[0]  // lng
                    ],
                    description: loc.short_description,
                    slug: loc.slug
                }));

            setMarkers(transformed);
            setLoading(false);
        };

        fetchCategoryAndLocations();
    }, [slug]);

    if (loading) return <div>⏳ Lädt...</div>;
    if (error) return <div>❌ Fehler: {error}</div>;
    if (!category) return <div>❌ Kategorie nicht gefunden</div>;

    return (
        <div>
            <div className={styles.categoryDetails}>
                <div>
                    <h1>{category.category_name}</h1>
                    <p>{category.description}</p>
                    {category.image_url && (
                        <img
                            src={category.image_url}
                            alt={category.name}
                            className={styles.categoriesImage}
                        />
                    )}
                </div>
                <MapBox markers={markers} className={styles.map} />
            </div>

            <div className={styles.placeList}>
                {locations.map((loc) => (
                    <div key={loc.id} className={styles.place}>
                        <h3>
                            <Link to={`/place/${loc.slug}`}>{loc.name}</Link>
                        </h3>
                        <p>{loc.short_description}</p>
                        {loc.image_url && (
                            <img
                                src={loc.image_url}
                                alt={loc.name}
                                className={styles.categoriesImage}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

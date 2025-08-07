import Navbar from "../../components/Navbar/Navbar.jsx";
import styles from "./CategoryDetails.module.css"
import { supabase } from "../../Backend/supabaseClient.js";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MapBox from "../../components/MapBox/MapBox.jsx";


export default function CategoryDetails() {
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategoryAndLocations = async () => {
            setLoading(true);

            const { data: categoryData, error: catError } = await supabase
                .from('categories')
                .select('*')
                .eq('id', id)
                .single();

            if (catError) {
                setError(catError.message);
                setLoading(false);
                return;
            }

            setCategory(categoryData);

            // Fetch locations for that category
            const { data: locationsData, error: locError } = await supabase
                .from('locations')
                .select('*')
                .eq('category_id', id)
                .order('name', { ascending: true });

            if (locError) {
                setError(locError.message);
            } else {
                setLocations(locationsData);
            }

            setLoading(false);
        };

        fetchCategoryAndLocations();
    }, [id]);

    if (loading) return <div>⏳ Lädt...</div>;
    if (error) return <div>❌ Fehler: {error}</div>;
    if (!category) return <div>❌ Kategorie nicht gefunden</div>;

    return (
        <div>
            <Navbar />
            <div>
                <div className={styles.categoryDetails}>
                    <div>
                        <h1>{category.name}</h1>
                        <p>{category.description}</p>
                        {category.image_url && (
                            <img src={category.image_url} alt={category.name} className={styles.categoriesImage} />
                        )}
                    </div>
                    <MapBox className={styles.map}/>
                </div>
                <div className={styles.placeList}>
                    {locations.map(loc => (
                        <div key={loc.id} className={styles.place}>
                            <h3><Link to={`/place/${loc.id}`}>{loc.name}</Link></h3>
                            <p>{loc.short_description}</p>
                            <img src={loc.image_url} alt={category.name} className={styles.categoriesImage}/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
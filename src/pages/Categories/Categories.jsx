import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./Categories.module.css";
import { Link } from "react-router-dom";
import { supabase } from "../../Backend/supabaseClient";

export default function Categories() {
    const [categories, setCategories] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase.from('categories').select();
            if (error) {
                setError(error.message);
            } else {
                setCategories(data);
            }
            setLoading(false);
        };

        fetchCategories();
    }, []);

    if (loading) return <div>⏳ Lädt...</div>;
    if (error) return <div>❌ Fehler: {error}</div>;

    return (
        <div>
            <Navbar />
            <div className={styles.categories}>
                {categories.map(cat => (
                    <div key={cat.id} className={styles.category}>
                        <div>
                            <h2><Link to={`/${cat.name}`}>{cat.name}</Link></h2>
                            <p>{cat.description}</p>
                        </div>
                        {cat.image_url && (
                            <img src={cat.image_url} alt={cat.name} className={styles.categoriesImage} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}


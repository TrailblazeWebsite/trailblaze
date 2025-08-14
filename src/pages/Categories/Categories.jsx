import React from "react";
import styles from "./Categories.module.css";
import { Link } from "react-router-dom";
import { supabase } from "../../Backend/supabaseClient.js";

export default function Categories() {
    const [categories, setCategories] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase
                .from('categories')
                .select()
                .order('category_name', { ascending: true });
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
        <div className={styles.container}>
            {categories.map(cat => (
                <div key={cat.id} className={styles.category}>
                    <div>
                        <h2>
                            <Link to={`/categories/${cat.slug}`}>
                                {cat.icon_url && (
                                    <img
                                        src={cat.icon_url}
                                        alt=""
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                            objectFit: "contain",
                                            verticalAlign: "middle",
                                            marginRight: "8px"
                                        }}
                                    />
                                )}
                                {cat.category_name}
                            </Link>
                        </h2>
                        <p>{cat.description}</p>
                    </div>
                    <div>
                        {cat.image_url && (
                            <img
                                src={cat.image_url}
                                alt={cat.category_name}
                                className={styles.categoriesImage}
                            />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

}


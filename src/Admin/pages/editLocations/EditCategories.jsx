import AdminNavbar from "../../components/AdminNavbar/AdminNavbar";
import { useEffect, useState } from "react";
import styles from "./EditCategories.module.css";
import { supabase } from "../../../Backend/supabaseClient";
import Categories from "../../../pages/Categories/Categories";

export default function EditCategories() {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image_url: ''
    });
    const [selectedCategory, setSelectedCategory] = useState(null); // ← editing state
    const [message, setMessage] = useState(null);

    const fetchCategories = async () => {
        const { data, error } = await supabase.from("categories").select();
        if (error) {
            console.error("Fehler beim Laden der Kategorien:", error.message);
        } else {
            setCategories(data);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEdit = (category) => {
        setFormData({
            name: category.name,
            description: category.description,
            image_url: category.image_url
        });
        setSelectedCategory(category);
        setMessage(null);
    };

    const handleCancelEdit = () => {
        setFormData({ name: '', description: '', image_url: '' });
        setSelectedCategory(null);
        setMessage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let result;
        if (selectedCategory) {
            // UPDATE existing entry
            result = await supabase
                .from('categories')
                .update({
                    name: formData.name,
                    description: formData.description,
                    image_url: formData.image_url
                })
                .eq('id', selectedCategory.id);
        } else {
            // INSERT new entry
            result = await supabase
                .from('categories')
                .insert([{
                    name: formData.name,
                    description: formData.description,
                    image_url: formData.image_url
                }]);
        }

        const { error } = result;

        if (error) {
            setMessage(`❌ Fehler: ${error.message}`);
        } else {
            setMessage(selectedCategory ? '✅ Eintrag aktualisiert!' : '✅ Eintrag erstellt!');
            setFormData({ name: '', description: '', image_url: '' });
            setSelectedCategory(null);
            await fetchCategories();
        }
    };

    return (
        <div>
            <AdminNavbar />
            <div className={styles.container}>
                <div className={styles.input}>
                    <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Name of category"
                            required
                        />
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Description"
                        />
                        <input
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                            placeholder="Bild-URL"
                        />
                        <button type="submit">{selectedCategory ? 'Aktualisieren' : 'Speichern'}</button>
                        {selectedCategory && (
                            <button type="button" onClick={handleCancelEdit} style={{backgroundColor: '#ccc'}}>
                                Abbrechen
                            </button>
                        )}
                    </form>
                    {message && <p>{message}</p>}

                    <div>
                        <h3>Kategorien</h3>
                        <ul style={{listStyle: "none", padding: 0}}>
                            {categories.map((cat) => (
                                <li key={cat.id} style={{marginBottom: "1rem", borderBottom: "1px solid #eee"}}>
                                    <strong>{cat.name}</strong>
                                    <br/>
                                    <button onClick={() => handleEdit(cat)}>Bearbeiten</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className={styles.pagePreview}>
                    <Categories/>
                </div>
            </div>
        </div>
    );
}

import Navbar from "../../components/Navbar/Navbar";
import { useEffect, useState } from "react";
import styles from "./EditCategories.module.css";
import { supabase } from "../../Backend/supabaseClient";
import Categories from "../Categories/Categories";

export default function EditCategories() {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image_url: ''
    });
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [message, setMessage] = useState(null);
    const [refreshCounter, setRefreshCounter] = useState(0);

    const fetchCategories = async () => {
        const { data, error } = await supabase
            .from("categories")
            .select()
            .order('name', { ascending: true });
        if (error) {
            console.error("Fehler beim Laden der Kategorien:", error.message);
        } else {
            setCategories(data);
            setRefreshCounter(prev => prev + 1); // erhöht den Counter nach jedem Laden
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
            result = await supabase
                .from('categories')
                .update({
                    name: formData.name,
                    description: formData.description,
                    image_url: formData.image_url
                })
                .eq('id', selectedCategory.id)

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
            setSelectedCategoryId("");
            await fetchCategories();
        }
    };

    return (
        <div>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.input}>
                    <select
                        value={selectedCategoryId}
                        onChange={(e) => {
                            const id = e.target.value;
                            setSelectedCategoryId(id);

                            if (id === "") {
                                setFormData({
                                    name: '',
                                    description: '',
                                    image_url: ''
                                });
                                setSelectedCategory(null);
                            } else {
                                const selected = categories.find(cat => cat.id === parseInt(id));
                                if (selected) {
                                    setFormData({
                                        name: selected.name || '',
                                        description: selected.description || '',
                                        image_url: selected.image_url || ''
                                    });
                                    setSelectedCategory(selected);
                                }
                            }
                        }}
                    >
                        <option value="">➕ Neue Kategorie erstellen</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                ✏️ {cat.name}
                            </option>
                        ))}
                    </select>

                    <form
                        onSubmit={handleSubmit}
                        style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}
                    >
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Name der Kategorie"
                            required
                        />
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Beschreibung"
                        />
                        <input
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                            placeholder="Bild-URL"
                        />
                        <button type="submit">
                            {selectedCategory ? 'Aktualisieren' : 'Speichern'}
                        </button>
                        {selectedCategory && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                style={{backgroundColor: '#ccc'}}
                            >
                                Abbrechen
                            </button>
                        )}
                    </form>

                    {message && <p>{message}</p>}
                </div>

                <div className={styles.pagePreview}>
                    <Categories key={refreshCounter} />
                </div>
            </div>
        </div>
    );

}

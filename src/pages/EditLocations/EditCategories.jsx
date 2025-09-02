import { useEffect, useState } from "react";
import styles from "./EditCategories.module.css";
import { supabase } from "../../Backend/supabaseClient.js";
import Categories from "../Categories/Categories.jsx";
import ImageUploader from "../../components/ImageUploader/ImageUploader.jsx";

// Helper: slugify a string
const slugify = (text) =>
    text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')       // Replace spaces with -
        .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
        .replace(/--+/g, '-');      // Replace multiple - with single -

export default function EditCategories() {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        category_name: '',
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
            .select("id, category_name, description, image_url, slug")
            .order('category_name', { ascending: true });
        if (error) {
            console.error("Fehler beim Laden der Kategorien:", error.message);
        } else {
            setCategories(data);
            setRefreshCounter(prev => prev + 1);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCancelEdit = () => {
        setFormData({ category_name: '', description: '', image_url: '' });
        setSelectedCategory(null);
        setMessage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            category_name: formData.category_name,
            slug: slugify(formData.category_name),
            description: formData.description,
            image_url: formData.image_url
        };

        let result;
        if (selectedCategory) {
            result = await supabase
                .from('categories')
                .update(payload)
                .eq('id', selectedCategory.id);
        } else {
            result = await supabase
                .from('categories')
                .insert([payload]);
        }

        const { error } = result;
        if (error) {
            setMessage(`❌ Fehler: ${error.message}`);
        } else {
            setMessage(selectedCategory ? '✅ Eintrag aktualisiert!' : '✅ Eintrag erstellt!');
            setFormData({ category_name: '', description: '', image_url: '' });
            setSelectedCategory(null);
            setSelectedCategoryId("");
            await fetchCategories();
        }
    };

    return (
        <div>
            <div className={styles.container}>
                <div className={styles.input}>
                    <select
                        value={selectedCategoryId}
                        onChange={(e) => {
                            const id = e.target.value;
                            setSelectedCategoryId(id);
                            if (id === "") {
                                handleCancelEdit();
                            } else {
                                const selected = categories.find(cat => cat.id === id);
                                if (selected) {
                                    setFormData({
                                        category_name: selected.category_name || '',
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
                                ✏️ {cat.category_name}
                            </option>
                        ))}
                    </select>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input
                            name="category_name"
                            value={formData.category_name}
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

                        {/* Replace image_url input with ImageUploader */}
                        <ImageUploader
                            value={formData.image_url || null}
                            onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                            multiple={false} // only single image
                        />

                        <button type="submit">
                            {selectedCategory ? 'Aktualisieren' : 'Speichern'}
                        </button>
                        {selectedCategory && (
                            <button type="button" onClick={handleCancelEdit} style={{ backgroundColor: '#ccc' }}>
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

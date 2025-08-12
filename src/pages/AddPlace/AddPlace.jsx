import { useEffect, useState } from "react";
import styles from "./AddPlace.module.css";
import { supabase } from "../../Backend/supabaseClient.js";

export default function AddPlace() {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState(initialForm());
    const [message, setMessage] = useState(null);

    function initialForm() {
        return {
            name: '',
            short_description: '',
            description: '',
            longitude: '',
            latitude: '',
            gallery_urls: [],
            rating: '',
            category_id: ''
        };
    }

    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase
                .from('categories')
                .select()
                .order('category_name', { ascending: true });

            if (error) {
                console.error('Fehler beim Laden der Kategorien:', error.message);
            } else {
                setCategories(data);
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const longitude = parseFloat(formData.longitude);
        const latitude = parseFloat(formData.latitude);

        const payload = {
            name: formData.name,
            short_description: formData.short_description,
            description: formData.description,
            category_id: formData.category_id || null, // keep as UUID string
            rating: parseFloat(formData.rating),
            coordinates: `SRID=4326;POINT(${longitude} ${latitude})`,
            gallery_urls: formData.gallery_urls
        };

        const { error } = await supabase.from('locations').insert([payload]);

        if (error) {
            setMessage(`❌ Fehler: ${error.message}`);
        } else {
            setMessage('✅ Neuer Ort erfolgreich erstellt!');
            setFormData(initialForm());
        }
    };

    return (
        <div>
            <div className={styles.container}>
                <div className={styles.input}>
                    <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name des Ortes" required />
                        <input name="short_description" value={formData.short_description} onChange={handleChange} placeholder="Kurzbeschreibung" />
                        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Beschreibung" />

                        <select name="category_id" value={formData.category_id} onChange={handleChange} required>
                            <option value="">-- Kategorie wählen --</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                            ))}
                        </select>

                        <input type="number" step="0.1" min="0" max="5" name="rating" value={formData.rating} onChange={handleChange} placeholder="Bewertung (z.B. 4.5)" required />
                        <input type="number" step="0.000001" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="Längengrad" required />
                        <input type="number" step="0.000001" name="latitude" value={formData.latitude} onChange={handleChange} placeholder="Breitengrad" required />

                        <textarea
                            name="gallery_urls"
                            value={formData.gallery_urls.join('\n')}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    gallery_urls: e.target.value
                                        .split('\n')
                                        .map(url => url.trim())
                                        .filter(url => url !== '')
                                }))
                            }
                            placeholder="Weitere Bild-URLs, jeweils eine pro Zeile"
                        />

                        <button type="submit">Ort hinzufügen</button>
                    </form>
                    {message && <p>{message}</p>}
                </div>
                <div className={styles.pagePreview}></div>
            </div>
        </div>
    );
}

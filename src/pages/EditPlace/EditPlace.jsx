// src/pages/EditPlace/EditPlace.jsx
import { useEffect, useState } from "react";
import styles from "./EditPlace.module.css";
import { supabase } from "../../Backend/supabaseClient.js";
import ImageUploader from "../../components/ImageUploader/ImageUploader";

export default function EditPlace() {
    const [locations, setLocations] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
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
            category_id: '',
            visible: true
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

        const fetchLocations = async () => {
            const { data, error } = await supabase.rpc('get_all_locations_admin');
            if (error) {
                console.error('Fehler beim Laden der Orte:', error.message);
            } else {
                setLocations(data);
            }
        };

        fetchCategories();
        fetchLocations();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSelectLocation = (id) => {
        setSelectedId(id);
        if (!id) {
            setFormData(initialForm());
            return;
        }
        const selected = locations.find(loc => String(loc.id) === String(id));
        if (selected) {
            setFormData({
                name: selected.name || '',
                short_description: selected.short_description || '',
                description: selected.description || '',
                longitude: selected.coordinates?.coordinates?.[0] || '',
                latitude: selected.coordinates?.coordinates?.[1] || '',
                gallery_urls: Array.isArray(selected.gallery_urls) ? selected.gallery_urls : [],
                rating: selected.rating || '',
                category_id: selected.category_id || '',
                visible: selected.visible ?? true
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const longitude = parseFloat(formData.longitude);
        const latitude = parseFloat(formData.latitude);

        const payload = {
            name: formData.name,
            short_description: formData.short_description,
            description: formData.description,
            category_id: formData.category_id || null,
            rating: parseFloat(formData.rating),
            coordinates: `SRID=4326;POINT(${longitude} ${latitude})`,
            gallery_urls: formData.gallery_urls,
            visible: formData.visible
        };

        let result;
        if (selectedId) {
            result = await supabase.from('locations').update(payload).eq('id', selectedId);
        } else {
            result = await supabase.from('locations').insert([payload]);
        }

        if (result.error) {
            setMessage(`❌ Fehler: ${result.error.message}`);
        } else {
            setMessage(selectedId ? '✅ Ort erfolgreich aktualisiert!' : '✅ Neuer Ort erfolgreich erstellt!');
            setSelectedId(null);
            setFormData(initialForm());
            const { data: updatedLocations } = await supabase.rpc('get_all_locations_admin');
            setLocations(updatedLocations);
        }
    };

    const handleDelete = async () => {
        if (!selectedId) return;
        if (!window.confirm("Möchtest du diesen Ort wirklich löschen?")) return;

        const { error } = await supabase.from('locations').delete().eq('id', selectedId);
        if (error) {
            setMessage(`❌ Fehler beim Löschen: ${error.message}`);
        } else {
            setMessage('🗑️ Ort erfolgreich gelöscht.');
            setSelectedId(null);
            setFormData(initialForm());
            const { data: updatedLocations } = await supabase.rpc('get_all_locations_admin');
            setLocations(updatedLocations);
        }
    };

    return (
        <div>
            <div className={styles.container}>
                <div className={styles.input}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {selectedId && (
                            <button type="button" onClick={() => handleSelectLocation(null)}>
                                ➕ Neuen Ort erstellen
                            </button>
                        )}

                        <select value={selectedId || ''} onChange={(e) => handleSelectLocation(e.target.value)}>
                            <option value="">➕ Neuer Ort</option>
                            {categories.map((cat) => (
                                <optgroup key={cat.id} label={cat.category_name}>
                                    {locations
                                        .filter((loc) => loc.category_id === cat.id)
                                        .map((loc) => (
                                            <option key={loc.id} value={loc.id}>
                                                {loc.name} {loc.visible ? '' : '(invisible)'}
                                            </option>
                                        ))}
                                </optgroup>
                            ))}
                        </select>

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
                        <input type="number" step="0.000001" name="latitude" value={formData.latitude} onChange={handleChange} placeholder="Breitengrad" required />
                        <input type="number" step="0.000001" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="Längengrad" required />

                        <label>
                            <input type="checkbox" name="visible" checked={formData.visible} onChange={handleChange} />
                            Sichtbar
                        </label>

                        <ImageUploader
                            multiple
                            value={formData.gallery_urls}
                            onChange={(urls) => setFormData((prev) => ({ ...prev, gallery_urls: urls }))}
                        />

                        <button type="submit">Speichern</button>
                        {selectedId && (
                            <button type="button" style={{ backgroundColor: 'crimson', color: 'white' }} onClick={handleDelete}>
                                🗑️ Ort löschen
                            </button>
                        )}
                    </form>
                    {message && <p>{message}</p>}
                </div>
                <div className={styles.pagePreview}></div>
            </div>
        </div>
    );
}

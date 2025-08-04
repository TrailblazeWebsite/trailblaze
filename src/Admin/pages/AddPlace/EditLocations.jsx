import AdminNavbar from "../../components/AdminNavbar/AdminNavbar";
import {useEffect, useState} from "react";
import styles from "./EditLocations.module.css"
import PlaceDummy from "../../components/PlaceDummy/PlaceDummy";
import { supabase } from "../../../Backend/supabaseClient";



export default function EditLocations() {
    const [locations, setLocations] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [categories, setCategories] = useState([])
    const [formData, setFormData] = useState({
        name: '',
        short_description: '',
        description: '',
        longitude: '',
        latitude: '',
        image_url: '',
        gallery_urls: [],
        rating: '',
        category_id: ''
    })
    const [message, setMessage] = useState(null)



    useEffect(() => {
        const fetchCategories = async () => {
            const {data, error} = await supabase
                .from('categories')
                .select()
                .order('name', {ascending: true})

            if (error) {
                console.error('Fehler beim Laden der Kategorien:', error.message)
            } else {
                console.log('Geladene Kategorien:', data)
                setCategories(data)
            }
        }
        fetchCategories()

        const fetchLocations = async () => {
            const { data, error } = await supabase.rpc('get_all_locations_with_geojson');

            if (error) {
                console.error('Fehler beim Laden der Orte:', error.message);
            } else {
                setLocations(data);
            }
        };

        fetchLocations();

    }, [])

    const handleChange = (e) => {
        const {name, value} = e.target
        setFormData((prev) => ({...prev, [name]: value}))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const longitude = parseFloat(formData.longitude);
        const latitude = parseFloat(formData.latitude);

        const payload = {
            name: formData.name,
            short_description: formData.short_description,
            description: formData.description,
            category_id: parseInt(formData.category_id),
            rating: parseFloat(formData.rating),
            coordinates: `POINT(${longitude} ${latitude})`,
            image_url: formData.image_url,
            gallery_urls: formData.gallery_urls
        };

        let result;
        if (selectedId) {
            result = await supabase
                .from('locations')
                .update(payload)
                .eq('id', selectedId);
        } else {
            result = await supabase
                .from('locations')
                .insert([payload]);
        }

        const { data, error } = result;

        if (error) {
            setMessage(`❌ Fehler: ${error.message}`);
        } else {
            setMessage(selectedId ? '✅ Ort erfolgreich aktualisiert!' : '✅ Neuer Ort erfolgreich erstellt!');
            setSelectedId(null); // Formular zurücksetzen
            setFormData({
                name: '',
                short_description: '',
                description: '',
                longitude: '',
                latitude: '',
                image_url: '',
                gallery_urls: [],
                rating: '',
                category_id: ''
            });

            // Aktualisiere die Liste der Orte
            const { data: updatedLocations } = await supabase.from('locations').select();
            setLocations(updatedLocations);
        }
    };

    const handleDelete = async () => {
        if (!selectedId) return;

        const confirmDelete = window.confirm("Möchtest du diesen Ort wirklich löschen?");
        if (!confirmDelete) return;

        const { error } = await supabase
            .from('locations')
            .delete()
            .eq('id', selectedId);

        if (error) {
            setMessage(`❌ Fehler beim Löschen: ${error.message}`);
        } else {
            setMessage('🗑️ Ort erfolgreich gelöscht.');
            setSelectedId(null);
            setFormData({
                name: '',
                short_description: '',
                description: '',
                longitude: '',
                latitude: '',
                image_url: '',
                gallery_urls: [],
                rating: '',
                category_id: ''
            });

            const { data: updatedLocations } = await supabase.from('locations').select();
            setLocations(updatedLocations);
        }
    };




    return (
        <div>
            <AdminNavbar/>
            <div className={styles.container}>
                <div className={styles.input}>
                    <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                        {selectedId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedId(null);
                                    setFormData({
                                        name: '',
                                        short_description: '',
                                        description: '',
                                        longitude: '',
                                        latitude: '',
                                        image_url: '',
                                        gallery_urls: [],
                                        rating: '',
                                        category_id: ''
                                    });
                                }}
                            >
                                ➕ Neuen Ort erstellen
                            </button>
                        )}
                        <select
                            value={selectedId || ''}
                            onChange={(e) => {
                                const id = e.target.value;
                                setSelectedId(id);
                                const selected = locations.find(loc => loc.id === parseInt(id));
                                if (selected) {
                                    setFormData({
                                        name: selected.name || '',
                                        short_description: selected.short_description || '',
                                        description: selected.description || '',
                                        longitude: selected.coordinates?.coordinates?.[0] || '',
                                        latitude: selected.coordinates?.coordinates?.[1] || '',
                                        image_url: selected.image_url || '',
                                        gallery_urls: selected.gallery_urls || [],
                                        rating: selected.rating || '',
                                        category_id: selected.category_id || ''
                                    });
                                }
                            }}
                        >
                            <option value="">➕ Neuer Ort</option>

                            {categories.map((cat) => (
                                <optgroup key={cat.id} label={cat.name}>
                                    {locations
                                        .filter((loc) => loc.category_id === cat.id)
                                        .map((loc) => (
                                            <option key={loc.id} value={loc.id}>
                                                {loc.name}
                                            </option>
                                        ))}
                                </optgroup>
                            ))}
                        </select>


                        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name des Ortes"
                               required/>
                        <input name="short_description" value={formData.short_description} onChange={handleChange}
                               placeholder="Kurzbeschreibung"/>
                        <textarea name="description" value={formData.description} onChange={handleChange}
                                  placeholder="Beschreibung"/>

                        <select name="category_id" value={formData.category_id} onChange={handleChange} required>
                            <option value="">-- Kategorie wählen --</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>

                        <input type="number" step="0.1" min="0" max="5" name="rating" value={formData.rating}
                               onChange={handleChange} placeholder="Bewertung (z.B. 4.5)" required/>

                        <input
                            type="number"
                            step="0.000001"
                            name="longitude"
                            value={formData.longitude}
                            onChange={handleChange}
                            placeholder="Längengrad (z. B. 7.6271)"
                            required
                        />

                        <input
                            type="number"
                            step="0.000001"
                            name="latitude"
                            value={formData.latitude}
                            onChange={handleChange}
                            placeholder="Breitengrad (z. B. 47.4817)"
                            required
                        />

                        <input
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                            placeholder="Bild-URL"
                        />

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

                        <button type="submit">Speichern</button>
                        {selectedId && (
                            <button
                                type="button"
                                style={{backgroundColor: 'crimson', color: 'white'}}
                                onClick={handleDelete}
                            >
                                🗑️ Ort löschen
                            </button>
                        )}
                    </form>
                    {message && <p>{message}</p>}
                </div>
                <div className={styles.pagePreview}>
                    <PlaceDummy/>
                </div>
            </div>
        </div>
    )
}
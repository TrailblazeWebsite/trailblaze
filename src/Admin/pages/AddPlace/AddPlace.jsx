import AdminNavbar from "../../components/AdminNavbar/AdminNavbar";
import {useEffect, useState} from "react";
import styles from "./AddPlace.module.css"
import PlaceDummy from "../../components/PlaceDummy/PlaceDummy";
import { supabase } from "../../../Backend/supabaseClient";

export default function AddPlace() {
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

    // Kategorien beim Laden holen
    useEffect(() => {
        const fetchCategories = async () => {
            const {data, error} = await supabase.from('categories').select()

            if (error) {
                console.error('Fehler beim Laden der Kategorien:', error.message)
            } else {
                console.log('Geladene Kategorien:', data)
                setCategories(data)
            }
        }

        fetchCategories()
    }, [])

    // Eingaben aktualisieren
    const handleChange = (e) => {
        const {name, value} = e.target
        setFormData((prev) => ({...prev, [name]: value}))
    }

    // Formular absenden
    const handleSubmit = async (e) => {
        e.preventDefault()

        const longitude = parseFloat(formData.longitude)
        const latitude = parseFloat(formData.latitude)

        const {data, error} = await supabase.from('locations').insert([{
            name: formData.name,
            short_description: formData.short_description,
            description: formData.description,
            category_id: parseInt(formData.category_id),
            rating: parseFloat(formData.rating),
            coordinates: `POINT(${longitude} ${latitude})`,
            image_url: formData.image_url,
            gallery_urls: formData.gallery_urls
        }])

        if (error) {
            setMessage(`❌ Fehler: ${error.message}`)
        } else {
            setMessage('✅ Eintrag erfolgreich erstellt!')
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
            })
        }
    }

    return (
        <div>
            <AdminNavbar/>
            <div className={styles.container}>
                <div className={styles.input}>
                    <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
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
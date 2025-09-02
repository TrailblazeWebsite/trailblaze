import styles from "./PlaceEditPreview.module.css";
import Map from "../MapBox/MapBox.jsx";
import Slideshow from "../Slideshow/Slideshow";

export default function PlaceEditPreview({ formData, categories = [] }) {
    if (!formData) return null;

    const category = categories.find((c) => c.id === formData.category_id);

    const hasValidCoordinates =
        formData.latitude && formData.longitude &&
        !isNaN(formData.latitude) && !isNaN(formData.longitude);

    return (
        <div className={styles.container}>
            <div className={styles.topContainer}>
                <div className={styles.topLeft}>
                    <h1>{formData.name || "Name des Ortes"}</h1>
                    {category && <h3>{category.category_name}</h3>}
                    <p>{formData.description || "Beschreibung..."}</p>
                </div>
                <div className={styles.topRightContainer}>
                    <div>
                        {formData.rating
                            ? "⭐".repeat(Math.floor(formData.rating))
                            : "Keine Bewertung"}
                    </div>
                    <div>⭐ Bewertung: {formData.rating ?? "Keine Bewertung"}</div>
                </div>
            </div>

            <div style={{ height: "400px" }}>
                <Slideshow
                    media={
                        Array.isArray(formData.gallery_urls) && formData.gallery_urls.length > 0
                            ? formData.gallery_urls
                            : ["https://res.cloudinary.com/dgfycfxe1/image/upload/v1756830549/y00kxe9xwtfj5smh9g6z.png"]
                    }
                    interval={3000}
                    className={styles.slideshow}
                />
            </div>

            <div className={styles.middleContainer}>
                {hasValidCoordinates ? (
                    <div className={styles.mapContainer}>
                        <Map
                            markers={[
                                {
                                    name: formData.name,
                                    coordinates: [parseFloat(formData.latitude), parseFloat(formData.longitude)],
                                    description: formData.short_description,
                                    category: category?.category_name,
                                },
                            ]}
                            center={[parseFloat(formData.latitude), parseFloat(formData.longitude)]}
                        />
                    </div>
                ) : (
                    <p>📍 Keine gültigen Koordinaten verfügbar</p>
                )}
            </div>
        </div>
    );
}

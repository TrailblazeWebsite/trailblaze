import React from "react";
import { Link } from "react-router-dom";
import styles from "./PlacePreview.module.css";

export default function PlacePreview({ locations }) {
    if (!locations || locations.length === 0) {
        return <div>Keine Orte gefunden.</div>;
    }

    return (
        <div className={styles.placeList}>
            {locations.map((loc) => {
                const displayImage =
                    Array.isArray(loc.gallery_urls) && loc.gallery_urls.length
                        ? loc.gallery_urls[0]
                        : null;

                return (
                    <div key={loc.id} className={`${styles.place} hover-lift`}>
                        <div className={styles.imageWrapper}>
                            {displayImage && (
                                <img
                                    src={displayImage}
                                    alt={loc.name}
                                    className={styles.categoriesImage}
                                />
                            )}
                            <h3 className={styles.imageTitle}>
                                <Link to={`/place/${loc.slug}`}>{loc.name}</Link>
                            </h3>
                        </div>
                        {loc.short_description && (
                            <p className={styles.description}>{loc.short_description}</p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

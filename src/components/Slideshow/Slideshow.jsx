import { useState } from "react";
import styles from "./Slideshow.module.css";

export default function Slideshow({ media = [] }) {
    const [current, setCurrent] = useState(0);

    if (!media || media.length === 0) {
        return <div>Loading slideshow...</div>;
    }

    const prevSlide = () => setCurrent((prev) => (prev - 1 + media.length) % media.length);
    const nextSlide = () => setCurrent((prev) => (prev + 1) % media.length);

    const currentUrl = media[current];
    const isVideo = currentUrl?.toLowerCase().endsWith(".mp4");

    return (
        <div className={styles.slideshow}>
            {isVideo ? (
                <video
                    src={currentUrl}
                    autoPlay
                    muted
                    loop
                />
            ) : (
                <img src={currentUrl} alt={`Slide ${current + 1}`} />
            )}

            {/* Navigation buttons */}
            <button onClick={prevSlide} className={`${styles.button} ${styles.prev}`}>‹</button>
            <button onClick={nextSlide} className={`${styles.button} ${styles.next}`}>›</button>

            {/* Dots navigation */}
            <div className={styles.dots}>
                {media.map((_, i) => (
                    <span
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`${styles.dot} ${current === i ? styles.active : ""}`}
                    ></span>
                ))}
            </div>
        </div>
    );
}

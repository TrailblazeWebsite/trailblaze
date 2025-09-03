import { useState } from "react";
import styles from "./ImageUploader.module.css";

export default function ImageUploader({ value, onChange, multiple = false }) {
    const [uploading, setUploading] = useState(false);
    const [dragIndex, setDragIndex] = useState(null);

    const uploadToCloudinary = async (file) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "unsigned_present");

        // choose resource type dynamically
        const resourceType = file.type.startsWith("video/") ? "video" : "image";

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/dgfycfxe1/${resourceType}/upload`,
            { method: "POST", body: data }
        );

        const result = await res.json();
        if (!res.ok) throw new Error(result.error?.message || "Upload failed");
        return result;
    };


    const handleFiles = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        setUploading(true);

        try {
            const uploads = await Promise.all(files.map(uploadToCloudinary));
            const newUrls = uploads.map((u) => u.secure_url);

            if (multiple) onChange([...(value || []), ...newUrls]);
            else onChange(newUrls[0]);
        } catch (err) {
            console.error(err);
            alert("❌ Fehler beim Hochladen des Bildes");
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = (idx) => {
        if (multiple) onChange(value.filter((_, i) => i !== idx));
        else onChange(null);
    };

    // Drag-and-drop for reordering
    const handleDragStart = (index) => setDragIndex(index);
    const handleDragOver = (e) => e.preventDefault();
    const handleDrop = (index) => {
        if (dragIndex === null || dragIndex === index) return;
        const newOrder = [...value];
        const [moved] = newOrder.splice(dragIndex, 1);
        newOrder.splice(index, 0, moved);
        onChange(newOrder);
        setDragIndex(null);
    };

    return (
        <div className={styles.container}>
            <input
                type="file"
                accept="image/*,video/*"
                multiple={multiple}
                onChange={handleFiles}
                disabled={uploading}
                className={styles.inputFile}
            />
            {uploading && <p className={styles.uploading}>⏳ Uploading...</p>}

            {multiple ? (
                <div className={styles.previewList}>
                    {value?.map((url, i) => (
                        <div
                            key={i}
                            className={styles.previewItem}
                            draggable
                            onDragStart={() => handleDragStart(i)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(i)}
                        >
                            <img src={url} alt={`gallery-${i}`} />
                            <button
                                type="button"
                                className={styles.removeBtn}
                                onClick={() => handleRemove(i)}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                value && (
                    <div className={styles.previewItem}>
                        <img src={value} alt="uploaded" />
                        <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={() => handleRemove()}
                        >
                            ✕
                        </button>
                    </div>
                )
            )}
        </div>
    );
}

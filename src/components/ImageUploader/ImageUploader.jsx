import { useState } from "react";

export default function ImageUploader({
                                          value,
                                          onChange,
                                          multiple = false, // default: single image
                                      }) {
    const [uploading, setUploading] = useState(false);

    // Upload to Cloudinary
    const uploadToCloudinary = async (file) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "unsigned_present"); // ⚡ replace with your unsigned preset

        const res = await fetch(
            "https://api.cloudinary.com/v1_1/dgfycfxe1/image/upload",
            {
                method: "POST",
                body: data,
            }
        );

        const result = await res.json();

        if (!res.ok) {
            console.error("Cloudinary upload error:", result);
            throw new Error(result.error?.message || "Upload failed");
        }

        return result;
    };


    const handleFiles = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        setUploading(true);
        try {
            const uploads = await Promise.all(files.map(uploadToCloudinary));
            const newUrls = uploads.map((u) => u.secure_url);

            if (multiple) {
                onChange([...(value || []), ...newUrls]);
            } else {
                onChange(newUrls[0]); // just one image
            }
        } catch (err) {
            console.error(err);
            alert("❌ Fehler beim Hochladen des Bildes");
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = (idx) => {
        if (multiple) {
            const newUrls = value.filter((_, i) => i !== idx);
            onChange(newUrls);
        } else {
            onChange(null);
        }
    };

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                multiple={multiple}
                onChange={handleFiles}
                disabled={uploading}
            />
            {uploading && <p>⏳ Uploading...</p>}

            {/* Previews */}
            {multiple ? (
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}>
                    {value?.map((url, i) => (
                        <div key={i} style={{ position: "relative" }}>
                            <img
                                src={url}
                                alt={`gallery-${i}`}
                                style={{ width: "100px", borderRadius: "8px" }}
                            />
                            <button
                                type="button"
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    background: "red",
                                    color: "white",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                                onClick={() => handleRemove(i)}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                value && (
                    <div style={{ position: "relative", marginTop: "1rem" }}>
                        <img
                            src={value}
                            alt="uploaded"
                            style={{ width: "150px", borderRadius: "8px" }}
                        />
                        <button
                            type="button"
                            style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                background: "red",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                            }}
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

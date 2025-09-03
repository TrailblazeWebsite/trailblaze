// src/pages/CategoryDetails/CategoryDetails.jsx
import styles from "./CategoryDetails.module.css";
import { supabase } from "../../Backend/supabaseClient.js";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MapBox from "../../components/MapBox/MapBox.jsx";
import PlaceEditPreview from "../../components/PlaceEditPreview/PlaceEditPreview";
import PlacePreview from "../../components/PlacePreview/PlacePreview";

export default function CategoryDetails() {
    const { slug } = useParams();
    const [category, setCategory] = useState(null);
    const [locations, setLocations] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);

            // 1) Load category by slug
            const { data: cat, error: catErr } = await supabase
                .from("categories")
                .select("*")
                .eq("slug", slug)
                .single();

            if (catErr || !cat) {
                if (!cancelled) {
                    setError(catErr?.message || "Kategorie nicht gefunden");
                    setLoading(false);
                }
                return;
            }
            if (cancelled) return;
            setCategory(cat);
            console.log("[CategoryDetails] Kategorie:", cat);

            // 2) Load locations via RPC that returns GeoJSON for coordinates
            // Function should return: id, name, short_description, gallery_urls, slug, category_name, coordinates (GeoJSON)
            const { data: locs, error: locErr } = await supabase
                .rpc("get_locations_by_category_with_geojson", { cat_id: cat.id });

            if (locErr) {
                if (!cancelled) {
                    setError(locErr.message);
                    setLoading(false);
                }
                return;
            }
            if (cancelled) return;

            setLocations(locs || []);
            console.log("[CategoryDetails] Locations:", locs);

            // 3) Transform to Leaflet markers
            const toJson = (v) => (typeof v === "string" ? safeJson(v) : v);
            const mks = (locs || [])
                .map((loc) => {
                    const geo = toJson(loc.coordinates);
                    const coords = Array.isArray(geo?.coordinates) ? geo.coordinates : null; // GeoJSON [lng, lat]
                    if (!coords || coords.length < 2) return null;

                    const [lng, lat] = coords;
                    const latLng = [lat, lng]; // Leaflet expects [lat, lng]

                    return {
                        id: loc.id,
                        name: loc.name,
                        description: loc.short_description,
                        slug: loc.slug,
                        category: cat.category_name, // used by your MapBox to group
                        coordinates: latLng,
                        image:
                            Array.isArray(loc.gallery_urls) && loc.gallery_urls.length
                                ? loc.gallery_urls[0]
                                : null,
                    };
                })
                .filter(Boolean);

            setMarkers(mks);
            console.log("[CategoryDetails] Marker für MapBox:", mks);
            setLoading(false);
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [slug]);

    function safeJson(s) {
        try {
            return JSON.parse(s);
        } catch {
            return null;
        }
    }
    console.log({ loading, error, category, locations, markers });
    if (loading) return <div>⏳ Lädt...</div>;
    if (error) return <div>❌ Fehler: {error}</div>;
    if (!category) return <div>❌ Kategorie nicht gefunden</div>;

    return (
        <div>
            <div className={styles.topContainer}>
                <div className={styles.category}>
                    <div>
                        <h1>
                            {category.icon_url && (
                                <img
                                    src={category.icon_url}
                                    alt=""
                                    style={{
                                        width: 40,
                                        height: 40,
                                        objectFit: "contain",
                                        verticalAlign: "middle",
                                        marginRight: 8,
                                    }}
                                />
                            )}
                            {category.category_name}
                        </h1>
                        {category.description && <p>{category.description}</p>}
                    </div>
                    <div>
                        {category.image_url && (
                            <img
                                src={category.image_url}
                                alt={category.category_name}
                                className={styles.categoriesImage}
                            />
                        )}
                    </div>
                </div>

                <div className={styles.mapContainer}>
                    <MapBox
                        markers={markers}
                        categories={[
                            {
                                category: category.category_name,
                                visible: true,
                                icon_url: category.icon_url, // your MapBox reads icon_url
                            },
                        ]}
                        zoom={8}
                        style={{ width: "100%", height: "420px" }}
                    />
                </div>
            </div>

            <PlacePreview locations={locations}></PlacePreview>
        </div>
    );
}

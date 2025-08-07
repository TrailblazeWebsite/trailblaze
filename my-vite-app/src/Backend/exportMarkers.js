import { supabase } from "./supabaseClient.js";
import fs from "fs";

async function exportMarkers() {
    const { data, error } = await supabase
        .from("locations")
        .select(`
      name,
      description,
      coordinates,
      category:categories(name)
    `);

    if (error) {
        console.error("Fehler beim Abrufen:", error);
        return;
    }

    const markers = data
        .filter(loc => loc.coordinates && loc.coordinates.type === "Point")
        .map(loc => {
            const [lng, lat] = loc.coordinates.coordinates;
            return {
                name: loc.name,
                coordinates: [lat, lng], // ✅ wie du es wolltest
                description: loc.description || "",
                category: loc.category?.name || "Unbekannt"
            };
        });

    fs.writeFileSync("markers.json", JSON.stringify(markers, null, 2));
    console.log(`✅ ${markers.length} Marker wurden in markers.json geschrieben.`);
}

exportMarkers();

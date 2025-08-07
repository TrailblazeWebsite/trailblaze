import { useState, useEffect } from "react";

export default function useUserLocation() {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    setError(error.message);
                }
            );
        } else {
            setError("Geolocation wird vom Browser nicht unterstützt.");
        }
    }, []);

    return { location, error };
}


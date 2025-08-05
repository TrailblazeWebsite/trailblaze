import { useEffect, useState } from "react";

function UserLocation() {
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
            setError("Geolocation is not supported by your browser.");
        }
    }, []);

    if (error) return <p>Fehler: {error}</p>;
    if (!location) return <p>Standort wird geladen...</p>;

    return (
        <div>
            <h3>Dein Standort:</h3>
            <p>Breitengrad: {location.lat}</p>
            <p>Längengrad: {location.lng}</p>
        </div>
    );
}

export default UserLocation;

import styles from './MapBox.module.css';
import {
    MapContainer,
    Marker,
    ScaleControl,
    Popup,
    TileLayer,
    LayersControl,
    LayerGroup
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from "leaflet";
import markerImage from "../../assets/search.svg";
import { Link } from "react-router-dom";
import React from "react";
import { useUserLocationContext } from "../../context/UserLocationContext";

const defaultCenter = [46.484, 8.1336];
const defaultStyle = { height: '100%', width: '100%' };

const userLocationIcon = new Icon({
    iconUrl: "https://res.cloudinary.com/dgfycfxe1/image/upload/v1755043283/platzhalter_h4yom4.svg",
    iconSize: [25, 25],
});

export default function MapBox({
                                   zoom = 8,
                                   style = defaultStyle,
                                   markers = [],
                                   categories = [],
                               }) {
    const { location: userLocation } = useUserLocationContext();

    const center = (userLocation &&
        typeof userLocation.lat === "number" &&
        typeof userLocation.lng === "number")
        ? [userLocation.lat, userLocation.lng]
        : defaultCenter;

    // Filter out user location from normal markers
    const validMarkers = markers.filter(
        m =>
            Array.isArray(m.coordinates) &&
            m.coordinates.length === 2 &&
            !(
                userLocation &&
                m.coordinates[0] === userLocation.lat &&
                m.coordinates[1] === userLocation.lng
            )
    );

    const renderMarker = (m, index) => {
        const categoryData = categories.find(cat => cat.category === m.category);
        const iconUrl = categoryData?.icon_url?.trim() || markerImage;

        const customIcon = new Icon({
            iconUrl,
            iconSize: [30, 30],
        });

        return (
            <Marker
                key={m.id ?? m.name ?? index}
                position={m.coordinates}
                icon={customIcon}
            >
                <Popup>
                    <h3>{m.name}</h3>
                    <h4>{m.description}</h4>
                    {m.id && <h3><Link to={`/place/${m.slug}`}>{m.name}</Link></h3>}
                </Popup>
            </Marker>
        );
    };

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            minZoom={3}
            style={style}
            zoomControl={false}
            className={styles.mapBox}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <ScaleControl
                position="bottomleft"
                metric
                imperial={false}
                maxWidth={200}
            />

            {userLocation && (
                <Marker
                    position={[userLocation.lat, userLocation.lng]}
                    icon={userLocationIcon}
                >
                    <Popup>Du bist hier</Popup>
                </Marker>
            )}

            {categories.length > 0 ? (
                <LayersControl position="topright">
                    {categories.map(category => (
                        <LayersControl.Overlay
                            key={category.category}
                            name={category.category}
                            checked={category.visible || false}
                        >
                            <LayerGroup>
                                {validMarkers
                                    .filter(m => m.category === category.category)
                                    .map(renderMarker)}
                            </LayerGroup>
                        </LayersControl.Overlay>
                    ))}
                </LayersControl>
            ) : (
                validMarkers.map(renderMarker)
            )}
        </MapContainer>
    );
}

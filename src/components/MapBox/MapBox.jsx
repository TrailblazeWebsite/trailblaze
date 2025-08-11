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

const customItem = new Icon({
    iconUrl: markerImage,
    iconSize: [20, 20],
});

export default function MapBox({
                                   zoom = 8,
                                   style = defaultStyle,
                                   markers = [],
                                   categories = [],
                               }) {
    const { location: userLocation, error } = useUserLocationContext();

    const center = (userLocation &&
        typeof userLocation.lat === "number" &&
        typeof userLocation.lng === "number")
        ? [userLocation.lat, userLocation.lng]
        : defaultCenter;

    const validMarkers = markers.filter(
        m => Array.isArray(m.coordinates) && m.coordinates.length === 2
    );

    const renderMarker = (m, index) => (
        <Marker
            key={m.id ?? m.name ?? index}
            position={m.coordinates}
            icon={customItem}
        >
            <Popup>
                <h3>{m.name}</h3>
                <h4>{m.description}</h4>
                {m.id && <h3><Link to={`/place/${m.slug}`}>{m.name}</Link></h3>}
            </Popup>
        </Marker>
    );

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            minZoom={3}
            style={style}
            zoomControl={false}
            className={styles.mapBox}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <ScaleControl
                position="bottomleft"
                metric
                imperial={false}
                maxWidth={200}
            />

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

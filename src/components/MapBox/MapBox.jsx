import styles from './MapBox.module.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import React, { useEffect } from 'react';
import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    LayersControl,
    LayerGroup,
    ScaleControl,
    useMap
} from 'react-leaflet';
import L, { Icon } from 'leaflet';
import 'leaflet.markercluster';
import { useUserLocationContext } from '../../context/UserLocationContext';

const defaultCenter = [46.484, 8.1336];
const defaultStyle = { height: '100%', width: '100%' };
const defaultMarkerUrl = 'https://res.cloudinary.com/dgfycfxe1/image/upload/v1755213033/search_nesbag.svg';

const userLocationIcon = new Icon({
    iconUrl: 'https://res.cloudinary.com/dgfycfxe1/image/upload/v1755043283/platzhalter_h4yom4.svg',
    iconSize: [25, 25],
});

/** Cluster-Layer für den Single-Category-Fall */
function SingleCategoryCluster({ markers, iconUrl, color }) {
    const map = useMap();

    useEffect(() => {
        if (!markers?.length) return;

        const clusterGroup = L.markerClusterGroup({
            iconCreateFunction: (cluster) =>
                L.divIcon({
                    html: `<div style="
            background:${color || '#666'};
            border-radius:50%;
            color:#fff;
            display:flex;align-items:center;justify-content:center;
            width:40px;height:40px;font-weight:700;">
            ${cluster.getChildCount()}
          </div>`,
                    className: 'custom-cluster-icon',
                    iconSize: [40, 40],
                }),
        });

        markers.forEach((m) => {
            const icon = new Icon({ iconUrl: iconUrl || defaultMarkerUrl, iconSize: [30, 30] });
            const popupHtml = `
        <div>
          <h3 style="margin:0 0 4px 0;">${m.name ?? ''}</h3>
          ${m.description ? `<p style="margin:0 0 6px 0;">${m.description}</p>` : ''}
          ${m.slug ? `<a href="/place/${m.slug}">Mehr</a>` : ''}
        </div>
      `;
            clusterGroup.addLayer(L.marker(m.coordinates, { icon }).bindPopup(popupHtml));
        });

        map.addLayer(clusterGroup);
        return () => {
            map.removeLayer(clusterGroup);
        };
    }, [map, markers, iconUrl, color]);

    return null;
}

export default function MapBox({
                                   zoom = 8,
                                   style = defaultStyle,
                                   markers = [],
                                   categories = [],
                               }) {
    const { location: userLocation } = useUserLocationContext();

    const center =
        userLocation &&
        typeof userLocation.lat === 'number' &&
        typeof userLocation.lng === 'number'
            ? [userLocation.lat, userLocation.lng]
            : defaultCenter;

    const validMarkers = (markers || []).filter(
        (m) =>
            Array.isArray(m.coordinates) &&
            m.coordinates.length === 2 &&
            !(userLocation && m.coordinates[0] === userLocation.lat && m.coordinates[1] === userLocation.lng)
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
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <ScaleControl position="bottomleft" metric imperial={false} maxWidth={200} />

            {userLocation && (
                <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
                    <Popup>Du bist hier</Popup>
                </Marker>
            )}

            {/* 1 Kategorie → Clustern imperativ */}
            {categories.length <= 1 ? (
                <SingleCategoryCluster
                    markers={validMarkers}
                    iconUrl={categories[0]?.icon_url}
                    color={categories[0]?.color}
                />
            ) : (
                // Mehrere Kategorien → LayersControl + deklarative Marker
                <LayersControl position="topright">
                    {categories.map((cat) => {
                        const catMarkers = validMarkers.filter((m) => m.category === cat.category);
                        if (!catMarkers.length) return null;

                        const icon = new Icon({
                            iconUrl: cat.icon_url || defaultMarkerUrl,
                            iconSize: [30, 30],
                        });

                        return (
                            <LayersControl.Overlay
                                key={cat.category}
                                name={cat.category}
                                checked={Boolean(cat.visible)}
                            >
                                <LayerGroup>
                                    {catMarkers.map((m) => (
                                        <Marker
                                            key={m.id ?? m.slug ?? `${m.coordinates[0]}-${m.coordinates[1]}`}
                                            position={m.coordinates}
                                            icon={icon}
                                        >
                                            <Popup>
                                                <div>
                                                    <h3 style={{ margin: 0 }}>{m.name ?? ''}</h3>
                                                    {m.description && <p style={{ margin: '4px 0' }}>{m.description}</p>}
                                                    {m.slug && <a href={`/place/${m.slug}`}>Mehr</a>}
                                                </div>
                                            </Popup>
                                        </Marker>
                                    ))}
                                </LayerGroup>
                            </LayersControl.Overlay>
                        );
                    })}
                </LayersControl>
            )}
        </MapContainer>
    );
}

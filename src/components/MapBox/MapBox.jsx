import styles from './MapBox.module.css'
import {MapContainer, Marker, ScaleControl, Popup, TileLayer, LayersControl, LayerGroup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {icon, Icon, marker} from "leaflet";
import markerImage from "../../assets/search.svg"
import {Link} from "react-router-dom";

const defaultCenter = [46.484, 8.1336]
const defaultStyle = { height: '100%', width: '100%'}

const customItem = new Icon({
    iconUrl: markerImage,
    iconSize: [20, 20],
})



export default function MapBox({
                                   center = defaultCenter,
                                   zoom = 8,
                                   style = defaultStyle,
                                   markers = [],
                                   categories = [],
                               })
{

    const renderMarker = (m) => (
        <Marker key={m.name} position={m.coordinates} icon={customItem}>
            <Popup>
                <h3>{m.name}</h3>
                <h4>{m.description}</h4>
                <Link to="/"> more about {m.name} </Link>
            </Popup>
        </Marker>
    );

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            minZoom={3}
            style={style}
            className={styles.mapBox}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <ScaleControl position="bottomleft" metric imperial={false} maxwidth={200}/>

            {categories.length > 0 ? (
                <LayersControl position="topright">
                    {categories.map(category => (
                        <LayersControl.Overlay
                            name={category.category}
                            checked={category.visible || false}
                            color={category.color}
                        >
                            <LayerGroup>
                                {markers
                                    .filter(m => m.category === category.category)
                                    .map(renderMarker)}
                            </LayerGroup>
                        </LayersControl.Overlay>
                    ))}
                </LayersControl>

            ) : (
                markers.map(renderMarker)
            )}



        </MapContainer>
    )
}
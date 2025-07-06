import styles from './MapBox.module.css'
import { MapContainer, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapBox = ({center, zoom, style}) => {
    const position = [46.484, 8.1336]
    const defaultStyle = { height: '500px', width: '100%'}

    return (
        <MapContainer
            center={center || position}
            zoom={zoom || 8}
            minZoom={3}
            style={style || defaultStyle}

            className={styles.mapContainer}
            >

            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
        </MapContainer>
    )
}

export default MapBox
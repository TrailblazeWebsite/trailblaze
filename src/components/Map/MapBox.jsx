import styles from './MapBox.module.css'
import {MapContainer, Marker, ScaleControl, Popup, TileLayer, LayersControl, LayerGroup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {icon, Icon, marker} from "leaflet";
import markerImage from "../../assets/search.svg"
import {Link} from "react-router-dom";

const MapBox = ({center, zoom, style}) => {
    const position = [46.484, 8.1336]
    const defaultStyle = { height: '500px', width: '100%'}

    const markers = [
        {
            name: "Creux du Va",
            coordinates : [
                6.721444,
                46.931935
            ],
            description: "Schöner Badeplatz und hoher Baum, von welchem man in den See springen kann.\n" +
                "3/5\n" +
                "47.274072, 8.208565",
            category: "Atlas der Schweiz"
        },
        {
            name: "Creux d Van",
            coordinates : [
                5.721444,
                46.931935
            ],
            description: "Hallo",
            category: "Atlas der Schweiz"
        },
        {
            name: "Creu du Van",
            coordinates : [
                4.721444,
                46.931935
            ],
            description: "Test",
            category: "Alt"
        },
        {
            name: "Creux du Van",
            coordinates : [
                3.721444,
                46.931935
            ],
            description: "Test",
            category: "Noch zu Erkunden: Niedrige Priorität"
        }
        ];

    const categories = [
        {
            category: "Atlas der Schweiz",
            color: "Purple",
            symbol: "Default",
            catDescription: "Viele Höhlen eingezeichnet aber immer etwas ungenau",
            visible: false
        },
        {
            category: "Alt",
            color: "Red",
            symbol: "Default",
            catDescription: "Viele Höhlen eingezeichnet aber immer etwas ungenau",
            visible: true
        },
        {
            category: "Noch zu Erkunden: Niedrige Priorität",
            color: "Green",
            symbol: "Default",
            catDescription: "Viele Höhlen eingezeichnet aber immer etwas ungenau",
            visible: false
        },
    ];

    const customItem = new Icon({
        iconUrl: markerImage,
        iconSize: [20, 20],
    })

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

            <ScaleControl
                position="bottomleft"
                metric
                imperial={false}
                maxwidth={200}
            />

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
                                .map(m => (
                                    <Marker
                                        position={m.coordinates}
                                        icon={customItem}
                                    >
                                        <Popup>
                                            <h3>{m.name}</h3>
                                            <h4>{m.description}</h4>
                                            <Link to="/"> more about {m.name} </Link>
                                        </Popup>
                                    </Marker>
                                ))
                            }
                        </LayerGroup>
                    </LayersControl.Overlay>
                ))}
            </LayersControl>

        </MapContainer>
    )
}

export default MapBox
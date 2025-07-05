import Navbar from "../../components/Navbar/Navbar";
import MapBox from "../../components/Map/MapBox";

const costumStyle = {
    height: '800px',
    width: '90%',
    borderRadius: '8px',
    border: '2px solid #ccc'
}

function Map() {
    return (
        <div className="App">
            <Navbar />
            <MapBox
            style={costumStyle}
            className="mapContainer"
            />
        </div>
    );
}

export default Map
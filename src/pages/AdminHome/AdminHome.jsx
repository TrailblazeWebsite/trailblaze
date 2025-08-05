import Navbar from "../../components/Navbar/Navbar";
import {Link} from "react-router-dom";

function AdminHome() {
    return (
        <div>
            <Navbar/>
            <div>
                <li><Link to="/addPlace"> Edit Locations </Link></li>
                <li><Link to="/editCategories"> Edit Categories </Link></li>
            </div>
        </div>
    )
}

export default AdminHome
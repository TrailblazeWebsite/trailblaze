import Navbar from "../../components/Navbar/Navbar.jsx";
import {Link} from "react-router-dom";

function AdminHome() {
    return (
        <div>
            <div>
                <li><Link to="/addPlace"> Edit Locations </Link></li>
                <li><Link to="/editCategories"> Edit Categories </Link></li>
                <li><Link to="/login"> Login</Link></li>
                <li><Link to="/register"> Register </Link></li>
            </div>
        </div>
    )
}

export default AdminHome
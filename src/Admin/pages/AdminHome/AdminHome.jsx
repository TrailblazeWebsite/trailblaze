import Navbar from "../../../components/Navbar/Navbar";
import styles from"../../Admin.css"
import {Link} from "react-router-dom";

function AdminHome() {
    return (
        <div className={styles.admin}>
            <Navbar/>
            <div>
                <li><Link to="/addPlace"> Edit Locations </Link></li>
                <li><Link to="/editCategories"> Edit Categories </Link></li>
            </div>
        </div>
    )
}

export default AdminHome
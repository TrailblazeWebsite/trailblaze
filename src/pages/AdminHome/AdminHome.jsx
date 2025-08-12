import {Link} from "react-router-dom";

function AdminHome() {
    return (
        <div>
            <div>
                <li><Link to="/editPlace"> Edit Locations </Link></li>
                <li><Link to="/editCategories"> Edit Categories </Link></li>
                <li><Link to="/manageUser"> Manage User </Link></li>
            </div>
        </div>
    )
}

export default AdminHome
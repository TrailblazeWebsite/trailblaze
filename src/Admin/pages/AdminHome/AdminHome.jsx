import AdminNavbar from "../../components/AdminNavbar/AdminNavbar";
import styles from"../../Admin.css"

function AdminHome() {
    return (
        <div className={styles.admin}>
            <AdminNavbar/>
        </div>
    )
}

export default AdminHome
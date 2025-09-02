import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {supabase} from "../../Backend/supabaseClient";
import styles from "./AdminHome.module.css";

function AdminHome() {
    const [users, setUsers] = useState([]);
    const [userApplications, setUserApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        const { data, error } = await supabase
            .from("profiles")
            .select("id, email, role, created_at")
            .neq("role", "admin")
            .order("email");

        if (error) {
            setError(error.message);
        } else {
            setUsers(data);
        }
    };

    const fetchUserApplications = async () => {
        const { data, error } = await supabase
            .from("profiles")
            .select("id, email, role, created_at")
            .eq("role", "applicant")
            .neq("role", "admin")
            .order("email");

        if (error) {
            setError(error.message);
        } else {
            setUserApplications(data);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchUsers(), fetchUserApplications()]);
            setLoading(false);
        };
        loadData();
    }, []);

    const updateUserRole = async (userId, newRole) => {
        const { error } = await supabase
            .from("profiles")
            .update({ role: newRole })
            .eq("id", userId);

        if (error) {
            alert("Error updating role: " + error.message);
        } else {
            await Promise.all([fetchUsers(), fetchUserApplications()]);
        }
    };

    if (loading) return <p>Loading users...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles.container}>
            <div className={styles.navButtons}>
                <button>
                    <Link to="/editPlace"> Edit Locations </Link>
                </button>
                <button>
                    <Link to="/editCategories"> Edit Categories </Link>
                </button>
                <button>
                    <Link to="/manageUser"> Manage User </Link>
                </button>
            </div>

            <div className={styles.section}>
                <h1>Pending Applications</h1>
                <div className={styles.tableWrapper}>
                    <table>
                        <thead>
                        <tr>
                            <th>Email</th>
                            <th>Created at</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {userApplications.map(({id, email, created_at}) => (
                            <tr key={id}>
                                <td>{email}</td>
                                <td>{new Date(created_at).toLocaleString()}</td>
                                <td>
                                    <button
                                        className={styles.actionButton}
                                        onClick={() => updateUserRole(id, "user")}
                                    >
                                        Accept
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AdminHome
import React, { useEffect, useState } from "react";
import { supabase } from "../../Backend/supabaseClient";
import styles from "./ManageUsers.module.css";

export default function ManageUsers() {
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
            <h1 className={styles.title}>User Management</h1>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Change Role</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users
                        .filter(({ role }) => role !== "admin")
                        .map(({ id, email, role }) => (
                            <tr key={id}>
                                <td>{email}</td>
                                <td>{role}</td>
                                <td>
                                    <select
                                        className={styles.roleSelect}
                                        value={role}
                                        onChange={(e) => updateUserRole(id, e.target.value)}
                                    >
                                        <option value="applicant">Applicant</option>
                                        <option value="user">User</option>
                                        <option value="trailblazer">Trailblazer</option>
                                        <option value="vanguard">Vanguard</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

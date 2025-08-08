import React, { useEffect, useState } from 'react';
import { supabase } from "../../Backend/supabaseClient";

export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Lade alle Nutzerprofile (Admins only)
    const fetchUsers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('id, email, role')
            .order('email');

        if (error) {
            setError(error.message);
        } else {
            setUsers(data);
            setError(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Rolle ändern
    const updateUserRole = async (userId, newRole) => {
        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId);

        if (error) {
            alert('Error updating role: ' + error.message);
        } else {
            // Refresh User List
            fetchUsers();
        }
    };

    if (loading) return <p>Loading users...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>User Management</h1>
            <table border="1" cellPadding={8} style={{ borderCollapse: 'collapse' }}>
                <thead>
                <tr>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Change Role</th>
                </tr>
                </thead>
                <tbody>
                {users.map(({ id, email, role }) => (
                    <tr key={id}>
                        <td>{email}</td>
                        <td>{role}</td>
                        <td>
                            <select
                                value={role}
                                onChange={(e) => updateUserRole(id, e.target.value)}
                            >
                                <option value="authenticated">User</option>
                                <option value="admin">Admin</option>
                                <option value="trailblazer">Trailblazer</option>
                            </select>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

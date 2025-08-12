import React, { useEffect, useState } from 'react';
import { supabase } from "../../Backend/supabaseClient";

export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [userApplications, setUserApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, email, role, created_at')
            .order('email');

        if (error) {
            setError(error.message);
        } else {
            setUsers(data);
        }
    };

    const fetchUserApplications = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, email, role, created_at')
            .eq('role', 'applicant')
            .order('email');

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
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId);

        if (error) {
            alert('Error updating role: ' + error.message);
        } else {
            await Promise.all([fetchUsers(), fetchUserApplications()]);
        }
    };

    if (loading) return <p>Loading users...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <div>
                <h1>Pending Applications</h1>
                <table>
                    <thead>
                    <tr>
                        <th>Email</th>
                        <th>Created at</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {userApplications.map(({ id, email, created_at }) => (
                        <tr key={id}>
                            <td>{email}</td>
                            <td>{new Date(created_at).toLocaleString()}</td>
                            <td>
                                <button onClick={() => updateUserRole(id, 'authenticated')}>Accept</button>
                                <button onClick={() => updateUserRole(id, 'rejected')}>Deny</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

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
                                <option value="applicant">Applicant</option>
                            </select>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

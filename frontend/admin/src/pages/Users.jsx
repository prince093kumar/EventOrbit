import React, { useState, useEffect } from 'react';
import { Search, User, Trash2, Mail, Ban, CheckCircle } from 'lucide-react';
import apiClient from '../api/apiClient';

const Users = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await apiClient.get('/users');
                setUsers(res.data);
            } catch (error) {
                console.error("Error fetching users", error);
            }
        };

        fetchUsers();
        const interval = setInterval(fetchUsers, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h2>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 uppercase text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Phone</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Wallet</th>
                            <th className="px-6 py-4">Joined Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {users.length > 0 ? users.map((user) => (
                            <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="px-6 py-4 flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mr-3 text-slate-500 dark:text-white">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">{user.fullName}</p>
                                        <p className="text-xs">{user.email}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-slate-600 dark:text-slate-400">
                                        {user.phone || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${user.role === 'admin' ? 'bg-violet-500/10 text-violet-500' : 'bg-blue-500/10 text-blue-500'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    ₹{user.walletBalance || 0}
                                </td>
                                <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={async () => {
                                                const action = user.isBlocked ? 'unblock' : 'block';
                                                if (window.confirm(`Are you sure you want to ${action} this user?`)) {
                                                    try {
                                                        const res = await apiClient.put(`/users/${user._id}/block`);
                                                        if (res.data.success) {
                                                            setUsers(users.map(u => u._id === user._id ? { ...u, isBlocked: res.data.isBlocked } : u));
                                                        }
                                                    } catch (err) {
                                                        console.error(`Failed to ${action} user`, err);
                                                        alert(`Failed to ${action} user`);
                                                    }
                                                }
                                            }}
                                            className={`p-1 rounded ${user.isBlocked ? 'text-green-500 hover:bg-green-500/10' : 'text-red-500 hover:bg-red-500/10'}`}
                                            title={user.isBlocked ? "Unblock User" : "Block User"}
                                        >
                                            {user.isBlocked ? <CheckCircle className="w-5 h-5" /> : <Ban className="w-5 h-5" />}
                                        </button>

                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export default Users;

import React, { useState, useEffect } from 'react';
import { Search, Filter, ShieldCheck, XCircle, Eye, Ban, CheckCircle, Clock, Mail, Phone } from 'lucide-react';
import apiClient from '../api/apiClient';

const Organizers = () => {
    const [organizers, setOrganizers] = useState([]);

    useEffect(() => {
        const fetchOrganizers = async () => {
            try {
                const res = await apiClient.get('/organizers');
                setOrganizers(res.data);
            } catch (error) {
                console.error("Error fetching organizers", error);
            }
        };

        fetchOrganizers();
        const interval = setInterval(fetchOrganizers, 5000);

        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'verified':
            case 'approved': return 'bg-green-500/10 text-green-500';
            case 'pending': return 'bg-yellow-500/10 text-yellow-500';
            case 'rejected': return 'bg-red-500/10 text-red-500';
            default: return 'bg-slate-500/10 text-slate-500';
        }
    };

    const updateKycStatus = async (orgId, newStatus) => {
        try {
            await apiClient.put(`/organizers/${orgId}/kyc`, { kycStatus: newStatus });
            setOrganizers(organizers.map(o => o._id === orgId ? { ...o, kycStatus: newStatus } : o));
        } catch (err) { console.error(err); }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Organizer Verification</h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search organizers..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 uppercase text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <tr>
                            <th className="px-6 py-4">Organizer</th>
                            <th className="px-6 py-4">Contact</th>
                            <th className="px-6 py-4">Details</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Document</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {organizers.length > 0 ? organizers.map((org) => (
                            <tr key={org._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-medium text-slate-900 dark:text-white">{org.fullName}</p>
                                    <p className="text-xs text-slate-500">ID: {org._id}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                            <Mail className="w-3 h-3" /> {org.email}
                                        </span>
                                        <span className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                                            <Phone className="w-3 h-3" /> {org.phone || 'N/A'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{org.organizationDetails?.orgName || 'N/A'}</p>
                                    <p className="text-xs text-slate-500">{org.organizationDetails?.address || 'No Address'}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${getStatusColor(org.kycStatus)}`}>
                                        {org.kycStatus || 'pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {org.organizationDetails?.kycDocument ? (
                                        <a
                                            href={org.organizationDetails.kycDocument}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-blue-500 hover:text-blue-700 font-medium text-sm bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors w-fit"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View Doc
                                        </a>
                                    ) : (
                                        <span className="text-xs text-slate-400 italic flex items-center gap-1">
                                            <XCircle className="w-3 h-3" /> No Upload
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-2">

                                        {/* Status Actions */}
                                        {org.kycStatus !== 'approved' && (
                                            <button
                                                onClick={() => updateKycStatus(org._id, 'approved')}
                                                className="p-1 text-green-500 hover:bg-green-500/10 rounded"
                                                title="Approve KYC"
                                            >
                                                <ShieldCheck className="w-5 h-5" />
                                            </button>
                                        )}

                                        {org.kycStatus !== 'rejected' && (
                                            <button
                                                onClick={() => updateKycStatus(org._id, 'rejected')}
                                                className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                                                title="Reject KYC"
                                            >
                                                <XCircle className="w-5 h-5" />
                                            </button>
                                        )}

                                        {org.kycStatus !== 'pending' && (
                                            <button
                                                onClick={() => updateKycStatus(org._id, 'pending')}
                                                className="p-1 text-yellow-500 hover:bg-yellow-500/10 rounded"
                                                title="Set Pending"
                                            >
                                                <Clock className="w-5 h-5" />
                                            </button>
                                        )}

                                        {/* Block/Unblock Action */}
                                        <button
                                            onClick={async () => {
                                                const action = org.isBlocked ? 'unblock' : 'block';
                                                if (window.confirm(`Are you sure you want to ${action} this organizer?`)) {
                                                    try {
                                                        const res = await apiClient.put(`/users/${org._id}/block`);
                                                        if (res.data.success) {
                                                            setOrganizers(organizers.map(o => o._id === org._id ? { ...o, isBlocked: res.data.isBlocked } : o));
                                                        }
                                                    } catch (err) {
                                                        console.error(`Failed to ${action} organizer`, err);
                                                        alert(`Failed to ${action} organizer`);
                                                    }
                                                }
                                            }}
                                            className={`p-1 rounded ${org.isBlocked ? 'text-green-500 hover:bg-green-500/10' : 'text-red-500 hover:bg-red-500/10'}`}
                                            title={org.isBlocked ? "Unblock Organizer" : "Block Organizer"}
                                        >
                                            {org.isBlocked ? <CheckCircle className="w-5 h-5" /> : <Ban className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                                    No organizers found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Organizers;

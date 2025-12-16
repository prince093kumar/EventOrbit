import React, { useState, useEffect } from 'react';
import { ShieldCheck, Upload, Building, User, Mail, Phone, CheckCircle } from 'lucide-react';

const Profile = () => {
    const [userData, setUserData] = useState({
        fullName: '',
        email: '',
        phone: '',
        organizationDetails: {
            orgName: '',
            address: ''
        },
        bankDetails: {
            accountHolderName: '',
            bankName: '',
            accountNumber: '',
            ifscCode: ''
        },
        kycStatus: 'not_submitted'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/organizer/profile', {
                    // headers: { 'Authorization': ... } // In real app, headers are needed if using fetch directly without interceptor. 
                    // Based on walkthrough, we might be relying on cookies or need to import token. 
                    // Ideally useAuth() provides token, let's assume global fetch wrapper or add header efficiently.
                    // For now, I'll add the header manually using localStorage or Context if available in scope.
                    // Context is safer. Let's assume standard fetch for now as per previous patterns.
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('eventorbit_organizer_token')}`
                    }
                });
                const data = await res.json();
                if (data.success) {
                    // Merge generic user data + specific nested objects
                    setUserData(prev => ({
                        ...prev,
                        ...data.user,
                        organizationDetails: data.user.organizationDetails || prev.organizationDetails,
                        bankDetails: data.user.bankDetails || prev.bankDetails
                    }));
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/organizer/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('eventorbit_organizer_token')}`
                },
                body: JSON.stringify(userData)
            });
            const data = await res.json();
            if (data.success) {
                alert("Profile Updated Successfully!");
            } else {
                alert("Failed to update profile.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Error connecting to server.");
        }
    };

    const handleNestedChange = (section, field, value) => {
        setUserData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-page)]">Organizer Profile (KYC)</h1>
                    <p className="text-[var(--text-muted)]">Manage your organization details and banking information.</p>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${userData.kycStatus === 'approved'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    <ShieldCheck size={18} />
                    <span className="capitalize">{userData.kycStatus?.replace('_', ' ') || 'Pending'}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Organization Details */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
                    <h3 className="font-bold text-[var(--text-page)] text-lg mb-6">Organization Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-[var(--text-muted)]">Organization Name</label>
                            <input
                                type="text"
                                value={userData.organizationDetails.orgName}
                                onChange={(e) => handleNestedChange('organizationDetails', 'orgName', e.target.value)}
                                className="w-full px-4 py-2.5 bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-[#FFDA8A]/50"
                                placeholder="Sonic Boom Inc."
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-[var(--text-muted)]">Official Email</label>
                            <input
                                type="email"
                                value={userData.email}
                                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                className="w-full px-4 py-2.5 bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-[#FFDA8A]/50"
                            />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-xs font-medium text-[var(--text-muted)]">Address</label>
                            <input
                                type="text"
                                value={userData.organizationDetails.address}
                                onChange={(e) => handleNestedChange('organizationDetails', 'address', e.target.value)}
                                className="w-full px-4 py-2.5 bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-[#FFDA8A]/50"
                                placeholder="123 Audio Lane, Neo Tokyo"
                            />
                        </div>
                    </div>
                </div>

                {/* Bank Information */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
                    <h3 className="font-bold text-[var(--text-page)] text-lg mb-6">Bank Information (For Payouts)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-[var(--text-muted)]">Account Holder Name</label>
                            <input
                                type="text"
                                value={userData.bankDetails.accountHolderName}
                                onChange={(e) => handleNestedChange('bankDetails', 'accountHolderName', e.target.value)}
                                className="w-full px-4 py-2.5 bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-[#FFDA8A]/50"
                                placeholder="Account Holder Name"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-[var(--text-muted)]">Bank Name</label>
                            <input
                                type="text"
                                value={userData.bankDetails.bankName}
                                onChange={(e) => handleNestedChange('bankDetails', 'bankName', e.target.value)}
                                className="w-full px-4 py-2.5 bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-[#FFDA8A]/50"
                                placeholder="Bank Name"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-[var(--text-muted)]">Account Number</label>
                            <input
                                type="text"
                                value={userData.bankDetails.accountNumber}
                                onChange={(e) => handleNestedChange('bankDetails', 'accountNumber', e.target.value)}
                                className="w-full px-4 py-2.5 bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-[#FFDA8A]/50"
                                placeholder="Account Number"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-[var(--text-muted)]">IFSC / Swift Code</label>
                            <input
                                type="text"
                                value={userData.bankDetails.ifscCode}
                                onChange={(e) => handleNestedChange('bankDetails', 'ifscCode', e.target.value)}
                                className="w-full px-4 py-2.5 bg-[var(--bg-page)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-[#FFDA8A]/50"
                                placeholder="IFSC / Swift Code"
                            />
                        </div>
                    </div>
                </div>

                {/* Verification Documents */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
                    <h3 className="font-bold text-[var(--text-page)] text-lg mb-6">Verification Documents</h3>
                    <div className="border-[2px] border-dashed border-[var(--border-color)] rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer group">
                        <div className="w-12 h-12 bg-[#FFDA8A]/20 rounded-full flex items-center justify-center text-yellow-600 mb-3 group-hover:scale-110 transition-transform">
                            <Upload size={24} />
                        </div>
                        <p className="text-sm font-medium text-[var(--text-page)]">Click to Upload Business License / Tax ID</p>
                    </div>

                    {/* Mock verified status */}
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg flex justify-between items-center text-sm border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2">
                            <CheckCircle size={16} />
                            <span>identity_proof.pdf</span>
                        </div>
                        <span className="font-semibold">Verified</span>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className="w-48 py-3 bg-gradient-to-r from-[#FFDA8A] to-[#ffc107] text-gray-900 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                    Save Profile
                </button>
            </div>
        </div>
    );
};

export default Profile;

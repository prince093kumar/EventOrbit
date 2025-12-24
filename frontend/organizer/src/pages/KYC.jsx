import React, { useState, useEffect, useRef } from 'react';
import { Building, ShieldCheck, Upload, CheckCircle, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';

const KYC = () => {
    const { user } = useAuth();
    const docInputRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [verificationFile, setVerificationFile] = useState(null);

    const [formData, setFormData] = useState({
        organizationDetails: { orgName: '', address: '' },
        bankDetails: { accountHolderName: '', bankName: '', accountNumber: '', ifscCode: '' },
        kycStatus: 'not_submitted'
    });

    // Load Data from Backend
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Try backend first
                const token = localStorage.getItem('eventorbit_organizer_token');
                if (token) {
                    const res = await apiClient.get('/organizer/profile');
                    const data = res.data;
                    if (data.success && data.user) {
                        setFormData(prev => ({
                            ...prev,
                            organizationDetails: data.user.organizationDetails || prev.organizationDetails,
                            bankDetails: data.user.bankDetails || prev.bankDetails,
                            kycStatus: data.user.kycStatus || prev.kycStatus
                        }));
                        return;
                    }
                }

                // Fallback to Context/LocalStorage if backend fails or no token
                const savedData = localStorage.getItem('organizer_kyc_data');
                if (savedData) {
                    setFormData(JSON.parse(savedData));
                } else if (user) {
                    setFormData(prev => ({
                        ...prev,
                        organizationDetails: user.organizationDetails || prev.organizationDetails,
                        bankDetails: user.bankDetails || prev.bankDetails,
                        kycStatus: user.kycStatus || 'not_submitted'
                    }));
                }
            } catch (error) {
                console.error("Error fetching KYC status:", error);
            }
        };
        fetchProfile();
    }, [user]);

    const handleNestedChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Save to Backend
            const token = localStorage.getItem('eventorbit_organizer_token');
            if (token) {
                const data = new FormData();
                data.append('organizationDetails', JSON.stringify(formData.organizationDetails));
                data.append('bankDetails', JSON.stringify(formData.bankDetails));

                // Important: Set kycStatus to pending if submitting with a file
                if (verificationFile) {
                    data.append('kycStatus', 'pending');
                    data.append('kycDocument', verificationFile);
                } else {
                    data.append('kycStatus', formData.kycStatus);
                }

                const res = await apiClient.put('/organizer/profile', data, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                const resData = res.data;
                if (resData.success) {
                    setFormData(prev => ({
                        ...prev,
                        kycStatus: resData.user.kycStatus || 'pending',
                        organizationDetails: resData.user.organizationDetails || prev.organizationDetails
                    }));
                }
            }

            // Also persist locally as backup/simulate
            if (verificationFile || formData.kycStatus === 'not_submitted') {
                setFormData(prev => ({ ...prev, kycStatus: 'pending' }));
            }
            localStorage.setItem('organizer_kyc_data', JSON.stringify({
                ...formData,
                kycStatus: verificationFile ? 'pending' : formData.kycStatus
            }));

            setSuccessMsg('KYC Details Submitted Successfully!');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (error) {
            console.error(error);
            setSuccessMsg('Saved locally (Backend error)');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-[var(--text-page)]">KYC & Organization</h1>
                <p className="text-[var(--text-muted)] mt-2">Verify your organization identity and banking details for payouts.</p>
            </div>

            {/* Status Banner */}
            <div className={`p-4 rounded-xl border flex items-center gap-3 ${formData.kycStatus === 'approved' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400' :
                formData.kycStatus === 'pending' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400' :
                    'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400'
                }`}>
                <ShieldCheck size={24} />
                <div>
                    <p className="font-bold text-sm uppercase">{formData.kycStatus.replace('_', ' ')}</p>
                    <p className="text-xs opacity-90">
                        {formData.kycStatus === 'approved' ? "Your account is fully verified." :
                            formData.kycStatus === 'pending' ? "We are reviewing your documents." :
                                "Please submit your details to start hosting events."}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Organization Details */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-[var(--text-page)] text-lg mb-6 flex items-center gap-2">
                        <Building size={20} className="text-[#FFDA8A]" /> Organization Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-page)]">Organization Name</label>
                            <input
                                type="text"
                                value={formData.organizationDetails.orgName}
                                onChange={(e) => handleNestedChange('organizationDetails', 'orgName', e.target.value)}
                                className="w-full px-4 py-2.5 bg-[#f9fafb] dark:bg-slate-900 border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-[#FFDA8A]/50 transition-all"
                                placeholder="Sonic Boom Inc."
                                required
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-[var(--text-page)]">Registered Office Address</label>
                            <input
                                type="text"
                                value={formData.organizationDetails.address}
                                onChange={(e) => handleNestedChange('organizationDetails', 'address', e.target.value)}
                                className="w-full px-4 py-2.5 bg-[#f9fafb] dark:bg-slate-900 border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-[#FFDA8A]/50 transition-all"
                                placeholder="123 Audio Lane, Neo Tokyo"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Bank Information */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-[var(--text-page)] text-lg mb-6 flex items-center gap-2">
                        <ShieldCheck size={20} className="text-[#FFDA8A]" /> Bank Details (Payouts)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-page)]">Account Holder Name</label>
                            <input type="text" value={formData.bankDetails.accountHolderName} onChange={(e) => handleNestedChange('bankDetails', 'accountHolderName', e.target.value)} className="w-full px-4 py-2.5 bg-[#f9fafb] dark:bg-slate-900 border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-[#FFDA8A]/50 transition-all" placeholder="Name on Passbook" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-page)]">Bank Name</label>
                            <input type="text" value={formData.bankDetails.bankName} onChange={(e) => handleNestedChange('bankDetails', 'bankName', e.target.value)} className="w-full px-4 py-2.5 bg-[#f9fafb] dark:bg-slate-900 border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-[#FFDA8A]/50 transition-all" placeholder="HDFC, SBI, etc." required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-page)]">Account Number</label>
                            <input type="text" value={formData.bankDetails.accountNumber} onChange={(e) => handleNestedChange('bankDetails', 'accountNumber', e.target.value)} className="w-full px-4 py-2.5 bg-[#f9fafb] dark:bg-slate-900 border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-[#FFDA8A]/50 transition-all" placeholder="1234..." required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[var(--text-page)]">IFSC Code</label>
                            <input type="text" value={formData.bankDetails.ifscCode} onChange={(e) => handleNestedChange('bankDetails', 'ifscCode', e.target.value)} className="w-full px-4 py-2.5 bg-[#f9fafb] dark:bg-slate-900 border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-[#FFDA8A]/50 transition-all" placeholder="ABCD0123..." required />
                        </div>
                    </div>
                </div>

                {/* KYC Document */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-[var(--text-page)] text-lg mb-6 flex items-center gap-2">
                        <Upload size={20} className="text-[#FFDA8A]" /> Verification Documents
                    </h3>
                    <div
                        onClick={() => docInputRef.current.click()}
                        className="border-[2px] border-dashed border-[var(--border-color)] rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-[#f9fafb] dark:hover:bg-slate-800 transition-colors cursor-pointer group"
                    >
                        <input type="file" ref={docInputRef} className="hidden" accept=".pdf,.jpg,.png" onChange={(e) => { const f = e.target.files[0]; if (f) { setVerificationFile(f); } }} />
                        <div className="w-12 h-12 bg-[#FFDA8A]/20 rounded-full flex items-center justify-center text-yellow-600 mb-3 group-hover:scale-110 transition-transform">
                            <Upload size={24} />
                        </div>
                        <p className="text-sm font-medium text-[var(--text-page)]">
                            {verificationFile ? `Selected: ${verificationFile.name}` : "Click to Upload Business License / Tax ID"}
                        </p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">Supports PDF, JPG, PNG (Max 5MB)</p>
                    </div>

                    {verificationFile && (
                        <div className="mt-4 p-3 rounded-lg flex justify-between items-center text-sm border bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} />
                                <span>{verificationFile.name}</span>
                            </div>
                            <span className="font-semibold">Ready to Submit</span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-[#FFDA8A] hover:bg-[#ffc107] text-gray-900 font-bold rounded-xl shadow-lg shadow-[#FFDA8A]/20 transition-all flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Submit for Verification
                    </button>
                    {successMsg && <span className="text-green-600 dark:text-green-400 font-medium animate-in fade-in slide-in-from-left-2">{successMsg}</span>}
                </div>
            </form>

            {/* Submission Summary (Restored) */}
            {formData.kycStatus !== 'not_submitted' && (
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4">
                    <h3 className="font-bold text-[var(--text-page)] text-lg mb-4">Submission Summary</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-2 border-b border-[var(--border-color)]">
                            <span className="text-[var(--text-muted)]">Status</span>
                            <span className={`font-bold capitalize ${formData.kycStatus === 'approved' ? 'text-green-600' :
                                formData.kycStatus === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                                }`}>{formData.kycStatus.replace('_', ' ')}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-[var(--border-color)]">
                            <span className="text-[var(--text-muted)]">Organization</span>
                            <span className="text-[var(--text-page)] font-medium">{formData.organizationDetails.orgName}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-[var(--border-color)]">
                            <span className="text-[var(--text-muted)]">Submitted Date</span>
                            <span className="text-[var(--text-page)] font-medium">{new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-[var(--text-muted)]">Address</span>
                            <span className="text-[var(--text-page)] font-medium">{formData.organizationDetails.address}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KYC;

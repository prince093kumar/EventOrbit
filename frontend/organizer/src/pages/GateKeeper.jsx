import React, { useState } from 'react';
import { Scan, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';
import apiClient from '../api/apiClient';

const GateKeeper = () => {
    const [ticketId, setTicketId] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [result, setResult] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const [isScanning, setIsScanning] = useState(false);

    const handleQrScan = (detectedCodes) => {
        if (detectedCodes && detectedCodes.length > 0) {
            const rawValue = detectedCodes[0].rawValue;
            if (rawValue) {
                setTicketId(rawValue);
                setIsScanning(false);
                // Trigger verification immediately after scan
                // We need to pass the value directly because state update might be async
                verifyTicket(rawValue);
            }
        }
    };

    const verifyTicket = async (idToVerify) => {
        if (!idToVerify) return;

        setStatus('loading');
        setResult(null);
        setErrorMsg('');

        try {
            const res = await apiClient.post('/bookings/verify', { ticketId: idToVerify });

            if (res.data.success) {
                setStatus('success');
                setResult(res.data.data);
                // Clear input after short delay for next scan
                setTimeout(() => setTicketId(''), 3000);
            }
        } catch (err) {
            setStatus('error');
            setErrorMsg(err.response?.data?.message || "Verification Failed");
        }
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        verifyTicket(ticketId);
    };

    return (
        <div className="max-w-md mx-auto space-y-8 mt-10">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex justify-center items-center gap-2">
                    <Scan className="w-8 h-8 text-violet-500" />
                    Gate Keeper
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Scan QR Code or Enter Ticket ID to verify entry.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
                {/* Toggle Scan/Manual */}
                <div className="flex justify-center mb-6">
                    <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-lg flex gap-1">
                        <button
                            onClick={() => setIsScanning(true)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${isScanning ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            Scan QR
                        </button>
                        <button
                            onClick={() => setIsScanning(false)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${!isScanning ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            Manual Entry
                        </button>
                    </div>
                </div>

                {isScanning ? (
                    <div className="rounded-xl overflow-hidden aspect-square bg-black relative">
                        {/* Dynamically import scanner to avoid SSR issues if any, though here it's SPA */}
                        <Scanner
                            onScan={handleQrScan}
                            components={{
                                audio: false,
                                torch: true
                            }}
                            styles={{
                                container: { width: '100%', height: '100%' }
                            }}
                        />
                        <div className="absolute inset-0 border-2 border-violet-500/50 pointer-events-none"></div>
                        <p className="absolute bottom-4 left-0 right-0 text-center text-white/80 text-xs">Point camera at QR code</p>
                    </div>
                ) : (
                    <form onSubmit={handleManualSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Ticket ID
                            </label>
                            <input
                                type="text"
                                value={ticketId}
                                onChange={(e) => setTicketId(e.target.value)}
                                placeholder="e.g. TIX-123456"
                                className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-mono text-lg text-center tracking-wider"
                                autoFocus
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading' || !ticketId}
                            className="w-full py-3 px-4 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-violet-500/20"
                        >
                            {status === 'loading' ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                'Verify Ticket'
                            )}
                        </button>
                    </form>
                )}
            </div>

            {/* Result Display */}
            <div className="transition-all duration-300 ease-in-out">
                {status === 'success' && result && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center animate-fade-in-up">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 dark:text-green-400">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-1">Access Granted</h3>
                        <p className="text-green-600 dark:text-green-400 mb-4">Check-in successful!</p>

                        <div className="bg-white dark:bg-slate-900/50 rounded-lg p-4 text-left space-y-2 text-sm border border-green-100 dark:border-green-800/50">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Attendee:</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{result.attendee}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Seat Type:</span>
                                <span className="font-mono text-slate-800 dark:text-slate-200">{result.seatType}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Seat Number:</span>
                                <span className="font-mono font-bold text-violet-600 dark:text-violet-400">{result.seatNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Event:</span>
                                <span className="text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{result.event}</span>
                            </div>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center animate-fade-in-up">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-400">
                            <XCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-red-800 dark:text-red-300 mb-1">Access Denied</h3>
                        <p className="text-red-600 dark:text-red-400 font-medium">{errorMsg}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GateKeeper;

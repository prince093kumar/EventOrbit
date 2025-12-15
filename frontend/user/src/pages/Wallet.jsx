 
import React, { useState, useEffect } from 'react';
import { Plus, History, Wallet as WalletIcon, X, CheckCircle, ArrowUpRight, ArrowDownLeft, CreditCard, Download, Filter, Calendar } from 'lucide-react';

const Wallet = () => {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);

    // Statement Modal State
    const [showStatementModal, setShowStatementModal] = useState(false);
    const [filterType, setFilterType] = useState('all'); // all, credit, debit
    const [dateRange, setDateRange] = useState('all'); // all, month, week

    const [addAmount, setAddAmount] = useState('');
    const [processing, setProcessing] = useState(false);
    const [generatingPdf, setGeneratingPdf] = useState(false);

    // Initialize Wallet from LocalStorage
    useEffect(() => {
        const storedWallet = localStorage.getItem('user_wallet');
        if (storedWallet) {
            const { balance: savedBalance, transactions: savedTx } = JSON.parse(storedWallet);
            setBalance(savedBalance);
            setTransactions(savedTx);
        } else {
            // Default Initial State
            const initialBalance = 1500.00;
            const initialTx = [
                { id: 1, type: 'Ticket Purchase', description: 'Neon Nights', amount: -1500.00, date: new Date(Date.now() - 172800000).toLocaleDateString(), isCredit: false },
                { id: 2, type: 'Wallet Top-up', description: 'Credit Card *4421', amount: 3000.00, date: new Date(Date.now() - 604800000).toLocaleDateString(), isCredit: true },
            ];
            setBalance(initialBalance);
            setTransactions(initialTx);
            localStorage.setItem('user_wallet', JSON.stringify({ balance: initialBalance, transactions: initialTx }));
        }
    }, []);

    const updateWallet = (newBalance, newTransactions) => {
        setBalance(newBalance);
        setTransactions(newTransactions);
        localStorage.setItem('user_wallet', JSON.stringify({ balance: newBalance, transactions: newTransactions }));
    };

    const handleAddMoney = (e) => {
        e.preventDefault();
        if (!addAmount || isNaN(addAmount) || Number(addAmount) <= 0) return;

        setProcessing(true);

        // Simulate Payment Gateway Delay
        setTimeout(() => {
            const amount = Number(addAmount);
            const newBalance = balance + amount;
            const newTx = {
                id: Date.now(),
                type: 'Wallet Top-up',
                description: 'Credit Card *8888',
                amount: amount,
                date: new Date().toLocaleDateString(),
                isCredit: true
            };

            updateWallet(newBalance, [newTx, ...transactions]);
            setProcessing(false);
            setShowAddModal(false);
            setAddAmount('');
            // Optional: Toast success could go here
        }, 2000);
    };

    // Filter Logic
    const getFilteredTransactions = () => {
        return transactions.filter(tx => {
            // Type Filter
            if (filterType === 'credit' && !tx.isCredit) return false;
            if (filterType === 'debit' && tx.isCredit) return false;

            // Date Filter (Simple implementation)
            const txDate = new Date(tx.date);
            const now = new Date();
            if (dateRange === 'month') {
                if (txDate.getMonth() !== now.getMonth() || txDate.getFullYear() !== now.getFullYear()) return false;
            }
            // Add more date logic if needed
            return true;
        });
    };

    const generatePDF = async () => {
        setGeneratingPdf(true);
        try {
            // Dynamically import jsPDF only when needed to verify if imports are crashing the page
            const { jsPDF } = await import('jspdf');
            await import('jspdf-autotable');

            const doc = new jsPDF();
            const filteredTx = getFilteredTransactions();

            doc.setFontSize(20);
            doc.text("Wallet Statement", 14, 22);
            doc.setFontSize(10);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
            doc.text(`Balance: ₹${balance.toFixed(2)}`, 14, 36);

            const tableColumn = ["Date", "Description", "Type", "Amount", "Status"];
            const tableRows = [];

            filteredTx.forEach(tx => {
                const transactionData = [
                    tx.date,
                    tx.description,
                    tx.type,
                    `${tx.isCredit ? '+' : '-'}₹${Math.abs(tx.amount)}`,
                    "Success"
                ];
                tableRows.push(transactionData);
            });

            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 40,
                theme: 'grid',
                headStyles: { fillColor: [255, 218, 138], textColor: [0, 0, 0] }, // Gold Theme Headers
            });

            doc.save(`EventOrbit_Statement_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error("PDF Generation failed", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setGeneratingPdf(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold text-[var(--text-page)] mb-6 flex items-center gap-3">
                <WalletIcon className="text-[#FFDA8A]" size={32} />
                My Wallet
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Balance Card */}
                <div className="lg:col-span-2">
                    <div className="bg-gray-900 dark:bg-slate-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFDA8A]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                        <div className="relative z-10">
                            <p className="text-gray-400 text-sm font-semibold tracking-wider mb-2">AVAILABLE BALANCE</p>
                            <h3 className="text-5xl font-bold mb-8 tracking-tight">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="flex items-center gap-2 bg-[#FFDA8A] hover:bg-[#ffc107] text-gray-900 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-[#FFDA8A]/20"
                                >
                                    <Plus size={20} />
                                    Add Money
                                </button>
                                <button
                                    onClick={() => setShowStatementModal(true)}
                                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-colors backdrop-blur-sm"
                                >
                                    <History size={20} />
                                    Statements
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats or Promo (Optional placeholder) */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-[var(--border-color)] flex flex-col justify-center">
                    <h4 className="text-[var(--text-muted)] font-medium mb-4">Monthly Spending</h4>
                    <div className="text-2xl font-bold text-[var(--text-page)] mb-2">
                        ₹{transactions.filter(t => !t.isCredit && new Date(t.date).getMonth() === new Date().getMonth()).reduce((acc, t) => acc + Math.abs(t.amount), 0).toLocaleString()}
                    </div>
                    <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                        <ArrowDownLeft size={14} /> 12% less than last month
                    </p>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="mt-10">
                <h3 className="text-xl font-bold text-[var(--text-page)] mb-6">Recent Transactions</h3>
                <div className="space-y-4">
                    {transactions.length > 0 ? (
                        transactions.map(tx => (
                            <div key={tx.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-[var(--border-color)] flex items-center justify-between hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.isCredit ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                        {tx.isCredit ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-[var(--text-page)] text-lg">{tx.type}</p>
                                        <p className="text-sm text-[var(--text-muted)]">{tx.description} • {tx.date}</p>
                                    </div>
                                </div>
                                <span className={`font-bold text-lg ${tx.isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-500 lg:mr-4'}`}>
                                    {tx.isCredit ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-[var(--text-muted)] text-center py-8">No transactions yet.</p>
                    )}
                </div>
            </div>

            {/* Add Money Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="bg-[#FFDA8A] p-6 flex justify-between items-center text-gray-900">
                            <h3 className="text-xl font-bold">Add Money to Wallet</h3>
                            <button onClick={() => setShowAddModal(false)} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8">
                            {!processing ? (
                                <form onSubmit={handleAddMoney}>
                                    <div className="mb-6">
                                        <label className="block text-sm font-bold text-[var(--text-muted)] mb-2 uppercase tracking-wider">Amount (₹)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xl">₹</span>
                                            <input
                                                type="number"
                                                value={addAmount}
                                                onChange={(e) => setAddAmount(e.target.value)}
                                                placeholder="Enter amount"
                                                className="w-full pl-10 pr-4 py-4 bg-gray-50 dark:bg-slate-800 border border-[var(--border-color)] rounded-xl text-3xl font-bold text-[var(--text-page)] focus:outline-none focus:ring-2 focus:ring-[#FFDA8A] placeholder-gray-300 transition-all"
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3 mb-8">
                                        {[500, 1000, 2000, 5000].map(amt => (
                                            <button
                                                key={amt}
                                                type="button"
                                                onClick={() => setAddAmount(amt.toString())}
                                                className="py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] font-medium hover:border-[#FFDA8A] hover:bg-[#FFDA8A]/10 hover:text-[#FFDA8A] transition-colors"
                                            >
                                                +₹{amt}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!addAmount}
                                        className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <CreditCard size={20} />
                                        Pay Securely
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="mx-auto w-16 h-16 border-4 border-[#FFDA8A] border-t-transparent rounded-full animate-spin mb-6"></div>
                                    <h4 className="text-xl font-bold text-[var(--text-page)] mb-2">Processing Payment...</h4>
                                    <p className="text-[var(--text-muted)]">Please do not close this window.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Statement Modal */}
            {showStatementModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="bg-[#FFDA8A] p-6 flex justify-between items-center text-gray-900">
                            <h3 className="text-xl font-bold flex items-center gap-2"><History size={24} /> Transaction History</h3>
                            <button onClick={() => setShowStatementModal(false)} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Actions / Filters */}
                            <div className="flex flex-wrap gap-4 mb-6 justify-between items-center">
                                <div className="flex gap-2">
                                    <select
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                        className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-800 border border-[var(--border-color)] text-[var(--text-page)] text-sm focus:outline-none"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="credit">Credits (+)</option>
                                        <option value="debit">Debits (-)</option>
                                    </select>
                                    <select
                                        value={dateRange}
                                        onChange={(e) => setDateRange(e.target.value)}
                                        className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-800 border border-[var(--border-color)] text-[var(--text-page)] text-sm focus:outline-none"
                                    >
                                        <option value="all">All Time</option>
                                        <option value="month">This Month</option>
                                    </select>
                                </div>
                                <button
                                    onClick={generatePDF}
                                    className="flex items-center gap-2 bg-gray-900 dark:bg-slate-700 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-800 transition-all shadow-md"
                                >
                                    <Download size={16} /> Download PDF
                                </button>
                            </div>

                            {/* List */}
                            <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                                {getFilteredTransactions().length > 0 ? (
                                    getFilteredTransactions().map(tx => (
                                        <div key={tx.id} className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-[var(--border-color)] flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg ${tx.isCredit ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                    {tx.isCredit ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[var(--text-page)] text-sm">{tx.description}</p>
                                                    <p className="text-xs text-[var(--text-muted)]">{tx.date} • {tx.type}</p>
                                                </div>
                                            </div>
                                            <span className={`font-bold ${tx.isCredit ? 'text-green-600' : 'text-red-500'}`}>
                                                {tx.isCredit ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-[var(--text-muted)]">
                                        <Filter size={24} className="mx-auto mb-2 opacity-30" />
                                        <p>No transactions found matching filters.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wallet;

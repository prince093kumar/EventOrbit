import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-auto transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <h2 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent mb-2">
                            EventOrbit
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Seamless event management for the modern era.
                        </p>
                    </div>

                    <div className="flex space-x-6 text-slate-500 dark:text-slate-400">
                        <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact Support</a>
                    </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 mt-8 pt-8 flex justify-center text-sm text-slate-500 dark:text-slate-500">
                    <p>&copy; {new Date().getFullYear()} EventOrbit. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

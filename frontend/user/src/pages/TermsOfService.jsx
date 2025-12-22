import React from 'react';
import { Shield, BookOpen, AlertCircle } from 'lucide-react';

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-page)] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/30 mb-4">
                        <Shield className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                        Terms of Service
                    </h1>
                    <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
                        Please read these terms carefully before using our platform.
                    </p>
                </div>

                {/* Main Content Card */}
                <div className="bg-[var(--bg-card)] rounded-2xl shadow-xl border border-[var(--border-color)] overflow-hidden">
                    <div className="p-8 space-y-8">

                        {/* Important Disclaimer */}
                        <div className="bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 p-6 rounded-r-lg">
                            <div className="flex items-start space-x-4">
                                <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-lg font-bold text-amber-800 dark:text-amber-200 mb-2">
                                        Educational Purpose Disclaimer
                                    </h3>
                                    <p className="text-amber-700 dark:text-amber-300 leading-relaxed">
                                        This project (EventOrbit) is created solely for <strong>learning and educational purposes</strong>.
                                        It is <strong>NOT</strong> intended for commercial use, real-world transactions, or production deployment.
                                        Any data entered here should be considered temporary and non-secure.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* General Terms */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 mb-4">
                                <BookOpen className="w-6 h-6 text-violet-600" />
                                <h2 className="text-2xl font-bold">General Terms</h2>
                            </div>
                            <div className="prose dark:prose-invert max-w-none text-[var(--text-muted)] space-y-4">
                                <p>
                                    By accessing this website, you agree to be bound by these Terms of Service. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                                </p>
                                <p>
                                    <strong>1. Use License:</strong> This is an open-source educational project. You are free to view and learn from the codebase, but no commercial rights are granted used under this strict educational license.
                                </p>
                                <p>
                                    <strong>2. Disclaimer:</strong> The materials on EventOrbit's website are provided on an 'as is' basis. EventOrbit makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                                </p>
                                <p>
                                    <strong>3. Limitations:</strong> In no event shall EventOrbit or its contributors be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on EventOrbit's website.
                                </p>
                            </div>
                        </div>

                        {/* Contact Section */}
                        <div className="pt-8 border-t border-[var(--border-color)]">
                            <p className="text-sm text-[var(--text-muted)] text-center">
                                If you have any questions about these Terms, please contact us at <a href="mailto:support@eventorbit.education" className="text-violet-600 hover:text-violet-700 font-medium">support@eventorbit.education</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;

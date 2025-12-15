import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-page)] flex flex-col transition-colors">
            <TopBar />
            <main className="flex-1 pt-24 pb-8 container mx-auto px-4 md:px-8">
                {children || <Outlet />}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;

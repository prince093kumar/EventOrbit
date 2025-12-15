import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    EventOrbit
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-8 items-center text-gray-700 font-medium">
                    <Link to="/" className="hover:text-blue-600 transition">Home</Link>
                    <Link to="/events" className="hover:text-blue-600 transition">Events</Link>
                    <Link to="/about" className="hover:text-blue-600 transition">About</Link>
                    <Link to="/contact" className="hover:text-blue-600 transition">Contact</Link>
                </div>

                {/* Buttons */}
                <div className="hidden md:flex gap-4">
                    <Link to="/login" className="px-5 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition">
                        Log In
                    </Link>
                    <Link to="/register" className="px-5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-600/30 transition">
                        Sign Up
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-700 text-2xl">
                    {isOpen ? "✖" : "☰"}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-gray-100 absolute w-full top-full left-0 flex flex-col items-center py-6 gap-4 shadow-lg">
                    <Link to="/" className="text-gray-700 text-lg hover:text-blue-600" onClick={() => setIsOpen(false)}>Home</Link>
                    <Link to="/events" className="text-gray-700 text-lg hover:text-blue-600" onClick={() => setIsOpen(false)}>Events</Link>
                    <Link to="/about" className="text-gray-700 text-lg hover:text-blue-600" onClick={() => setIsOpen(false)}>About</Link>
                    <Link to="/contact" className="text-gray-700 text-lg hover:text-blue-600" onClick={() => setIsOpen(false)}>Contact</Link>
                    <div className="flex gap-4 mt-2">
                        <Link to="/login" className="px-5 py-2 rounded-full border border-gray-300 text-gray-700">Log In</Link>
                        <Link to="/register" className="px-5 py-2 rounded-full bg-blue-600 text-white">Sign Up</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

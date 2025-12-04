import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Box, Upload, Eye, Info } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home', icon: <Box size={18} /> },
    { path: '/upload', label: 'Upload', icon: <Upload size={18} /> },
    { path: '/viewer', label: '3D Viewer', icon: <Eye size={18} /> },
    { path: '/about', label: 'About', icon: <Info size={18} /> },
  ];

  return (
    <motion.nav 
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <Box size={28} />
          </div>
          <span className="logo-text">Meshify<span className="logo-accent">3D</span></span>
        </Link>

        <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
          <Link to="/upload" className="nav-cta" onClick={() => setIsOpen(false)}>
            Get Started
          </Link>
        </div>

        <button className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;

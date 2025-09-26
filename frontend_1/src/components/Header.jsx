import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleQuickSearch = () => {
    navigate('/search');
    closeMenu();
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Logo */}
        <Link to="/" style={styles.logo} onClick={closeMenu}>
          <span style={styles.logoText}>MENU DEAL MOÇO</span>
          <span style={styles.logoSubtext}>OS MELHORES MENUS</span>
        </Link>

        {/* Desktop Navigation */}
        <nav style={styles.desktopNav}>
          <Link
            to="/"
            style={{
              ...styles.navLink,
              ...(isActive('/') ? styles.navLinkActive : {})
            }}
          >
            INÍCIO
          </Link>
          <Link
            to="/search"
            style={{
              ...styles.navLink,
              ...(isActive('/search') ? styles.navLinkActive : {})
            }}
          >
            PROCURAR
          </Link>
          <Link
            to="/add-restaurant"
            style={{
              ...styles.navLink,
              ...(isActive('/add-restaurant') ? styles.navLinkActive : {})
            }}
          >
            ADICIONAR
          </Link>
          <Link
            to="/about"
            style={{
              ...styles.navLink,
              ...(isActive('/about') ? styles.navLinkActive : {})
            }}
          >
            SOBRE
          </Link>
        </nav>

        {/* Quick Search Button */}
        <button
          onClick={handleQuickSearch}
          style={styles.quickSearchButton}
          className="mono-button mono-button--small"
        >
          PROCURAR AGORA
        </button>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMenu}
          style={styles.mobileMenuToggle}
          aria-label="Toggle menu"
        >
          <span style={{
            ...styles.hamburger,
            ...(isMenuOpen ? styles.hamburgerOpen : {})
          }}>
            <span style={styles.hamburgerLine}></span>
            <span style={styles.hamburgerLine}></span>
            <span style={styles.hamburgerLine}></span>
          </span>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div style={styles.mobileNavOverlay} onClick={closeMenu}>
          <nav style={styles.mobileNav} onClick={(e) => e.stopPropagation()}>
            <Link
              to="/"
              style={{
                ...styles.mobileNavLink,
                ...(isActive('/') ? styles.mobileNavLinkActive : {})
              }}
              onClick={closeMenu}
            >
              INÍCIO
            </Link>
            <Link
              to="/search"
              style={{
                ...styles.mobileNavLink,
                ...(isActive('/search') ? styles.mobileNavLinkActive : {})
              }}
              onClick={closeMenu}
            >
              PROCURAR RESTAURANTES
            </Link>
            <Link
              to="/add-restaurant"
              style={{
                ...styles.mobileNavLink,
                ...(isActive('/add-restaurant') ? styles.mobileNavLinkActive : {})
              }}
              onClick={closeMenu}
            >
              ADICIONAR RESTAURANTE
            </Link>
            <Link
              to="/about"
              style={{
                ...styles.mobileNavLink,
                ...(isActive('/about') ? styles.mobileNavLinkActive : {})
              }}
              onClick={closeMenu}
            >
              SOBRE O PROJETO
            </Link>

            <div style={styles.mobileNavCTA}>
              <button
                onClick={handleQuickSearch}
                style={styles.mobileSearchButton}
                className="mono-button"
              >
                PROCURAR AGORA
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

const styles = {
  header: {
    background: '#ffffff',
    borderBottom: '3px solid #000000',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    fontFamily: 'Space Mono, monospace'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '80px'
  },
  logo: {
    textDecoration: 'none',
    color: '#000000',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer'
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    lineHeight: 1
  },
  logoSubtext: {
    fontSize: '10px',
    fontWeight: 400,
    letterSpacing: '0.2em',
    marginTop: '2px',
    opacity: 0.8
  },
  desktopNav: {
    display: 'flex',
    gap: '32px',
    alignItems: 'center'
  },
  navLink: {
    textDecoration: 'none',
    color: '#666666',
    fontSize: '14px',
    fontWeight: 700,
    letterSpacing: '0.05em',
    padding: '8px 0',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase'
  },
  navLinkActive: {
    color: '#000000',
    borderBottomColor: '#000000'
  },
  quickSearchButton: {
    display: 'none'
  },
  mobileMenuToggle: {
    display: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    position: 'relative'
  },
  hamburger: {
    display: 'flex',
    flexDirection: 'column',
    width: '24px',
    height: '18px',
    justifyContent: 'space-between'
  },
  hamburgerLine: {
    width: '100%',
    height: '2px',
    background: '#000000',
    transition: 'all 0.3s ease'
  },
  hamburgerOpen: {
    transform: 'rotate(45deg)'
  },
  mobileNavOverlay: {
    position: 'fixed',
    top: '80px',
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
    display: 'none'
  },
  mobileNav: {
    background: '#ffffff',
    padding: '32px 24px',
    borderBottom: '3px solid #000000',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  mobileNavLink: {
    textDecoration: 'none',
    color: '#333333',
    fontSize: '16px',
    fontWeight: 700,
    letterSpacing: '0.05em',
    padding: '12px 0',
    borderBottom: '1px solid #e5e5e5',
    transition: 'all 0.2s ease'
  },
  mobileNavLinkActive: {
    color: '#000000',
    borderBottomColor: '#000000'
  },
  mobileNavCTA: {
    marginTop: '16px',
    paddingTop: '24px',
    borderTop: '2px solid #e5e5e5'
  },
  mobileSearchButton: {
    width: '100%',
    textAlign: 'center'
  }
};

// Media queries via JavaScript (for demo - in production use CSS)
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(max-width: 768px)');

  const updateStyles = (matches) => {
    if (matches) {
      // Mobile styles
      styles.desktopNav.display = 'none';
      styles.quickSearchButton.display = 'none';
      styles.mobileMenuToggle.display = 'block';
      styles.mobileNavOverlay.display = 'block';
    } else {
      // Desktop styles
      styles.desktopNav.display = 'flex';
      styles.quickSearchButton.display = 'inline-block';
      styles.mobileMenuToggle.display = 'none';
      styles.mobileNavOverlay.display = 'none';
    }
  };

  updateStyles(mediaQuery.matches);
  mediaQuery.addListener(updateStyles);
}

export default Header;
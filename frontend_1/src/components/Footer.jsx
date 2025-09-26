import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Main Footer Content */}
        <div style={styles.footerMain}>
          {/* Brand Section */}
          <div style={styles.brandSection}>
            <h3 style={styles.brandTitle}>MENU DEAL MOÇO</h3>
            <p style={styles.brandDescription}>
              Os melhores menus de almoço em Portugal.<br />
              Rankings por qualidade-preço baseados<br />
              em avaliações reais.
            </p>
            <div style={styles.tagline}>
              <span style={styles.taglineText}>
                "SE FUNCIONA EM MONOCROMÁTICO,<br />
                FUNCIONA EM QUALQUER LUGAR."
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div style={styles.linksSection}>
            <div style={styles.linkColumn}>
              <h4 style={styles.linkColumnTitle}>NAVEGAÇÃO</h4>
              <Link to="/" style={styles.footerLink}>Início</Link>
              <Link to="/search" style={styles.footerLink}>Procurar Restaurantes</Link>
              <Link to="/add-restaurant" style={styles.footerLink}>Adicionar Restaurante</Link>
              <Link to="/about" style={styles.footerLink}>Sobre o Projeto</Link>
            </div>

            <div style={styles.linkColumn}>
              <h4 style={styles.linkColumnTitle}>PARA RESTAURANTES</h4>
              <a href="#claim" style={styles.footerLink}>Reclamar Perfil</a>
              <a href="#business" style={styles.footerLink}>Soluções Business</a>
              <a href="#guidelines" style={styles.footerLink}>Diretrizes de Qualidade</a>
              <a href="#help" style={styles.footerLink}>Centro de Ajuda</a>
            </div>

            <div style={styles.linkColumn}>
              <h4 style={styles.linkColumnTitle}>COMUNIDADE</h4>
              <a href="#blog" style={styles.footerLink}>Blog</a>
              <a href="#reviews" style={styles.footerLink}>Como Avaliar</a>
              <a href="#guidelines" style={styles.footerLink}>Diretrizes da Comunidade</a>
              <a href="#contact" style={styles.footerLink}>Contacto</a>
            </div>
          </div>

          {/* Stats Section */}
          <div style={styles.statsSection}>
            <h4 style={styles.statsTitle}>ESTATÍSTICAS</h4>
            <div style={styles.stat}>
              <span style={styles.statNumber}>500+</span>
              <span style={styles.statLabel}>RESTAURANTES</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statNumber}>2.5K+</span>
              <span style={styles.statLabel}>AVALIAÇÕES</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statNumber}>15</span>
              <span style={styles.statLabel}>CIDADES</span>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div style={styles.footerBottom}>
          <div style={styles.bottomLeft}>
            <p style={styles.copyright}>
              © {currentYear} MENU DEAL MOÇO. TODOS OS DIREITOS RESERVADOS.
            </p>
            <p style={styles.tech}>
              FEITO COM REACT + MONO DESIGN SYSTEM
            </p>
          </div>

          <div style={styles.bottomRight}>
            <a href="#privacy" style={styles.legalLink}>PRIVACIDADE</a>
            <span style={styles.separator}>•</span>
            <a href="#terms" style={styles.legalLink}>TERMOS</a>
            <span style={styles.separator}>•</span>
            <a href="#cookies" style={styles.legalLink}>COOKIES</a>
          </div>
        </div>

        {/* Design System Credit */}
        <div style={styles.designCredit}>
          <p style={styles.designText}>
            DESIGN SYSTEM: MONO — FOCADO EM TIPOGRAFIA, ESPAÇAMENTO E PROPORÇÃO
          </p>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: '#000000',
    color: '#ffffff',
    fontFamily: 'Space Mono, monospace',
    marginTop: '64px'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '64px 24px 32px'
  },
  footerMain: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr 1fr',
    gap: '48px',
    marginBottom: '48px'
  },
  brandSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  brandTitle: {
    fontSize: '24px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    margin: 0,
    lineHeight: 1.2
  },
  brandDescription: {
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: 1.6,
    color: '#cccccc',
    margin: 0
  },
  tagline: {
    marginTop: '24px',
    padding: '16px',
    border: '2px solid #333333',
    background: '#1a1a1a'
  },
  taglineText: {
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    lineHeight: 1.4,
    color: '#ffffff'
  },
  linksSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '32px'
  },
  linkColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  linkColumnTitle: {
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: '#ffffff',
    margin: '0 0 8px 0',
    borderBottom: '1px solid #333333',
    paddingBottom: '8px'
  },
  footerLink: {
    color: '#999999',
    textDecoration: 'none',
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: 1.5,
    transition: 'color 0.2s ease',
    cursor: 'pointer'
  },
  statsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  statsTitle: {
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: '#ffffff',
    margin: '0 0 8px 0',
    borderBottom: '1px solid #333333',
    paddingBottom: '8px'
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  statNumber: {
    fontSize: '24px',
    fontWeight: 700,
    letterSpacing: '0.05em',
    color: '#ffffff',
    lineHeight: 1
  },
  statLabel: {
    fontSize: '10px',
    fontWeight: 400,
    letterSpacing: '0.1em',
    color: '#666666'
  },
  footerBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: '32px',
    borderTop: '1px solid #333333'
  },
  bottomLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  copyright: {
    fontSize: '11px',
    fontWeight: 400,
    letterSpacing: '0.05em',
    color: '#666666',
    margin: 0
  },
  tech: {
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: '#999999',
    margin: 0
  },
  bottomRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  legalLink: {
    color: '#666666',
    textDecoration: 'none',
    fontSize: '10px',
    fontWeight: 400,
    letterSpacing: '0.1em',
    transition: 'color 0.2s ease'
  },
  separator: {
    color: '#333333',
    fontSize: '10px'
  },
  designCredit: {
    marginTop: '32px',
    paddingTop: '16px',
    borderTop: '1px solid #1a1a1a',
    textAlign: 'center'
  },
  designText: {
    fontSize: '9px',
    fontWeight: 400,
    letterSpacing: '0.2em',
    color: '#333333',
    margin: 0,
    fontStyle: 'italic'
  }
};

// Hover effects (in production, use CSS)
if (typeof document !== 'undefined') {
  const addHoverEffects = () => {
    const style = document.createElement('style');
    style.textContent = `
      .footer-link:hover {
        color: #ffffff !important;
      }
      .legal-link:hover {
        color: #ffffff !important;
      }
    `;
    document.head.appendChild(style);
  };

  // Add class names for hover effects
  React.useEffect = React.useEffect || (() => {});
  setTimeout(addHoverEffects, 100);
}

// Responsive adjustments
const mobileStyles = {
  footerMain: {
    gridTemplateColumns: '1fr',
    gap: '32px'
  },
  linksSection: {
    gridTemplateColumns: '1fr',
    gap: '24px'
  },
  footerBottom: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '16px'
  },
  bottomRight: {
    alignSelf: 'flex-start'
  }
};

// Apply mobile styles (in production, use CSS media queries)
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(max-width: 768px)');

  const updateFooterStyles = (matches) => {
    if (matches) {
      Object.assign(styles.footerMain, mobileStyles.footerMain);
      Object.assign(styles.linksSection, mobileStyles.linksSection);
      Object.assign(styles.footerBottom, mobileStyles.footerBottom);
      Object.assign(styles.bottomRight, mobileStyles.bottomRight);
    }
  };

  updateFooterStyles(mediaQuery.matches);
  mediaQuery.addListener(updateFooterStyles);
}

export default Footer;
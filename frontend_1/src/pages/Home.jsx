import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const searchQuery = e.target.elements.search.value;
    if (searchQuery) {
      // Send as location parameter since most searches will be location-based
      navigate(`/search?location=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.title}>Menu Deal Moço</h1>
        <p className={styles.subtitle}>Find the best lunch deals in Portugal.</p>
        
        <form onSubmit={handleSearch} className={styles.searchContainer}>
          <input 
            type="text" 
            name="search" 
            placeholder="Search by city, district, or address" 
            className={styles.searchInput} 
          />
          <button type="submit" className={styles.searchButton}>Search</button>
        </form>

        <Link to="/add-restaurant" className="mono-button mono-button--ghost">
          + Add a Restaurant
        </Link>
      </section>

      {/* How It Works */}
      <section className={styles.features}>
        <h2 className={styles.featuresTitle}>How It Works</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⌕</div>
            <h3 className={styles.featureTitle}>Search</h3>
            <p className={styles.featureText}>Find restaurants by location.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⭐</div>
            <h3 className={styles.featureTitle}>Compare</h3>
            <p className={styles.featureText}>Check value ratings and reviews.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🍴</div>
            <h3 className={styles.featureTitle}>Choose</h3>
            <p className={styles.featureText}>Pick the perfect lunch deal for you.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

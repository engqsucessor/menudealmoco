import React from 'react';
import { Link } from 'react-router-dom';
import styles from './About.module.css';

const About = () => {
  return (
    <div className={styles.aboutPage}>
      <h1 className={styles.title}>About Menu Deal Moço</h1>
      <p className={styles.subtitle}>Our mission is to help you find the best lunch deals in Portugal.</p>

      <div className={styles.section}>
        <h2>What We Do</h2>
        <p>
          We provide a platform for people to find and share information about the best value-for-money lunch menus in Portugal. Our community of users submits and reviews restaurants, ensuring that the information is always up-to-date.
        </p>
      </div>

      <div className={styles.section}>
        <h2>How It Works</h2>
        <p>
          Users can search for restaurants by location, price, and food type. They can also submit new restaurants and leave reviews for others to see. Our validation system ensures that all information is accurate and reliable.
        </p>
      </div>

      <div className={styles.cta}>
        <Link to="/add-restaurant" className={styles.ctaButton}>
          Contribute to the Community
        </Link>
      </div>
    </div>
  );
};

export default About;

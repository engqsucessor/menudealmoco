import React, { useState } from 'react';
import styles from './FilterModal.module.css';
import Button from './Button';
import Slider from './Slider';

const FilterModal = ({ isOpen, onClose, filters, onFiltersChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (category, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Filtros</h2>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>

        <div className={styles.modalContent}>
          {/* TheFork Benefits Section */}
          <section className={styles.section}>
            <h3>Vantagens do MenuDealMoço</h3>
            <div className={styles.toggleGroup}>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={localFilters.hasPromotion}
                  onChange={(e) => handleChange('hasPromotion', e.target.checked)}
                />
                <span className={styles.toggleLabel}>
                  <strong>Promoções</strong>
                  <p>Descontos especiais em restaurantes selecionados</p>
                </span>
              </label>
            </div>
          </section>

          {/* Rating Section */}
          <section className={styles.section}>
            <h3>Classificação média</h3>
            <Slider
              min={7}
              max={10}
              step={0.5}
              value={localFilters.minRating || 7}
              onChange={(value) => handleChange('minRating', value)}
            />
          </section>

          {/* Price Range Section */}
          <section className={styles.section}>
            <h3>Preço médio</h3>
            <div className={styles.priceRange}>
              <Slider
                min={0}
                max={150}
                step={5}
                value={[localFilters.minPrice || 0, localFilters.maxPrice || 150]}
                onChange={([min, max]) => {
                  handleChange('minPrice', min);
                  handleChange('maxPrice', max);
                }}
                range
              />
            </div>
          </section>

          {/* Included Items Section */}
          <section className={styles.section}>
            <h3>O que está incluído</h3>
            <div className={styles.toggleGroup}>
              {Object.entries({
                coffee: 'Café incluído',
                dessert: 'Sobremesa incluída',
                wine: 'Vinho incluído',
                bread: 'Pão/Sopa incluídos'
              }).map(([key, label]) => (
                <label key={key} className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={localFilters.includes?.[key]}
                    onChange={(e) => handleChange('includes', {
                      ...localFilters.includes,
                      [key]: e.target.checked
                    })}
                  />
                  <span className={styles.toggleLabel}>{label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Practical Features Section */}
          <section className={styles.section}>
            <h3>Características práticas</h3>
            <div className={styles.toggleGroup}>
              {Object.entries({
                openNow: 'Aberto agora',
                takesCards: 'Aceita cartões',
                quickService: 'Serviço rápido',
                groupFriendly: 'Adequado para grupos',
                hasParking: 'Tem estacionamento'
              }).map(([key, label]) => (
                <label key={key} className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={localFilters.practical?.[key]}
                    onChange={(e) => handleChange('practical', {
                      ...localFilters.practical,
                      [key]: e.target.checked
                    })}
                  />
                  <span className={styles.toggleLabel}>{label}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className={styles.modalFooter}>
          <Button onClick={handleApply} variant="primary" className={styles.applyButton}>
            VER {/* Add restaurant count here */} RESTAURANTES
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
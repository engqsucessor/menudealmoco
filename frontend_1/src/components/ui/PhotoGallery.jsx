import React, { useState } from 'react';
import PhotoModal from './PhotoModal';
import styles from './PhotoGallery.module.css';

const PhotoGallery = ({ restaurant }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Combine all photos from different sources
  const getAllPhotos = () => {
    const photos = [];

    // Add restaurant photos (new multi-photo support)
    if (restaurant.restaurantPhotos && Array.isArray(restaurant.restaurantPhotos)) {
      restaurant.restaurantPhotos.forEach((photo, index) => {
        if (photo) {
          photos.push({
            src: photo,
            title: `Restaurant Photo ${index + 1}`,
            type: 'restaurant'
          });
        }
      });
    } else if (restaurant.restaurantPhoto) {
      // Fallback to single photo
      photos.push({
        src: restaurant.restaurantPhoto,
        title: 'Restaurant Photo',
        type: 'restaurant'
      });
    }

    // Add menu photos (new multi-photo support)
    if (restaurant.menuPhotos && Array.isArray(restaurant.menuPhotos)) {
      restaurant.menuPhotos.forEach((photo, index) => {
        if (photo) {
          photos.push({
            src: photo,
            title: `Menu de Almoço ${index + 1}`,
            type: 'menu'
          });
        }
      });
    } else if (restaurant.menuPhoto) {
      // Fallback to single photo
      photos.push({
        src: restaurant.menuPhoto,
        title: 'Menu de Almoço',
        type: 'menu'
      });
    }

    // Add legacy photos if they exist (from the photos array)
    if (restaurant.photos && Array.isArray(restaurant.photos)) {
      restaurant.photos.forEach((photo, index) => {
        if (photo && photo.trim()) {
          photos.push({
            src: photo,
            title: `Additional Photo ${index + 1}`,
            type: 'additional'
          });
        }
      });
    }

    // Fallback to the legacy 'photo' field if it exists
    if (restaurant.photo && !photos.some(p => p.src === restaurant.photo)) {
      photos.push({
        src: restaurant.photo,
        title: 'Restaurant Photo',
        type: 'restaurant'
      });
    }

    return photos;
  };

  const allPhotos = getAllPhotos();

  const openPhotoModal = (photo, index) => {
    setSelectedPhoto({ ...photo, number: index + 1 });
  };

  const closePhotoModal = () => {
    setSelectedPhoto(null);
  };

  if (allPhotos.length === 0) {
    return (
      <div className={styles.noPhotos}>
        <span>No photos available</span>
      </div>
    );
  }

  return (
    <div className={styles.photoGallery}>
      <h2 className={styles.galleryTitle}>
        Photos ({allPhotos.length})
      </h2>
      
      <div className={styles.photoGrid}>
        {allPhotos.map((photo, index) => (
          <div 
            key={index} 
            className={styles.photoItem}
            onClick={() => openPhotoModal(photo, index)}
          >
            <div className={styles.photoContainer}>
              <img 
                src={photo.src} 
                alt={photo.title} 
                className={styles.thumbnail}
              />
              <div className={styles.photoOverlay}>
                <span className={styles.photoNumber}>{index + 1}</span>
                <span className={styles.clickHint}>Click to enlarge</span>
              </div>
            </div>
            <div className={styles.photoLabel}>
              <span className={styles.photoTitle}>{photo.title}</span>
              <span className={styles.photoType}>
                {photo.type === 'restaurant' && '🏪'}
                {photo.type === 'menu' && '📋'}
                {photo.type === 'additional' && '📸'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <PhotoModal
          isOpen={!!selectedPhoto}
          onClose={closePhotoModal}
          photo={selectedPhoto.src}
          photoNumber={selectedPhoto.number}
          title={selectedPhoto.title}
        />
      )}
    </div>
  );
};

export default PhotoGallery;
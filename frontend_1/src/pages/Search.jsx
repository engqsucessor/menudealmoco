import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Search = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [foodType, setFoodType] = useState('');
  const [filters, setFilters] = useState({
    openNow: false,
    acceptsCards: false,
    quickService: false
  });

  // Mock restaurant data
  const mockRestaurants = [
    {
      id: 1,
      name: 'Tasquinha do Ze',
      location: 'Baixa, Porto',
      price: 8.50,
      rating: 4.5,
      included: 'Sopa + Prato + Bebida + Café',
      foodType: 'Tradicional Portuguesa',
      distance: '0.2 km',
      image: '/placeholder-restaurant.jpg'
    },
    {
      id: 2,
      name: 'Cantina Moderna',
      location: 'Cedofeita, Porto',
      price: 12.00,
      rating: 4.2,
      included: 'Prato + Sobremesa + Bebida',
      foodType: 'Moderno/Contemporâneo',
      distance: '0.5 km',
      image: '/placeholder-restaurant.jpg'
    },
    {
      id: 3,
      name: 'Marisqueira Central',
      location: 'Ribeira, Porto',
      price: 15.00,
      rating: 4.7,
      included: 'Prato + Vinho + Café',
      foodType: 'Especialista em Marisco',
      distance: '0.8 km',
      image: '/placeholder-restaurant.jpg'
    }
  ];

  const handleFilterChange = (filterName) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  return (
    <div className="mono-container mono-p-lg">
      {/* Search Header */}
      <div className="mono-mb-xl">
        <h1 className="mono-heading-2 mono-mb-lg mono-uppercase">
          Procurar Restaurantes
        </h1>
        <p className="mono-body text-gray-600">
          Encontre os melhores menus de almoço na sua área
        </p>
      </div>

      {/* Search Filters */}
      <div className="mono-card mono-mb-xl">
        <div className="mono-grid grid-cols-1 md:grid-cols-4 gap-4 mono-mb-lg">
          {/* Location Search */}
          <div>
            <label className="mono-label mono-mb-sm block">Localização</label>
            <input
              type="text"
              className="mono-input w-full"
              placeholder="Porto, Lisboa, ou 'perto de mim'"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
          </div>

          {/* Price Range */}
          <div>
            <label className="mono-label mono-mb-sm block">Preço</label>
            <select
              className="mono-select w-full"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <option value="">Todos os preços</option>
              <option value="6-8">€6-8 (Orçamento)</option>
              <option value="8-10">€8-10 (Standard)</option>
              <option value="10-12">€10-12 (Bom valor)</option>
              <option value="12-15">€12-15 (Premium)</option>
              <option value="15+">€15+ (High-end)</option>
            </select>
          </div>

          {/* Food Type */}
          <div>
            <label className="mono-label mono-mb-sm block">Tipo de Comida</label>
            <select
              className="mono-select w-full"
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
            >
              <option value="">Todos os tipos</option>
              <option value="tradicional">Tradicional Portuguesa</option>
              <option value="moderno">Moderno/Contemporâneo</option>
              <option value="marisco">Especialista em Marisco</option>
              <option value="carne">Focado em Carne</option>
              <option value="vegetariano">Vegetariano-friendly</option>
              <option value="internacional">Internacional</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button className="mono-button w-full">
              PROCURAR
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="border-t mono-pt-lg">
          <div className="mono-label mono-mb-sm">Filtros Rápidos:</div>
          <div className="mono-flex flex-wrap gap-2">
            <label className="mono-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.openNow}
                onChange={() => handleFilterChange('openNow')}
                className="form-checkbox"
              />
              <span className="mono-body-small">Aberto agora</span>
            </label>
            <label className="mono-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.acceptsCards}
                onChange={() => handleFilterChange('acceptsCards')}
                className="form-checkbox"
              />
              <span className="mono-body-small">Aceita cartões</span>
            </label>
            <label className="mono-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.quickService}
                onChange={() => handleFilterChange('quickService')}
                className="form-checkbox"
              />
              <span className="mono-body-small">Serviço rápido</span>
            </label>
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="mono-flex justify-between items-center mono-mb-lg">
          <h2 className="mono-heading-5 mono-uppercase">
            {mockRestaurants.length} Restaurantes Encontrados
          </h2>
          <select className="mono-select">
            <option value="rating">Ordenar por: Avaliação</option>
            <option value="price-low">Preço: Menor para Maior</option>
            <option value="price-high">Preço: Maior para Menor</option>
            <option value="distance">Distância</option>
          </select>
        </div>

        {/* Restaurant Cards */}
        <div className="mono-grid grid-cols-1 gap-4">
          {mockRestaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              to={`/restaurant/${restaurant.id}`}
              className="mono-card mono-card--featured block transition-all"
            >
              <div className="mono-flex gap-4">
                <div className="w-24 h-24 bg-gray-200 flex items-center justify-center mono-body-small text-gray-500">
                  FOTO
                </div>
                
                <div className="flex-1">
                  <div className="mono-flex justify-between items-start mono-mb-sm">
                    <h3 className="mono-heading-6 mono-uppercase">{restaurant.name}</h3>
                    <div className="text-right">
                      <div className="mono-heading-5">€{restaurant.price.toFixed(2)}</div>
                      <div className="mono-caption text-gray-600">
                        ★ {restaurant.rating}/5
                      </div>
                    </div>
                  </div>
                  
                  <div className="mono-body-small text-gray-600 mono-mb-sm">
                    <div>{restaurant.location} • {restaurant.distance}</div>
                    <div>{restaurant.foodType}</div>
                  </div>
                  
                  <div className="mono-body-small mono-bold">
                    Inclui: {restaurant.included}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
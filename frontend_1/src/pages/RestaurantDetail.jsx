import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock restaurant data
  const restaurant = {
    id: 1,
    name: 'Tasquinha do Ze',
    location: 'Rua das Flores, 123, Baixa, Porto',
    price: 8.50,
    rating: 4.5,
    reviewCount: 127,
    included: 'Sopa + Prato Principal + Bebida + Café',
    foodType: 'Tradicional Portuguesa',
    phone: '+351 22 123 4567',
    hours: 'Seg-Sex: 12:00-15:00',
    description: 'Restaurante familiar com mais de 30 anos de tradição. Especializado em pratos tradicionais portugueses com ingredientes frescos e locais.',
    features: ['Aceita cartões', 'Serviço rápido', 'Wi-Fi gratuito', 'Acessível'],
    images: ['/placeholder-restaurant-1.jpg', '/placeholder-restaurant-2.jpg'],
    menuItems: [
      'Caldo Verde',
      'Bacalhau à Brás',
      'Francesinha',
      'Bifana',
      'Pasteles de Nata'
    ]
  };

  const mockReviews = [
    {
      id: 1,
      author: 'Maria S.',
      rating: 5,
      date: '2024-01-15',
      comment: 'Excelente qualidade-preço! O bacalhau à brás estava delicioso e o atendimento foi muito simpático.'
    },
    {
      id: 2,
      author: 'João P.',
      rating: 4,
      date: '2024-01-10',
      comment: 'Boa comida tradicional. As porções são generosas e o preço é justo. Recomendo!'
    },
    {
      id: 3,
      author: 'Ana M.',
      rating: 4,
      date: '2024-01-05',
      comment: 'Ambiente familiar e acolhedor. A francesinha é muito boa, embora o serviço possa ser um pouco lento às vezes.'
    }
  ];

  return (
    <div className="mono-container mono-p-lg">
      {/* Breadcrumb */}
      <nav className="mono-mb-lg">
        <div className="mono-flex items-center gap-2 mono-body-small text-gray-600">
          <Link to="/" className="hover:text-black">Início</Link>
          <span>»</span>
          <Link to="/search" className="hover:text-black">Procurar</Link>
          <span>»</span>
          <span className="text-black">{restaurant.name}</span>
        </div>
      </nav>

      {/* Restaurant Header */}
      <div className="mono-card mono-mb-xl">
        <div className="mono-grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Images */}
          <div>
            <div className="bg-gray-200 h-48 mono-flex items-center justify-center mono-mb-sm">
              <span className="mono-body text-gray-500">FOTO PRINCIPAL</span>
            </div>
            <div className="mono-grid grid-cols-2 gap-2">
              <div className="bg-gray-200 h-20 mono-flex items-center justify-center">
                <span className="mono-caption text-gray-500">FOTO 2</span>
              </div>
              <div className="bg-gray-200 h-20 mono-flex items-center justify-center">
                <span className="mono-caption text-gray-500">FOTO 3</span>
              </div>
            </div>
          </div>

          {/* Restaurant Info */}
          <div className="md:col-span-2">
            <div className="mono-flex justify-between items-start mono-mb-md">
              <div>
                <h1 className="mono-heading-3 mono-mb-sm mono-uppercase">{restaurant.name}</h1>
                <p className="mono-body text-gray-600 mono-mb-sm">{restaurant.location}</p>
                <p className="mono-body-small text-gray-600">{restaurant.foodType}</p>
              </div>
              
              <div className="text-right">
                <div className="mono-heading-2 mono-mb-sm">€{restaurant.price.toFixed(2)}</div>
                <div className="mono-flex items-center gap-2 justify-end mono-mb-sm">
                  <span className="mono-heading-6">★ {restaurant.rating}</span>
                  <span className="mono-body-small text-gray-600">({restaurant.reviewCount} avaliações)</span>
                </div>
                <button className="mono-button mono-button--small">
                  COMO CHEGAR
                </button>
              </div>
            </div>

            <div className="mono-mb-lg">
              <h3 className="mono-heading-6 mono-mb-sm mono-uppercase">O que está incluído:</h3>
              <p className="mono-body mono-bold">{restaurant.included}</p>
            </div>

            <div className="mono-grid grid-cols-2 gap-4">
              <div>
                <h4 className="mono-label mono-mb-sm">CONTACTO</h4>
                <p className="mono-body-small mono-mb-sm">{restaurant.phone}</p>
                <p className="mono-body-small">{restaurant.hours}</p>
              </div>
              
              <div>
                <h4 className="mono-label mono-mb-sm">CARACTERÍSTICAS</h4>
                <div className="mono-flex flex-wrap gap-1">
                  {restaurant.features.map((feature, index) => (
                    <span key={index} className="mono-caption bg-gray-200 mono-p-xs">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mono-card">
        <div className="border-b mono-mb-lg">
          <div className="mono-flex gap-4">
            <button
              className={`mono-label mono-p-md border-b-2 ${
                activeTab === 'overview' ? 'border-black' : 'border-transparent'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              VISÃO GERAL
            </button>
            <button
              className={`mono-label mono-p-md border-b-2 ${
                activeTab === 'menu' ? 'border-black' : 'border-transparent'
              }`}
              onClick={() => setActiveTab('menu')}
            >
              MENU
            </button>
            <button
              className={`mono-label mono-p-md border-b-2 ${
                activeTab === 'reviews' ? 'border-black' : 'border-transparent'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              AVALIAÇÕES
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            <h3 className="mono-heading-5 mono-mb-lg mono-uppercase">Sobre este restaurante</h3>
            <p className="mono-body mono-mb-lg">{restaurant.description}</p>
            
            <div className="mono-grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="mono-heading-6 mono-mb-md mono-uppercase">Pratos populares</h4>
                <ul className="mono-body-small">
                  {restaurant.menuItems.slice(0, 3).map((item, index) => (
                    <li key={index} className="mono-mb-sm">• {item}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="mono-heading-6 mono-mb-md mono-uppercase">Informações úteis</h4>
                <div className="mono-body-small">
                  <p className="mono-mb-sm">• Reservas não necessárias</p>
                  <p className="mono-mb-sm">• Menu muda diariamente</p>
                  <p className="mono-mb-sm">• Estacionamento próximo</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div>
            <h3 className="mono-heading-5 mono-mb-lg mono-uppercase">Menu do dia</h3>
            <p className="mono-body mono-mb-lg text-gray-600">
              Preço: <span className="mono-bold">€{restaurant.price.toFixed(2)}</span> | 
              Inclui: <span className="mono-bold">{restaurant.included}</span>
            </p>
            
            <div className="mono-grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="mono-heading-6 mono-mb-md mono-uppercase">Pratos disponíveis</h4>
                <ul className="mono-body">
                  {restaurant.menuItems.map((item, index) => (
                    <li key={index} className="mono-mb-sm border-b mono-pb-sm">{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gray-100 mono-p-lg">
                <h4 className="mono-heading-6 mono-mb-md mono-uppercase">Nota</h4>
                <p className="mono-body-small text-gray-600">
                  O menu pode variar conforme a disponibilidade dos ingredientes. 
                  Contacte o restaurante para confirmar os pratos do dia.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <div className="mono-flex justify-between items-center mono-mb-lg">
              <h3 className="mono-heading-5 mono-uppercase">Avaliações</h3>
              <button className="mono-button mono-button--small">
                ESCREVER AVALIAÇÃO
              </button>
            </div>
            
            <div className="mono-grid grid-cols-1 gap-4">
              {mockReviews.map((review) => (
                <div key={review.id} className="border-b mono-pb-lg">
                  <div className="mono-flex justify-between items-start mono-mb-sm">
                    <div>
                      <div className="mono-heading-6">{review.author}</div>
                      <div className="mono-caption text-gray-600">{review.date}</div>
                    </div>
                    <div className="mono-body">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>
                  <p className="mono-body">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AddRestaurant = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    website: '',
    menuPrice: '',
    included: '',
    foodType: '',
    description: '',
    hours: '',
    features: []
  });
  
  const [menuPhoto, setMenuPhoto] = useState(null);
  const [additionalPhotos, setAdditionalPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const foodTypes = [
    'Tradicional Portuguesa',
    'Moderno/Contemporâneo',
    'Especialista em Marisco',
    'Focado em Carne',
    'Vegetariano-friendly',
    'Internacional'
  ];

  const availableFeatures = [
    'Aceita cartões',
    'Serviço rápido',
    'Wi-Fi gratuito',
    'Acessível',
    'Estacionamento',
    'Esplanada',
    'Reservas aceites',
    'Entrega ao domicílio'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="mono-container mono-p-lg">
        <div className="max-w-2xl mx-auto text-center mono-p-xxxl">
          <h1 className="mono-heading-2 mono-mb-lg mono-uppercase">
            Submissão Recebida!
          </h1>
          <p className="mono-body-large mono-mb-lg">
            Obrigado por submeter o restaurante <strong>{formData.name}</strong>.
          </p>
          <p className="mono-body mono-mb-xl text-gray-600">
            A sua submissão será revista pela nossa equipa e, se aprovada, 
            aparecerá no site em 1-3 dias úteis.
          </p>
          <div className="mono-flex justify-center gap-4">
            <Link to="/search" className="mono-button">
              VER RESTAURANTES
            </Link>
            <Link to="/add-restaurant" className="mono-button mono-button--ghost">
              ADICIONAR OUTRO
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mono-container mono-p-lg">
      {/* Header */}
      <div className="mono-mb-xl">
        <h1 className="mono-heading-2 mono-mb-lg mono-uppercase">
          Adicionar Restaurante
        </h1>
        <p className="mono-body text-gray-600">
          Ajude a comunidade a descobrir novos locais com bons menus de almoço
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        {/* Basic Information */}
        <div className="mono-card mono-mb-lg">
          <h2 className="mono-heading-5 mono-mb-lg mono-uppercase">Informações Básicas</h2>
          
          <div className="mono-grid grid-cols-1 md:grid-cols-2 gap-4 mono-mb-lg">
            <div>
              <label className="mono-label mono-mb-sm block">Nome do Restaurante *</label>
              <input
                type="text"
                name="name"
                className="mono-input w-full"
                placeholder="Ex: Tasquinha do Manuel"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label className="mono-label mono-mb-sm block">Tipo de Comida *</label>
              <select
                name="foodType"
                className="mono-select w-full"
                value={formData.foodType}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione o tipo</option>
                {foodTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mono-mb-lg">
            <label className="mono-label mono-mb-sm block">Morada Completa *</label>
            <input
              type="text"
              name="address"
              className="mono-input w-full"
              placeholder="Rua, número, freguesia, cidade"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mono-grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mono-label mono-mb-sm block">Telefone</label>
              <input
                type="tel"
                name="phone"
                className="mono-input w-full"
                placeholder="+351 xxx xxx xxx"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label className="mono-label mono-mb-sm block">Website</label>
              <input
                type="url"
                name="website"
                className="mono-input w-full"
                placeholder="https://..."
                value={formData.website}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Menu Information */}
        <div className="mono-card mono-mb-lg">
          <h2 className="mono-heading-5 mono-mb-lg mono-uppercase">Informações do Menu</h2>
          
          <div className="mono-grid grid-cols-1 md:grid-cols-2 gap-4 mono-mb-lg">
            <div>
              <label className="mono-label mono-mb-sm block">Preço do Menu *</label>
              <input
                type="number"
                name="menuPrice"
                className="mono-input w-full"
                placeholder="Ex: 9.50"
                step="0.50"
                min="0"
                value={formData.menuPrice}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label className="mono-label mono-mb-sm block">Horário de Almoço</label>
              <input
                type="text"
                name="hours"
                className="mono-input w-full"
                placeholder="Ex: Seg-Sex: 12:00-15:00"
                value={formData.hours}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="mono-mb-lg">
            <label className="mono-label mono-mb-sm block">O que está incluído no menu? *</label>
            <input
              type="text"
              name="included"
              className="mono-input w-full"
              placeholder="Ex: Sopa + Prato + Bebida + Café"
              value={formData.included}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="mono-label mono-mb-sm block">Descrição do Restaurante</label>
            <textarea
              name="description"
              className="mono-textarea w-full"
              placeholder="Descreva brevemente o restaurante, especialidades, ambiente..."
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
            />
          </div>
        </div>

        {/* Features */}
        <div className="mono-card mono-mb-lg">
          <h2 className="mono-heading-5 mono-mb-lg mono-uppercase">Características</h2>
          <p className="mono-body-small text-gray-600 mono-mb-lg">
            Selecione as características que se aplicam a este restaurante:
          </p>
          
          <div className="mono-grid grid-cols-2 md:grid-cols-4 gap-3">
            {availableFeatures.map((feature) => (
              <label key={feature} className="mono-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.features.includes(feature)}
                  onChange={() => handleFeatureToggle(feature)}
                  className="form-checkbox"
                />
                <span className="mono-body-small">{feature}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Photos */}
        <div className="mono-card mono-mb-lg">
          <h2 className="mono-heading-5 mono-mb-lg mono-uppercase">Fotografias</h2>
          
          <div className="mono-mb-lg">
            <label className="mono-label mono-mb-sm block">Foto do Menu/Preçário *</label>
            <p className="mono-body-small text-gray-600 mono-mb-sm">
              Obrigatório: Uma foto clara do menu ou preçário para verificação
            </p>
            <input
              type="file"
              accept="image/*"
              className="mono-input w-full"
              onChange={(e) => setMenuPhoto(e.target.files[0])}
              required
            />
          </div>

          <div>
            <label className="mono-label mono-mb-sm block">Fotos Adicionais (Opcional)</label>
            <p className="mono-body-small text-gray-600 mono-mb-sm">
              Fotos da comida, ambiente, fachada do restaurante
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              className="mono-input w-full"
              onChange={(e) => setAdditionalPhotos([...e.target.files])}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="mono-card">
          <h2 className="mono-heading-5 mono-mb-lg mono-uppercase">Finalizar Submissão</h2>
          
          <div className="bg-gray-100 mono-p-lg mono-mb-lg">
            <h3 className="mono-heading-6 mono-mb-md mono-uppercase">Processo de Validação</h3>
            <ul className="mono-body-small text-gray-700">
              <li className="mono-mb-sm">• Verificamos se o restaurante existe no endereço indicado</li>
              <li className="mono-mb-sm">• Confirmamos o preço do menu através da foto ou fontes online</li>
              <li className="mono-mb-sm">• Aprovamos submissões legítimas em 1-3 dias úteis</li>
              <li>• Rejeitamos duplicados ou informações incorretas</li>
            </ul>
          </div>

          <div className="mono-flex justify-between items-center">
            <Link to="/search" className="mono-button mono-button--ghost">
              CANCELAR
            </Link>
            
            <button
              type="submit"
              className="mono-button mono-button--large"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'A SUBMETER...' : 'SUBMETER RESTAURANTE'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddRestaurant;
import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="mono-container">
      {/* Hero Section */}
      <section className="mono-p-xxxl text-center">
        <h1 className="mono-heading-1 mono-mb-lg">
          MENU DEAL MOÇO
        </h1>
        <p className="mono-heading-6 mono-mb-xl text-gray-600">
          OS MELHORES MENUS DE ALMOÇO EM PORTUGAL
        </p>
        <p className="mono-body-large mono-mb-xxl max-w-2xl mx-auto text-gray-700">
          Encontre os melhores menus de almoço por qualidade-preço,<br />
          baseados em avaliações reais de pessoas como você.
        </p>
        
        <div className="mono-flex justify-center gap-4 mono-mb-xxxl">
          <Link to="/search" className="mono-button mono-button--large">
            PROCURAR RESTAURANTES
          </Link>
          <Link to="/add-restaurant" className="mono-button mono-button--ghost mono-button--large">
            ADICIONAR RESTAURANTE
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="mono-p-xxl border-t">
        <h2 className="mono-heading-3 mono-mb-xl text-center mono-uppercase">
          Como Funciona
        </h2>
        
        <div className="mono-grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center mono-p-lg">
            <div className="mono-heading-2 mono-mb-md">01</div>
            <h3 className="mono-heading-6 mono-mb-md mono-uppercase">Procure</h3>
            <p className="mono-body text-gray-600">
              Digite a sua localização ou use "perto de mim" para encontrar restaurantes na sua área.
            </p>
          </div>
          
          <div className="text-center mono-p-lg">
            <div className="mono-heading-2 mono-mb-md">02</div>
            <h3 className="mono-heading-6 mono-mb-md mono-uppercase">Compare</h3>
            <p className="mono-body text-gray-600">
              Veja rankings por qualidade-preço, preços de menus e avaliações de outros utilizadores.
            </p>
          </div>
          
          <div className="text-center mono-p-lg">
            <div className="mono-heading-2 mono-mb-md">03</div>
            <h3 className="mono-heading-6 mono-mb-md mono-uppercase">Escolha</h3>
            <p className="mono-body text-gray-600">
              Encontre o melhor menu para o seu orçamento e preferências alimentares.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mono-p-xxl border-t bg-gray-100">
        <div className="text-center mono-mb-xl">
          <h2 className="mono-heading-3 mono-uppercase">Em Números</h2>
        </div>
        
        <div className="mono-grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="mono-heading-1">500+</div>
            <div className="mono-label text-gray-600">RESTAURANTES</div>
          </div>
          <div>
            <div className="mono-heading-1">2.5K+</div>
            <div className="mono-label text-gray-600">AVALIAÇÕES</div>
          </div>
          <div>
            <div className="mono-heading-1">15</div>
            <div className="mono-label text-gray-600">CIDADES</div>
          </div>
          <div>
            <div className="mono-heading-1">€9.50</div>
            <div className="mono-label text-gray-600">PREÇO MÉDIO</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mono-p-xxxl text-center border-t">
        <h2 className="mono-heading-3 mono-mb-lg mono-uppercase">
          Pronto para encontrar o seu próximo almoço?
        </h2>
        <Link to="/search" className="mono-button mono-button--large">
          COMEÇAR AGORA
        </Link>
      </section>
    </div>
  )
}

export default Home
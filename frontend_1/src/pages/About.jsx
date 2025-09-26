import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="mono-container mono-p-lg">
      {/* Hero Section */}
      <section className="text-center mono-mb-xxxl">
        <h1 className="mono-heading-1 mono-mb-lg mono-uppercase">
          Sobre o Menu Deal Moço
        </h1>
        <p className="mono-heading-6 mono-mb-xl text-gray-600">
          A NOSSA MISSÃO É SIMPLES
        </p>
        <p className="mono-body-large max-w-3xl mx-auto text-gray-700">
          Ajudar as pessoas em Portugal a encontrar os melhores menus de almoço <br />
          por qualidade-preço, baseados em avaliações reais da comunidade.
        </p>
      </section>

      {/* Problem & Solution */}
      <section className="mono-grid grid-cols-1 md:grid-cols-2 gap-8 mono-mb-xxxl">
        <div className="mono-card">
          <h2 className="mono-heading-4 mono-mb-lg mono-uppercase">O Problema</h2>
          <div className="mono-body mono-mb-md text-gray-700">
            <p className="mono-mb-md">
              É difícil encontrar informações confiáveis sobre menus de almoço em Portugal.
            </p>
            <p className="mono-mb-md">
              Os preços estão espalhados por vários sites, nem sempre atualizados.
            </p>
            <p>
              Não existe uma plataforma central para comparar qualidade-preço.
            </p>
          </div>
        </div>

        <div className="mono-card">
          <h2 className="mono-heading-4 mono-mb-lg mono-uppercase">A Solução</h2>
          <div className="mono-body mono-mb-md text-gray-700">
            <p className="mono-mb-md">
              Uma plataforma simples e focada exclusivamente em menus de almoço.
            </p>
            <p className="mono-mb-md">
              Rankings baseados em avaliações reais de utilizadores.
            </p>
            <p>
              Informação sempre atualizada e verificada pela comunidade.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mono-mb-xxxl">
        <h2 className="mono-heading-2 text-center mono-mb-xl mono-uppercase">
          Como Funciona
        </h2>
        
        <div className="mono-grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center mono-p-lg">
            <div className="mono-heading-1 mono-mb-lg">01</div>
            <h3 className="mono-heading-5 mono-mb-md mono-uppercase">Utilizadores Contribuem</h3>
            <p className="mono-body text-gray-600">
              Qualquer pessoa pode adicionar restaurantes e avaliar menus que experimentou.
            </p>
          </div>
          
          <div className="text-center mono-p-lg">
            <div className="mono-heading-1 mono-mb-lg">02</div>
            <h3 className="mono-heading-5 mono-mb-md mono-uppercase">Nós Verificamos</h3>
            <p className="mono-body text-gray-600">
              Todas as submissões são verificadas para garantir precisão e legitimidade.
            </p>
          </div>
          
          <div className="text-center mono-p-lg">
            <div className="mono-heading-1 mono-mb-lg">03</div>
            <h3 className="mono-heading-5 mono-mb-md mono-uppercase">Todos Beneficiam</h3>
            <p className="mono-body text-gray-600">
              A comunidade tem acesso a informação confiável sobre os melhores menus.
            </p>
          </div>
        </div>
      </section>

      {/* MONO Design System */}
      <section className="mono-card mono-mb-xxxl bg-black text-white">
        <h2 className="mono-heading-3 mono-mb-lg mono-uppercase text-center">
          Design System: MONO
        </h2>
        
        <div className="mono-grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="mono-heading-5 mono-mb-md mono-uppercase">Filosofia</h3>
            <p className="mono-body mono-mb-md text-gray-300">
              "Retire o não-essencial. Cor, decoração, complexidade — eliminados."
            </p>
            <p className="mono-body text-gray-300">
              O foco está na tipografia, espaçamento, proporção e layout.
            </p>
          </div>
          
          <div>
            <h3 className="mono-heading-5 mono-mb-md mono-uppercase">Princípios</h3>
            <ul className="mono-body text-gray-300">
              <li className="mono-mb-sm">• <strong>Redução:</strong> Remover elementos não-essenciais</li>
              <li className="mono-mb-sm">• <strong>Refinamento:</strong> Aperfeiçoar tipografia e espaçamento</li>
              <li className="mono-mb-sm">• <strong>Ritmo:</strong> Criar padrões com elementos limitados</li>
              <li>• <strong>Reação:</strong> Comunicar de forma eficaz</li>
            </ul>
          </div>
        </div>
        
        <div className="text-center mono-mt-lg">
          <p className="mono-caption text-gray-500 mono-italic">
            "SE FUNCIONA EM MONOCROMÁTICO, FUNCIONA EM QUALQUER LUGAR."
          </p>
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="mono-mb-xxxl">
        <h2 className="mono-heading-2 text-center mono-mb-xl mono-uppercase">
          Diretrizes da Comunidade
        </h2>
        
        <div className="mono-grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mono-card">
            <h3 className="mono-heading-5 mono-mb-lg mono-uppercase">Para Utilizadores</h3>
            <ul className="mono-body">
              <li className="mono-mb-md">• Seja honesto nas suas avaliações</li>
              <li className="mono-mb-md">• Foque-se na qualidade-preço do menu</li>
              <li className="mono-mb-md">• Inclua detalhes úteis para outros</li>
              <li className="mono-mb-md">• Respeite os restaurantes e proprietários</li>
              <li>• Mantenha as avaliações atualizadas</li>
            </ul>
          </div>
          
          <div className="mono-card">
            <h3 className="mono-heading-5 mono-mb-lg mono-uppercase">Para Restaurantes</h3>
            <ul className="mono-body">
              <li className="mono-mb-md">• Mantenha os preços atualizados</li>
              <li className="mono-mb-md">• Responda às avaliações de forma profissional</li>
              <li className="mono-mb-md">• Use o feedback para melhorar o serviço</li>
              <li className="mono-mb-md">• Reclame o seu perfil para gestão direta</li>
              <li>• Forneça informações precisas</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mono-card mono-mb-xxxl bg-gray-100">
        <h2 className="mono-heading-3 text-center mono-mb-xl mono-uppercase">
          O Projeto em Números
        </h2>
        
        <div className="mono-grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="mono-heading-1 mono-mb-sm">500+</div>
            <div className="mono-label text-gray-600">RESTAURANTES</div>
          </div>
          <div>
            <div className="mono-heading-1 mono-mb-sm">2.5K+</div>
            <div className="mono-label text-gray-600">AVALIAÇÕES</div>
          </div>
          <div>
            <div className="mono-heading-1 mono-mb-sm">15</div>
            <div className="mono-label text-gray-600">CIDADES</div>
          </div>
          <div>
            <div className="mono-heading-1 mono-mb-sm">95%</div>
            <div className="mono-label text-gray-600">PRECISÃO</div>
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="mono-mb-xxxl">
        <h2 className="mono-heading-2 text-center mono-mb-xl mono-uppercase">
          Detalhes Técnicos
        </h2>
        
        <div className="mono-grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="mono-card">
            <h3 className="mono-heading-6 mono-mb-md mono-uppercase">Frontend</h3>
            <ul className="mono-body-small text-gray-600">
              <li className="mono-mb-sm">• React 18</li>
              <li className="mono-mb-sm">• React Router</li>
              <li className="mono-mb-sm">• MONO Design System</li>
              <li>• CSS personalizado</li>
            </ul>
          </div>
          
          <div className="mono-card">
            <h3 className="mono-heading-6 mono-mb-md mono-uppercase">Funcionalidades</h3>
            <ul className="mono-body-small text-gray-600">
              <li className="mono-mb-sm">• Pesquisa por localização</li>
              <li className="mono-mb-sm">• Filtragem avançada</li>
              <li className="mono-mb-sm">• Sistema de avaliações</li>
              <li>• Submissão de restaurantes</li>
            </ul>
          </div>
          
          <div className="mono-card">
            <h3 className="mono-heading-6 mono-mb-md mono-uppercase">Design</h3>
            <ul className="mono-body-small text-gray-600">
              <li className="mono-mb-sm">• Apenas preto, branco e cinza</li>
              <li className="mono-mb-sm">• Fonte Space Mono exclusivamente</li>
              <li className="mono-mb-sm">• Foco em tipografia</li>
              <li>• Layout minimalista</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center mono-p-xxxl border-t">
        <h2 className="mono-heading-3 mono-mb-lg mono-uppercase">
          Faça Parte da Comunidade
        </h2>
        <p className="mono-body-large mono-mb-xl max-w-2xl mx-auto text-gray-600">
          Ajude-nos a construir a melhor plataforma de menus de almoço em Portugal
        </p>
        
        <div className="mono-flex justify-center gap-4">
          <Link to="/add-restaurant" className="mono-button mono-button--large">
            ADICIONAR RESTAURANTE
          </Link>
          <Link to="/search" className="mono-button mono-button--ghost mono-button--large">
            EXPLORAR MENUS
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
/**
 * Mock Reviews Data for Menu Deal Moço
 * Sample reviews for restaurants with realistic Portuguese content
 */

export const mockReviews = [
  // Reviews for Tasquinha do João (id: 1)
  {
    id: "rev_1",
    restaurantId: "1",
    userId: "user_123",
    userName: "Maria Santos",
    userAvatar: "/avatars/maria_santos.jpg",
    rating: {
      overall: 4,
      valueForMoney: 5,
      foodQuality: 4,
      portionSize: 4,
      serviceSpeed: 4
    },
    reviewText: "Excelente relação qualidade-preço! A francesinha estava deliciosa e o atendimento muito simpático. O ambiente é muito acolhedor, parece que estamos em casa da avó. Voltarei certamente!",
    dateVisited: new Date("2024-12-10"),
    datePosted: new Date("2024-12-12"),
    helpful: 23,
    photos: ["/reviews/tasquinha_joao_francesinha_user.jpg"],
    verified: true,
    dishOrdered: "Francesinha completa"
  },
  {
    id: "rev_2",
    restaurantId: "1",
    userId: "user_456",
    userName: "João Pereira",
    userAvatar: "/avatars/joao_pereira.jpg",
    rating: {
      overall: 5,
      valueForMoney: 5,
      foodQuality: 4,
      portionSize: 5,
      serviceSpeed: 4
    },
    reviewText: "Fantástico! Por 8,50€ tens sopa, prato principal, bebida e café. As doses são generosas e a comida tem sabor caseiro. O bacalhau à Brás estava espetacular.",
    dateVisited: new Date("2024-12-08"),
    datePosted: new Date("2024-12-09"),
    helpful: 15,
    photos: [],
    verified: true,
    dishOrdered: "Bacalhau à Brás"
  },
  {
    id: "rev_3",
    restaurantId: "1",
    userId: "user_789",
    userName: "Ana Costa",
    userAvatar: "/avatars/ana_costa.jpg",
    rating: {
      overall: 4,
      valueForMoney: 4,
      foodQuality: 4,
      portionSize: 4,
      serviceSpeed: 3
    },
    reviewText: "Bom restaurante tradicional. A sopa estava muito boa e o prato principal bem confecionado. O único senão é que às vezes demora um pouco o serviço na hora de almoço.",
    dateVisited: new Date("2024-12-05"),
    datePosted: new Date("2024-12-06"),
    helpful: 8,
    photos: [],
    verified: false,
    dishOrdered: "Cozido à portuguesa"
  },

  // Reviews for Marisqueira Central (id: 2)
  {
    id: "rev_4",
    restaurantId: "2",
    userId: "user_234",
    userName: "Carlos Ferreira",
    userAvatar: "/avatars/carlos_ferreira.jpg",
    rating: {
      overall: 4,
      valueForMoney: 4,
      foodQuality: 5,
      portionSize: 4,
      serviceSpeed: 3
    },
    reviewText: "Peixe fresco todos os dias! O robalo grelhado estava perfeito, bem temperado e no ponto certo. Vale a pena os 12€, especialmente pela qualidade do peixe.",
    dateVisited: new Date("2024-12-07"),
    datePosted: new Date("2024-12-08"),
    helpful: 19,
    photos: ["/reviews/marisqueira_central_robalo.jpg"],
    verified: true,
    dishOrdered: "Robalo grelhado"
  },
  {
    id: "rev_5",
    restaurantId: "2",
    userId: "user_567",
    userName: "Fernanda Lima",
    userAvatar: "/avatars/fernanda_lima.jpg",
    rating: {
      overall: 3,
      valueForMoney: 3,
      foodQuality: 4,
      portionSize: 4,
      serviceSpeed: 3
    },
    reviewText: "Boa marisqueira mas um pouco cara para o que oferece. A caldeirada estava saborosa mas esperava mais pelo preço. O ambiente é agradável.",
    dateVisited: new Date("2024-12-03"),
    datePosted: new Date("2024-12-04"),
    helpful: 12,
    photos: [],
    verified: true,
    dishOrdered: "Caldeirada de peixe"
  },

  // Reviews for Cantina Universitária (id: 3)
  {
    id: "rev_6",
    restaurantId: "3",
    userId: "user_890",
    userName: "Pedro Estudante",
    userAvatar: "/avatars/pedro_estudante.jpg",
    rating: {
      overall: 4,
      valueForMoney: 5,
      foodQuality: 3,
      portionSize: 5,
      serviceSpeed: 4
    },
    reviewText: "Para estudantes é perfeito! Por menos de 7€ comes bem e ficas satisfeito. A comida não é gourmet mas é caseira e as doses são enormes. Recomendo!",
    dateVisited: new Date("2024-12-09"),
    datePosted: new Date("2024-12-10"),
    helpful: 45,
    photos: ["/reviews/cantina_universitaria_dose.jpg"],
    verified: true,
    dishOrdered: "Bitoque com batatas fritas"
  },
  {
    id: "rev_7",
    restaurantId: "3",
    userId: "user_345",
    userName: "Rita Almeida",
    userAvatar: "/avatars/rita_almeida.jpg",
    rating: {
      overall: 4,
      valueForMoney: 5,
      foodQuality: 3,
      portionSize: 4,
      serviceSpeed: 5
    },
    reviewText: "Relação qualidade-preço imbatível! Ideal para quem quer uma refeição rápida e económica. O staff é muito eficiente, mesmo com muita gente consegues ser servido rapidamente.",
    dateVisited: new Date("2024-12-06"),
    datePosted: new Date("2024-12-07"),
    helpful: 22,
    photos: [],
    verified: true,
    dishOrdered: "Esparguete à bolonhesa"
  },

  // Reviews for O Diplomata (id: 4)
  {
    id: "rev_8",
    restaurantId: "4",
    userId: "user_678",
    userName: "Miguel Executive",
    userAvatar: "/avatars/miguel_executive.jpg",
    rating: {
      overall: 5,
      valueForMoney: 4,
      foodQuality: 5,
      portionSize: 4,
      serviceSpeed: 5
    },
    reviewText: "Excelente para almoços de negócios. A apresentação dos pratos é impecável e o sabor está ao nível. O ambiente é elegante e o serviço muito profissional. Vale os 14,50€.",
    dateVisited: new Date("2024-12-11"),
    datePosted: new Date("2024-12-12"),
    helpful: 18,
    photos: ["/reviews/diplomata_presentation.jpg"],
    verified: true,
    dishOrdered: "Bacalhau confitado com puré de grão"
  },
  {
    id: "rev_9",
    restaurantId: "4",
    userId: "user_901",
    userName: "Carla Business",
    userAvatar: "/avatars/carla_business.jpg",
    rating: {
      overall: 4,
      valueForMoney: 4,
      foodQuality: 5,
      portionSize: 3,
      serviceSpeed: 4
    },
    reviewText: "Cozinha criativa e refinada. Gostei muito da reinterpretação moderna de pratos tradicionais. As doses são um pouco pequenas mas a qualidade compensa.",
    dateVisited: new Date("2024-12-09"),
    datePosted: new Date("2024-12-10"),
    helpful: 14,
    photos: [],
    verified: true,
    dishOrdered: "Polvo à lagareiro desconstruído"
  },

  // Reviews for Taberna do Real (id: 6)
  {
    id: "rev_10",
    restaurantId: "6",
    userId: "user_111",
    userName: "Teresa Lisboa",
    userAvatar: "/avatars/teresa_lisboa.jpg",
    rating: {
      overall: 4,
      valueForMoney: 4,
      foodQuality: 5,
      portionSize: 4,
      serviceSpeed: 4
    },
    reviewText: "Taberna autêntica com azulejos lindos e comida tradicional portuguesa. O bacalhau com natas estava divinal! Ambiente muito acolhedor e típico de Lisboa.",
    dateVisited: new Date("2024-12-08"),
    datePosted: new Date("2024-12-09"),
    helpful: 26,
    photos: ["/reviews/taberna_real_azulejos.jpg", "/reviews/taberna_real_bacalhau.jpg"],
    verified: true,
    dishOrdered: "Bacalhau com natas"
  },
  {
    id: "rev_11",
    restaurantId: "6",
    userId: "user_222",
    userName: "António Tradicional",
    userAvatar: "/avatars/antonio_tradicional.jpg",
    rating: {
      overall: 5,
      valueForMoney: 5,
      foodQuality: 4,
      portionSize: 5,
      serviceSpeed: 4
    },
    reviewText: "Uma das melhores tabernas de Lisboa! Comida caseira, doses generosas e preço justo. O ambiente lembra as tabernas de antigamente. Recomendo vivamente!",
    dateVisited: new Date("2024-12-06"),
    datePosted: new Date("2024-12-07"),
    helpful: 31,
    photos: [],
    verified: true,
    dishOrdered: "Cozido à portuguesa"
  },

  // Reviews for Tasca do Chico (id: 15)
  {
    id: "rev_12",
    restaurantId: "15",
    userId: "user_333",
    userName: "Fado Lover",
    userAvatar: "/avatars/fado_lover.jpg",
    rating: {
      overall: 5,
      valueForMoney: 5,
      foodQuality: 4,
      portionSize: 4,
      serviceSpeed: 4
    },
    reviewText: "Experiência autêntica do Bairro Alto! As sardinhas estavam perfeitas e o fado ao vivo criou um ambiente mágico. Preço excelente para o que oferece. Imperdível!",
    dateVisited: new Date("2024-12-10"),
    datePosted: new Date("2024-12-11"),
    helpful: 38,
    photos: ["/reviews/tasca_chico_sardines.jpg", "/reviews/tasca_chico_fado_night.jpg"],
    verified: true,
    dishOrdered: "Sardinhas assadas com pimento"
  },
  {
    id: "rev_13",
    restaurantId: "15",
    userId: "user_444",
    userName: "Tourist Guide",
    userAvatar: "/avatars/tourist_guide.jpg",
    rating: {
      overall: 4,
      valueForMoney: 5,
      foodQuality: 4,
      portionSize: 4,
      serviceSpeed: 3
    },
    reviewText: "Lugar icónico do Bairro Alto. Sempre trago os meus turistas aqui para uma experiência autêntica. A comida é simples mas saborosa e o ambiente é único em Lisboa.",
    dateVisited: new Date("2024-12-05"),
    datePosted: new Date("2024-12-06"),
    helpful: 29,
    photos: [],
    verified: true,
    dishOrdered: "Bifana e imperial"
  },

  // Reviews for O Gaveto (id: 11)
  {
    id: "rev_14",
    restaurantId: "11",
    userId: "user_555",
    userName: "Seafood Expert",
    userAvatar: "/avatars/seafood_expert.jpg",
    rating: {
      overall: 5,
      valueForMoney: 4,
      foodQuality: 5,
      portionSize: 5,
      serviceSpeed: 4
    },
    reviewText: "O melhor peixe grelhado da região do Porto! A qualidade é consistente e as doses são generosas. A vista para o mar é um bónus. Vale cada euro dos 16€.",
    dateVisited: new Date("2024-12-12"),
    datePosted: new Date("2024-12-13"),
    helpful: 42,
    photos: ["/reviews/gaveto_grilled_fish.jpg", "/reviews/gaveto_ocean_view.jpg"],
    verified: true,
    dishOrdered: "Robalo grelhado com legumes"
  },
  {
    id: "rev_15",
    restaurantId: "11",
    userId: "user_666",
    userName: "Matosinhos Local",
    userAvatar: "/avatars/matosinhos_local.jpg",
    rating: {
      overall: 4,
      valueForMoney: 4,
      foodQuality: 5,
      portionSize: 4,
      serviceSpeed: 3
    },
    reviewText: "Restaurante de referência em Matosinhos. O peixe é sempre fresco e bem confecionado. Pode ser um pouco caro mas a qualidade justifica. Reserva com antecedência!",
    dateVisited: new Date("2024-12-09"),
    datePosted: new Date("2024-12-10"),
    helpful: 25,
    photos: [],
    verified: true,
    dishOrdered: "Dourada grelhada"
  },

  // Reviews for Verde & Sabor (id: 14)
  {
    id: "rev_16",
    restaurantId: "14",
    userId: "user_777",
    userName: "Vegan Lisboa",
    userAvatar: "/avatars/vegan_lisboa.jpg",
    rating: {
      overall: 4,
      valueForMoney: 4,
      foodQuality: 4,
      portionSize: 4,
      serviceSpeed: 4
    },
    reviewText: "Finalmente um restaurante que oferece opções vegetarianas saborosas em Lisboa! A francesinha vegan estava surpreendentemente boa. Ingredientes frescos e orgânicos.",
    dateVisited: new Date("2024-12-11"),
    datePosted: new Date("2024-12-12"),
    helpful: 33,
    photos: ["/reviews/verde_sabor_vegan_francesinha.jpg"],
    verified: true,
    dishOrdered: "Francesinha vegan"
  },
  {
    id: "rev_17",
    restaurantId: "14",
    userId: "user_888",
    userName: "Healthy Eater",
    userAvatar: "/avatars/healthy_eater.jpg",
    rating: {
      overall: 4,
      valueForMoney: 4,
      foodQuality: 4,
      portionSize: 4,
      serviceSpeed: 4
    },
    reviewText: "Óptima opção para quem procura alimentação saudável. O menu muda frequentemente e usa sempre ingredientes sazonais. O ambiente é muito agradável e relaxante.",
    dateVisited: new Date("2024-12-08"),
    datePosted: new Date("2024-12-09"),
    helpful: 21,
    photos: [],
    verified: true,
    dishOrdered: "Bowl quinoa com legumes grelhados"
  }
];

// Helper function to get reviews by restaurant
export const getReviewsByRestaurant = (restaurantId) => {
  return mockReviews.filter(review => review.restaurantId === restaurantId);
};

// Helper function to calculate average ratings
export const calculateAverageRatings = (reviews) => {
  if (!reviews || reviews.length === 0) {
    return {
      overall: 0,
      valueForMoney: 0,
      foodQuality: 0,
      portionSize: 0,
      serviceSpeed: 0
    };
  }

  const totals = reviews.reduce((acc, review) => {
    acc.overall += review.rating.overall;
    acc.valueForMoney += review.rating.valueForMoney;
    acc.foodQuality += review.rating.foodQuality;
    acc.portionSize += review.rating.portionSize;
    acc.serviceSpeed += review.rating.serviceSpeed;
    return acc;
  }, {
    overall: 0,
    valueForMoney: 0,
    foodQuality: 0,
    portionSize: 0,
    serviceSpeed: 0
  });

  const count = reviews.length;
  return {
    overall: Math.round((totals.overall / count) * 10) / 10,
    valueForMoney: Math.round((totals.valueForMoney / count) * 10) / 10,
    foodQuality: Math.round((totals.foodQuality / count) * 10) / 10,
    portionSize: Math.round((totals.portionSize / count) * 10) / 10,
    serviceSpeed: Math.round((totals.serviceSpeed / count) * 10) / 10
  };
};

export default mockReviews;
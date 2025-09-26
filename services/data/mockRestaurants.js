/**
 * Mock Restaurant Data for Menu Deal Moço
 * Authentic Portuguese restaurants from Porto and Lisboa
 */

export const mockRestaurants = [
  // Porto Restaurants
  {
    id: "1",
    name: "Tasquinha do João",
    address: "Rua do Breiner, 85, 4050-124 Porto",
    coordinates: { lat: 41.1579, lng: -8.6291 },
    city: "Porto",
    district: "Cedofeita",
    menuPrice: 8.50,
    foodType: "Traditional Portuguese",
    whatsIncluded: ["soup", "main", "drink", "coffee"],
    description: "Family-run tasquinha serving authentic northern Portuguese dishes since 1982. Famous for their francesinha and fresh grilled fish.",
    photos: [
      "/images/tasquinha-joao-menu.jpg",
      "/images/tasquinha-joao-interior.jpg",
      "/images/tasquinha-joao-francesinha.jpg"
    ],
    overallRating: 4.3,
    menuRating: 4.5,
    menuReviews: 92,
    googleRating: 4.2,
    googleReviews: 89,
    zomatoRating: 4.4,
    zomatoReviews: 38,
    totalReviews: 127,
    ratings: {
      valueForMoney: 4.5,
      foodQuality: 4.2,
      portionSize: 4.4,
      serviceSpeed: 4.0
    },
    businessHours: {
      monday: "12:00-15:00,19:00-22:30",
      tuesday: "12:00-15:00,19:00-22:30",
      wednesday: "12:00-15:00,19:00-22:30",
      thursday: "12:00-15:00,19:00-22:30",
      friday: "12:00-15:00,19:00-23:00",
      saturday: "12:00-15:00,19:00-23:00",
      sunday: "12:00-15:00"
    },
    contact: {
      phone: "+351 22 200 1234",
      email: "joao@tasquinha.pt",
      website: null
    },
    practical: {
      cardsAccepted: true,
      parking: false,
      quickService: true,
      groupFriendly: true,
      nearMetro: true,
      metroStation: "Bolhão"
    },
    features: {
      coffeeIncluded: true,
      dessertIncluded: false,
      wineAvailable: true,
      breadSoupIncluded: true,
      vegetarianOptions: false
    },
    isOpen: true,
    lastUpdated: new Date("2024-12-15"),
    submittedBy: "user123",
    approved: true
  },
  {
    id: "2",
    name: "Marisqueira Central",
    address: "Rua da Picaria, 30, 4050-477 Porto",
    coordinates: { lat: 41.1496, lng: -8.6109 },
    city: "Porto",
    district: "Santo Ildefonso",
    menuPrice: 12.00,
    foodType: "Seafood specialist",
    whatsIncluded: ["soup", "main", "drink"],
    description: "Fresh seafood daily from Matosinhos market. Specializing in grilled fish, seafood rice, and traditional caldeirada.",
    photos: [
      "/images/marisqueira-central-menu.jpg",
      "/images/marisqueira-central-fish.jpg",
      "/images/marisqueira-central-interior.jpg"
    ],
    overallRating: 4.1,
    menuRating: 4.3,
    menuReviews: 67,
    googleRating: 4.0,
    googleReviews: 54,
    zomatoRating: 4.2,
    zomatoReviews: 35,
    totalReviews: 89,
    ratings: {
      valueForMoney: 3.9,
      foodQuality: 4.4,
      portionSize: 4.2,
      serviceSpeed: 3.8
    },
    businessHours: {
      monday: "closed",
      tuesday: "12:00-15:00,19:00-22:00",
      wednesday: "12:00-15:00,19:00-22:00",
      thursday: "12:00-15:00,19:00-22:00",
      friday: "12:00-15:00,19:00-22:30",
      saturday: "12:00-15:00,19:00-22:30",
      sunday: "12:00-15:00"
    },
    contact: {
      phone: "+351 22 208 5678",
      email: "geral@marisqueiracentral.pt",
      website: "www.marisqueiracentral.pt"
    },
    practical: {
      cardsAccepted: true,
      parking: false,
      quickService: false,
      groupFriendly: true,
      nearMetro: true,
      metroStation: "São Bento"
    },
    features: {
      coffeeIncluded: false,
      dessertIncluded: false,
      wineAvailable: true,
      breadSoupIncluded: true,
      vegetarianOptions: false
    },
    isOpen: true,
    lastUpdated: new Date("2024-12-10"),
    submittedBy: "user456",
    approved: true
  },
  {
    id: "3",
    name: "Cantina Universitária",
    address: "Rua Dr. Roberto Frias, 378, 4200-465 Porto",
    coordinates: { lat: 41.1782, lng: -8.5980 },
    city: "Porto",
    district: "Asprela",
    menuPrice: 6.80,
    foodType: "Traditional Portuguese",
    whatsIncluded: ["soup", "main", "salad", "drink"],
    description: "Student-friendly restaurant near FEUP. Hearty portions of traditional Portuguese comfort food at unbeatable prices.",
    photos: [
      "/images/cantina-universitaria-menu.jpg",
      "/images/cantina-universitaria-food.jpg"
    ],
    overallRating: 3.8,
    googleRating: 3.9,
    googleReviews: 124,
    zomatoRating: 3.7,
    zomatoReviews: 79,
    totalReviews: 203,
    ratings: {
      valueForMoney: 4.7,
      foodQuality: 3.5,
      portionSize: 4.5,
      serviceSpeed: 4.2
    },
    businessHours: {
      monday: "11:30-14:30",
      tuesday: "11:30-14:30",
      wednesday: "11:30-14:30",
      thursday: "11:30-14:30",
      friday: "11:30-14:30",
      saturday: "closed",
      sunday: "closed"
    },
    contact: {
      phone: "+351 22 508 9012",
      email: null,
      website: null
    },
    practical: {
      cardsAccepted: false,
      parking: true,
      quickService: true,
      groupFriendly: true,
      nearMetro: false,
      metroStation: null
    },
    features: {
      coffeeIncluded: false,
      dessertIncluded: false,
      wineAvailable: false,
      breadSoupIncluded: true,
      vegetarianOptions: true
    },
    isOpen: true,
    lastUpdated: new Date("2024-12-08"),
    submittedBy: "student789",
    approved: true
  },
  {
    id: "4",
    name: "O Diplomata",
    address: "Rua José Falcão, 32, 4050-315 Porto",
    coordinates: { lat: 41.1523, lng: -8.6145 },
    city: "Porto",
    district: "Cedofeita",
    menuPrice: 14.50,
    foodType: "Modern/Contemporary",
    whatsIncluded: ["soup", "main", "dessert", "coffee"],
    description: "Elegant modern Portuguese cuisine with creative twists on traditional dishes. Popular with business professionals.",
    photos: [
      "/images/diplomata-menu.jpg",
      "/images/diplomata-interior.jpg",
      "/images/diplomata-dish.jpg"
    ],
    overallRating: 4.5,
    googleRating: 4.4,
    zomatoRating: 4.6,
    totalReviews: 95,
    ratings: {
      valueForMoney: 4.2,
      foodQuality: 4.7,
      portionSize: 4.1,
      serviceSpeed: 4.3
    },
    businessHours: {
      monday: "12:00-15:00,19:30-23:00",
      tuesday: "12:00-15:00,19:30-23:00",
      wednesday: "12:00-15:00,19:30-23:00",
      thursday: "12:00-15:00,19:30-23:00",
      friday: "12:00-15:00,19:30-23:30",
      saturday: "19:30-23:30",
      sunday: "closed"
    },
    contact: {
      phone: "+351 22 332 4567",
      email: "reservas@diplomata.pt",
      website: "www.diplomata.pt"
    },
    practicalInfo: {
      takesCards: true,
      hasParking: false,
      quickService: false,
      groupFriendly: false,
      nearMetro: true,
      metroStation: "Marquês"
    },
    features: {
      coffeeIncluded: true,
      dessertIncluded: true,
      wineAvailable: true,
      breadSoupIncluded: true,
      vegetarianOptions: true
    },
    isOpen: true,
    lastUpdated: new Date("2024-12-12"),
    submittedBy: "foodie101",
    approved: true
  },
  {
    id: "5",
    name: "Bifana do Afonso",
    address: "Praça da Batalha, 116, 4000-101 Porto",
    coordinates: { lat: 41.1477, lng: -8.6150 },
    city: "Porto",
    district: "Santo Ildefonso",
    menuPrice: 7.20,
    foodType: "Traditional Portuguese",
    whatsIncluded: ["main", "drink"],
    description: "Famous for the best bifana in Porto since 1962. Quick service and authentic flavors in a historic location.",
    photos: [
      "/images/bifana-afonso-menu.jpg",
      "/images/bifana-afonso-bifana.jpg",
      "/images/bifana-afonso-exterior.jpg"
    ],
    overallRating: 4.0,
    googleRating: 3.8,
    zomatoRating: 4.2,
    totalReviews: 156,
    ratings: {
      valueForMoney: 4.4,
      foodQuality: 4.1,
      portionSize: 3.8,
      serviceSpeed: 4.5
    },
    businessHours: {
      monday: "07:00-19:00",
      tuesday: "07:00-19:00",
      wednesday: "07:00-19:00",
      thursday: "07:00-19:00",
      friday: "07:00-19:00",
      saturday: "07:00-19:00",
      sunday: "08:00-18:00"
    },
    contact: {
      phone: "+351 22 200 7890",
      email: null,
      website: null
    },
    practicalInfo: {
      takesCards: false,
      hasParking: false,
      quickService: true,
      groupFriendly: false,
      nearMetro: true,
      metroStation: "São Bento"
    },
    features: {
      coffeeIncluded: false,
      dessertIncluded: false,
      wineAvailable: false,
      breadSoupIncluded: false,
      vegetarianOptions: false
    },
    isOpen: true,
    lastUpdated: new Date("2024-12-14"),
    submittedBy: "local_porto",
    approved: true
  },

  // Lisboa Restaurants
  {
    id: "6",
    name: "Taberna do Real",
    address: "Rua do Poço dos Negros, 103, 1200-337 Lisboa",
    coordinates: { lat: 38.7071, lng: -9.1458 },
    city: "Lisboa",
    district: "Príncipe Real",
    menuPrice: 11.00,
    foodType: "Traditional Portuguese",
    whatsIncluded: ["soup", "main", "drink", "coffee"],
    description: "Authentic Lisbon taberna with traditional azulejos and home-style cooking. Famous for their bacalhau dishes and friendly atmosphere.",
    photos: [
      "/images/taberna-real-menu.jpg",
      "/images/taberna-real-azulejos.jpg",
      "/images/taberna-real-bacalhau.jpg"
    ],
    overallRating: 4.4,
    totalReviews: 178,
    ratings: {
      valueForMoney: 4.3,
      foodQuality: 4.5,
      portionSize: 4.2,
      serviceSpeed: 4.0
    },
    businessHours: {
      monday: "12:00-15:00,19:00-22:00",
      tuesday: "12:00-15:00,19:00-22:00",
      wednesday: "12:00-15:00,19:00-22:00",
      thursday: "12:00-15:00,19:00-22:00",
      friday: "12:00-15:00,19:00-22:30",
      saturday: "12:00-15:00,19:00-22:30",
      sunday: "12:00-15:00"
    },
    contact: {
      phone: "+351 21 342 1234",
      email: "reservas@tabernadoreal.pt",
      website: "www.tabernadoreal.pt"
    },
    practicalInfo: {
      takesCards: true,
      hasParking: false,
      quickService: false,
      groupFriendly: true,
      nearMetro: true,
      metroStation: "Rato"
    },
    features: {
      coffeeIncluded: true,
      dessertIncluded: false,
      wineAvailable: true,
      breadSoupIncluded: true,
      vegetarianOptions: true
    },
    isOpen: true,
    lastUpdated: new Date("2024-12-13"),
    submittedBy: "lisboa_local",
    approved: true
  },
  {
    id: "7",
    name: "Marisqueira São Roque",
    address: "Rua Dom Pedro V, 89, 1250-092 Lisboa",
    coordinates: { lat: 38.7131, lng: -9.1441 },
    city: "Lisboa",
    district: "Misericórdia",
    menuPrice: 13.50,
    foodType: "Seafood specialist",
    whatsIncluded: ["soup", "main", "drink"],
    description: "Fresh seafood from Sesimbra and Setúbal. Specializes in caldeirada de peixe, grilled sardines, and seafood cataplana.",
    photos: [
      "/images/marisqueira-sroque-menu.jpg",
      "/images/marisqueira-sroque-cataplana.jpg",
      "/images/marisqueira-sroque-terrace.jpg"
    ],
    overallRating: 4.2,
    totalReviews: 134,
    ratings: {
      valueForMoney: 4.0,
      foodQuality: 4.4,
      portionSize: 4.3,
      serviceSpeed: 3.9
    },
    businessHours: {
      monday: "closed",
      tuesday: "12:00-15:00,19:00-22:00",
      wednesday: "12:00-15:00,19:00-22:00",
      thursday: "12:00-15:00,19:00-22:00",
      friday: "12:00-15:00,19:00-22:30",
      saturday: "12:00-15:00,19:00-22:30",
      sunday: "12:00-15:00"
    },
    contact: {
      phone: "+351 21 346 5678",
      email: "geral@marisqueirasaoroque.pt",
      website: null
    },
    practicalInfo: {
      takesCards: true,
      hasParking: false,
      quickService: false,
      groupFriendly: true,
      nearMetro: true,
      metroStation: "Avenida"
    },
    features: {
      coffeeIncluded: false,
      dessertIncluded: false,
      wineAvailable: true,
      breadSoupIncluded: true,
      vegetarianOptions: false
    },
    isOpen: true,
    lastUpdated: new Date("2024-12-11"),
    submittedBy: "seafood_lover",
    approved: true
  },
  {
    id: "8",
    name: "Cantinho da Esquina",
    address: "Rua da Esperança, 112, 1200-660 Lisboa",
    coordinates: { lat: 38.7040, lng: -9.1654 },
    city: "Lisboa",
    district: "Estrela",
    menuPrice: 9.80,
    foodType: "Traditional Portuguese",
    whatsIncluded: ["soup", "main", "drink", "coffee"],
    description: "Neighborhood gem in Estrela serving generous portions of comfort food. Popular with locals and known for excellent value.",
    photos: [
      "/images/cantinho-esquina-menu.jpg",
      "/images/cantinho-esquina-interior.jpg",
      "/images/cantinho-esquina-food.jpg"
    ],
    overallRating: 4.1,
    totalReviews: 92,
    ratings: {
      valueForMoney: 4.5,
      foodQuality: 3.9,
      portionSize: 4.4,
      serviceSpeed: 4.0
    },
    businessHours: {
      monday: "11:30-15:00,18:30-22:00",
      tuesday: "11:30-15:00,18:30-22:00",
      wednesday: "11:30-15:00,18:30-22:00",
      thursday: "11:30-15:00,18:30-22:00",
      friday: "11:30-15:00,18:30-22:00",
      saturday: "11:30-15:00,18:30-22:00",
      sunday: "closed"
    },
    contact: {
      phone: "+351 21 396 7890",
      email: null,
      website: null
    },
    practicalInfo: {
      takesCards: true,
      hasParking: false,
      quickService: true,
      groupFriendly: true,
      nearMetro: false,
      metroStation: null
    },
    features: {
      coffeeIncluded: true,
      dessertIncluded: false,
      wineAvailable: true,
      breadSoupIncluded: true,
      vegetarianOptions: true
    },
    isOpen: true,
    lastUpdated: new Date("2024-12-09"),
    submittedBy: "estrela_resident",
    approved: true
  },
  {
    id: "9",
    name: "Mesa Real",
    address: "Rua das Flores, 45, 1200-194 Lisboa",
    coordinates: { lat: 38.7112, lng: -9.1456 },
    city: "Lisboa",
    district: "Chiado",
    menuPrice: 15.50,
    foodType: "Modern/Contemporary",
    whatsIncluded: ["soup", "main", "dessert", "coffee"],
    description: "Upscale modern Portuguese cuisine in the heart of Chiado. Innovative interpretations of classic dishes with premium ingredients.",
    photos: [
      "/images/mesa-real-menu.jpg",
      "/images/mesa-real-plating.jpg",
      "/images/mesa-real-interior.jpg"
    ],
    overallRating: 4.6,
    menuRating: 4.7,
    menuReviews: 45,
    googleRating: 4.4,
    googleReviews: 42,
    zomatoRating: 4.6,
    zomatoReviews: 25,
    totalReviews: 67,
    ratings: {
      valueForMoney: 4.1,
      foodQuality: 4.8,
      portionSize: 3.9,
      serviceSpeed: 4.2
    },
    businessHours: {
      monday: "12:30-15:00,19:30-23:00",
      tuesday: "12:30-15:00,19:30-23:00",
      wednesday: "12:30-15:00,19:30-23:00",
      thursday: "12:30-15:00,19:30-23:00",
      friday: "12:30-15:00,19:30-23:30",
      saturday: "19:30-23:30",
      sunday: "closed"
    },
    contact: {
      phone: "+351 21 347 1111",
      email: "reservas@mesareal.pt",
      website: "www.mesareal.pt"
    },
    practical: {
      cardsAccepted: true,
      parking: false,
      quickService: false,
      groupFriendly: false,
      nearMetro: true,
      metroStation: "Baixa-Chiado"
    },
    features: {
      coffeeIncluded: true,
      dessertIncluded: true,
      wineAvailable: true,
      breadSoupIncluded: true,
      vegetarianOptions: true
    },
    isOpen: true,
    lastUpdated: new Date("2024-12-14"),
    submittedBy: "gourmet_user",
    approved: true
  },
  {
    id: "10",
    name: "Pastéis & Companhia",
    address: "Rua de Belém, 84, 1300-085 Lisboa",
    coordinates: { lat: 38.6979, lng: -9.2063 },
    city: "Lisboa",
    district: "Belém",
    menuPrice: 8.20,
    foodType: "Traditional Portuguese",
    whatsIncluded: ["main", "drink", "coffee"],
    description: "Traditional pastéis de nata and light meals near Mosteiro dos Jerónimos. Perfect for tourists and locals alike.",
    photos: [
      "/images/pasteis-companhia-menu.jpg",
      "/images/pasteis-companhia-nata.jpg",
      "/images/pasteis-companhia-exterior.jpg"
    ],
    overallRating: 3.9,
    totalReviews: 245,
    ratings: {
      valueForMoney: 4.2,
      foodQuality: 3.8,
      portionSize: 3.7,
      serviceSpeed: 4.3
    },
    businessHours: {
      monday: "08:00-19:00",
      tuesday: "08:00-19:00",
      wednesday: "08:00-19:00",
      thursday: "08:00-19:00",
      friday: "08:00-19:00",
      saturday: "08:00-19:00",
      sunday: "08:00-19:00"
    },
    contact: {
      phone: "+351 21 362 2222",
      email: "info@pasteiscompanhia.pt",
      website: null
    },
    practicalInfo: {
      takesCards: true,
      hasParking: true,
      quickService: true,
      groupFriendly: true,
      nearMetro: false,
      metroStation: null
    },
    features: {
      coffeeIncluded: true,
      dessertIncluded: false,
      wineAvailable: false,
      breadSoupIncluded: false,
      vegetarianOptions: true
    },
    isOpen: true,
    lastUpdated: new Date("2024-12-10"),
    submittedBy: "tourist_guide",
    approved: true
  },

  // More Porto restaurants
  {
    id: "11",
    name: "O Gaveto",
    address: "Rua Roberto Ivens, 826, 4450-251 Matosinhos",
    coordinates: { lat: 41.1844, lng: -8.6918 },
    city: "Porto",
    district: "Matosinhos",
    menuPrice: 16.00,
    foodType: "Seafood specialist",
    whatsIncluded: ["soup", "main", "dessert"],
    description: "Legendary seafood restaurant in Matosinhos. Known for the freshest fish grilled to perfection and spectacular ocean views.",
    photos: [
      "/images/gaveto-menu.jpg",
      "/images/gaveto-grilled-fish.jpg",
      "/images/gaveto-ocean-view.jpg"
    ],
    overallRating: 4.7,
    totalReviews: 312,
    ratings: {
      valueForMoney: 4.3,
      foodQuality: 4.9,
      portionSize: 4.6,
      serviceSpeed: 4.1
    },
    businessHours: {
      monday: "closed",
      tuesday: "12:00-15:00,19:00-22:30",
      wednesday: "12:00-15:00,19:00-22:30",
      thursday: "12:00-15:00,19:00-22:30",
      friday: "12:00-15:00,19:00-23:00",
      saturday: "12:00-15:00,19:00-23:00",
      sunday: "12:00-15:00"
    },
    contact: {
      phone: "+351 22 937 1234",
      email: "reservas@ogaveto.pt",
      website: "www.ogaveto.pt"
    },
    practicalInfo: {
      takesCards: true,
      hasParking: true,
      quickService: false,
      groupFriendly: true,
      nearMetro: true,
      metroStation: "Matosinhos Sul"
    },
    features: {
      coffeeIncluded: false,
      dessertIncluded: true,
      wineAvailable: true,
      breadSoupIncluded: true,
      vegetarianOptions: false
    },
    isOpen: true,
    lastUpdated: new Date("2024-12-12"),
    submittedBy: "seafood_expert",
    approved: true
  },
  {
    id: "12",
    name: "Taberna do Largo",
    address: "Largo de São Domingos, 3, 4050-545 Porto",
    coordinates: { lat: 41.1507, lng: -8.6154 },
    city: "Porto",
    district: "Vitória",
    menuPrice: 10.50,
    foodType: "Traditional Portuguese",
    whatsIncluded: ["soup", "main", "drink", "coffee"],
    description: "Cozy taberna in historic São Domingos square. Traditional recipes passed down through generations with modern presentation.",
    photos: [
      "/images/taberna-largo-menu.jpg",
      "/images/taberna-largo-square.jpg",
      "/images/taberna-largo-tripas.jpg"
    ],
    overallRating: 4.2,
    totalReviews: 158,
    ratings: {
      valueForMoney: 4.4,
      foodQuality: 4.1,
      portionSize: 4.0,
      serviceSpeed: 4.2
    },
    businessHours: {
      monday: "12:00-15:00,19:00-22:00",
      tuesday: "12:00-15:00,19:00-22:00",
      wednesday: "12:00-15:00,19:00-22:00",
      thursday: "12:00-15:00,19:00-22:00",
      friday: "12:00-15:00,19:00-22:30",
      saturday: "12:00-15:00,19:00-22:30",
      sunday: "closed"
    },
    contact: {
      phone: "+351 22 201 5555",
      email: "tabernalargo@gmail.com",
      website: null
    },
    practicalInfo: {
      takesCards: true,
      hasParking: false,
      quickService: true,
      groupFriendly: true,
      nearMetro: true,
      metroStation: "São Bento"
    },
    features: {
      coffeeIncluded: true,
      dessertIncluded: false,
      wineAvailable: true,
      breadSoupIncluded: true,
      vegetarianOptions: true
    },
    isOpen: true,
    lastUpdated: new Date("2024-12-08"),
    submittedBy: "vitoria_local",
    approved: true
  },

  // More Lisboa restaurants
  {
    id: "13",
    name: "Casa da Índia",
    address: "Rua do Loreto, 49, 1200-240 Lisboa",
    coordinates: { lat: 38.7127, lng: -9.1442 },
    city: "Lisboa",
    district: "Chiado",
    menuPrice: 12.80,
    foodType: "International",
    whatsIncluded: ["soup", "main", "drink"],
    description: "Fusion of Portuguese and Indian flavors. Unique menu combining traditional Portuguese techniques with exotic spices.",
    photos: [
      "/images/casa-india-menu.jpg",
      "/images/casa-india-curry-bacalhau.jpg",
      "/images/casa-india-interior.jpg"
    ],
    overallRating: 4.0,
    totalReviews: 76,
    ratings: {
      valueForMoney: 3.9,
      foodQuality: 4.2,
      portionSize: 4.0,
      serviceSpeed: 3.8
    },
    businessHours: {
      monday: "12:00-15:00,19:00-22:00",
      tuesday: "12:00-15:00,19:00-22:00",
      wednesday: "12:00-15:00,19:00-22:00",
      thursday: "12:00-15:00,19:00-22:00",
      friday: "12:00-15:00,19:00-22:30",
      saturday: "12:00-15:00,19:00-22:30",
      sunday: "closed"
    },
    contact: {
      phone: "+351 21 342 7777",
      email: "reservas@casadaindia.pt",
      website: "www.casadaindia.pt"
    },
    practicalInfo: {
      takesCards: true,
      hasParking: false,
      quickService: false,
      groupFriendly: true,
      nearMetro: true,
      metroStation: "Baixa-Chiado"
    },
    features: {
      coffeeIncluded: false,
      dessertIncluded: false,
      wineAvailable: true,
      breadSoupIncluded: true,
      vegetarianOptions: true
    },
    isOpen: true,
    lastUpdated: new Date("2024-12-13"),
    submittedBy: "fusion_fan",
    approved: true
  },
  {
    id: "14",
    name: "Verde & Sabor",
    address: "Rua do Século, 95, 1200-434 Lisboa",
    coordinates: { lat: 38.7138, lng: -9.1486 },
    city: "Lisboa",
    district: "Príncipe Real",
    menuPrice: 11.50,
    foodType: "Vegetarian-friendly",
    whatsIncluded: ["soup", "main", "salad", "drink"],
    description: "Plant-based Portuguese cuisine with organic ingredients. Traditional recipes reimagined for modern healthy eating.",
    photos: [
      "/images/verde-sabor-menu.jpg",
      "/images/verde-sabor-vegan-francesinha.jpg",
      "/images/verde-sabor-garden.jpg"
    ],
    overallRating: 4.3,
    totalReviews: 89,
    ratings: {
      valueForMoney: 4.2,
      foodQuality: 4.4,
      portionSize: 4.1,
      serviceSpeed: 4.0
    },
    businessHours: {
      monday: "11:30-15:30,18:30-22:00",
      tuesday: "11:30-15:30,18:30-22:00",
      wednesday: "11:30-15:30,18:30-22:00",
      thursday: "11:30-15:30,18:30-22:00",
      friday: "11:30-15:30,18:30-22:00",
      saturday: "11:30-15:30,18:30-22:00",
      sunday: "11:30-15:30"
    },
    contact: {
      phone: "+351 21 347 8888",
      email: "info@verdesabor.pt",
      website: "www.verdesabor.pt"
    },
    practicalInfo: {
      takesCards: true,
      hasParking: false,
      quickService: true,
      groupFriendly: true,
      nearMetro: true,
      metroStation: "Avenida"
    },
    features: {
      coffeeIncluded: false,
      dessertIncluded: false,
      wineAvailable: true,
      breadSoupIncluded: true,
      vegetarianOptions: true
    },
    isOpen: true,
    lastUpdated: new Date("2024-12-11"),
    submittedBy: "green_eater",
    approved: true
  },
  {
    id: "15",
    name: "Tasca do Chico",
    address: "Rua do Diário de Notícias, 39, 1200-142 Lisboa",
    coordinates: { lat: 38.7107, lng: -9.1448 },
    city: "Lisboa",
    district: "Bairro Alto",
    menuPrice: 7.50,
    foodType: "Traditional Portuguese",
    whatsIncluded: ["main", "drink"],
    description: "Iconic Bairro Alto tasca known for sardines, fado music, and authentic Lisbon atmosphere. A must-visit local institution.",
    photos: [
      "/images/tasca-chico-menu.jpg",
      "/images/tasca-chico-sardines.jpg",
      "/images/tasca-chico-fado.jpg"
    ],
    overallRating: 4.5,
    totalReviews: 287,
    ratings: {
      valueForMoney: 4.6,
      foodQuality: 4.3,
      portionSize: 4.0,
      serviceSpeed: 4.2
    },
    businessHours: {
      monday: "18:00-02:00",
      tuesday: "18:00-02:00",
      wednesday: "18:00-02:00",
      thursday: "18:00-02:00",
      friday: "18:00-02:00",
      saturday: "18:00-02:00",
      sunday: "18:00-02:00"
    },
    contact: {
      phone: "+351 21 346 0000",
      email: null,
      website: null
    },
    practicalInfo: {
      takesCards: false,
      hasParking: false,
      quickService: true,
      groupFriendly: true,
      nearMetro: true,
      metroStation: "Baixa-Chiado"
    },
    features: {
      coffeeIncluded: false,
      dessertIncluded: false,
      wineAvailable: true,
      breadSoupIncluded: false,
      vegetarianOptions: false
    },
    isOpen: true,
    lastUpdated: new Date("2024-12-14"),
    submittedBy: "fado_lover",
    approved: true
  },

  // Additional restaurants to reach 20+
  {
    id: "16",
    name: "Adega Machado",
    address: "Rua do Norte, 91, 1200-284 Lisboa",
    coordinates: { lat: 38.7115, lng: -9.1463 },
    city: "Lisboa",
    district: "Bairro Alto",
    menuPrice: 13.00,
    foodType: "Traditional Portuguese",
    whatsIncluded: ["soup", "main", "dessert", "coffee"],
    description: "Historic fado house serving traditional Portuguese cuisine since 1937. Live fado performances during dinner service.",
    photos: [
      "/images/adega-machado-menu.jpg",
      "/images/adega-machado-fado.jpg",
      "/images/adega-machado-interior.jpg"
    ],
    overallRating: 4.1,
    totalReviews: 198,
    ratings: {
      valueForMoney: 3.8,
      foodQuality: 4.2,
      portionSize: 4.0,
      serviceSpeed: 3.9
    },
    businessHours: {
      monday: "closed",
      tuesday: "19:30-02:00",
      wednesday: "19:30-02:00",
      thursday: "19:30-02:00",
      friday: "19:30-02:00",
      saturday: "19:30-02:00",
      sunday: "19:30-02:00"
    },
    contact: {
      phone: "+351 21 322 4646",
      email: "reservas@adegamachado.pt",
      website: "www.adegamachado.pt"
    },
    practicalInfo: {
      takesCards: true,
      hasParking: false,
      quickService: false,
      groupFriendly: true,
      nearMetro: true,
      metroStation: "Baixa-Chiado"
    },
    features: {
      coffeeIncluded: true,
      dessertIncluded: true,
      wineAvailable: true,
      breadSoupIncluded: true,
      vegetarianOptions: false
    },
    isOpen: true,
    lastUpdated: new Date("2024-12-09"),
    submittedBy: "culture_seeker",
    approved: true
  },
  {
    id: "17",
    name: "Flor do Bacalhau",
    address: "Rua da Alfândega, 127, 4050-029 Porto",
    coordinates: { lat: 41.1427, lng: -8.6071 },
    city: "Porto",
    district: "Ribeira",
    menuPrice: 9.20,
    foodType: "Traditional Portuguese",
    whatsIncluded: ["soup", "main", "drink"],
    description: "Riverside restaurant specializing in bacalhau dishes. Over 30 different ways to prepare codfish in a historic Ribeira setting.",
    photos: [
      "/images/flor-bacalhau-menu.jpg",
      "/images/flor-bacalhau-codfish.jpg",
      "/images/flor-bacalhau-douro.jpg"
    ],
    overallRating: 4.0,
    totalReviews: 167,
    ratings: {
      valueForMoney: 4.1,
      foodQuality: 4.0,
      portionSize: 4.2,
      serviceSpeed: 3.8
    },
    businessHours: {
      monday: "12:00-15:00,19:00-22:00",
      tuesday: "12:00-15:00,19:00-22:00",
      wednesday: "12:00-15:00,19:00-22:00",
      thursday: "12:00-15:00,19:00-22:00",
      friday: "12:00-15:00,19:00-22:30",
      saturday: "12:00-15:00,19:00-22:30",
      sunday: "12:00-15:00"
    },
    contact: {
      phone: "+351 22 200 3333",
      email: "info@flordobacalhau.pt",
      website: null
    },
    practicalInfo: {
      takesCards: true,
      hasParking: false,
      quickService: true,
      groupFriendly: true,
      nearMetro: false,
      metroStation: null
    },
    features: {
      coffeeIncluded: false,
      dessertIncluded: false,
      wineAvailable: true,
      breadSoupIncluded: true,
      vegetarianOptions: false
    },
    isOpen: true,
    lastUpdated: new Date("2024-12-07"),
    submittedBy: "ribeira_walker",
    approved: true
  },
  {
    id: "18",
    name: "Tabacaria Real",
    address: "Rua da Escola Politécnica, 27, 1250-100 Lisboa",
    coordinates: { lat: 38.7172, lng: -9.1522 },
    city: "Lisboa",
    district: "Avenidas Novas",
    menuPrice: 10.20,
    foodType: "Traditional Portuguese",
    whatsIncluded: ["soup", "main", "drink", "coffee"],
    description: "Family restaurant serving homestyle Portuguese cooking for three generations. Known for generous portions and traditional flavors.",
    photos: [
      "/images/tabacaria-real-menu.jpg",
      "/images/tabacaria-real-cozido.jpg",
      "/images/tabacaria-real-family.jpg"
    ],
    overallRating: 4.2,
    totalReviews: 143,
    ratings: {
      valueForMoney: 4.4,
      foodQuality: 4.1,
      portionSize: 4.5,
      serviceSpeed: 4.0
    },
    businessHours: {
      monday: "12:00-15:00,19:00-22:00",
      tuesday: "12:00-15:00,19:00-22:00",
      wednesday: "12:00-15:00,19:00-22:00",
      thursday: "12:00-15:00,19:00-22:00",
      friday: "12:00-15:00,19:00-22:00",
      saturday: "12:00-15:00,19:00-22:00",
      sunday: "closed"
    },
    contact: {
      phone: "+351 21 385 4444",
      email: "tabacaria.real@gmail.com",
      website: null
    },
    practicalInfo: {
      takesCards: true,
      hasParking: false,
      quickService: true,
      groupFriendly: true,
      nearMetro: true,
      metroStation: "Marquês de Pombal"
    },
    features: {
      coffeeIncluded: true,
      dessertIncluded: false,
      wineAvailable: true,
      breadSoupIncluded: true,
      vegetarianOptions: true
    },
    isOpen: true,
    lastUpdated: new Date("2024-12-12"),
    submittedBy: "traditional_taste",
    approved: true
  },
  {
    id: "19",
    name: "Churrasqueira Minhota",
    address: "Rua de Cedofeita, 179, 4050-180 Porto",
    coordinates: { lat: 41.1547, lng: -8.6201 },
    city: "Porto",
    district: "Cedofeita",
    menuPrice: 11.80,
    foodType: "Meat-focused",
    whatsIncluded: ["soup", "main", "drink", "coffee"],
    description: "Authentic Minho-style grilled chicken and meat. Famous for frango no churrasco and traditional Portuguese grilled specialties.",
    photos: [
      "/images/churrasqueira-minhota-menu.jpg",
      "/images/churrasqueira-minhota-chicken.jpg",
      "/images/churrasqueira-minhota-grill.jpg"
    ],
    overallRating: 4.3,
    totalReviews: 201,
    ratings: {
      valueForMoney: 4.4,
      foodQuality: 4.3,
      portionSize: 4.6,
      serviceSpeed: 4.1
    },
    businessHours: {
      monday: "12:00-15:00,19:00-22:30",
      tuesday: "12:00-15:00,19:00-22:30",
      wednesday: "12:00-15:00,19:00-22:30",
      thursday: "12:00-15:00,19:00-22:30",
      friday: "12:00-15:00,19:00-23:00",
      saturday: "12:00-15:00,19:00-23:00",
      sunday: "12:00-15:00"
    },
    contact: {
      phone: "+351 22 200 6666",
      email: "geral@churrasqueiraminhota.pt",
      website: "www.churrasqueiraminhota.pt"
    },
    practicalInfo: {
      takesCards: true,
      hasParking: false,
      quickService: true,
      groupFriendly: true,
      nearMetro: true,
      metroStation: "24 de Agosto"
    },
    features: {
      coffeeIncluded: true,
      dessertIncluded: false,
      wineAvailable: true,
      breadSoupIncluded: true,
      vegetarianOptions: false
    },
    isOpen: true,
    lastUpdated: new Date("2024-12-10"),
    submittedBy: "meat_lover",
    approved: true
  },
  {
    id: "20",
    name: "Esplanada Mariscos",
    address: "Avenida de Brasília, 202, 1400-038 Lisboa",
    coordinates: { lat: 38.6958, lng: -9.2125 },
    city: "Lisboa",
    district: "Belém",
    menuPrice: 14.20,
    foodType: "Seafood specialist",
    whatsIncluded: ["soup", "main", "drink"],
    description: "Waterfront seafood restaurant with views of the Tagus River. Specializes in fresh fish and seafood with outdoor terrace dining.",
    photos: [
      "/images/esplanada-mariscos-menu.jpg",
      "/images/esplanada-mariscos-terrace.jpg",
      "/images/esplanada-mariscos-fish.jpg"
    ],
    overallRating: 4.1,
    totalReviews: 156,
    ratings: {
      valueForMoney: 3.9,
      foodQuality: 4.3,
      portionSize: 4.1,
      serviceSpeed: 3.8
    },
    businessHours: {
      monday: "12:00-15:30,19:00-22:30",
      tuesday: "12:00-15:30,19:00-22:30",
      wednesday: "12:00-15:30,19:00-22:30",
      thursday: "12:00-15:30,19:00-22:30",
      friday: "12:00-15:30,19:00-23:00",
      saturday: "12:00-15:30,19:00-23:00",
      sunday: "12:00-15:30"
    },
    contact: {
      phone: "+351 21 301 7777",
      email: "reservas@esplanadamariscos.pt",
      website: "www.esplanadamariscos.pt"
    },
    practicalInfo: {
      takesCards: true,
      hasParking: true,
      quickService: false,
      groupFriendly: true,
      nearMetro: false,
      metroStation: null
    },
    features: {
      coffeeIncluded: false,
      dessertIncluded: false,
      wineAvailable: true,
      breadSoupIncluded: true,
      vegetarianOptions: false
    },
    isOpen: true,
    lastUpdated: new Date("2024-12-13"),
    submittedBy: "tagus_view",
    approved: true
  },
  {
    id: "21",
    name: "Bom Sucesso Market",
    address: "Praça do Bom Sucesso, 74, 4150-146 Porto",
    coordinates: { lat: 41.1588, lng: -8.6394 },
    city: "Porto",
    district: "Lordelo do Ouro",
    menuPrice: 12.50,
    foodType: "International",
    whatsIncluded: ["main", "drink"],
    description: "Modern food market with diverse international options. Multiple vendors offering everything from sushi to traditional Portuguese dishes.",
    photos: [
      "/images/bom-sucesso-menu.jpg",
      "/images/bom-sucesso-market.jpg",
      "/images/bom-sucesso-variety.jpg"
    ],
    overallRating: 4.0,
    totalReviews: 289,
    ratings: {
      valueForMoney: 3.8,
      foodQuality: 4.1,
      portionSize: 3.9,
      serviceSpeed: 4.2
    },
    businessHours: {
      monday: "10:00-02:00",
      tuesday: "10:00-02:00",
      wednesday: "10:00-02:00",
      thursday: "10:00-02:00",
      friday: "10:00-02:00",
      saturday: "10:00-02:00",
      sunday: "10:00-02:00"
    },
    contact: {
      phone: "+351 22 610 8888",
      email: "info@bomsucesso.pt",
      website: "www.mercadobomsucesso.pt"
    },
    practicalInfo: {
      takesCards: true,
      hasParking: true,
      quickService: true,
      groupFriendly: true,
      nearMetro: true,
      metroStation: "Casa da Música"
    },
    features: {
      coffeeIncluded: false,
      dessertIncluded: false,
      wineAvailable: true,
      breadSoupIncluded: false,
      vegetarianOptions: true
    },
    isOpen: true,
    lastUpdated: new Date("2024-12-11"),
    submittedBy: "market_explorer",
    approved: true
  }
];

// Export for use in services
export default mockRestaurants;
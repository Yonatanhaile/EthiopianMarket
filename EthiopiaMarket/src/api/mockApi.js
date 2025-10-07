// Mock API for development

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const mockListings = [
  {
    id: '1',
    title: 'iPhone 13 Pro - Like New',
    shortDescription: 'Excellent condition, 256GB',
    longDescription: 'iPhone 13 Pro in excellent condition. 256GB storage, Pacific Blue color. Comes with original box and charger. Battery health 95%. No scratches or dents.',
    category: 'electronics',
    region: 'addisababa',
    images: ['https://via.placeholder.com/400x300/10b981/ffffff?text=iPhone+13+Pro'],
    contactMethods: {
      phone: '+251911234567',
      whatsapp: '+251911234567',
      telegram: '@seller1',
      email: 'seller1@example.com'
    },
    sellerId: 'seller1',
    sellerName: 'Abebe Kebede',
    views: 234,
    createdAt: '2024-01-15T10:30:00Z',
    status: 'active'
  },
  {
    id: '2',
    title: 'Toyota Corolla 2015',
    shortDescription: 'Well maintained, low mileage',
    longDescription: 'Toyota Corolla 2015 model in excellent condition. Regular maintenance, all papers in order. White color, automatic transmission, 45,000 km.',
    category: 'vehicles',
    region: 'addisababa',
    images: ['https://via.placeholder.com/400x300/10b981/ffffff?text=Toyota+Corolla'],
    contactMethods: {
      phone: '+251922345678',
      whatsapp: '+251922345678'
    },
    sellerId: 'seller2',
    sellerName: 'Tigist Alemu',
    views: 567,
    createdAt: '2024-01-14T14:20:00Z',
    status: 'active'
  },
  {
    id: '3',
    title: '2 Bedroom Apartment - Bole',
    shortDescription: 'Modern apartment in prime location',
    longDescription: 'Beautiful 2 bedroom apartment in Bole area. Fully furnished, modern kitchen, balcony with great view. Close to shops, restaurants, and public transport.',
    category: 'realestate',
    region: 'addisababa',
    images: ['https://via.placeholder.com/400x300/10b981/ffffff?text=Apartment'],
    contactMethods: {
      phone: '+251933456789',
      email: 'realestate@example.com'
    },
    sellerId: 'seller3',
    sellerName: 'Mulugeta Tekle',
    views: 890,
    createdAt: '2024-01-13T09:15:00Z',
    status: 'active'
  }
];

const mockUsers = {
  seller1: {
    id: 'seller1',
    name: 'Abebe Kebede',
    joinedDate: '2023-06-15',
    listingsCount: 5,
    rating: 4.8
  },
  seller2: {
    id: 'seller2',
    name: 'Tigist Alemu',
    joinedDate: '2023-08-20',
    listingsCount: 8,
    rating: 4.9
  },
  seller3: {
    id: 'seller3',
    name: 'Mulugeta Tekle',
    joinedDate: '2023-05-10',
    listingsCount: 12,
    rating: 4.7
  }
};

export const api = {
  // GET /api/listings
  getListings: async (filters = {}) => {
    await delay(500);
    
    let filtered = [...mockListings];
    
    if (filters.category) {
      filtered = filtered.filter(l => l.category === filters.category);
    }
    
    if (filters.region) {
      filtered = filtered.filter(l => l.region === filters.region);
    }
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(l => 
        l.title.toLowerCase().includes(search) ||
        l.shortDescription.toLowerCase().includes(search)
      );
    }
    
    return {
      data: filtered,
      total: filtered.length
    };
  },

  // GET /api/listings/:id
  getListingById: async (id) => {
    await delay(300);
    const listing = mockListings.find(l => l.id === id);
    if (!listing) {
      throw new Error('Listing not found');
    }
    return { data: listing };
  },

  // POST /api/listings
  createListing: async (listingData) => {
    await delay(800);
    
    const newListing = {
      id: Math.random().toString(36).substr(2, 9),
      ...listingData,
      sellerId: 'current-user',
      sellerName: 'Current User',
      views: 0,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    mockListings.unshift(newListing);
    return { data: newListing };
  },

  // PUT /api/listings/:id
  updateListing: async (id, listingData) => {
    await delay(600);
    const index = mockListings.findIndex(l => l.id === id);
    if (index === -1) {
      throw new Error('Listing not found');
    }
    mockListings[index] = { ...mockListings[index], ...listingData };
    return { data: mockListings[index] };
  },

  // POST /api/messages
  sendMessage: async (messageData) => {
    await delay(500);
    return { 
      success: true, 
      message: 'Message sent successfully' 
    };
  },

  // POST /api/auth/otp
  sendOTP: async (phoneNumber) => {
    await delay(1000);
    return { 
      success: true, 
      message: 'OTP sent to ' + phoneNumber 
    };
  },

  // GET /api/users/:id
  getUserById: async (id) => {
    await delay(300);
    const user = mockUsers[id];
    if (!user) {
      throw new Error('User not found');
    }
    return { data: user };
  },

  // GET /api/users/:id/listings
  getUserListings: async (userId) => {
    await delay(400);
    const listings = mockListings.filter(l => l.sellerId === userId);
    return { data: listings };
  }
};


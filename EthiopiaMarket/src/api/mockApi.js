// Real API implementation
import apiClient from './client';

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
    const queryParams = new URLSearchParams();
    
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.region) queryParams.append('region', filters.region);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    
    const response = await apiClient(`/listings?${queryParams.toString()}`);
    return response;
  },

  // GET /api/listings/:id
  getListingById: async (id) => {
    const response = await apiClient(`/listings/${id}`);
    // Increment view count
    await apiClient(`/listings/${id}/view`, { method: 'PUT' }).catch(() => {});
    return response;
  },

  // POST /api/listings
  createListing: async (listingData) => {
    const response = await apiClient('/listings', {
      method: 'POST',
      body: JSON.stringify(listingData)
    });
    return response;
  },

  // PUT /api/listings/:id
  updateListing: async (id, listingData) => {
    const response = await apiClient(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(listingData)
    });
    return response;
  },

  // POST /api/messages
  sendMessage: async (messageData) => {
    const response = await apiClient('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData)
    });
    return response;
  },

  // POST /api/auth/register
  registerUser: async (userData) => {
    const response = await apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    return response;
  },

  // POST /api/auth/login
  loginUser: async (email, password) => {
    const response = await apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    return response;
  },

  // GET /api/users/:id
  getUserById: async (id) => {
    const response = await apiClient(`/users/${id}`);
    return response;
  },

  // GET /api/users/:id/listings
  getUserListings: async (userId) => {
    const response = await apiClient(`/users/${userId}/listings`);
    return response;
  },

  // GET /api/admin/stats
  getAdminStats: async () => {
    const response = await apiClient('/admin/stats');
    return response;
  },

  // GET /api/admin/listings/pending
  getPendingListings: async () => {
    const response = await apiClient('/admin/listings/pending');
    return response;
  },

  // PUT /api/admin/listings/:id/approve
  approveListing: async (id) => {
    const response = await apiClient(`/admin/listings/${id}/approve`, {
      method: 'PUT'
    });
    return response;
  },

  // PUT /api/admin/listings/:id/reject
  rejectListing: async (id, reason) => {
    const response = await apiClient(`/admin/listings/${id}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason })
    });
    return response;
  }
};

// Export individual functions for easier importing
export const getListings = api.getListings;
export const getListingById = api.getListingById;
export const createListing = api.createListing;
export const updateListing = api.updateListing;
export const sendMessage = api.sendMessage;
export const registerUser = api.registerUser;
export const loginUser = api.loginUser;
export const getUserById = api.getUserById;
export const getUserListings = api.getUserListings;
export const getAdminStats = api.getAdminStats;
export const getPendingListings = api.getPendingListings;
export const approveListing = api.approveListing;
export const rejectListing = api.rejectListing;


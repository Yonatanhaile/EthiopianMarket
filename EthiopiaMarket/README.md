# Ethiopia Market - Frontend

A lightweight, mobile-first Ethiopian marketplace built with React + Vite. Designed for low-bandwidth environments with PWA support, multi-language support (English & Amharic), and optimized for Ethiopian users.

## Features

✨ **Core Functionality**
- **Authentication**: OTP-based login and registration with Ethiopian phone numbers
- Browse and search listings with category and region filters
- Create and manage listings with multi-step wizard
- Contact sellers via Phone, WhatsApp, Telegram, or Email
- View seller profiles and their listings
- Seller dashboard to manage listings and view statistics (protected)
- Admin dashboard for content moderation (protected)
- Protected routes requiring authentication

🌐 **Localization**
- Full i18n support (English & Amharic)
- Ethiopian phone number formatting (+251)
- Noto Sans Ethiopic font for Amharic text

📱 **Mobile-First & Low-Bandwidth Optimized**
- Progressive Web App (PWA) support
- Lazy image loading
- Client-side image compression before upload
- Low-data mode (disable images to save bandwidth)
- Responsive design for all screen sizes

🛠️ **Technical Stack**
- React 18 + Vite
- React Router for navigation
- TanStack React Query for data fetching
- React Hook Form for form validation
- react-i18next for internationalization
- Tailwind CSS for styling
- vite-plugin-pwa for PWA capabilities
- browser-image-compression for image optimization

## Prerequisites

- Node.js 16+ and npm (or yarn/pnpm)
- Modern web browser

## Local Development Setup

### 1. Install Dependencies

```bash
cd EthiopiaMarket
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### 4. Preview Production Build

```bash
npm run preview
```

## Project Structure

```
EthiopiaMarket/
├── public/                    # Static assets
├── src/
│   ├── api/
│   │   └── mockApi.js        # Mock API implementation
│   ├── components/           # Reusable components
│   │   ├── Layout.jsx
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── SearchBar.jsx
│   │   ├── FilterBar.jsx
│   │   ├── ListingCard.jsx
│   │   ├── LazyImage.jsx
│   │   ├── ImageUpload.jsx
│   │   └── ContactButtons.jsx
│   ├── contexts/
│   │   └── DataModeContext.jsx  # Low-data mode context
│   ├── hooks/
│   │   └── useListings.js    # React Query hooks
│   ├── i18n/
│   │   ├── config.js         # i18n configuration
│   │   └── locales/
│   │       ├── en.json       # English translations
│   │       └── am.json       # Amharic translations
│   ├── pages/                # Route pages
│   │   ├── Home.jsx
│   │   ├── Login.jsx         # OTP-based authentication
│   │   ├── Register.jsx      # User registration
│   │   ├── CategoryResults.jsx
│   │   ├── ListingDetail.jsx
│   │   ├── SellerProfile.jsx
│   │   ├── SellerDashboard.jsx  # Protected
│   │   ├── AdminDashboard.jsx   # Protected
│   │   ├── CreateListing.jsx    # Protected
│   │   └── EditListing.jsx      # Protected
│   ├── utils/
│   │   ├── imageCompression.js  # Image compression utilities
│   │   └── phoneFormat.js    # Ethiopian phone formatting
│   ├── App.jsx               # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Key Features Implementation

### 1. Authentication

**OTP-Based Login:**
- Enter Ethiopian phone number (+251 or 09 format)
- Receive OTP via SMS (mocked in demo)
- Enter 6-digit OTP to login
- Session persisted in localStorage

**Registration:**
- Multi-step registration with phone verification
- Collects: Name, Phone, Email (optional)
- OTP verification required
- Auto-login after successful registration

**Protected Routes:**
- Dashboard, Create Listing, Edit Listing, Admin Dashboard
- Redirects to login page if not authenticated
- Returns to intended page after login

### 2. Multi-Language Support

Toggle between English and Amharic using the language switcher in the header. All text is stored in `src/i18n/locales/`.

```javascript
// Usage in components
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('app.name')}</h1>;
}
```

### 3. Low-Data Mode

Users can toggle low-data mode from the header (📵/📶 icon). When enabled:
- Images are not loaded
- Image placeholders are shown instead
- Preference is saved to localStorage

### 4. Image Upload with Compression

Images are automatically compressed before upload to reduce bandwidth usage:
- Max file size: 0.5MB
- Max dimensions: 1024x1024
- Quality: 80%

### 5. Ethiopian Phone Number Support

Phone numbers are formatted and validated for Ethiopian standards:
- Accepts: `+251XXXXXXXXX` or `09XXXXXXXX`
- Auto-formats for display
- WhatsApp and Telegram links are generated automatically

### 6. Form Validation

Create/Edit listing forms use React Hook Form with validation:
- Required fields
- Min/max length constraints
- Phone number format validation
- Email format validation

### 7. Multi-Step Listing Creation

The create listing wizard has 4 steps:
1. Basic Information (title, category, region)
2. Description (short & long descriptions)
3. Images (upload with compression)
4. Contact Methods (phone, WhatsApp, Telegram, email)

## API Integration

Currently using mock API (`src/api/mockApi.js`). To connect to a real backend:

### API Contract

**GET /api/listings**
```javascript
// Query params: category, region, search
Response: { data: [...], total: number }
```

**GET /api/listings/:id**
```javascript
Response: { data: {...} }
```

**POST /api/listings**
```javascript
Body: { title, category, region, shortDescription, longDescription, images, contactMethods }
Response: { data: {...} }
```

**PUT /api/listings/:id**
```javascript
Body: { ...fields to update }
Response: { data: {...} }
```

**POST /api/messages**
```javascript
Body: { listingId, message, contactInfo }
Response: { success: boolean }
```

**POST /api/auth/otp**
```javascript
Body: { phoneNumber }
Response: { success: boolean, message: string }
```

**POST /api/auth/verify-otp**
```javascript
Body: { phoneNumber, otp }
Response: { success: boolean, token: string }
```

**POST /api/auth/register**
```javascript
Body: { name, phone, email }
Response: { success: boolean, data: {...} }
```

### Replacing Mock API

1. Create `src/api/client.js` with your API client (axios/fetch)
2. Update `src/api/mockApi.js` to use real endpoints
3. Update environment variables for API base URL

```javascript
// Example with fetch
export const api = {
  getListings: async (filters) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/api/listings?${params}`);
    return response.json();
  },
  // ... other methods
};
```

## Deployment

### Netlify

1. Connect your repository to Netlify
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Deploy!

### Vercel

```bash
npm install -g vercel
vercel --prod
```

### Static Hosting (GitHub Pages, S3, etc.)

```bash
npm run build
# Upload contents of 'dist' folder to your hosting
```

### Environment Variables

Create `.env` file for environment-specific configuration:

```env
VITE_API_BASE_URL=https://api.ethiopiamarket.com
VITE_ENABLE_ANALYTICS=true
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## PWA Configuration

The app is configured as a PWA with:
- Offline support via service worker
- Install prompt for "Add to Home Screen"
- Network-first caching strategy for API calls
- Precaching of static assets

To customize PWA settings, edit `vite.config.js`:

```javascript
VitePWA({
  manifest: {
    name: 'Ethiopia Market',
    short_name: 'EthMarket',
    theme_color: '#10b981',
    // ... other settings
  }
})
```

## Ethiopian-Specific Optimizations

1. **Phone Number Formatting**: Automatic formatting for +251 numbers
2. **WhatsApp Integration**: Direct WhatsApp links for contacts
3. **Telegram Integration**: Deep links to Telegram profiles
4. **Amharic Font**: Noto Sans Ethiopic for proper Amharic rendering
5. **Region Filters**: Ethiopian regions/cities in filters
6. **Low Bandwidth Mode**: Essential for Ethiopian internet conditions

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- iOS Safari 12+
- Chrome Android 80+
- Progressive enhancement for older browsers

## Performance Optimizations

- Code splitting with React lazy loading
- Image lazy loading with intersection observer
- React Query caching (5 min stale time)
- Minimized bundle size with tree shaking
- CSS purging with Tailwind

## Known Limitations

- No real-time chat (use contact methods instead)
- No payment processing (by design)
- Mock API only (needs backend integration)
- Basic authentication (OTP endpoint ready but not fully implemented)

## Future Enhancements

- [ ] Real-time messaging system
- [ ] Push notifications for new messages
- [ ] Advanced search with price ranges
- [ ] User reviews and ratings
- [ ] Saved/favorited listings
- [ ] Report listing functionality
- [ ] Email notifications
- [ ] SMS OTP authentication

## Troubleshooting

### Images not loading
- Check browser console for errors
- Verify image URLs are accessible
- Try toggling low-data mode

### Translations not working
- Clear browser cache
- Check i18n configuration in `src/i18n/config.js`
- Verify JSON files in `src/i18n/locales/`

### Build errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### PWA not installing
- Ensure HTTPS (required for PWA)
- Check service worker registration in browser DevTools
- Verify manifest.json is accessible

## Contributing

This is a starter template. Feel free to customize and extend based on your needs!

## License

MIT License - feel free to use this for your projects.

## Support

For issues or questions, please refer to the project documentation or create an issue in the repository.

---

Built with ❤️ for Ethiopia


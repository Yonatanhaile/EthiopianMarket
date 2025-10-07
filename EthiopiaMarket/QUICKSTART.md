# Quick Start Guide

Get the Ethiopia Market frontend up and running in 5 minutes!

## 1. Install Dependencies

```bash
cd EthiopiaMarket
npm install
```

This will install all required packages including:
- React, React Router, React Query
- Tailwind CSS
- react-i18next for translations
- React Hook Form for forms
- browser-image-compression for image optimization
- vite-plugin-pwa for PWA support

## 2. Start Development Server

```bash
npm run dev
```

The app will open at http://localhost:3000

## 3. Explore the Features

### Language Switching
- Click the language button in the header (አማ/EN) to switch between English and Amharic

### Low-Data Mode
- Click the data mode icon (📵/📶) in the header to toggle image loading on/off
- Perfect for testing low-bandwidth scenarios

### Browse Listings
- Home page shows recent listings
- Click category cards to filter by category
- Use the search bar to find specific items

### Create a Listing
1. Click "Create Listing" button on the home page or dashboard
2. Fill out the 4-step wizard:
   - Step 1: Title, category, region
   - Step 2: Short and long descriptions
   - Step 3: Upload images (automatically compressed)
   - Step 4: Contact methods (phone, WhatsApp, Telegram, email)
3. Submit and view your listing

### View Listing Details
- Click any listing card to see full details
- See contact options (phone, WhatsApp, Telegram, email)
- View seller profile

### Dashboard
- Go to /dashboard to see seller dashboard
- View your listings stats
- Edit existing listings

### Admin Dashboard
- Go to /admin for moderation interface
- Approve/reject pending listings
- View system statistics

## 4. Test Ethiopian-Specific Features

### Phone Numbers
Try these formats when creating listings:
- +251911234567
- 0911234567

Both will be validated and formatted correctly.

### WhatsApp Links
When you add a WhatsApp number, it creates a direct chat link that works on mobile and desktop.

### Telegram
Add @username format for Telegram contacts.

### Amharic Support
Switch to Amharic (አማ) to see:
- Ethiopian font rendering (Noto Sans Ethiopic)
- Translated interface
- Right-to-left text handling for Amharic

## 5. Build for Production

```bash
npm run build
```

Creates optimized build in `dist` folder ready for deployment.

## Common Mock Data

The app comes with sample listings:
- iPhone 13 Pro (Electronics, Addis Ababa)
- Toyota Corolla 2015 (Vehicles, Addis Ababa)
- 2 Bedroom Apartment (Real Estate, Addis Ababa)

## API Integration

Currently using mock API. To connect to your backend:
1. Update `src/api/mockApi.js` with real API calls
2. Set `VITE_API_BASE_URL` in environment variables
3. Implement authentication as needed

## Troubleshooting

**Port already in use?**
```bash
npm run dev -- --port 3001
```

**Images not compressing?**
- Check browser console for errors
- Ensure files are valid images (JPEG, PNG, WebP)

**Translations not showing?**
- Clear browser cache
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## Next Steps

1. Customize branding (colors in `tailwind.config.js`)
2. Add your logo to `Header.jsx`
3. Configure PWA icons in `vite.config.js`
4. Connect to your backend API
5. Deploy to Netlify, Vercel, or your hosting platform

## File Organization Tips

- **Components**: Reusable UI components in `src/components/`
- **Pages**: Route-specific pages in `src/pages/`
- **Translations**: Edit `src/i18n/locales/en.json` and `am.json`
- **Styles**: Tailwind classes in components, global styles in `src/index.css`
- **API**: Mock API in `src/api/mockApi.js`, hooks in `src/hooks/`

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [TanStack Query](https://tanstack.com/query)

Happy coding! 🚀


# PhotoLens - Photography & Event Management Platform

A modern platform connecting customers with professional photographers for events, weddings, and special occasions.

## 🌟 Features

- **Find Photographers**: Browse 500+ verified professional photographers
- **Equipment Rentals**: Rent cameras, drones, lighting, and studio equipment  
- **Photo Locations**: Discover and book stunning photography locations
- **Event Management**: End-to-end booking and event coordination
- **Portfolio Galleries**: View photographer portfolios and customer stories
- **Reviews & Ratings**: Authentic customer feedback system

## 🚀 Demo Credentials

### Test Customer Account
- **Email**: customer@demo.com
- **Password**: demo123
password_db = "yt30a4eMBYBt3eMn"


### Test Photographer Account  
- **Email**: photographer@demo.com
- **Password**: demo123

## 💻 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui with custom design system
- **Backend**: Supabase (Database, Authentication, Storage)
- **Routing**: React Router v6
- **State Management**: TanStack Query
- **Styling**: Custom design system with teal accent colors

## 🎨 Design System

- **Primary Color**: Teal (#2DD4BF)
- **Typography**: Inter font family
- **Style**: Modern, clean, minimal (Airbnb + Swiggy inspired)
- **Responsive**: Mobile-first design approach

## 📱 User Flows

### Customer Journey
1. Landing page with hero section
2. Registration/Login with role selection
3. Search photographers by location, date, type
4. View photographer profiles and portfolios
5. Book services and manage events
6. Access shared galleries

### Photographer Journey
1. Professional registration with portfolio setup
2. Dashboard for managing bookings and calendar
3. Upload and organize portfolio content
4. Manage rental equipment listings
5. Chat with customers and share galleries
6. Add photography location recommendations

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📄 Project Structure

```
src/
├── components/ui/          # Reusable UI components
├── pages/                  # Page components
├── assets/                 # Images and static assets
├── lib/                    # Utilities and helpers
└── integrations/           # Supabase integration
```

## 🌍 Deployment

### Vercel Configuration

This project is configured for deployment on Vercel with proper SPA routing support:

1. **vercel.json**: Handles client-side routing for all routes
2. **_redirects**: Backup configuration for SPA routing
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`

### Route Configuration

The following routes are configured and should work on Vercel:
- `/event/:eventId/register` - Event registration page
- `/event/:eventId/waiting` - Event waiting/results page  
- `/event/:eventId/results` - Event results page
- `/admin/dashboard` - Admin dashboard
- All other application routes

### Troubleshooting 404 Errors

If you encounter 404 errors on Vercel:
1. Ensure `vercel.json` is in the root directory
2. Check that `_redirects` exists in the `public/` directory
3. Verify the build output includes all necessary files
4. Test routes locally with `npm run preview`

## 💻 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 📋 Roadmap

### Phase 1 (MVP) ✅
- [x] Landing page with hero section
- [x] Authentication system
- [x] Basic photographer search
- [x] Profile pages
- [x] Equipment rental listings

### Phase 2 (Upcoming)
- [ ] Real-time chat system
- [ ] Payment integration
- [ ] Advanced booking calendar
- [ ] AI-powered photo organization
- [ ] Mobile app (React Native)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support or questions, contact us at support@photolens.app

---

Built with ❤️ using Lovable
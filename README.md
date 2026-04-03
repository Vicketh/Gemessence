# 💎 Gemessence - Luxury Jewelry E-Commerce Platform

A premium jewelry e-commerce platform built with modern web technologies, featuring a sophisticated dark theme with royal gold and dark red accents.

## ✨ Features

### 🎨 **Modern Design**
- **Dark Theme**: Matte-black base with royal gold (#C9A227) and dark red (#800000) accents
- **Interactive Hero Slideshow**: 3 Gemini-generated hero images with smooth transitions
- **Responsive Design**: Mobile-first approach with seamless desktop experience
- **Glass Morphism**: Modern UI elements with backdrop blur effects

### 🛍️ **E-Commerce Functionality**
- **Product Catalog**: Interactive product cards with hover effects and quick actions
- **Shopping Cart**: Persistent cart with session management
- **User Authentication**: Secure login/register system
- **Order Management**: Complete order lifecycle tracking
- **Wishlist**: Save favorite items for later

### 🎛️ **Admin Dashboard**
- **Product Management**: Add, edit, delete products with image upload
- **User Management**: View user details, suspend/reactivate accounts
- **Review Moderation**: Approve reviews and feature them on homepage
- **Analytics**: Revenue tracking, sales trends, customer growth
- **Offer Management**: Create discounts and promotional campaigns

### 📱 **Customer Engagement**
- **WhatsApp Integration**: Floating WhatsApp button (+254797534189)
- **Customer Reviews**: Star ratings and testimonials
- **Multi-Action FAB**: Quick access to cart, wishlist, contact options
- **Real-time Notifications**: Toast notifications for user actions

### 🔧 **Technical Features**
- **TypeScript**: Full type safety across the application
- **React 18**: Modern React with hooks and context
- **Vite**: Lightning-fast development and build
- **TailwindCSS**: Utility-first styling with custom theme
- **Framer Motion**: Smooth animations and transitions
- **Recharts**: Interactive data visualization
- **Express.js**: RESTful API backend
- **PostgreSQL**: Robust database with Drizzle ORM

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vicketh/Gemessence.git
   cd Gemessence
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your database credentials:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/gemessence
   ADMIN_PASSWORD=your_secure_admin_password
   ADMIN_EMAIL=admin@gemessence.co.ke
   PORT=5000
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5000
   - Admin Dashboard: http://localhost:5000/admin

## 📁 Project Structure

```
Gemessence/
├── client/                 # Frontend React application
│   ├── public/            # Static assets and images
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
├── server/                # Backend Express application
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   └── index.ts           # Server entry point
├── shared/                # Shared types and schemas
└── attached_assets/       # Product images and assets
```

## 🎨 Design System

### Color Palette
- **Primary Gold**: `#C9A227` (Royal Gold)
- **Secondary Red**: `#800000` (Dark Red)
- **Background**: `#0a0a0a` (Matte Black)
- **Accent Gold**: `#E8C84A` (Bright Gold)
- **Accent Red**: `#A00000` (Bright Red)

### Typography
- **Display Font**: Playfair Display (Serif)
- **Body Font**: Plus Jakarta Sans (Sans-serif)
- **Logo Font**: Palatino Linotype (Serif Italic)

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema

## 🚀 Deployment

The project is configured for automatic deployment to GitHub Pages via GitHub Actions.

### Manual Deployment
1. Build the project: `npm run build`
2. Deploy the `dist/public` folder to your hosting service

### GitHub Pages
The repository includes a GitHub Actions workflow that automatically:
- Builds the project on every push to main
- Deploys to GitHub Pages
- Handles static asset optimization

## 🔐 Admin Access

Default admin credentials (change in production):
- **Username**: admin
- **Password**: Set via `ADMIN_PASSWORD` environment variable

## 📱 WhatsApp Integration

The platform includes a floating WhatsApp button for customer support:
- **Phone Number**: +254797534189 (configurable)
- **Auto-message**: Pre-filled inquiry message
- **Responsive**: Works on all devices

## 🌟 Key Features Showcase

### Interactive Product Cards
- 3D hover effects with image scaling
- Quick action buttons (wishlist, view, cart)
- Star ratings and review counts
- Smooth micro-interactions

### Hero Slideshow
- Auto-play with manual controls
- Smooth fade and scale transitions
- Progress indicators and play/pause
- Responsive design

### Admin Dashboard
- Comprehensive product management
- User account control
- Review moderation system
- Real-time analytics and charts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Modern luxury jewelry websites
- **Logo Design**: Custom SVG implementation
- **Product Images**: Chain jewelry collection
- **Icons**: Lucide React icon library
- **Animations**: Framer Motion library

---

**Built with ❤️ for luxury jewelry enthusiasts**

*Gemessence - Where craftsmanship meets digital excellence*
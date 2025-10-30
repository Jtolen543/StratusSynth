# Next.js SaaS Boilerplate

A modern, production-ready Next.js boilerplate with authentication, modern UI animations, and SaaS-style design patterns. Built with TypeScript, Tailwind CSS, and Framer Motion for smooth, professional user experiences.

## ✨ Features

- **🔐 Complete Authentication System**
  - Email/password authentication
  - Social login (Google, GitHub, Discord)
  - Two-factor authentication (2FA)
  - Password reset functionality
  - Passkey support for passwordless authentication

- **🎨 Modern UI/UX**
  - Framer Motion animations and transitions
  - Responsive design with Tailwind CSS
  - Dark/light mode support
  - Glass morphism effects
  - Scroll-based animations
  - Micro-interactions and hover effects

- **⚡ Performance & Developer Experience**
  - Next.js 15 with App Router
  - TypeScript for type safety
  - Turbopack for fast development
  - Optimized bundle size
  - SEO-friendly structure

- **🛠️ Built-in Components**
  - Animated cards and forms
  - Scroll progress indicator
  - Modern button variants
  - Responsive navigation
  - Profile management system

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd nextjs-saas-boilerplate
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🎯 Customization

### Branding
- Update the app name in `src/components/header.tsx` and `src/components/footer.tsx`
- Modify the logo and colors in the design system
- Customize the landing page content in `src/app/page.tsx`

### Styling
- Colors and themes are defined in `src/app/globals.css`
- Component styles use Tailwind CSS classes
- Animation variants are in individual component files

### Authentication
- Configure providers in your authentication setup
- Customize email templates in `src/lib/emails/`
- Modify user data structure as needed

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── profile/           # User profile management
│   └── globals.css        # Global styles and animations
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── animated-card.tsx # Custom animated components
├── lib/                  # Utility functions and configurations
└── db/                   # Database schemas and connections
```

## 🎨 Animation System

The boilerplate includes a comprehensive animation system:

- **Scroll Animations**: Elements animate as they come into view
- **Hover Effects**: Interactive elements with smooth transitions
- **Page Transitions**: Smooth navigation between pages
- **Loading States**: Animated loading indicators
- **Micro-interactions**: Button presses, form focus states

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run migrate:gen` - Generate database migrations
- `npm run migrate:dev` - Run development migrations

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Better Auth](https://www.better-auth.com/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

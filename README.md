# SkyCart 🛒

SkyCart is a modern, fast, and responsive grocery delivery web application simulation built with **React 19**, **TypeScript**, and **Tailwind CSS**. It simulates a seamless 15-minute drone delivery service for fresh, locally sourced groceries.

## 🚀 Features

- **Product Catalog:** Browse a wide variety of fresh groceries and essentials.
- **Search & Filtering:** Quickly find products with real-time search, category filters, and sorting by price or customer rating.
- **Shopping Cart:** Add, remove, and update quantities of items in the cart. Real-time updates across the app.
- **Smart Checkout System:** 
  - Subtotal and estimated tax calculations.
  - Automatic threshold discounts (10% off on $50+, 20% off on $100+).
  - Dynamic delivery fee calculations (Free delivery over $35).
- **Coupon System:** Apply promo codes (e.g., `SKY35`, `FRESH5`) for additional discounts.
- **Drone Delivery Simulation:** Seamless checkout experience simulating a futuristic drone delivery.
- **State Management:** Fast, centralized state management using **Zustand**.
- **Responsive UI:** A premium, dark-mode inspired UI crafted with Tailwind CSS v4.

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Bundler:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Routing:** [React Router DOM](https://reactrouter.com/)
- **Form Handling:** [React Hook Form](https://react-hook-form.com/) & [Yup](https://github.com/jquense/yup)
- **Data Fetching:** [Axios](https://axios-http.com/)

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   ```

2. Navigate into the project directory:
   ```bash
   cd myapp
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser to view the app.

## 📜 Available Scripts

- `npm run dev`: Starts the development server with Hot Module Replacement (HMR).
- `npm run build`: Compiles TypeScript and builds the app for production into the `dist` folder.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs ESLint to check for code quality and style issues.

## 💡 Usage Highlights

- Try out the search bar on the homepage to find items instantly.
- Test the coupon system in the cart by applying the codes `SKY35` (35% off) or `FRESH5` ($5 off flat).
- Reach a $35 discounted subtotal to unlock free delivery!

---

*This project was created as an assessment project.*

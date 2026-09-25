import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth";

// ⚡ Regular imports for layout containers to prevent visual layout flicker
import PublicLayout from "./components/PublicLayout";
import RequireAuth from "./admin/RequireAuth";
import AdminLayout from "./admin/AdminLayout";

// ⚡ Code Splitting: Public Routes (Loaded dynamically on demand)
const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

// ⚡ Code Splitting: Admin Routes (Heavy dependencies isolated from regular visitors)
const Login = lazy(() => import("./admin/Login"));
const Dashboard = lazy(() => import("./admin/Dashboard"));
const CategoriesList = lazy(() => import("./admin/CategoriesList"));
const CategoryForm = lazy(() => import("./admin/CategoryForm"));
const ProductsList = lazy(() => import("./admin/ProductsList"));
const ProductForm = lazy(() => import("./admin/ProductForm"));
const Settings = lazy(() => import("./admin/Settings"));

export default function App() {
  return (
    <AuthProvider>
      {/* 
        The Suspense fallback acts as a global placeholder while the chunk loads. 
        You can replace this inline div with a custom loading spinner component.
      */}
      <Suspense fallback={<div className="loading-fallback"></div>}>
        <Routes>
          {/* Public Website Flow */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/collections/:slug" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin Login */}
          <Route path="/admin/login" element={<Login />} />

          {/* Protected Dashboard Flow */}
          <Route element={<RequireAuth />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="categories" element={<CategoriesList />} />
              <Route path="categories/:id" element={<CategoryForm />} />
              <Route path="products" element={<ProductsList />} />
              <Route path="products/:id" element={<ProductForm />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}
import "./App.css";
import HomePage from "./pages/HomePage/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import ProductPage from "./pages/ProductPage/ProductPage";
import ShoppingCartPage from "./pages/ShoppingCartPage/ShoppingCartPage";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage";
import RefreshContextProvider from "./context/RefreshContextProvider";

function App() {
  return (
    <RefreshContextProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/shoppingCart/:id" element={<ShoppingCartPage />} />
          <Route path="/checkout/:cartId" element={<CheckoutPage />} />
        </Routes>
      </BrowserRouter>
    </RefreshContextProvider>
  );
}

export default App;

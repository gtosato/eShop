import { useEffect, useState } from "react";
import { getAllProducts } from "../../../services/products";
import ProductList from "../../containers/ProductList/ProductList";
import styles from "./HomePage.module.scss";
import Carousel from "../../components/Carousel/Carousel";

const HomePage = () => {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAllProducts().then((response) => {
      setLoading(false);
      setProducts(response);
    });
  }, []);
  return (
    <main>
      <Carousel />
      <h1 className={styles.title}>Product Listing</h1>
      {loading && <p>Loading...</p>}
      {!loading && products && <ProductList products={products} />}
    </main>
  );
};

export default HomePage;

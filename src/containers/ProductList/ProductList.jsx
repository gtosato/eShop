import ProductCard from "../../components/ProductCard/ProductCard";
import styles from "./ProductList.module.scss";
const ProductList = ({ products }) => {
  return (
    <section className={styles.card}>
      {products &&
        products.map((product) => {
          return (
            <ProductCard
              key={product.id}
              name={product.name}
              image={product.image}
              color={product.color}
              size={product.size}
              price={product.price}
              id={product.id}
              isFavourite={product.isFavourite}
            />
          );
        })}
    </section>
  );
};

export default ProductList;

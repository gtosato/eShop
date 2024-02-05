import { Link, useParams } from "react-router-dom";
import ShoppingCartList from "../../containers/ShoppingCartList/ShoppingCartList";
import { useEffect, useState, useContext } from "react";
import { getAllCartItems } from "../../../services/products";
import styles from "./ShoppingCartPage.module.scss";
import { RefreshContext } from "../../context/RefreshContextProvider";
const ShoppingCartPage = () => {
  const [cartItems, setCartItems] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { refresh } = useContext(RefreshContext);

  //   console.log(useParams());

  const pathVariables = useParams();
  const id = pathVariables.id;

  useEffect(() => {
    setLoading(true);
    getAllCartItems(id)
      .then((res) => setCartItems(res))
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, [id, refresh]);
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>My Cart</h1>
      <ShoppingCartList cartItems={cartItems} />
      <div className={styles.buttonContainer}>
        <Link to="/">
          <button className={styles.button}>Continue Shopping</button>
        </Link>
        <Link to={`/checkout/${id}`}>
          <button className={styles.button}>Checkout</button>
        </Link>
      </div>
    </main>
  );
};

export default ShoppingCartPage;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddOrderForm from "../../components/AddOrderForm/AddOrderForm";
import { getCartItems, addNewOrder } from "../../../services/products.js";
import styles from "./CheckoutPage.module.scss";

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const { cartId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const items = await getCartItems(cartId);
        setCartItems(items);
      } catch (error) {
        console.error("Error fetching cart items:", error.message);
      }
    };

    fetchCartItems();
  }, [cartId]);

  const submitHandler = (data) => {
    // console.log(data);
    addNewOrder(data)
      .then((res) => {
        console.log(res);
        navigate("/");
      })
      .catch((e) => console.error());
  };

  return (
    <main className={styles.main}>
      <div className={styles.mainContainerLeft}>
        <AddOrderForm submitHandler={submitHandler} cartItems={cartItems} />
      </div>
      <div className={styles.mainContainerRight}>
        {cartItems.map((item) => (
          <div key={item.id} className={styles.product}>
            <img src={item.image} className={styles.itemImage} alt="" />
            <p className={styles.productInfo}>{item.name}</p>
            <p className={styles.productInfo}>{item.quantity}</p>
            <p className={styles.productInfo}>${item.price}</p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default CheckoutPage;

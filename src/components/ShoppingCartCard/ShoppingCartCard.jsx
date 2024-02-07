import styles from "./ShoppingCartCard.module.scss";
import {
  deleteCartItemAndUpdateQtyInStock,
  decreaseCartItemByOne,
} from "../../../services/products.js";
import { useEffect, useState, useRef } from "react";

const ShoppingCartCard = ({
  cartId,
  image,
  name,
  price,
  productId,
  quantity,
  subTotal,
  refresh,
  setRefresh,
}) => {
  const [decrementBtnClicked, setDecrementBtnClicked] = useState(false);
  const initialRender = useRef(true);

  const deleteItem = async () => {
    await deleteCartItemAndUpdateQtyInStock(cartId, productId);

    // Refresh page after deletion
    setRefresh(!refresh);
  };

  const incrementQuantity = () => {
    alert("This button still requires implementation.");
  };

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    const updateStock = async () => {
      try {
        await decreaseCartItemByOne(productId, price);
        setRefresh(!refresh);
      } catch (error) {
        console.error("Error updating stock:", error);
      }
    };
    updateStock();
  }, [decrementBtnClicked]);

  const decrementQuantity = () => {
    if (quantity > 1) {
      setDecrementBtnClicked(!decrementBtnClicked);
    }
  };

  return (
    <article className={styles.card}>
      <img src={image} className={styles.image} alt="product image" />
      <h4 className={styles.productName}>{name}</h4>
      <p className={styles.productPrice}>${price.toFixed(2)}</p>
      <p className={styles.inputBoxContainer}>
        <button className={styles.changeQtyBtn} onClick={decrementQuantity}>
          -
        </button>
        <input
          disabled
          className={styles.inputBox}
          type="number"
          value={quantity}
        />
        <button className={styles.changeQtyBtn} onClick={incrementQuantity}>
          +
        </button>
      </p>
      <p className={styles.productSubTotal}>${subTotal.toFixed(2)}</p>
      <p className={styles.deleteBtnContainer}>
        <a onClick={deleteItem} className={styles.deleteBtn}>
          X
        </a>
      </p>
    </article>
  );
};

export default ShoppingCartCard;

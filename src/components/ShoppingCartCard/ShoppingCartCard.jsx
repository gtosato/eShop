import styles from "./ShoppingCartCard.module.scss";
import {
  deleteCartItemAndUpdateQtyInStock,
  getProductById,
  updateCartItemAndProductQty,
} from "../../../services/products.js";
import { useEffect, useState, useContext } from "react";
import { RefreshContext } from "../../context/RefreshContextProvider";

const ShoppingCartCard = ({
  cartId,
  image,
  name,
  price,
  productId,
  quantity,
  subTotal,
}) => {
  const [qty, setQty] = useState(0);
  const { refresh } = useContext(RefreshContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const product = await getProductById(productId);
        const qtyInStock = product.qtyInStock;

        if (qty > qtyInStock) {
          alert(
            "Not enough stock available. Only " + qtyInStock + " available."
          );
          setQty(qtyInStock);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchData();
  }, [productId, qty, refresh]);

  const handleQuantityChange = async (e) => {
    const newQuantity = parseInt(e.target?.value || 0);

    // Perform logic to update qtyInStock and quantity
    await updateCartItemAndProductQty(
      productId,
      cartId,
      quantity,
      price,
      newQuantity
    );

    // Update local state with the new quantity
    setQty(newQuantity);
  };

  const deleteItem = async () => {
    await deleteCartItemAndUpdateQtyInStock(cartId, productId);

    // Refresh the page after deletion
    window.location.reload();
  };

  const handleNegativeAndDecimal = (e) => {
    let myCharacterCode = e.keyCode;

    if (myCharacterCode === 189 || myCharacterCode === 190) {
      e.preventDefault();
    }
  };

  const incrementQuantity = () => {
    alert("This button still requires implementation.");
    // const newQuantity = qty + 1;
    // handleQuantityChange(newQuantity);
  };

  const decrementQuantity = () => {
    alert("This button still requires implementation.");
    // const newQuantity = Math.max(qty - 1, 0);
    // handleQuantityChange(newQuantity);
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
          defaultValue={quantity}
          onKeyDown={handleNegativeAndDecimal}
          onChange={handleQuantityChange}
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

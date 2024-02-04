import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addProductToCart, getProductById } from "../../../services/products";
import styles from "./ProductPage.module.scss";
import { uniqueCartId } from "../../../config/firebase.js";

const ProductPage = () => {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  //   console.log(useParams());

  const pathVariables = useParams();
  const id = pathVariables.id;

  useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then((res) => setProduct(res))
      .catch((e) => setError(e))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const qtyInput = document.querySelector("#qtyToPurchase");
    let quantity = parseInt(qtyInput.value);

    // default quantity to 1 if not entered
    if (!quantity) {
      quantity = 1;
    }

    // checkProductExistsInCart(id, quantity);

    addProductToCart({ product }, quantity).then(() =>
      navigate(`/shoppingCart/${uniqueCartId}`)
    );
  };

  const handleNegativeAndDecimal = (e) => {
    let myCharacterCode = e.keyCode;

    if (myCharacterCode === 189 || myCharacterCode === 190) {
      e.preventDefault();
    }
  };

  return (
    <main>
      {loading && <p>Loading....</p>}
      {!loading && error && <p>{error.message}</p>}
      {!loading && product && (
        <form onSubmit={handleSubmit} className={styles.productContainer}>
          <div className={styles.productContainerLeft}>
            <img src={product.image} className={styles.image} alt="" />
          </div>
          <div className={styles.productContainerRight}>
            <p className={styles.title}>{product.name}</p>
            <p className={styles.price}>${product.price}</p>
            <div className={styles.addQuantity}>
              <label className={styles.qtyLabel} htmlFor="qtyToPurchase">
                QTY
              </label>
              <input
                className={styles.input}
                type="number"
                min="1"
                max={product.qtyInStock}
                name="qtyToPurchase"
                id="qtyToPurchase"
                placeholder="1"
                onKeyDown={handleNegativeAndDecimal}
              />
              <button className={styles.addToCartBtn} type="submit">
                Add to Cart
              </button>
              <p className={styles.productTextTitles}>Description</p>
              <div className={styles.productText}>{product.description}</div>
              <p className={styles.productTextTitles}>Color</p>
              <div className={styles.productText}>{product.color}</div>{" "}
              <p className={styles.productTextTitles}>Size</p>
              <div className={styles.productText}>{product.size}</div>{" "}
            </div>
          </div>
        </form>
      )}
    </main>
  );
};

export default ProductPage;

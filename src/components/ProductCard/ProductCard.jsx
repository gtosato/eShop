import { Link } from "react-router-dom";
import styles from "./ProductCard.module.scss";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../../config/firebase.js";

const ProductCard = ({
  image = "",
  name = "Name not provided",
  color = "",
  size = "",
  price = "Price not provided",
  id = "",
  isFavourite,
}) => {
  const [favourite, setFavourite] = useState(isFavourite);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "products", id), (doc) => {
      if (doc.exists()) {
        setFavourite(doc.data().isFavourite);
      }
    });
    return () => unsubscribe();
  }, [id]);

  const toggleFavourite = async (e) => {
    e.preventDefault();

    try {
      // Update the isFavourite field in the Firestore document
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, { isFavourite: !favourite });

      // If the update is successful, update the local state using the updated value
      const updatedDoc = await getDoc(productRef);
      const updatedIsFavourite = updatedDoc.data().isFavourite;
      setFavourite(updatedIsFavourite);
    } catch (error) {
      console.error("Error updating isFavourite:", error);
    }
  };

  return (
    <>
      <Link className={styles.link} to={`/product/${id}`}>
        <article className={styles.card}>
          <img src={image} className={styles.image} alt="product image" />
          {favourite && (
            <div
              className={styles.favouriteContainer}
              onClick={toggleFavourite}
            >
              <i className="fa fa-heart" aria-hidden="true"></i>
            </div>
          )}
          {!favourite && (
            <div
              className={styles.favouriteContainer}
              onClick={toggleFavourite}
            >
              <i className="fa fa-heart-o" aria-hidden="true"></i>
            </div>
          )}
          <div>
            <h4 className={styles.productName}>{name}</h4>
          </div>
          <div>
            <p>{color}</p>
          </div>
          <div>
            <p>{size}</p>
          </div>
          <div>
            <p className={styles.price}>${price}</p>
          </div>
        </article>
      </Link>
    </>
  );
};

export default ProductCard;

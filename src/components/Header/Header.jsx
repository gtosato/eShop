import { Link } from "react-router-dom";
import { uniqueCartId } from "../../../config/firebase.js";
import styles from "./Header.module.scss";

const Header = () => {
  const cartStyles = {
    fontSize: "25px",
    color: "#1f73ff",
  };

  return (
    <header className={styles.header}>
      <div className={styles.socialMediaContainer}>
        <div className={styles.socialMediaIcon}>
          <i className="fa fa-facebook"></i>
        </div>
        <div className={styles.socialMediaIcon}>
          <i className="fa fa-twitter"></i>
        </div>
        <div className={styles.socialMediaIcon}>
          <i className="fa fa-youtube"></i>
        </div>
      </div>
      <div className={styles.logoContainer}>
        <Link to={"/"}>
          <img
            className={styles.logo}
            src="https://www.deadeyedarts.com/media/logo/websites/1/logo.png"
            alt=""
          />
        </Link>
      </div>
      <div className={styles.shoppingCartContainer}>
        <div className={styles.shoppingCartIcon}>
          <Link to={`/shoppingCart/${uniqueCartId}`}>
            <i className="fa fa-shopping-cart" style={cartStyles}></i>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;

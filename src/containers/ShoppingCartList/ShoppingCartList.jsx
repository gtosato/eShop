import { useEffect } from "react";
import ShoppingCartCard from "../../components/ShoppingCartCard/ShoppingCartCard";

const ShoppingCartList = ({ cartItems, refresh, setRefresh }) => {
  return (
    <section>
      {cartItems &&
        cartItems.map((item) => {
          return (
            <ShoppingCartCard
              key={item.id}
              cartId={item.cartId}
              image={item.image}
              name={item.name}
              price={item.price}
              productId={item.productId}
              quantity={item.quantity}
              subTotal={item.subTotal}
              refresh={refresh}
              setRefresh={setRefresh}
            />
          );
        })}
    </section>
  );
};

export default ShoppingCartList;

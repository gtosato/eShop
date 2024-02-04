import ShoppingCartCard from "../../components/ShoppingCartCard/ShoppingCartCard";

const ShoppingCartList = ({ cartItems }) => {
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
            />
          );
        })}
    </section>
  );
};

export default ShoppingCartList;

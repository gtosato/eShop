import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import { db, uniqueCartId } from "../config/firebase";

export const getAllProducts = async () => {
  const querySnapshot = await getDocs(collection(db, "products"));

  const dataToReturn = querySnapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    };
  });
  return dataToReturn;
};

export const getProductById = async (id) => {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error("Product not found");
  }

  return { id: docSnap.id, ...docSnap.data() };
};

// ******************** SHOPPING CART - MINUS BUTTON ***************************

const increaseQtyInStockByOne = async (productId) => {
  const productRef = doc(db, "products", productId);
  const productDoc = await getDoc(productRef);
  const currentQtyInStock = productDoc.data().qtyInStock;

  await updateDoc(productRef, {
    qtyInStock: currentQtyInStock + 1,
  });
};

export const decreaseCartItemByOne = async (id, price) => {
  // find existing item in cart
  const cartQuery = query(
    collection(db, "cartItems"),
    where("productId", "==", id)
  );
  const cartQuerySnapshot = await getDocs(cartQuery);
  // find existing id for cartItem record - should only be 1 record for each product
  const existingCartItem = cartQuerySnapshot.docs[0];
  const currentProductQty = existingCartItem.data().quantity;

  const newQuantity = parseInt(currentProductQty - 1);
  const newSubTotal = parseFloat(newQuantity * price);

  // Update the existing cartItem with the new quantity and subtotal.
  await updateDoc(doc(db, "cartItems", existingCartItem.id), {
    quantity: newQuantity,
    subTotal: newSubTotal,
  });

  // Increase stock by 1 in Products collection
  increaseQtyInStockByOne(id);
};

const decreaseQtyInStock = async (productId, quantity) => {
  const productRef = doc(db, "products", productId);
  const productDoc = await getDoc(productRef);
  const currentQtyInStock = productDoc.data().qtyInStock;
  await updateDoc(productRef, {
    qtyInStock: currentQtyInStock - parseInt(quantity),
  });
};

const addNewCartItem = async ({
  id,
  cartID,
  image,
  name,
  price,
  quantity,
  subTotal,
}) => {
  const docRef = await addDoc(collection(db, "cartItems"), {
    cartId: cartID,
    productId: id,
    image: image,
    name: name,
    price: price,
    quantity: quantity,
    subTotal: subTotal,
  });
  console.log("Document written with ID: ", docRef.id);

  // Decrease qtyInStock in products collection
  await decreaseQtyInStock(id, quantity);
};

const updateExistingCartItem = async (existingCartItem, price, quantity) => {
  const existingQuantity = existingCartItem.data().quantity;
  const newQuantity = existingQuantity + parseInt(quantity);
  const newSubTotal = newQuantity * price;

  // Update the existing document with the new quantity and subtotal.
  await updateDoc(doc(db, "cartItems", existingCartItem.id), {
    quantity: newQuantity,
    subTotal: newSubTotal,
  });
  console.log("Product already exists in cart.  Value has been changed.");

  // Decrease qtyInStock in products collection
  await decreaseQtyInStock(existingCartItem.data().productId, quantity);
};

export const addProductToCart = async ({ product }, quantity) => {
  const { id, image, name, price } = product;
  const cartID = uniqueCartId; // uniqueId initialised in firebase.js
  const subTotal = parseInt(quantity) * price;

  const cartQuery = query(
    collection(db, "cartItems"),
    where("productId", "==", id)
  );
  const cartQuerySnapshot = await getDocs(cartQuery);

  if (cartQuerySnapshot.empty) {
    await addNewCartItem({
      id,
      cartID,
      image,
      name,
      price,
      quantity,
      subTotal,
    });
  } else {
    // Product already exists in the cart. Update the quantity.
    const existingCartItem = cartQuerySnapshot.docs[0];
    await updateExistingCartItem(existingCartItem, price, quantity);
  }
};

export const getAllCartItems = async () => {
  // uniqueId initialised in firebase.js
  const q = query(
    collection(db, "cartItems"),
    where("cartId", "==", uniqueCartId)
  );

  const querySnapshot = await getDocs(q);

  const dataToReturn = querySnapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    };
  });

  return dataToReturn;
};

export const deleteCartItemAndUpdateQtyInStock = async (cartId, productId) => {
  // Get product in the shopping cart
  const cartItemQuery = query(
    collection(db, "cartItems"),
    where("productId", "==", productId),
    where("cartId", "==", cartId)
  );

  const cartItemQuerySnapshot = await getDocs(cartItemQuery);

  if (!cartItemQuerySnapshot.empty) {
    const cartItemDoc = cartItemQuerySnapshot.docs[0];
    const cartItemId = cartItemDoc.id;
    const cartItemQuantity = cartItemDoc.data().quantity;

    // Delete item from shopping cart
    await deleteDoc(doc(db, "cartItems", cartItemId));

    // Add quantity back to qtyInStock in the Products collection
    const productRef = doc(db, "products", productId);
    const productDoc = await getDoc(productRef);

    if (productDoc.exists()) {
      const currentQtyInStock = productDoc.data().qtyInStock;
      const newQtyInStock = currentQtyInStock + cartItemQuantity;

      // Update qtyInStock in the Products collection
      await updateDoc(productRef, {
        qtyInStock: newQtyInStock,
      });
    }
  }
};

const addOneToExistingCartItem = async (existingCartItem, price, quantity) => {
  const existingQuantity = existingCartItem.data().quantity;
  const newQuantity = existingQuantity + parseInt(quantity);
  const newSubTotal = newQuantity * price;

  // Update the existing document with the new quantity and subtotal.
  await updateDoc(doc(db, "cartItems", existingCartItem.id), {
    quantity: newQuantity,
    subTotal: newSubTotal,
  });
  console.log("Product already exists in cart.  Value has been changed.");

  // Decrease qtyInStock in products collection
  await decreaseQtyInStock(existingCartItem.data().productId, quantity);
};

const subtractOneFromExistingCartItem = async (
  existingCartItem,
  price,
  quantity
) => {
  const existingQuantity = existingCartItem.data().quantity;
  const newQuantity = existingQuantity + parseInt(quantity);
  const newSubTotal = newQuantity * price;

  // Update the existing document with the new quantity and subtotal.
  await updateDoc(doc(db, "cartItems", existingCartItem.id), {
    quantity: newQuantity,
    subTotal: newSubTotal,
  });
  // console.log("Product already exists in cart.  Value has been changed.");

  // Decrease qtyInStock in products collection
  await decreaseQtyInStock(existingCartItem.data().productId, quantity);
};

export const updateCartItemAndProductQty = async (
  productId,
  cartId,
  oldQuantity,
  newQuantity,
  price
) => {
  try {
    // Fetch product data from Product collection
    const productRef = doc(db, "products", productId);
    const productDoc = await getDoc(productRef);

    if (productDoc.exists()) {
      const qtyInStock = productDoc.data().qtyInStock;

      // Check if there is enough quantity in stock
      if (qtyInStock >= newQuantity - oldQuantity) {
        // Get product in the shopping cart
        const cartItemQuery = query(
          collection(db, "cartItems"),
          where("productId", "==", productId),
          where("cartId", "==", cartId)
        );

        const cartItemQuerySnapshot = await getDocs(cartItemQuery);

        if (!cartItemQuerySnapshot.empty) {
          // Product already exists in the cart. Update the quantity.
          const existingCartItem = cartItemQuerySnapshot.docs[0];

          await updateExistingCartItem(
            existingCartItem,
            price,
            parseInt(newQuantity)
          );

          // Update qtyInStock in Products collection
          const updatedQtyInStock = qtyInStock - (newQuantity - oldQuantity);
          await updateDoc(productRef, {
            qtyInStock: parseInt(updatedQtyInStock),
          });
        }
      } else {
        throw new Error("Not enough stock available.");
      }
    } else {
      throw new Error("Product not found.");
    }
  } catch (error) {
    console.error("Error updating cart item and product quantity:", error);
    throw error;
  }
};

export const getCartItems = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "cartItems"));

    const dataToReturn = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    return dataToReturn;
  } catch (error) {
    throw new Error("Error fetching cart items.");
  }
};

export const addNewOrder = async (data) => {
  // const newOrder = { ...data, additionalField: 0 };
  try {
    const docRef = await addDoc(collection(db, "orders"), data);
  } catch (e) {
    throw e;
  }
};

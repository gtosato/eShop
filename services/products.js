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

// ***************** RETRIEVE ALL PRODUCTS FROM PRODUCT COLLECTION *****************
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

// ************* RETRIEVE SPECIFIC PRODUCT FROM PRODUCT COLLECTION *****************
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

  const newQuantity = currentProductQty - 1;
  const newSubTotal = newQuantity * price;

  // Update the existing cartItem with the new quantity and subtotal.
  await updateDoc(doc(db, "cartItems", existingCartItem.id), {
    quantity: parseInt(newQuantity),
    subTotal: parseFloat(newSubTotal),
  });

  // Increase stock by 1 in Products collection
  increaseQtyInStockByOne(id);
};

// ******************** SHOPPING CART - PLUS BUTTON ***************************
const decreaseQtyInStockByOne = async (productId) => {
  const productRef = doc(db, "products", productId);
  const productDoc = await getDoc(productRef);
  const currentQtyInStock = productDoc.data().qtyInStock;

  await updateDoc(productRef, {
    qtyInStock: currentQtyInStock - 1,
  });
};

export const increaseCartItemByOne = async (id, price) => {
  // find existing item in cart
  const cartQuery = query(
    collection(db, "cartItems"),
    where("productId", "==", id)
  );
  const cartQuerySnapshot = await getDocs(cartQuery);
  // find existing id for cartItem record - should only be 1 record for each product
  const existingCartItem = cartQuerySnapshot.docs[0];
  const currentProductQty = existingCartItem.data().quantity;

  const newQuantity = currentProductQty + 1;
  const newSubTotal = newQuantity * price;

  // Update the existing cartItem with the new quantity and subtotal.
  await updateDoc(doc(db, "cartItems", existingCartItem.id), {
    quantity: parseInt(newQuantity),
    subTotal: parseFloat(newSubTotal),
  });

  // Decrease stock by 1 in Products collection
  decreaseQtyInStockByOne(id);
};

// ******** DECREASE STOCK BY LEVEL ENTERED ON PRODUCT PAGE **************
const decreaseQtyInStock = async (productId, quantity) => {
  const productRef = doc(db, "products", productId);
  const productDoc = await getDoc(productRef);
  const currentQtyInStock = productDoc.data().qtyInStock;
  await updateDoc(productRef, {
    qtyInStock: currentQtyInStock - parseInt(quantity),
  });
};

// ************** ADD NEW PRODUCT TO CART IF IT CURRENTLY DOES NOT EXIST **********
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
  // console.log("Document written with ID: ", docRef.id);

  // Decrease qtyInStock in products collection
  await decreaseQtyInStock(id, quantity);
};

// ************* UPDATE PRODUCT IN CART SINCE IT ALREADY EXISTS *****************
const updateExistingCartItem = async (existingCartItem, price, quantity) => {
  const existingQuantity = existingCartItem.data().quantity;
  const newQuantity = existingQuantity + parseInt(quantity);
  const newSubTotal = newQuantity * price;

  // Update the existing document with the new quantity and subtotal.
  await updateDoc(doc(db, "cartItems", existingCartItem.id), {
    quantity: newQuantity,
    subTotal: newSubTotal,
  });
  // console.log("Product already exists in cart.  Value has been updated.");

  // Decrease qtyInStock in products collection
  await decreaseQtyInStock(existingCartItem.data().productId, quantity);
};

// *********** THIS WILL EITHER UPDATE PRODUCT IN CART, OR ADD IF DOES NOT EXIST ************
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

// ************ RETRIEVE ALL CART ITEMS FOR SPECIFIED CART **************
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

// ****** DELETE ITEM FROM CART AND UPDATE QTY IN STOCK WHEN USER CLICKS X IN SHOPPING LIST ****
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

// ************* ADD NEW ORDER TO ORDER COLLECTION ***********
export const addNewOrder = async (data) => {
  // const newOrder = { ...data, additionalField: 0 };
  try {
    const docRef = await addDoc(collection(db, "orders"), data);
  } catch (e) {
    throw e;
  }
};

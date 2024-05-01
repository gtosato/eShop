# React e-Shop Website

This project is a mock-up of an e-Shop website. It allows users to select an item from stock, add to cart, and checkout.

<br />
Live deployment: 
<br />
https://gleeful-hummingbird-980b0a.netlify.app/

## Outline

This project performs the following:

-    Fetches Data within a React App
-    Uses react-router-dom
-    Uses Firebase/Firestore

-    Home Page
     -    This contains:
          -    A Grid of products
          -    Carousel of featured products
          -    Product Page (with id parameter), allows you to add to cart and select product variants
-    All products are stored in Firestore:
     -    The following information is stored:
          -    quantity
          -    variants (colors, sizes, etc)
          -    price per unit
          -    name
          -    image url
          -    favourited or not
               All data is stored in Firestore and fetched by the frontend, there is NO static product data in the react application

Using Firestore and react a cart system has been created. A cart page in the app contains logic to prevent users from adding items to cart that are no longer in stock. Checks are made to the current cart and the product quantity. Cart page contains the following:

-    List of products in cart

     -    Ability to change quantity of products in cart (Work in progress)
     -    Ability to remove items from cart

The site is scoped to one category of products

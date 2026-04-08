export const getCart = () => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : {};
};

export const saveCart = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('cartChange'));
};

export const addToCart = (product) => {
  const cart = getCart();
  if (cart[product.id]) {
    cart[product.id].quantity += 1;
  } else {
    cart[product.id] = {
      ...product,
      quantity: 1
    };
  }
  saveCart(cart);
};

export const removeFromCart = (productId) => {
  const cart = getCart();
  if (cart[productId]) {
    if (cart[productId].quantity > 1) {
      cart[productId].quantity -= 1;
    } else {
      delete cart[productId];
    }
  }
  saveCart(cart);
};

export const deleteFromCart = (productId) => {
  const cart = getCart();
  delete cart[productId];
  saveCart(cart);
};

export const clearCart = () => {
  saveCart({});
};

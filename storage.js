/**
 * LÊLA MODAS - Gerenciador de LocalStorage
 * Centraliza o salvamento, leitura, atualização, autenticação, favoritos e carrinho.
 */

const STORAGE_KEYS = {
  USERS: 'lela_users_db',
  CURRENT_USER: 'lela_current_session',
  FAVORITES: 'lela_user_favorites',
  CART: 'lela_user_cart'
};

const StorageService = {
  getUsers() {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  findUserByEmail(email) {
    const users = this.getUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
  },

  saveUser(userData) {
    const users = this.getUsers();
    
    if (this.findUserByEmail(userData.email)) {
      return { success: false, message: 'Já existe uma conta cadastrada com este e-mail!' };
    }

    users.push(userData);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.setCurrentUser(userData);
    return { success: true, message: 'Cadastro realizado com sucesso!' };
  },

  updateUser(updatedData) {
    let users = this.getUsers();
    const index = users.findIndex(u => u.email.toLowerCase() === updatedData.email.toLowerCase());

    if (index === -1) {
      return { success: false, message: 'Usuário não encontrado para atualização.' };
    }

    if (!updatedData.password) {
      updatedData.password = users[index].password;
    }

    users[index] = { ...users[index], ...updatedData };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.setCurrentUser(users[index]);

    return { success: true, message: 'Dados atualizados com sucesso!' };
  },

  login(email, password) {
    const user = this.findUserByEmail(email);
    if (!user) {
      return { success: false, message: 'E-mail não encontrado.' };
    }
    if (user.password !== password) {
      return { success: false, message: 'Senha incorreta.' };
    }
    this.setCurrentUser(user);
    return { success: true, user };
  },

  setCurrentUser(user) {
    const sessionData = { ...user };
    delete sessionData.password;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionData));
  },

  getCurrentUser() {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  // ================= FAVORITOS =================

  getFavorites() {
    const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
  },

  isFavorite(productId) {
    const favs = this.getFavorites();
    return favs.includes(productId);
  },

  toggleFavorite(productId) {
    let favs = this.getFavorites();
    if (favs.includes(productId)) {
      favs = favs.filter(id => id !== productId);
    } else {
      favs.push(productId);
    }
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
    return favs.includes(productId);
  },

  // ================= GERENCIAMENTO DO CARRINHO =================

  getCart() {
    const data = localStorage.getItem(STORAGE_KEYS.CART);
    return data ? JSON.parse(data) : [];
  },

  addToCart(productId, selectedSize = 'P') {
    let cart = this.getCart();
    const existingIndex = cart.findIndex(item => item.id === productId && item.size === selectedSize);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ id: productId, size: selectedSize, quantity: 1 });
    }

    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  },

  updateCartQuantity(productId, selectedSize, delta) {
    let cart = this.getCart();
    const index = cart.findIndex(item => item.id === productId && item.size === selectedSize);

    if (index > -1) {
      cart[index].quantity += delta;
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }
    }

    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  },

  removeFromCart(productId, selectedSize) {
    let cart = this.getCart();
    cart = cart.filter(item => !(item.id === productId && item.size === selectedSize));
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  },

  clearCart() {
    localStorage.removeItem(STORAGE_KEYS.CART);
  }
};
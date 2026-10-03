/**
 * LÊLA MODAS - Script Principal
 * Controle de produtos, busca em tempo real, carrinho, checkout e integração WhatsApp.
 */

// ================= CONFIGURAÇÃO DA LOJA =================
// Insira o número do WhatsApp Business da cliente com DDD (Apenas números: código do país + DDD + número)
// Exemplo: 5521999999999
const STORE_WHATSAPP_NUMBER = '5521999293091';

// Dataset de produtos com categoria, estoque e sinalização rated
const products = [
  { id: 1, title: 'Vestido Midi Floral', price: 189, category: 'Vestidos & Conjuntos', stock: 12, rated: true },
  { id: 2, title: 'Blusa Crepe Manga Longa', price: 99, category: 'Blusas & Camisetas', stock: 5, rated: true },
  { id: 3, title: 'Conjunto Alfaiataria', price: 259, category: 'Vestidos & Conjuntos', stock: 2, rated: true },
  { id: 4, title: 'Saia Plissada Elegance', price: 129, category: 'Calças & Jeans', stock: 15, rated: true },
  { id: 5, title: 'Calça Pantalona Linho', price: 179, category: 'Calças & Jeans', stock: 8, rated: true },
  { id: 6, title: 'Top Cropped Tricot', price: 79, category: 'Blusas & Camisetas', stock: 3, rated: true },
  { id: 7, title: 'Jaqueta Jeans Oversized', price: 219, category: 'Blusas & Camisetas', stock: 7, rated: false },
  { id: 8, title: 'Camisa Algodão Premium', price: 149, category: 'Blusas & Camisetas', stock: 10, rated: true },
  { id: 9, title: 'Vestido Longo Cetim', price: 299, category: 'Vestidos & Conjuntos', stock: 1, rated: true },
  { id: 10, title: 'Blazer Estruturado', price: 239, category: 'Blusas & Camisetas', stock: 6, rated: true },
  { id: 11, title: 'Shorts Alfaiataria Cinto', price: 119, category: 'Calças & Jeans', stock: 9, rated: false },
  { id: 12, title: 'Macacão Pantalona', price: 229, category: 'Vestidos & Conjuntos', stock: 4, rated: true },
  { id: 13, title: 'Regata Seda Pura', price: 89, category: 'Blusas & Camisetas', stock: 11, rated: false },
  { id: 14, title: 'Cardigan Alongado', price: 159, category: 'Blusas & Camisetas', stock: 14, rated: true },
  { id: 15, title: 'Vestido Canelado Casual', price: 139, category: 'Vestidos & Conjuntos', stock: 2, rated: false },
  { id: 16, title: 'Tênis Casual Feminino', price: 199, category: 'Calçados & Acessórios', stock: 18, rated: true }
];

// Elementos DOM
const productsContainer = document.getElementById('products-container');
const searchInput = document.getElementById('search-input');
const btnHamburger = document.getElementById('btn-hamburger');
const btnProfile = document.getElementById('btn-profile');
const btnFavorites = document.getElementById('btn-favorites');
const btnCart = document.getElementById('btn-cart');
const drawerMenu = document.getElementById('drawer-menu');
const closeDrawer = document.getElementById('close-drawer');
const overlay = document.getElementById('overlay');
const modal = document.getElementById('app-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.getElementById('close-modal');

// Normalização de texto para busca sem acentos
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// Renderizar Produtos no Grid Principal
function renderProducts(items) {
  if (items.length === 0) {
    productsContainer.innerHTML = `
      <div class="no-products-msg">
        <i class="ph ph-magnifying-glass"></i>
        <p>Nenhum produto encontrado para "<strong>${searchInput.value}</strong>".</p>
        <p style="font-size:12px; margin-top:4px;">Tente pesquisar por termos como "Vestido", "Blusa", "Saia" ou "Calça".</p>
      </div>
    `;
    return;
  }

  productsContainer.innerHTML = items.map(p => `
    <div class="product-card" onclick="openProductDetail(${p.id})">
      <div class="product-image-holder">
        <i class="ph ph-image product-placeholder-icon"></i>
        ${p.rated ? `<div class="purple-badge" title="Mais Bem Avaliado"></div>` : ''}
      </div>
      <div class="product-info">
        <div class="product-title">${p.title}</div>
        <div class="product-price">R$ ${p.price},00</div>
      </div>
    </div>
  `).join('');
}

// Pesquisa dinâmica
searchInput.addEventListener('input', (e) => {
  const searchTerm = normalizeText(e.target.value.trim());

  if (searchTerm === '') {
    renderProducts(products);
    return;
  }

  const filtered = products.filter(p => {
    const titleNormalized = normalizeText(p.title);
    const categoryNormalized = normalizeText(p.category);
    return titleNormalized.includes(searchTerm) || categoryNormalized.includes(searchTerm);
  });

  renderProducts(filtered);
});

// Controladores do Drawer e Modal
function toggleDrawer(open) {
  if (open) {
    drawerMenu.classList.add('open');
    overlay.classList.add('active');
  } else {
    drawerMenu.classList.remove('open');
    overlay.classList.remove('active');
  }
}

function openModalWithContent(htmlContent) {
  modalBody.innerHTML = htmlContent;
  modal.classList.add('open');
  overlay.classList.add('active');
}

function closeModalHandler() {
  modal.classList.remove('open');
  if (!drawerMenu.classList.contains('open')) {
    overlay.classList.remove('active');
  }
}

// Ouvintes de Eventos do Header
btnHamburger.addEventListener('click', () => toggleDrawer(true));
closeDrawer.addEventListener('click', () => toggleDrawer(false));
overlay.addEventListener('click', () => {
  toggleDrawer(false);
  closeModalHandler();
});
closeModal.addEventListener('click', closeModalHandler);

// ================= ABA DO CARRINHO =================

function openCartModal() {
  const cartItems = StorageService.getCart();

  if (cartItems.length === 0) {
    openModalWithContent(`
      <h3 class="modal-title">Meu Carrinho 🛍️</h3>
      <div class="empty-fav-box">
        <i class="ph ph-shopping-bag-open"></i>
        <p>Seu carrinho está vazio.</p>
        <p style="font-size:12px; margin-top:4px;">Navegue pelas ofertas e escolha suas peças preferidas!</p>
        <button class="btn-primary" style="margin-top:16px;" onclick="closeModalHandler()">Explorar Loja</button>
      </div>
    `);
    return;
  }

  let totalValue = 0;

  const itemsHtml = cartItems.map(item => {
    const prod = products.find(p => p.id === item.id);
    if (!prod) return '';

    const subtotal = prod.price * item.quantity;
    totalValue += subtotal;

    return `
      <div class="cart-item">
        <div class="cart-item-img">
          <i class="ph ph-image"></i>
        </div>
        <div class="cart-item-info">
          <div class="cart-item-title">${prod.title}</div>
          <div class="cart-item-size">Tamanho: <strong>${item.size}</strong></div>
          <div class="cart-item-price">R$ ${prod.price},00</div>
        </div>
        <div class="cart-qty-controls">
          <button class="btn-qty" onclick="handleCartQtyChange(${item.id}, '${item.size}', -1)">-</button>
          <span class="qty-val">${item.quantity}</span>
          <button class="btn-qty" onclick="handleCartQtyChange(${item.id}, '${item.size}', 1)">+</button>
        </div>
        <button class="btn-delete-item" onclick="handleRemoveCartItem(${item.id}, '${item.size}')" title="Remover">
          <i class="ph ph-trash"></i>
        </button>
      </div>
    `;
  }).join('');

  openModalWithContent(`
    <h3 class="modal-title">Meu Carrinho 🛍️️</h3>
    <div class="cart-list">
      ${itemsHtml}
    </div>

    <div class="cart-summary">
      <div class="summary-row">
        <span>Subtotal:</span>
        <span>R$ ${totalValue},00</span>
      </div>
      <div class="summary-row">
        <span>Frete:</span>
        <span style="color: #2e7d32; font-weight: bold;">GRÁTIS</span>
      </div>
      <div class="summary-row summary-total">
        <span>Total:</span>
        <span>R$ ${totalValue},00</span>
      </div>
      <button class="btn-primary" style="margin-top: 12px;" onclick="openCheckoutModal()">
        Prosseguir para Entrega
      </button>
    </div>
  `);
}

function handleCartQtyChange(productId, size, delta) {
  StorageService.updateCartQuantity(productId, size, delta);
  openCartModal();
}

function handleRemoveCartItem(productId, size) {
  StorageService.removeFromCart(productId, size);
  openCartModal();
}

// ================= CHECKOUT E INTEGRAÇÃO WHATSAPP =================

function openCheckoutModal() {
  const currentUser = StorageService.getCurrentUser();

  if (!currentUser) {
    alert('Por favor, faça login ou cadastre-se para confirmar o endereço de entrega.');
    openLoginModal();
    return;
  }

  const addr = currentUser.address || {};

  openModalWithContent(`
    <h3 class="modal-title">Confirmar Endereço 📍</h3>
    <p style="font-size:13px; color:#555; text-align:center;">Confira se o endereço abaixo está correto antes de enviar o pedido:</p>

    <div class="address-box">
      <div><strong>Destinatário:</strong> ${currentUser.fullname}</div>
      <div><strong>Endereço:</strong> ${addr.street || 'Não informado'}, Nº ${addr.number || 'S/N'}</div>
      <div><strong>Bairro:</strong> ${addr.neighborhood || addr.bairro || 'Não informado'}</div>
      <div><strong>Cidade/UF:</strong> ${addr.city || ''} / ${addr.uf || ''}</div>
      <div><strong>CEP:</strong> ${addr.cep || 'Não informado'}</div>
      <div><strong>Telefone:</strong> ${currentUser.phone || 'Não informado'}</div>
    </div>

    <button class="btn-primary" style="background-color: #25d366; color: #fff; display: flex; align-items: center; justify-content: center; gap: 8px;" onclick="sendOrderToWhatsApp()">
      <i class="ph ph-whatsapp-logo" style="font-size: 20px;"></i>
      Confirmar e Enviar via WhatsApp
    </button>
    <button class="btn-secondary" style="background-color: #666; margin-top: 8px;" onclick="openCartModal()">
      Voltar ao Carrinho
    </button>
  `);
}

function sendOrderToWhatsApp() {
  const currentUser = StorageService.getCurrentUser();
  const cartItems = StorageService.getCart();
  const addr = currentUser.address || {};

  if (!currentUser || cartItems.length === 0) return;

  let totalValue = 0;
  let itemsListText = '';

  cartItems.forEach(item => {
    const prod = products.find(p => p.id === item.id);
    if (prod) {
      const subtotal = prod.price * item.quantity;
      totalValue += subtotal;
      itemsListText += `• ${item.quantity}x ${prod.title} (Tam: ${item.size}) - R$ ${subtotal},00\n`;
    }
  });

  // Montagem do texto do relatório do pedido
  const message = `🛍️ *NOVO PEDIDO - LÉLA MODAS *\n\n` +
    `👤 *Cliente:* ${currentUser.fullname}\n` +
    `📞 *Contato:* ${currentUser.phone || 'Não informado'}\n` +
    `📧 *E-mail:* ${currentUser.email}\n\n` +
    `📍 *ENDEREÇO DO CLIENTE:*\n` +
    `${addr.street || ''}, Nº ${addr.number || 'S/N'}\n` +
    `Bairro: ${addr.neighborhood || addr.bairro || ''}\n` +
    `${addr.city || ''} - ${addr.uf || ''}\n` +
    `CEP: ${addr.cep || ''}\n\n` +
    `🛒 *ITENS DO PEDIDO:*\n${itemsListText}\n` +
    `💰 *TOTAL DO PEDIDO:* R$ ${totalValue},00\n` +
    `🚚 *FRETE:* UBER ENTREGAS OU RETIRADA NA LOJA\n\n` +
    `Gostaria de confirmar a forma de pagamento!`;

  // Encoda o texto para o formato de URL
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodedMessage}`;

  // Limpa o carrinho
  StorageService.clearCart();

  // Abre o WhatsApp
  window.open(whatsappUrl, '_blank');

  // Tela de sucesso no site
  openModalWithContent(`
    <div class="success-box">
      <i class="ph ph-check-circle"></i>
      <h2 class="success-title">Redirecionando ao WhatsApp!</h2>
      <p class="success-desc">Seu pedido foi formatado e enviamos você diretamente para a conversa com a LÉLA MODAS no WhatsApp para finalizar a compra.</p>
      <button class="btn-primary" onclick="closeModalHandler()">Concluir</button>
    </div>
  `);
}

// ================= TELA DE CATEGORIAS =================

const categoriesList = [
  { name: 'Vestidos & Conjuntos', icon: 'ph-t-shirt' },
  { name: 'Blusas & Camisetas', icon: 'ph-coat-hanger' },
  { name: 'Calças & Jeans', icon: 'ph-pants' },
  { name: 'Calçados & Acessórios', icon: 'ph-tote' }
];

function openCategoriesModal() {
  openModalWithContent(`
    <h3 class="modal-title">Categorias 🛍️</h3>
    <div class="categories-grid">
      ${categoriesList.map(cat => `
        <div class="category-card" onclick="openCategoryProducts('${cat.name}')">
          <i class="ph ${cat.icon}"></i>
          <span>${cat.name}</span>
        </div>
      `).join('')}
    </div>
  `);
}

function openCategoryProducts(categoryName) {
  const categoryItems = products.filter(p => p.category === categoryName);

  openModalWithContent(`
    <button class="btn-back-categories" onclick="openCategoriesModal()">
      <i class="ph ph-arrow-left"></i> Voltar para Categorias
    </button>
    <h3 class="modal-title" style="margin-bottom: 4px;">${categoryName}</h3>
    <p class="top-rated-intro">${categoryItems.length} produto(s) encontrado(s)</p>
    
    <div class="favorites-grid">
      ${categoryItems.map(p => `
        <div class="fav-card" onclick="openProductDetail(${p.id})">
          <div class="fav-image-holder">
            <i class="ph ph-image"></i>
            ${p.rated ? `<div class="purple-badge" title="Mais Bem Avaliado"></div>` : ''}
          </div>
          <div class="fav-title">${p.title}</div>
          <div class="fav-price">R$ ${p.price},00</div>
        </div>
      `).join('')}
    </div>
  `);
}

// ================= TELA DE MAIS BEM AVALIADOS =================

function openTopRatedModal() {
  const topRatedProducts = products.filter(p => p.rated);

  openModalWithContent(`
    <h3 class="modal-title">Mais Bem Avaliados ⭐ (${topRatedProducts.length})</h3>
    <p class="top-rated-intro">Confira as peças marcadas com o selo exclusivo de destaque da LÉLA MODAS:</p>
    
    <div class="favorites-grid">
      ${topRatedProducts.map(p => `
        <div class="fav-card" onclick="openProductDetail(${p.id})">
          <div class="fav-image-holder">
            <i class="ph ph-image"></i>
            <div class="purple-badge" title="Mais Bem Avaliado"></div>
          </div>
          <div class="fav-title">${p.title}</div>
          <div class="fav-price">R$ ${p.price},00</div>
        </div>
      `).join('')}
    </div>
  `);
}

// ================= TELA DE MEUS FAVORITOS =================

function openFavoritesModal() {
  const favoriteIds = StorageService.getFavorites();
  const favoriteProducts = products.filter(p => favoriteIds.includes(p.id));

  if (favoriteProducts.length === 0) {
    openModalWithContent(`
      <h3 class="modal-title">Meus Favoritos ❤️</h3>
      <div class="empty-fav-box">
        <i class="ph ph-heartbreak"></i>
        <p>Sua lista de favoritos está vazia.</p>
        <p style="font-size:12px; margin-top:4px;">Navegue pela loja e marque os produtos que mais gostar!</p>
        <button class="btn-primary" style="margin-top:16px;" onclick="closeModalHandler()">Ver Produtos</button>
      </div>
    `);
    return;
  }

  openModalWithContent(`
    <h3 class="modal-title">Meus Favoritos ❤️ (${favoriteProducts.length})</h3>
    <div class="favorites-grid">
      ${favoriteProducts.map(p => `
        <div class="fav-card">
          <button class="btn-remove-fav" onclick="removeFavoriteFromList(${p.id}, event)" title="Remover dos Favoritos">
            <i class="ph ph-x"></i>
          </button>
          <div class="fav-image-holder" onclick="openProductDetail(${p.id})">
            <i class="ph ph-image"></i>
          </div>
          <div class="fav-title">${p.title}</div>
          <div class="fav-price">R$ ${p.price},00</div>
        </div>
      `).join('')}
    </div>
  `);
}

function removeFavoriteFromList(productId, event) {
  event.stopPropagation();
  StorageService.toggleFavorite(productId);
  openFavoritesModal();
}

// ================= PÁGINA / DETALHES DO PRODUTO =================

function openProductDetail(productId) {
  const prod = products.find(p => p.id === productId);
  if (!prod) return;

  const isFav = StorageService.isFavorite(productId);
  const isLowStock = prod.stock <= 3;
  let selectedSize = 'P';

  openModalWithContent(`
    <div class="product-detail-card">
      <div class="detail-image-holder">
        <i class="ph ph-image"></i>
        ${prod.rated ? `<div class="purple-badge" title="Mais Bem Avaliado"></div>` : ''}
      </div>

      <div>
        <span class="detail-category">${prod.category}</span>
        <h2 class="detail-title">${prod.title}</h2>
        <div class="detail-price">R$ ${prod.price},00</div>
        
        <div class="stock-badge ${isLowStock ? 'low-stock' : ''}">
          <i class="ph ph-package"></i>
          ${isLowStock ? `Apenas ${prod.stock} em estoque!` : `${prod.stock} unidades disponíveis`}
        </div>
      </div>

      <div>
        <label style="font-size:12px; font-weight:bold; color:#444;">Selecione o Tamanho:</label>
        <div class="size-selector">
          <button class="size-btn active" data-size="P">P</button>
          <button class="size-btn" data-size="M">M</button>
          <button class="size-btn" data-size="G">G</button>
          <button class="size-btn" data-size="GG">GG</button>
        </div>
      </div>

      <div class="detail-actions">
        <button class="btn-primary" id="btn-add-to-cart">
          Adicionar ao Carrinho
        </button>
        <button class="btn-favorite-action ${isFav ? 'is-active' : ''}" id="btn-fav-${prod.id}" onclick="handleToggleFavorite(${prod.id})">
          <i class="ph ${isFav ? 'ph-heart-fill' : 'ph-heart'}"></i>
        </button>
      </div>
    </div>
  `);

  const sizeBtns = document.querySelectorAll('.size-btn');
  sizeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      sizeBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      selectedSize = e.target.getAttribute('data-size');
    });
  });

  document.getElementById('btn-add-to-cart').addEventListener('click', () => {
    StorageService.addToCart(prod.id, selectedSize);
    alert(`${prod.title} (Tamanho ${selectedSize}) adicionado ao carrinho!`);
    openCartModal();
  });
}

function handleToggleFavorite(productId) {
  const isNowFav = StorageService.toggleFavorite(productId);
  const btn = document.getElementById(`btn-fav-${productId}`);
  
  if (btn) {
    if (isNowFav) {
      btn.classList.add('is-active');
      btn.innerHTML = '<i class="ph ph-heart-fill"></i>';
    } else {
      btn.classList.remove('is-active');
      btn.innerHTML = '<i class="ph ph-heart"></i>';
    }
  }
}

// ================= PERFIL E AUTENTICAÇÃO =================

function handleProfileClick() {
  const currentUser = StorageService.getCurrentUser();
  if (currentUser) {
    openEditProfileModal(currentUser);
  } else {
    openLoginModal();
  }
}

function openEditProfileModal(user) {
  const addr = user.address || {};

  openModalWithContent(`
    <h3 class="modal-title">Editar Meu Perfil</h3>
    <form class="signup-container" id="form-edit-profile" novalidate>
      <div class="section-subtitle">Dados Pessoais</div>
      
      <div class="form-group" id="group-fullname">
        <label for="edit-fullname">Nome Completo *</label>
        <input type="text" id="edit-fullname" value="${user.fullname || ''}" />
        <span class="error-msg">Preencha seu nome completo.</span>
      </div>

      <div class="form-row">
        <div class="form-group" id="group-email">
          <label for="edit-email">E-mail (Identificador)</label>
          <input type="email" id="edit-email" value="${user.email || ''}" disabled />
        </div>
        <div class="form-group" id="group-cpf">
          <label for="edit-cpf">CPF *</label>
          <input type="text" id="edit-cpf" value="${user.cpf || ''}" maxlength="14" />
          <span class="error-msg">CPF obrigatório.</span>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group" id="group-birthdate">
          <label for="edit-birthdate">Data de Nascimento *</label>
          <input type="date" id="edit-birthdate" value="${user.birthdate || ''}" />
          <span class="error-msg">Selecione sua data.</span>
        </div>
        <div class="form-group" id="group-gender">
          <label for="edit-gender">Gênero</label>
          <select id="edit-gender">
            <option value="" ${!user.gender ? 'selected' : ''}>Selecione...</option>
            <option value="Feminino" ${user.gender === 'Feminino' ? 'selected' : ''}>Feminino</option>
            <option value="Masculino" ${user.gender === 'Masculino' ? 'selected' : ''}>Masculino</option>
            <option value="Outro" ${user.gender === 'Outro' ? 'selected' : ''}>Outro</option>
            <option value="Prefiro não informar" ${user.gender === 'Prefiro não informar' ? 'selected' : ''}>Prefiro não informar</option>
          </select>
        </div>
      </div>

      <div class="form-group" id="group-phone">
        <label for="edit-phone">Telefone / WhatsApp *</label>
        <input type="tel" id="edit-phone" value="${user.phone || ''}" maxlength="15" />
        <span class="error-msg">Telefone obrigatório.</span>
      </div>

      <div class="section-subtitle">Endereço de Entrega</div>

      <div class="form-row">
        <div class="form-group" id="group-cep">
          <label for="edit-cep">CEP * <span class="cep-loading" id="cep-loading">(Buscando...)</span></label>
          <input type="text" id="edit-cep" value="${addr.cep || ''}" maxlength="9" />
          <span class="error-msg">CEP não encontrado.</span>
        </div>
        <div class="form-group" id="group-number">
          <label for="edit-number">Número *</label>
          <input type="text" id="edit-number" value="${addr.number || ''}" />
          <span class="error-msg">Obrigatório.</span>
        </div>
      </div>

      <div class="form-group" id="group-street">
        <label for="edit-street">Logradouro / Rua *</label>
        <input type="text" id="edit-street" value="${addr.street || ''}" />
        <span class="error-msg">Endereço obrigatório.</span>
      </div>

      <div class="form-row">
        <div class="form-group" id="group-neighborhood">
          <label for="edit-neighborhood">Bairro *</label>
          <input type="text" id="edit-neighborhood" value="${addr.neighborhood || addr.bairro || ''}" />
          <span class="error-msg">Bairro obrigatório.</span>
        </div>
        <div class="form-group" id="group-city">
          <label for="edit-city">Cidade *</label>
          <input type="text" id="edit-city" value="${addr.city || ''}" />
          <span class="error-msg">Cidade obrigatória.</span>
        </div>
        <div class="form-group" style="flex: 0.5;" id="group-uf">
          <label for="edit-uf">UF *</label>
          <input type="text" id="edit-uf" value="${addr.uf || ''}" maxlength="2" />
          <span class="error-msg">UF.</span>
        </div>
      </div>

      <div class="section-subtitle">Alterar Senha (Opcional)</div>

      <div class="form-row">
        <div class="form-group" id="group-password">
          <label for="edit-password">Nova Senha</label>
          <input type="password" id="edit-password" placeholder="Deixe em branco para manter" />
          <span class="error-msg">Mínimo 6 dígitos.</span>
        </div>
        <div class="form-group" id="group-confirm-password">
          <label for="edit-confirm-password">Confirmar Nova Senha</label>
          <input type="password" id="edit-confirm-password" placeholder="Repita a nova senha" />
          <span class="error-msg">Senhas divergentes.</span>
        </div>
      </div>

      <button class="btn-primary" type="submit" style="margin-top: 12px;">Salvar Alterações</button>
      <button class="btn-secondary" type="button" id="btn-logout">Sair da Conta</button>
    </form>
  `);

  const cepInput = document.getElementById('edit-cep');
  cepInput.addEventListener('blur', fetchAddressByCEPForEdit);

  document.getElementById('edit-cpf').addEventListener('input', maskCPF);
  document.getElementById('edit-phone').addEventListener('input', maskPhone);
  cepInput.addEventListener('input', maskCEP);

  document.getElementById('btn-logout').addEventListener('click', () => {
    StorageService.logout();
    alert('Você saiu da sua conta.');
    closeModalHandler();
  });

  document.getElementById('form-edit-profile').addEventListener('submit', (e) => {
    e.preventDefault();
    handleEditProfileSubmit(user.email);
  });
}

async function fetchAddressByCEPForEdit(e) {
  const cep = e.target.value.replace(/\D/g, '');
  const loading = document.getElementById('cep-loading');
  const groupCep = document.getElementById('group-cep');

  if (cep.length === 8) {
    loading.style.display = 'inline';
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        groupCep.classList.add('invalid');
      } else {
        groupCep.classList.remove('invalid');
        document.getElementById('edit-street').value = data.logradouro || '';
        document.getElementById('edit-neighborhood').value = data.bairro || '';
        document.getElementById('edit-city').value = data.localidade || '';
        document.getElementById('edit-uf').value = data.uf || '';
        document.getElementById('edit-number').focus();
      }
    } catch (err) {
      groupCep.classList.add('invalid');
    } finally {
      loading.style.display = 'none';
    }
  }
}

function handleEditProfileSubmit(email) {
  let isValid = true;

  function validateField(groupId, condition) {
    const el = document.getElementById(groupId);
    if (!condition) {
      el.classList.add('invalid');
      isValid = false;
    } else {
      el.classList.remove('invalid');
    }
  }

  const fullname = document.getElementById('edit-fullname').value.trim();
  const cpf = document.getElementById('edit-cpf').value.trim();
  const birthdate = document.getElementById('edit-birthdate').value;
  const phone = document.getElementById('edit-phone').value.trim();
  const cep = document.getElementById('edit-cep').value.trim();
  const number = document.getElementById('edit-number').value.trim();
  const street = document.getElementById('edit-street').value.trim();
  const neighborhood = document.getElementById('edit-neighborhood').value.trim();
  const city = document.getElementById('edit-city').value.trim();
  const uf = document.getElementById('edit-uf').value.trim();
  const password = document.getElementById('edit-password').value;
  const confirmPassword = document.getElementById('edit-confirm-password').value;
  const gender = document.getElementById('edit-gender').value;

  validateField('group-fullname', fullname.split(' ').length >= 2);
  validateField('group-cpf', cpf.length === 14);
  validateField('group-birthdate', birthdate !== '');
  validateField('group-phone', phone.length >= 14);
  validateField('group-cep', cep.length === 9);
  validateField('group-number', number !== '');
  validateField('group-street', street !== '');
  validateField('group-neighborhood', neighborhood !== '');
  validateField('group-city', city !== '');
  validateField('group-uf', uf.length === 2);

  if (password.length > 0) {
    validateField('group-password', password.length >= 6);
    validateField('group-confirm-password', confirmPassword === password);
  }

  if (!isValid) return;

  const updatedData = {
    fullname,
    email,
    cpf,
    birthdate,
    gender,
    phone,
    address: { cep, street, number, neighborhood, city, uf }
  };

  if (password.length >= 6) {
    updatedData.password = password;
  }

  const result = StorageService.updateUser(updatedData);

  if (result.success) {
    alert('Perfil atualizado com sucesso!');
    closeModalHandler();
  } else {
    alert(result.message);
  }
}

function openSignUpModal() {
  openModalWithContent(`
    <h3 class="modal-title">Criar Conta Completa</h3>
    <form class="signup-container" id="form-signup" novalidate>
      <div class="section-subtitle">Dados Pessoais</div>
      
      <div class="form-group" id="group-fullname">
        <label for="reg-fullname">Nome Completo *</label>
        <input type="text" id="reg-fullname" placeholder="Ex: Maria Silva" />
        <span class="error-msg">Preencha seu nome completo.</span>
      </div>

      <div class="form-row">
        <div class="form-group" id="group-email">
          <label for="reg-email">E-mail *</label>
          <input type="email" id="reg-email" placeholder="seu@email.com" />
          <span class="error-msg">Informe um e-mail válido.</span>
        </div>
        <div class="form-group" id="group-cpf">
          <label for="reg-cpf">CPF *</label>
          <input type="text" id="reg-cpf" placeholder="000.000.000-00" maxlength="14" />
          <span class="error-msg">CPF obrigatório.</span>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group" id="group-birthdate">
          <label for="reg-birthdate">Data de Nascimento *</label>
          <input type="date" id="reg-birthdate" />
          <span class="error-msg">Selecione sua data.</span>
        </div>
        <div class="form-group" id="group-gender">
          <label for="reg-gender">Gênero</label>
          <select id="reg-gender">
            <option value="">Selecione...</option>
            <option value="Feminino">Feminino</option>
            <option value="Masculino">Masculino</option>
            <option value="Outro">Outro</option>
            <option value="Prefiro não informar">Prefiro não informar</option>
          </select>
        </div>
      </div>

      <div class="form-group" id="group-phone">
        <label for="reg-phone">Telefone / WhatsApp *</label>
        <input type="tel" id="reg-phone" placeholder="(21) 99999-9999" maxlength="15" />
        <span class="error-msg">Telefone obrigatório.</span>
      </div>

      <div class="section-subtitle">Endereço de Entrega</div>

      <div class="form-row">
        <div class="form-group" id="group-cep">
          <label for="reg-cep">CEP * <span class="cep-loading" id="cep-loading">(Buscando...)</span></label>
          <input type="text" id="reg-cep" placeholder="00000-000" maxlength="9" />
          <span class="error-msg">CEP não encontrado.</span>
        </div>
        <div class="form-group" id="group-number">
          <label for="reg-number">Número *</label>
          <input type="text" id="reg-number" placeholder="Ex: 123" />
          <span class="error-msg">Obrigatório.</span>
        </div>
      </div>

      <div class="form-group" id="group-street">
        <label for="reg-street">Logradouro / Rua *</label>
        <input type="text" id="reg-street" placeholder="Rua, Avenida..." />
        <span class="error-msg">Endereço obrigatório.</span>
      </div>

      <div class="form-row">
        <div class="form-group" id="group-neighborhood">
          <label for="reg-neighborhood">Bairro *</label>
          <input type="text" id="reg-neighborhood" placeholder="Bairro" />
          <span class="error-msg">Bairro obrigatório.</span>
        </div>
        <div class="form-group" id="group-city">
          <label for="reg-city">Cidade *</label>
          <input type="text" id="reg-city" placeholder="Cidade" />
          <span class="error-msg">Cidade obrigatória.</span>
        </div>
        <div class="form-group" style="flex: 0.5;" id="group-uf">
          <label for="reg-uf">UF *</label>
          <input type="text" id="reg-uf" placeholder="RJ" maxlength="2" />
          <span class="error-msg">UF.</span>
        </div>
      </div>

      <div class="section-subtitle">Acesso e Segurança</div>

      <div class="form-row">
        <div class="form-group" id="group-password">
          <label for="reg-password">Senha *</label>
          <input type="password" id="reg-password" placeholder="Mínimo 6 dígitos" />
          <span class="error-msg">Mínimo 6 dígitos.</span>
        </div>
        <div class="form-group" id="group-confirm-password">
          <label for="reg-confirm-password">Confirmar Senha *</label>
          <input type="password" id="reg-confirm-password" placeholder="Repita a senha" />
          <span class="error-msg">Senhas divergentes.</span>
        </div>
      </div>

      <button class="btn-primary" type="submit" style="margin-top: 12px;">Finalizar Cadastro</button>
    </form>
    
    <div class="form-footer-link" style="margin-top: 12px;">
      Já tem uma conta? <a href="#" id="link-to-login">Faça Login</a>
    </div>
  `);

  const cepInput = document.getElementById('reg-cep');
  cepInput.addEventListener('blur', fetchAddressByCEP);

  document.getElementById('reg-cpf').addEventListener('input', maskCPF);
  document.getElementById('reg-phone').addEventListener('input', maskPhone);
  cepInput.addEventListener('input', maskCEP);

  document.getElementById('link-to-login').addEventListener('click', (e) => {
    e.preventDefault();
    openLoginModal();
  });

  document.getElementById('form-signup').addEventListener('submit', handleSignUpSubmit);
}

async function fetchAddressByCEP(e) {
  const cep = e.target.value.replace(/\D/g, '');
  const loading = document.getElementById('cep-loading');
  const groupCep = document.getElementById('group-cep');

  if (cep.length === 8) {
    loading.style.display = 'inline';
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        groupCep.classList.add('invalid');
      } else {
        groupCep.classList.remove('invalid');
        document.getElementById('reg-street').value = data.logradouro || '';
        document.getElementById('reg-neighborhood').value = data.bairro || '';
        document.getElementById('reg-city').value = data.localidade || '';
        document.getElementById('reg-uf').value = data.uf || '';
        document.getElementById('reg-number').focus();
      }
    } catch (err) {
      groupCep.classList.add('invalid');
    } finally {
      loading.style.display = 'none';
    }
  }
}

function maskCPF(e) {
  let v = e.target.value.replace(/\D/g, '');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  e.target.value = v;
}

function maskPhone(e) {
  let v = e.target.value.replace(/\D/g, '');
  v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
  v = v.replace(/(\d)(\d{4})$/, '$1-$2');
  e.target.value = v;
}

function maskCEP(e) {
  let v = e.target.value.replace(/\D/g, '');
  v = v.replace(/^(\d{5})(\d)/, '$1-$2');
  e.target.value = v;
}

function handleSignUpSubmit(e) {
  e.preventDefault();

  let isValid = true;

  function validateField(groupId, condition) {
    const el = document.getElementById(groupId);
    if (!condition) {
      el.classList.add('invalid');
      isValid = false;
    } else {
      el.classList.remove('invalid');
    }
  }

  const fullname = document.getElementById('reg-fullname').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const cpf = document.getElementById('reg-cpf').value.trim();
  const birthdate = document.getElementById('reg-birthdate').value;
  const phone = document.getElementById('reg-phone').value.trim();
  const cep = document.getElementById('reg-cep').value.trim();
  const number = document.getElementById('reg-number').value.trim();
  const street = document.getElementById('reg-street').value.trim();
  const neighborhood = document.getElementById('reg-neighborhood').value.trim();
  const city = document.getElementById('reg-city').value.trim();
  const uf = document.getElementById('reg-uf').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirmPassword = document.getElementById('reg-confirm-password').value;
  const gender = document.getElementById('reg-gender').value;

  validateField('group-fullname', fullname.split(' ').length >= 2);
  validateField('group-email', email.includes('@') && email.includes('.'));
  validateField('group-cpf', cpf.length === 14);
  validateField('group-birthdate', birthdate !== '');
  validateField('group-phone', phone.length >= 14);
  validateField('group-cep', cep.length === 9);
  validateField('group-number', number !== '');
  validateField('group-street', street !== '');
  validateField('group-neighborhood', neighborhood !== '');
  validateField('group-city', city !== '');
  validateField('group-uf', uf.length === 2);
  validateField('group-password', password.length >= 6);
  validateField('group-confirm-password', confirmPassword === password && confirmPassword !== '');

  if (!isValid) return;

  const userData = {
    fullname,
    email,
    cpf,
    birthdate,
    gender,
    phone,
    address: { cep, street, number, neighborhood, city, uf },
    password,
    createdAt: new Date().toISOString()
  };

  const result = StorageService.saveUser(userData);

  if (result.success) {
    alert('Cadastro realizado com sucesso! Você já está logado.');
    closeModalHandler();
  } else {
    alert(result.message);
  }
}

function openLoginModal() {
  openModalWithContent(`
    <h3 class="modal-title">Entrar na Conta</h3>
    <form class="signup-container" id="form-login">
      <div class="form-group" id="group-login-email">
        <label for="login-email">E-mail</label>
        <input type="email" id="login-email" placeholder="seu@email.com" required />
        <span class="error-msg">Informe o e-mail.</span>
      </div>
      <div class="form-group" id="group-login-pass">
        <label for="login-password">Senha</label>
        <input type="password" id="login-password" placeholder="******" required />
        <span class="error-msg">Informe a senha.</span>
      </div>
      <button class="btn-primary" type="submit" style="margin-top:8px;">Entrar</button>
    </form>
    <div class="form-footer-link" style="margin-top: 12px;">
      Ainda não tem conta? <a href="#" id="link-to-signup">Cadastre-se aqui</a>
    </div>
  `);

  document.getElementById('link-to-signup').addEventListener('click', (e) => {
    e.preventDefault();
    openSignUpModal();
  });

  document.getElementById('form-login').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-password').value;

    const auth = StorageService.login(email, pass);

    if (auth.success) {
      alert(`Bem-vindo(a) de volta, ${auth.user.fullname}!`);
      closeModalHandler();
    } else {
      alert(auth.message);
    }
  });
}

// Eventos de Abertura pelo Header
btnProfile.addEventListener('click', handleProfileClick);
btnFavorites.addEventListener('click', openFavoritesModal);
btnCart.addEventListener('click', openCartModal);

// Ações do Drawer (Menu Lateral)
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', (e) => {
    const id = e.currentTarget.id;
    toggleDrawer(false);

    if (id === 'menu-categories') {
      openCategoriesModal();
    } else if (id === 'menu-top-rated') {
      openTopRatedModal();
    } else if (id === 'menu-favorites') {
      openFavoritesModal();
    } else if (id === 'menu-profile') {
      handleProfileClick();
    }
  });
});

// Inicialização
renderProducts(products);
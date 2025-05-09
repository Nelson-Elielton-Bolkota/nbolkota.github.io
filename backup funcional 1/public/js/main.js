// =============================================
// ============ CARRINHO DE COMPRAS ============
// ============= (Integração MongoDB) ==========
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    // Configurações
    const CART_STORAGE_KEY = 'armazemCart';
    const API_URL = 'http://localhost:5000/api/products'; // Sua API MongoDB
    
    // Elementos DOM
    const DOM = {
        floatingCart: document.getElementById('floating-cart'),
        cartCount: document.getElementById('cart-count'),
        cartSum: document.getElementById('cart-sum'),
        cartSidebar: document.getElementById('cart-sidebar'),
        cartItemsContainer: document.getElementById('cart-items-container'),
        cartTotal: document.getElementById('cart-total'),
        closeCart: document.getElementById('close-cart'),
        clearCart: document.getElementById('clear-cart'),
        cartOverlay: document.getElementById('cart-overlay'),
        productGrids: {
            hortifruti: document.getElementById('hortifruti-grid'),
            caseiros: document.getElementById('caseiros-grid')
        }
    };

    // Estado da aplicação
    const state = {
        cart: {
            items: [],
            total: 0
        },
        products: []
    };

    // ======================
    // ===== INICIALIZAÇÃO ==
    // ======================
    async function init() {
        await loadProducts();
        loadCart();
        setupEventListeners();
    }

    // ======================
    // ===== EVENT LISTENERS 
    // ======================
    function setupEventListeners() {
        // Delegação de eventos para os botões do carrinho
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('cart-button')) {
                handleAddToCart(e);
            }
        });

        // Carrinho flutuante
        DOM.floatingCart.addEventListener('click', openCart);
        
        // Fechar sidebar
        DOM.closeCart.addEventListener('click', closeCart);
        DOM.cartOverlay.addEventListener('click', closeCart);
        
        // Limpar carrinho
        DOM.clearCart.addEventListener('click', clearCart);
    }

    // ======================
    // ===== GERENCIAMENTO ==
    // ======================
    function loadCart() {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
            state.cart = JSON.parse(savedCart);
            updateCartDisplay();
        }
    }

    function saveCart() {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
    }

    function clearCart() {
        state.cart = { items: [], total: 0 };
        updateCartDisplay();
        saveCart();
        DOM.cartSidebar.classList.add('shake');
        setTimeout(() => DOM.cartSidebar.classList.remove('shake'), 500);
    }

    // ======================
    // ===== CARRINHO =======
    // ======================
    function handleAddToCart(e) {
        const productCard = e.target.closest('.product-card');
        if (!productCard) return;

        const productId = productCard.dataset.id;
        const product = state.products.find(p => p._id === productId); // Assumindo que seu MongoDB usa _id

        if (!product) {
            console.error('Produto não encontrado no estado:', productId);
            return;
        }

        const cartProduct = {
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            uniqueKey: `${product._id}_${product.price}`
        };

        addToCart(cartProduct);
        showAddFeedback(e.target);
    }

    function addToCart(product) {
        const existingItem = state.cart.items.find(item => item.uniqueKey === product.uniqueKey);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            state.cart.items.push({
                ...product,
                quantity: 1
            });
        }

        state.cart.total = calculateTotal();
        updateCartDisplay();
        saveCart();
    }

    function calculateTotal() {
        return state.cart.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    // ======================
    // ===== INTERFACE ======
    // ======================
    function updateCartDisplay() {
        const itemCount = state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
        const total = state.cart.total.toFixed(2).replace('.', ',');
        
        DOM.cartCount.textContent = itemCount;
        DOM.cartSum.textContent = total;
        DOM.floatingCart.classList.toggle('has-items', itemCount > 0);
        
        if (DOM.cartSidebar.classList.contains('open')) {
            renderCartItems();
        }
    }

    function renderCartItems() {
        DOM.cartItemsContainer.innerHTML = state.cart.items.map(item => `
            <div class="cart-item" data-id="${item._id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.quantity}x ${formatCurrency(item.price)}</p>
                </div>
            </div>
        `).join('');

        DOM.cartTotal.textContent = formatCurrency(state.cart.total);
    }

    function openCart() {
        DOM.cartSidebar.classList.add('open');
        DOM.cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderCartItems();
    }

    function closeCart() {
        DOM.cartSidebar.classList.remove('open');
        DOM.cartOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function showAddFeedback(button) {
        button.textContent = '✓';
        button.classList.add('added');
        
        setTimeout(() => {
            button.textContent = '+';
            button.classList.remove('added');
        }, 1000);
    }

    // ======================
    // ===== PRODUTOS =======
    // ======================
    async function loadProducts() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Erro na API');
            
            state.products = await response.json();
            renderProducts();
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
            // Fallback opcional (se desejar)
            // loadStaticProducts();
        }
    }

    function renderProducts() {
        Object.keys(DOM.productGrids).forEach(category => {
            const filteredProducts = state.products.filter(p => p.category === category);
            if (filteredProducts.length > 0) {
                DOM.productGrids[category].innerHTML = filteredProducts.map(product => `
                    <article class="product-card" data-id="${product._id}">
                        <h3 class="product-name">${product.name}</h3>
                        <span class="product-price">${formatCurrency(product.price)}</span>
                        <img src="${product.image}" class="product-image" alt="${product.name}">
                        <button class="cart-button">+</button>
                    </article>
                `).join('');
            }
        });
    }

    // ======================
    // ===== UTILITÁRIOS ====
    // ======================
    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    // Inicializa a aplicação
    init();
});
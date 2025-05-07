// =============================================
// ============ CARRINHO DE COMPRAS ============
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    // Seletores
    const cartButtons = document.querySelectorAll('.cart-button');
    const floatingCart = document.querySelector('.floating-cart');
    const cartText = floatingCart.querySelector('.cart-text');

    // Estado do carrinho
    let cart = {
        items: [],
        total: 0
    };

    // =============================================
    // ============ FUNÇÕES DO CARRINHO ============
    // =============================================

    /**
     * Atualiza o carrinho flutuante com o total atual
     */
    function updateCartDisplay() {
        const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
        const totalPrice = cart.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        cartText.textContent = `Ver Carrinho (${itemCount} itens - ${totalPrice})`;

        // Adiciona classe quando tem itens no carrinho
        if (itemCount > 0) {
            floatingCart.classList.add('has-items');
        } else {
            floatingCart.classList.remove('has-items');
        }
    }

    const API_URL = 'http://localhost:5000/api/products';

    async function loadProducts() {
        try {
            // 1. Busca produtos da API
            const response = await fetch('http://localhost:5000/api/products');
            const products = await response.json();
    
            // 2. Filtra por categoria
            const hortifruti = products.filter(p => p.category === 'hortifruti');
            const caseiros = products.filter(p => p.category === 'caseiros');
    
            // 3. Renderiza na tela
            renderProducts(hortifruti, 'hortifruti-grid');
            renderProducts(caseiros, 'caseiros-grid');
    
        } catch (err) {
            console.error("Erro ao carregar produtos:", err);
            // Se a API falhar, mostra os produtos estáticos (opcional)
            loadStaticProducts();
        }
    }

    function renderProducts(products, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product-card');
            productElement.innerHTML = `
                <img src="${product.image}" class="product-image" />
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
                <button class="cart-button">+</button>
            `;
            container.appendChild(productElement);
        });

        const newButtons = container.querySelectorAll('.cart-button');
        newButtons.forEach(button => {
            button.addEventListener('click', function () {
                const productCard = this.closest('.product-card');
                addToCart(productCard);
            });
        });
    }

    /**
     * Adiciona um produto ao carrinho
     * @param {HTMLElement} productElement - Elemento DOM do produto
     */
    function addToCart(productElement) {
        const productName = productElement.querySelector('.product-name').textContent;
        const productPriceText = productElement.querySelector('.product-price').textContent;
        const productPrice = parseFloat(productPriceText.replace(/[^\d,]/g, '').replace(',', '.'));
        const productImage = productElement.querySelector('.product-image').src;

        const existingItem = cart.items.find(item => item.name === productName);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({
                name: productName,
                price: productPrice,
                quantity: 1,
                image: productImage
            });
        }

        cart.total += productPrice;
        updateCartDisplay();
        giveAddToCartFeedback(productElement);
    }

    /**
     * Mostra feedback visual ao adicionar item
     * @param {HTMLElement} productElement - Elemento do produto
     */
    function giveAddToCartFeedback(productElement) {
        const button = productElement.querySelector('.cart-button');

        button.textContent = '✓';
        button.style.backgroundColor = '#4CAF50';

        setTimeout(() => {
            button.textContent = '+';
            button.style.backgroundColor = '';
        }, 1000);
    }

    // =============================================
    // ============ EVENT LISTENERS ================
    // =============================================

    cartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            addToCart(productCard);
        });
    });

    floatingCart.addEventListener('click', function() {
        alert(`Carrinho:\n${cart.items.map(item => `${item.name} - ${item.quantity}x`).join('\n')}\n\nTotal: ${cart.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`);
    });

    // =============================================
    // ============ INICIALIZAÇÃO =================
    // =============================================

    const savedCart = localStorage.getItem('armazemCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }

    window.addEventListener('beforeunload', () => {
        localStorage.setItem('armazemCart', JSON.stringify(cart));
    });

    loadProducts();
});

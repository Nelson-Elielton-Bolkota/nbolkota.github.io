const API_URL = 'http://localhost:5000/api/products';
let products = [];
let editingProductId = null;

document.addEventListener('DOMContentLoaded', initAdmin);

async function initAdmin() {
    await loadProducts();
    setupForm();
    setupCancelButton();
}

async function loadProducts() {
    try {
        showLoader();
        const response = await fetch(API_URL);
        
        if (!response.ok) throw new Error('Erro ao carregar produtos');
        
        products = await response.json();
        renderProducts();
    } catch (error) {
        console.error('Erro:', error);
        alert('Falha ao carregar produtos. Verifique o console.');
    } finally {
        hideLoader();
    }
}

function renderProducts() {
    const productList = document.getElementById('productList');
    
    if (products.length === 0) {
        productList.innerHTML = '<p>Nenhum produto cadastrado</p>';
        return;
    }

    productList.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product._id}">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/150'">
            <h3>${product.name}</h3>
            <p>${formatCurrency(product.price)}</p>
            <p><small>Categoria: ${formatCategory(product.category)}</small></p>
            <div class="product-actions">
                <button class="edit-btn" onclick="editProduct('${product._id}')">Editar</button>
                <button class="delete-btn" onclick="deleteProduct('${product._id}')">Excluir</button>
            </div>
        </div>
    `).join('');
}

function setupForm() {
    const form = document.getElementById('productForm');
    form.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const productData = Object.fromEntries(formData);
    
    // Validação básica
    if (!productData.name || !productData.price || !productData.category) {
        alert('Preencha todos os campos obrigatórios');
        return;
    }

    try {
        showLoader();
        const isEditing = !!editingProductId;
        
        const response = await fetch(
            isEditing ? `${API_URL}/${editingProductId}` : API_URL,
            {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            }
        );

        if (!response.ok) throw new Error('Erro na requisição');

        const result = await response.json();
        alert(isEditing ? 'Produto atualizado!' : 'Produto cadastrado!');
        
        resetForm();
        await loadProducts();
    } catch (error) {
        console.error('Erro:', error);
        alert(`Falha ao ${editingProductId ? 'atualizar' : 'cadastrar'} produto`);
    } finally {
        hideLoader();
    }
}

function setupCancelButton() {
    document.getElementById('cancelEdit').addEventListener('click', resetForm);
}

function resetForm() {
    document.getElementById('productForm').reset();
    editingProductId = null;
    document.getElementById('submitBtn').textContent = 'Cadastrar Produto';
    document.getElementById('cancelEdit').style.display = 'none';
}

function editProduct(id) {
    const product = products.find(p => p._id === id);
    if (!product) return;

    editingProductId = id;
    const form = document.getElementById('productForm');
    
    form.querySelector('[name="name"]').value = product.name;
    form.querySelector('[name="price"]').value = product.price;
    form.querySelector('[name="category"]').value = product.category;
    form.querySelector('[name="image"]').value = product.image;
    
    document.getElementById('submitBtn').textContent = 'Atualizar Produto';
    document.getElementById('cancelEdit').style.display = 'inline-block';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteProduct(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
        showLoader();
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        
        if (!response.ok) throw new Error('Erro ao excluir');
        
        alert('Produto excluído com sucesso!');
        await loadProducts();
    } catch (error) {
        console.error('Erro:', error);
        alert('Falha ao excluir produto');
    } finally {
        hideLoader();
    }
}

// Utilitários
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatCategory(category) {
    const categories = {
        hortifruti: 'Hortifruti',
        caseiros: 'Caseiros',
        bebidas: 'Bebidas'
    };
    return categories[category] || category;
}

function showLoader() {
    // Implemente um loader se desejar
}

function hideLoader() {
    // Implemente um loader se desejar
}

// Expor funções para o escopo global (necessário para onclick no HTML)
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
const API_URL = 'http://localhost:5000/api/products';
let products = []; // Variável para armazenar os produtos carregados
let editingProductId = null; // Controla se estamos editando

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    // Cadastrar/Editar Produto
    document.getElementById('productForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.target));

        try {
            const url = editingProductId ? `${API_URL}/${editingProductId}` : API_URL;
            const method = editingProductId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert(editingProductId ? 'Produto atualizado!' : 'Produto cadastrado!');
                e.target.reset();
                editingProductId = null;
                loadProducts();
            }
        } catch (err) {
            console.error('Erro:', err);
        }
    });
});

async function loadProducts() {
    try {
        const response = await fetch(API_URL);
        products = await response.json(); // Atualiza a variável global

        const productList = document.getElementById('productList');
        productList.innerHTML = products.map(product => `
      <div class="product-card" data-id="${product._id}">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>R$ ${product.price.toFixed(2)}</p>
        <div>
          <button onclick="editProduct('${product._id}')">✏️ Editar</button>
          <button onclick="deleteProduct('${product._id}')">🗑️ Excluir</button>
        </div>
      </div>
    `).join('');
    } catch (err) {
        console.error('Erro ao carregar produtos:', err);
    }
}

function editProduct(id) {
    const product = products.find(p => p._id === id);
    if (product) {
        editingProductId = id;
        document.querySelector('[name="name"]').value = product.name;
        document.querySelector('[name="price"]').value = product.price;
        document.querySelector('[name="category"]').value = product.category;
        document.querySelector('[name="image"]').value = product.image;
        document.getElementById('productForm').classList.add('editing-mode');
        document.getElementById('productForm').classList.remove('editing-mode');
        document.getElementById('cancelEdit').addEventListener('click', () => {
            document.getElementById('productForm').reset();
            editingProductId = null;
            document.getElementById('cancelEdit').style.display = 'none';
            document.getElementById('cancelEdit').style.display = 'inline-block';
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

async function deleteProduct(id) {
    if (confirm('Tem certeza?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        loadProducts();
    }
}
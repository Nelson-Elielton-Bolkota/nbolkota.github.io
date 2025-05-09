require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const productRoutes = require('./routes/products');

const app = express();

// Configurações básicas
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/armazem';

// Middlewares essenciais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (frontend)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Para imagens se necessário

// Conexão com MongoDB (com tratamento robusto de erros)
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log('✅ Conectado ao MongoDB'))
.catch(err => {
  console.error('❌ Falha na conexão com MongoDB:', err.message);
  process.exit(1);
});

// Rotas da API
app.use('/api/products', productRoutes);

// Rotas do Frontend (SPA Fallback)
app.get(['/', '/admin', '/carrinho'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota específica para o painel admin (alternativa)
app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error('🔥 Erro:', err.stack);
  res.status(500).json({ error: 'Ocorreu um erro no servidor' });
});

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`
  🚀 Servidor rodando em http://localhost:${PORT}
  • Modo: ${process.env.NODE_ENV || 'development'}
  • MongoDB: ${MONGODB_URI.split('@')[1] || MONGODB_URI}
  `);
});

// Encerramento elegante
process.on('SIGTERM', () => {
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('Servidor encerrado');
      process.exit(0);
    });
  });
});
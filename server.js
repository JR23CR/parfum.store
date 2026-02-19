require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const Product = require('./Product'); // Asumiendo que el modelo está en este path

app.use(cors()); 
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Conectado a MongoDB');
        // Inicialización de datos si la base está vacía (Seeding)
        const count = await Product.countDocuments();
        if (count === 0) {
            const seedProducts = [
                { name: "Raghba for Men", brand: "Lattafa", familia_olfativa: "Oriental", variants: [{ size: "3ml", price: 30, stock: 50 }, { size: "5ml", price: 50, stock: 50 }, { size: "10ml", price: 95, stock: 50 }], imageUrl: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&w=600&q=80", notas_salida: ["Café Brasileño", "Limón"], notas_corazon: ["Incienso Árabe"], notas_fondo: ["Oud", "Sándalo"], ocasion: ["Día"], clima: ["Templado"], sillage: 4 }
            ];
            await Product.create(seedProducts);
            console.log('Base de datos inicializada con productos de prueba');
        }
    })
    .catch(err => console.error('Error de conexión:', err));

// Configuración de transporte profesional usando variables de entorno
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Obtener todos los productos
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error("Error en GET /api/products:", error);
        res.status(500).json({ error: 'Error al obtener productos de la base de datos' });
    }
});

// Controlador profesional para el detalle del perfume
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Perfume no encontrado' });

        // Validación de stock global
        const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
        
        // Lógica de sugerencia complementaria
        // Buscamos otro perfume de la misma familia olfativa que no sea el actual
        const complementary = await Product.findOne({
            familia_olfativa: product.familia_olfativa,
            _id: { $ne: product._id }
        }).select('name brand imageUrl variants');

        res.json({
            details: product,
            metrics: {
                sillage: product.sillage,
                longevity: product.sillage > 3 ? 'Alta' : 'Moderada',
                stockStatus: totalStock > 0 ? 'Disponible' : 'Agotado'
            },
            suggested: complementary
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener detalles' });
    }
});

app.post('/api/send-order', async (req, res) => {
    if (!req.body.cart || !req.body.email) {
        return res.status(400).json({ error: 'Datos incompletos' });
    }

    const { email, cart, total } = req.body;

    const itemsList = cart.map(i => `<li>${i.name} [${i.size}] (x${i.qty}) - Q${(i.price * i.qty).toFixed(2)}</li>`).join('');

    const mailOptions = {
        from: `"Tienda Elite" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_RECEIVER || process.env.EMAIL_USER,
        subject: `Nuevo Pedido de ${email}`,
        html: `
            <div style="font-family: sans-serif; padding: 20px; border: 2px solid #d4af37; background-color: #fdfbf7;">
                <h2 style="color: #064e3b; border-bottom: 2px solid #d4af37; padding-bottom: 10px; text-transform: uppercase; letter-spacing: 2px;">Nuevo Pedido Real: Al-Amazonia</h2>
                <p><strong>Cliente:</strong> ${email}</p>
                <h3 style="color: #064e3b;">Detalle de la Selección:</h3>
                <ul style="line-height: 1.6;">${itemsList}</ul>
                <p style="font-size: 20px; background: #064e3b; color: #d4af37; padding: 15px; text-align: center;"><strong>Total a cobrar: ${total}</strong></p>
                <p style="color: #064e3b; font-style: italic; font-size: 12px;">Este es un mensaje automático de tu boutique Al-Amazonia.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Enviado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al enviar' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor de correos activo en puerto ${PORT}`));
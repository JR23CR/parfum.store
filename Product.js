const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true },
    brand: { type: String, required: true },
    description: String,
    variants: [{
        size: { type: String, enum: ['3ml', '5ml', '10ml', '30ml', '50ml', '100ml'], required: true },
        price: { type: Number, required: true },
        stock: { type: Number, default: 0 }
    }],
    familia_olfativa: { 
        type: String, 
        enum: ['Cítrica', 'Floral', 'Fougère', 'Chipre', 'Amaderada', 'Oriental', 'Cuero'],
        required: true 
    },
    notas_salida: [String],
    notas_corazon: [String],
    notas_fondo: [String],
    sillage: { type: Number, min: 1, max: 5, default: 3 },
    ocasion: [{ type: String, enum: ['Día', 'Noche', 'Oficina', 'Cita'] }],
    clima: [{ type: String, enum: ['Frío', 'Cálido', 'Templado'] }],
    isLimitedEdition: { type: Boolean, default: false },
    imageUrl: String
}, { timestamps: true });

// Índice para búsquedas por notas
productSchema.index({ notas_salida: 'text', notas_corazon: 'text', notas_fondo: 'text' });

module.exports = mongoose.model('Product', productSchema);
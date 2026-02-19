/**
 * Calcula el descuento por volumen con validación de stock para ediciones limitadas.
 */
function calculateVolumeDiscount(product, quantity) {
    if (product.isLimitedEdition && product.stock < quantity) {
        throw new Error("Stock insuficiente para promoción de edición limitada");
    }
    
    let discount = 0;
    if (quantity >= 3) discount = 0.10; // 10%
    if (quantity >= 5) discount = 0.15; // 15%
    
    return product.price * quantity * (1 - discount);
}

module.exports = { calculateVolumeDiscount };
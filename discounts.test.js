import { calculateVolumeDiscount } from '../utils/discounts.js';

describe('Lógica de Descuento por Volumen', () => {
    const regularPerfume = { name: 'Sauvage', price: 1000, isLimitedEdition: false, stock: 50 };
    const limitedPerfume = { name: 'Aventus Ltd', price: 2000, isLimitedEdition: true, stock: 2 };

    test('Aplica 10% de descuento por 3 unidades', () => {
        const total = calculateVolumeDiscount(regularPerfume, 3);
        expect(total).toBe(1000 * 3 * 0.9);
    });

    test('Aplica 15% de descuento por 5 unidades', () => {
        const total = calculateVolumeDiscount(regularPerfume, 5);
        expect(total).toBe(1000 * 5 * 0.85);
    });

    test('Lanza error si no hay stock suficiente para edición limitada', () => {
        expect(() => {
            calculateVolumeDiscount(limitedPerfume, 5);
        }).toThrow("Stock insuficiente para promoción de edición limitada");
    });

    test('No aplica descuento para menos de 3 unidades', () => {
        const total = calculateVolumeDiscount(regularPerfume, 2);
        expect(total).toBe(1000 * 2);
    });
});
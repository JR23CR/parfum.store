/**
 * Filtra perfumes basándose en ocasión y clima con priorización de notas.
 */
export function filterPerfumes(perfumes, ocasion, clima) {
    return perfumes.filter(p => {
        const matchesOcasion = p.ocasion && p.ocasion.includes(ocasion);
        if (!matchesOcasion) return false;

        // Lógica de priorización por clima
        if (clima === 'Frío') {
            // Priorizar notas de fondo pesadas
            const heavyNotes = ['vainilla', 'madera', 'ambar', 'cuero', 'sándalo', 'patchouli', 'haba tonka'];
            return p.notas_fondo.some(note => heavyNotes.includes(note.toLowerCase()));
        } else if (clima === 'Cálido') {
            // Priorizar notas cítricas y frescas en la salida
            const citrusNotes = ['limón', 'bergamota', 'naranja', 'mandarina', 'pomelo', 'neroli', 'menta'];
            return p.notas_salida.some(note => citrusNotes.includes(note.toLowerCase()));
        }
        return true;
    });
}
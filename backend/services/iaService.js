// ESTA ES UNA IA MOCK
// Más adelante reemplazamos esta lógica por una API real.

const generarOutfit = async ({
    mensaje,
    temporada,
    categorias,
    candidatos,
    prendasSeleccionadas
}) => {

    const prendasElegidas = [];
    const idsUsados = new Set();

    // PRIMERO RESPETAMOS LAS PRENDAS ELEGIDAS MANUALMENTE POR EL USUARIO
    for (const prenda of prendasSeleccionadas) {
        const clave = `${prenda.origen}-${prenda.idOriginal}`;

        if (!idsUsados.has(clave)) {
            prendasElegidas.push(prenda);
            idsUsados.add(clave);
        }
    }

    // DESPUÉS COMPLETAMOS LAS CATEGORÍAS
    for (const categoria of categorias) {
        const yaTieneCategoria =prendasElegidas.some((prenda) => prenda.categoria === categoria);

        if (yaTieneCategoria) {
            continue;
        }

        // Primero intentamos usar algo del armario del usuario.
        let candidata = candidatos.find((prenda) => prenda.categoria === categoria && prenda.origen === "armario" && !idsUsados.has( `${prenda.origen}-${prenda.idOriginal}`));
           
        // Si no hay en el armario, usamos una del catálogo.
        if (!candidata) {
            candidata = candidatos.find((prenda) => prenda.categoria === categoria && !idsUsados.has( `${prenda.origen}-${prenda.idOriginal}`));
        }

        if (candidata) {
            prendasElegidas.push(candidata);
            idsUsados.add(`${candidata.origen}-${candidata.idOriginal}`);
        }
    }

    // RESPUESTA MOCK
    return {
        titulo:"Outfit sugerido por GRWM",
        descripcion:`Creamos una combinación para un estilo ${temporada}, teniendo en cuenta: "${mensaje}".`,
        mensajeUsuario: mensaje, 
        temporada,
        prendas: prendasElegidas,
        razon:"GRWM priorizó las prendas de tu armario y utilizó prendas de inspiración cuando fue necesario.",
        mock:true
    };
};


module.exports = { generarOutfit };
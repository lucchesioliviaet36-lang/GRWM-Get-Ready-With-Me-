const URL = "https://dummyjson.com/products";

const obtenerPorCategoria = async (categoria) => {
    const response = await fetch(`${URL}/category/${encodeURIComponent(categoria)}`);

    if (!response.ok) {
        throw new Error("No se pudo acceder al catalogo");
    }

    const data = await response.json();

    return data.products.map((producto) => ({
        idExterno: producto.id,
        nombre: producto.title,
        descripcion: producto.description,
        categoria: producto.category,
        imagen: producto.thumbnail,
        imagenes: producto.images,
        origen: "catalogo_externo"
    })); 
};

module.exports = { obtenerPorCategoria };
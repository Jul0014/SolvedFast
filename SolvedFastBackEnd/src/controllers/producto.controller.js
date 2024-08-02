import Producto from "../models/producto.model.js";
//import { similarityPercentage } from "../js/levenshtein.js";

/*export const searchSimilarProducto = async (req, res) => {
  const { nombre_producto, marca } = req.body;

  if (!nombre_producto || !marca) {
    return res.status(400).json({ error: 'Campos requeridos faltantes' });
  }

  const normalize = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const normalizedNombreProducto = normalize(nombre_producto);
  const normalizedMarca = normalize(marca);

  try {
    const existingProductos = await Producto.find({
      $or: [
        { nombre_producto: { $regex: normalizedNombreProducto, $options: "i" } },
        {
          marca: {
            $regex: normalizedMarca,
            $options: "i",
          },
        },
      ],
    });

    // Filter the results to find significant matches
    const matchingProductos = existingProductos.filter((Producto) => {
      const normalizedExistingNombreProducto = normalize(Producto.nombre_producto);
      const normalizedExistingMarca = normalize(
        Producto.marca
      );

      const similarityNombreProducto = similarityPercentage(
        normalizedNombreProducto,
        normalizedExistingNombreProducto
      );
      const similarityMarca = similarityPercentage(
        normalizedMarca,
        normalizedExistingMarca
      );

      return (
        similarityNombreProducto >= 30 ||
        similarityMarca >= 30 
      );
    });

    if (matchingProductos.length > 0) {
      return res.status(200).json({ ProductosEncontrados: matchingProductos });
    } else {
      return res.status(200).json({ ProductosEncontrados: [] });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};*/

export const createProducto = async (req, res) => {
  const { nombre_producto, categoria, marca } = req.body;

  const producto = new Producto({
    nombre_producto,
    categoria,
    marca,
  });

  try {
    await producto.save();
    res.status(201).json(producto);
  } catch (err) {
    res.status(500).json({ error: "Hubo un error al guardar el producto: " + err.message });
  }
};

const checkProductoExists = async (id) => {
  try {
      const producto = await Producto.findById(id);
      return !!producto; // Convertir a booleano
  } catch (err) {
      console.error("Error al verificar que el producto existe:", err);
      return false;
  }
};

export const updateProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre_producto, categoria, marca } = req.body;

  const exists = await checkProductoExists(id);
    if (!exists) {
        return res.status(404).json({ error: "El producto no existe" });
    }

  try {
    await Producto.findByIdAndUpdate(id, {
        nombre_producto,
        categoria,
        marca
    });

    res.json({ _id: id, ...req.body });
  } catch (err) {
    res.json({ error: "Hubo un error al actualizar el producto: " + err.message });
  }
};

export const disableProducto = async (req, res) => {
  const { id } = req.params;
  const estado = false;

  const exists = await checkProductoExists(id);
    if (!exists) {
        return res.status(404).json({ error: "El producto no existe" });
    }

  try {
    await Producto.findByIdAndUpdate(id, { estado });

    res.json({ _id: id, ...req.body });
  } catch (err) {
    res.json({ error: "Hubo un error al desactivar el producto: " + err.message });
  }
};

export const deleteProducto = async (req, res) => {
  const { id } = req.params;

  try {
    const productoEliminado = await Producto.findOneAndDelete({
      _id: id,
    });

    if (!productoEliminado) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res
      .status(200)
      .json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    return res.status(500).json({ error: "Error al eliminar el producto" });
  }
};

/*export const getProducto = async (req, res) => {
  const { id_producto } = req.params;

  try {
    const producto = await Producto.findById(id_producto);

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(200).json(producto);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Hubo un error al obtener el producto: " + err.message });
  }
};*/

export const getProducto = async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await Producto.findById(id).populate('categoria');

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(200).json(producto);
  } catch (err) {
    res.status(500).json({ error: "Hubo un error al obtener el producto: " + err.message });
  }
};
export const getAllProductos = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;

  try {
    const productos = await Producto.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate('categoria');

    const totalProductos = await Producto.countDocuments();

    res.json({
      productos,
      currentPage: page,
      totalPages: Math.ceil(totalProductos / perPage),
    });
  } catch (error) {
    res.status(500).json({ message: "Hubo un error al obtener los productos" });
  }
};

export const getAllEnabledProductos = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;

  try {
    const productos = await Producto.find({ estado: true })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate('categoria');

    const totalProductos = await Producto.countDocuments({ estado: true });

    res.json({
      productos,
      currentPage: page,
      totalPages: Math.ceil(totalProductos / perPage),
    });
  } catch (error) {
    res.status(500).json({ message: "Hubo un error al obtener los productos" });
  }
};

export const getAllProductosWOP = async (req, res) => {
  try {
    const productos = await Producto.find();

    res.status(200).json({ productos });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Hubo un error al obtener los productos " + err });
  }
};
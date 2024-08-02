import Categoria from "../models/categoria.model.js";

export const createCategoria = async (req, res) => {
  const { nombre_categoria } = req.body;

  const categoria = new Categoria({
    nombre_categoria,
  });

  try {
    await categoria.save();
    res.status(201).json(categoria);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Hubo un error al guardar la categoría: " + err.message });
  }
};

const checkCategoriaExists = async (id) => {
    try {
        const categoria = await Categoria.findById(id);
        return !!categoria; // Convert to boolean
    } catch (err) {
        console.error("Error al verificar que el categoria existe:", err);
        return false;
    }
  };

export const updateCategoria = async (req, res) => {
  const { id, nombre_categoria } = req.body;

  const exists = await checkCategoriaExists(id);
    if (!exists) {
        return res.status(404).json({ error: "La categoría no existe" });
    }

  try {
    await Categoria.findByIdAndUpdate(id, {
        nombre_categoria,
    });

    res.json({ _id: id, ...req.body });
  } catch (err) {
    res.json({ error: "Hubo un error al actualizar la categoría: " + err.message });
  }
};

export const deleteCategoria = async (req, res) => {
    const { id } = req.params;
  
    try {
      const categoriaEliminada = await Categoria.findOneAndDelete({ _id: id });
  
      if (!categoriaEliminada) {
        return res.status(404).json({ message: "Categoria no encontrada" });
      }
  
      return res.status(200).json({ message: "Categoria eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar categoria:", error);
      return res.status(500).json({ error: "Error al eliminar categoria" });
    }
  };

  export const disableCategoria = async (req, res) => {
    const { id } = req.params;
    const estado = false;

    const exists = await checkCategoriaExists(id);
      if (!exists) {
          return res.status(404).json({ error: "La categoría no existe" });
      }

    try {
      await Categoria.findByIdAndUpdate(id, {
        estado,
      });

      res.json({ _id: id, ...req.body });
    } catch (err) {
      res.json({ error: "Hubo un error al actualizar la categoría: " + err.message });
    }
  };

export const getCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    const categoria = await Categoria.findById(id);

    if (!categoria) {
      return res.status(404).json({ message: "Categoria no encontrada" });
    }

    res.status(200).json(categoria);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Hubo un error al obtener la categoria: " + err.message });
  }
};

export const getAllCategorias = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Page number
    const perPage = parseInt(req.query.perPage) || 10; // Clients per page
  
    try {
      const categorias = await Categoria.find();
  
      const totalCategorias = await Categoria.countDocuments();
  
      res.json({
        categorias,
        currentPage: page,
        totalPages: Math.ceil(totalCategorias / perPage),
      });
    } catch (error) {
      res.status(500).json({ message: "Hubo un error al obtener las categorias" });
    }
  };

  export const getAllEnabledCategorias = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Page number
    const perPage = parseInt(req.query.perPage) || 10; // Clients per page
  
    try {
      const categorias = await Categoria.find({ estado: true })
        .skip((page - 1) * perPage)
        .limit(perPage);
  
      // Count only the especialidades with estado = true
      const totalCategorias = await Categoria.countDocuments({ estado: true });
  
      res.json({
        categorias,
        currentPage: page,
        totalPages: Math.ceil(totalCategorias / perPage),
      });
    } catch (error) {
      res.status(500).json({ message: "Hubo un error al obtener las categorías" });
    }
  };
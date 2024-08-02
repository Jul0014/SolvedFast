import Especialidad from "../models/especialidad.model.js";

export const getAllEspecialidades = async (req, res) => {

  const page = parseInt(req.query.page) || 1; // Page number
  const perPage = parseInt(req.query.perPage) || 10; // Clients per page

  try {
    const especialidades = await Especialidad.find();

    const totalEspecialidades = await Especialidad.countDocuments();

    res.json({
      especialidades,
      currentPage: page,
      totalPages: Math.ceil(totalEspecialidades / perPage),
    });
  } catch (error) {
    res.status(500).json({ message: "Hubo un error al obtener las especialidades" });
  }
};

export const getAllEnabledEspecialidades = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Page number
  const perPage = parseInt(req.query.perPage) || 10; // Clients per page

  try {
    // Find especialidades with estado = true
    const especialidades = await Especialidad.find({ estado: true })
      .skip((page - 1) * perPage)
      .limit(perPage);

    // Count only the especialidades with estado = true
    const totalEspecialidades = await Especialidad.countDocuments({ estado: true });

    res.json({
      especialidades,
      currentPage: page,
      totalPages: Math.ceil(totalEspecialidades / perPage),
    });
  } catch (error) {
    res.status(500).json({ message: "Hubo un error al obtener las especialidades" });
  }
};

const checkEspecialidadExists = async (id) => {
  try {
      const especialidad = await Especialidad.findById(id);
      return !!especialidad; // Convert to boolean
  } catch (err) {
      console.error("Error al verificar que la especialidad existe:", err);
      return false;
  }
};

export const updateEspecialidad = async (req, res) => {
const { id, nombre_especialidad } = req.body;

console.log(req.body)

const exists = await checkEspecialidadExists(id);
  if (!exists) {
      return res.status(404).json({ error: "La especialidad no existe" });
  }

try {
  await Especialidad.findByIdAndUpdate(id, {
    nombre_especialidad,
  });

  res.json({ _id: id, ...req.body });
} catch (err) {
  res.json({ error: "Hubo un error al actualizar la especialidad: " + err.message });
}
};

export const deleteEspecialidad = async (req, res) => {
  const { id } = req.params;

  try {
    const especialidadEliminada = await Especialidad.findOneAndDelete({ _id: id });

    if (!especialidadEliminada) {
      return res.status(404).json({ message: "Especialidad no encontrada" });
    }

    return res.status(200).json({ message: "Especialidad eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar especialidad:", error);
    return res.status(500).json({ error: "Error al eliminar especialidad" });
  }
};

export const disableEspecialidad = async (req, res) => {
  const { id } = req.params;
  const estado = false;

  const exists = await checkEspecialidadExists(id);
    if (!exists) {
        return res.status(404).json({ error: "La especialidad no existe" });
    }

  try {
    await Especialidad.findByIdAndUpdate(id, {
      estado,
    });

    res.json({ _id: id, ...req.body });
  } catch (err) {
    res.json({ error: "Hubo un error al actualizar la especialidad: " + err.message });
  }
};

export const getEspecialidad = async (req, res) => {
const { id } = req.params;

try {
  const especialidad = await Especialidad.findById(id);

  if (!especialidad) {
    return res.status(404).json({ message: "Especialidad no encontrada" });
  }

  res.status(200).json(especialidad);
} catch (err) {
  res
    .status(500)
    .json({ error: "Hubo un error al obtener la especialidad: " + err.message });
}
};

export const createEspecialidad = async (req, res) => {
  const { nombre_especialidad } = req.body;

  const especialidad = new Especialidad({
    nombre_especialidad,
  });

  try {
    await especialidad.save();
    res.json({
      especialidad,
    });
  } catch (err) {
    res.json({
      error: "Hubo un error al guardar la especialidad: " + err.message,
    });
    return;
  }
};
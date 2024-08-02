import Tecnico from "../models/tecnico.model.js";
import Servicio from "../models/servicio.model.js"
import { isValid, parseISO } from "date-fns";
import { similarityPercentage } from "../js/levenshtein.js";
import cron from "node-cron";
import moment from "moment";
import validationTecnico from "../validations/tecnicoValidation.js";
import {
  validateQuitarSuspension,
  validateSuspension,
} from "../validations/suspencionFormValidations.js";

export const searchSimilarTecnico = async (req, res) => {
  const { nombres, apellido_paterno, apellido_materno } = req.body;

  const normalize = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const normalizedNombres = normalize(nombres);
  const normalizedApellidoPaterno = normalize(apellido_paterno);
  const normalizedApellidoMaterno = normalize(apellido_materno);

  try {
    const existingTecnicos = await Tecnico.find({
      $or: [
        { nombres: { $regex: normalizedNombres, $options: "i" } },
        {
          apellido_paterno: {
            $regex: normalizedApellidoPaterno,
            $options: "i",
          },
        },
        {
          apellido_materno: {
            $regex: normalizedApellidoMaterno,
            $options: "i",
          },
        },
      ],
    }).populate("especialidad"); // Populate the especialidad field

    // Filter the results to find significant matches
    const matchingTecnicos = existingTecnicos.filter((tecnico) => {
      const normalizedExistingNombres = normalize(tecnico.nombres);
      const normalizedExistingApellidoPaterno = normalize(
        tecnico.apellido_paterno
      );
      const normalizedExistingApellidoMaterno = normalize(
        tecnico.apellido_materno
      );

      const similarityNombres = similarityPercentage(
        normalizedNombres,
        normalizedExistingNombres
      );
      const similarityApellidoPaterno = similarityPercentage(
        normalizedApellidoPaterno,
        normalizedExistingApellidoPaterno
      );
      const similarityApellidoMaterno = similarityPercentage(
        normalizedApellidoMaterno,
        normalizedExistingApellidoMaterno
      );

      return (
        similarityNombres >= 30 ||
        similarityApellidoPaterno >= 30 ||
        similarityApellidoMaterno >= 30
      );
    });

    if (matchingTecnicos.length > 0) {
      return res.status(200).json({ tecnicosEncontrados: matchingTecnicos });
    } else {
      return res.status(200).json({ tecnicosEncontrados: [] });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createTecnico = async (req, res) => {
  const errors = await validationTecnico(req.body);

  // If there are errors, return them
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const {
    documento_identidad,
    tipo_documento,
    nombres,
    correo,
    apellido_paterno,
    apellido_materno,
    num_telefono,
    especialidad,
  } = req.body;

  const tecnico = new Tecnico({
    documento_identidad,
    tipo_documento,
    nombres,
    correo,
    apellido_paterno,
    apellido_materno,
    num_telefono,
    especialidad,
  });

  try {
    await tecnico.save();
    res.json({
      tecnico,
      currentPage: req.query.page || 1,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Hubo un error al guardar el tecnico: " + err.message });
  }
};

const checkTecnicoExists = async (id) => {
  try {
    const tecnico = await Tecnico.findById(id);
    return !!tecnico; // Convert to boolean
  } catch (err) {
    console.error("Error al verificar que el técnico existe:", err);
    return false;
  }
};

export const suspenderTecnico = async (req, res) => {
  const { id } = req.params;

  // Check if the technician exists
  const exists = await checkTecnicoExists(id);
  if (!exists) {
    return res.status(404).json({ error: "El técnico no existe" });
  }

  try {
    // Retrieve the technician from the database
    const tecnico = await Tecnico.findById(id);

    // Check if the technician's status is true
    if (!tecnico.estado) {
      return res.status(400).json({ error: "El técnico ya está suspendido" });
    }

    // Validate suspension data
    const errors = validateSuspension(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const { suceso, comentario, fecha_inicio, fecha_fin } = req.body;

    // Create a new historical record for the suspension
    const nuevoHistorial = {
      suceso,
      comentario,
      fecha_inicio: parseISO(fecha_inicio),
      fecha_fin: parseISO(fecha_fin),
    };

    // Add the historical record to the technician's history
    tecnico.historial_tecnico.push(nuevoHistorial);

    // Set the technician's status to false (suspended)
    tecnico.estado = false;

    // Save the updated technician data
    await tecnico.save();

    // Clear the 'tecnico' field in servicios for this technician
    await Servicio.updateMany(
      { tecnico: id, fecha_visita: { $gte: new Date() } }, // Query for services from today forward
      { $unset: { tecnico: 1 } } // Unset the 'tecnico' field
    );

    // Send a success response
    res.json({ message: "Técnico suspendido con éxito", tecnico });
  } catch (err) {
    // Handle errors
    res
      .status(500)
      .json({ error: "Hubo un error al suspender el técnico: " + err.message });
  }
};

export const quitarSuspensionTecnico = async (req, res) => {
  const { id } = req.params;

  // Check if the technician exists
  const exists = await checkTecnicoExists(id);
  if (!exists) {
    return res.status(404).json({ error: "El técnico no existe" });
  }

  try {
    // Retrieve the technician from the database
    const tecnico = await Tecnico.findById(id);

    // Check if the technician's status is false (suspended)
    if (tecnico.estado) {
      return res.status(400).json({ error: "El técnico no está suspendido" });
    }

    // Validate data for removing suspension
    const errors = validateQuitarSuspension(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const { suceso, comentario } = req.body;

    // Create a new historical record for suspension removal
    const nuevoHistorial = {
      suceso,
      comentario,
    };

    // Add the historical record to the technician's history
    tecnico.historial_tecnico.push(nuevoHistorial);

    // Set the technician's status to true (not suspended)
    tecnico.estado = true;

    // Save the changes
    await tecnico.save();

    // Send a success response
    res.json({ message: "Suspensión eliminada con éxito", tecnico });
  } catch (err) {
    // Handle errors
    res.status(500).json({
      error:
        "Hubo un error al quitar la suspensión del técnico: " + err.message,
    });
  }
};

export const updateTecnico = async (req, res) => {
  const { id } = req.params;

  // Check if the technician exists
  const exists = await checkTecnicoExists(id);
  if (!exists) {
    return res.status(404).json({ error: "El técnico no existe" });
  }

  const errors = await validationTecnico(req.body);
  console.log(errors)

  // If there are errors, return them
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const {
    documento_identidad,
    tipo_documento,
    nombres,
    correo,
    apellido_paterno,
    apellido_materno,
    num_telefono,
    especialidad,
    estado,
  } = req.body;

  try {
    await Tecnico.findByIdAndUpdate(id, {
      documento_identidad,
      tipo_documento,
      nombres,
      correo,
      apellido_paterno,
      apellido_materno,
      num_telefono,
      especialidad,
      estado,
    });
    res.json({ ...req.body });
  } catch (err) {
    res.json({ error: "Hubo un error al guardar el tecnico: " + err.message });
  }
};

export const deleteTecnico = async (req, res) => {
  const { id } = req.params;

  // Check if the technician exists
  const exists = await checkTecnicoExists(id);
  if (!exists) {
    return res.status(404).json({ error: "El técnico no existe" });
  }

  try {
    const tecnicoEliminado = await Tecnico.findOneAndDelete({ _id: id });

    if (!tecnicoEliminado) {
      return res.status(404).json({ message: "Tecnico no encontrado" });
    }

    return res.status(200).json({ message: "Tecnico eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el tecnico:", error);
    return res.status(500).json({ error: "Error al eliminar el tecnico" });
  }
};

export const getTecnico = async (req, res) => {
  const { id } = req.params;

  // Check if the technician exists
  const exists = await checkTecnicoExists(id);
  if (!exists) {
    return res.status(404).json({ error: "El técnico no existe" });
  }

  try {
    const tecnico = await Tecnico.findById(id);
    res.json(tecnico);
  } catch (err) {
    res.json({ error: "Hubo un error al obtener el tecnico: " + err.message });
    return;
  }
};

export const getAllTecnicos = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Page number
  const perPage = parseInt(req.query.perPage) || 10; // Clients per page
  
  try {
    const tecnicos = await Tecnico.find().populate({
      path: "especialidad",
      select: "nombre_especialidad",
      model: "Especialidad",
    }).sort({ createdAt: -1 })
    .skip((page - 1) * perPage)
    .limit(perPage);;

    const totalTecnicos = await Tecnico.countDocuments();

    res.json({
      tecnicos,
      currentPage: page,
      totalPages: Math.ceil(totalTecnicos / perPage),
    });
  } catch (error) {
    res.status(500).json({ message: "Hubo un error al obtener los tecnicos" });
  }
};

export const getAllAvailableTecnicos = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Page number
  const perPage = parseInt(req.query.perPage) || 10; // Clients per page
  
  try {
    const tecnicos = await Tecnico.find({ estado: true }).populate({
      path: "especialidad",
      select: "nombre_especialidad",
      model: "Especialidad",
    }).sort({ createdAt: -1 })
    .skip((page - 1) * perPage)
    .limit(perPage);;

    const totalTecnicos = await Tecnico.countDocuments();

    res.json({
      tecnicos,
      currentPage: page,
      totalPages: Math.ceil(totalTecnicos / perPage),
    });
  } catch (error) {
    res.status(500).json({ message: "Hubo un error al obtener los tecnicos" });
  }
};

export const findTecnico = async (req, res) => {
  const page = req.query.page || 1;
  const perPage = 50;

  try {
    var { data } = req.body;
    data = data.replace(/\s+/g, " ").trim().toUpperCase();
    const skipAmount = (page - 1) * perPage;

    const tecnicosEncontrados = await Tecnico.aggregate([
      {
        $lookup: {
          from: "especialidads",
          localField: "especialidad",
          foreignField: "_id",
          as: "especialidadDetails",
        },
      },
      {
        $unwind: {
          path: "$especialidadDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            { documento_identidad: { $regex: data, $options: "i" } },
            { nombres: { $regex: data, $options: "i" } },
            { apellido_paterno: { $regex: data, $options: "i" } },
            { apellido_materno: { $regex: data, $options: "i" } },
            { num_telefono: { $regex: data, $options: "i" } },
            {
              "especialidadDetails.nombre_especialidad": {
                $regex: data,
                $options: "i",
              },
            },
            { estado: { $regex: data, $options: "i" } },
            {
              $expr: {
                $cond: {
                  if: { $eq: [data, "ACTIVO"] },
                  then: { $eq: ["$estado", true] },
                  else: {
                    $cond: {
                      if: { $eq: [data, "SUSPENDIDO"] },
                      then: { $eq: ["$estado", false] },
                      else: null,
                    },
                  },
                },
              },
            },
            {
              $expr: {
                $regexMatch: {
                  input: {
                    $concat: [
                      "$nombres",
                      " ",
                      "$apellido_paterno",
                      " ",
                      "$apellido_materno",
                    ],
                  },
                  regex: data,
                  options: "i",
                },
              },
            },
          ],
        },
      },

      {
        $group: {
          _id: "$_id",
          documento_identidad: { $first: "$documento_identidad" },
          tipo_documento: { $first: "$tipo_documento" },
          nombres: { $first: "$nombres" },
          apellido_paterno: { $first: "$apellido_paterno" },
          apellido_materno: { $first: "$apellido_materno" },
          num_telefono: { $first: "$num_telefono" },
          tipoPersona: { $first: "$tipoPersona" },
          especialidad: { $first: "$especialidad" },
          estado: { $first: "$estado" },
          historial_tecnico: { $first: "$historial_tecnico" },
          fecha_creacion: { $first: "$fecha_creacion" },
          __v: { $first: "$__v" },
        },
      },
      {
        $lookup: {
          from: "especialidads",
          localField: "especialidad",
          foreignField: "_id",
          as: "especialidad",
        },
      },
      {
        $project: {
          documento_identidad: 1,
          tipo_documento: 1,
          nombres: 1,
          apellido_paterno: 1,
          apellido_materno: 1,
          num_telefono: 1,
          tipoPersona: 1,
          especialidad: {
            nombre_especialidad: 1,
          },
          estado: 1,
          historial_tecnico: 1,
          fecha_creacion: 1,
          __v: 1,
        },
      },
      {
        $sort: { fecha_creacion: -1 },
      },
      {
        $skip: skipAmount,
      },
      {
        $limit: perPage,
      },
    ]);

    res.json({
      tecnicos: tecnicosEncontrados,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: "Hubo un error al obtener los tecnicos" });
  }
};

cron.schedule("59 59 23 * * *", async () => {
  console.log("Ejecutando cron job a las 23:59:59");

  try {
    // Find all técnicos with estado false
    const tecnicos = await Tecnico.find({ estado: false });

    for (let tecnico of tecnicos) {
      // Get the last fecha_fin from the historial_tecnico
      const lastHistorial = tecnico.historial_tecnico.slice(-1)[0];

      if (lastHistorial) {
        const lastFechaFin = moment(lastHistorial.fecha_fin);

        // Check if lastFechaFin matches today's date
        if (lastFechaFin.isSame(moment(), "day")) {
          // Simulate req and res objects
          const req = {
            params: { id: tecnico._id },
            body: {
              suceso: "Reactivación automática",
              comentario: "Suspensión eliminada automáticamente",
            },
          };

          const res = {
            status: (code) => ({
              json: (data) => console.log(`Status: ${code}, Data:`, data),
            }),
            json: (data) => console.log(`Data:`, data),
          };

          // Call quitarSuspensionTecnico
          await quitarSuspensionTecnico(req, res);
        }
      }
    }
  } catch (err) {
    console.error("Error ejecutando el cron job:", err);
  }
});

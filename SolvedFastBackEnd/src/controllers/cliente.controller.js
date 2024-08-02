import Cliente from "../models/cliente.model.js";
import Servicio from "../models/servicio.model.js"
import { similarityPercentage } from "../js/levenshtein.js";
import validationCliente from "../validations/clienteValidation.js";

export const searchSimilarCliente = async (req, res) => {
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
    const existingClientes = await Cliente.find({
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
    });

    // Filter the results to find significant matches
    const matchingClientes = existingClientes.filter((cliente) => {
      const normalizedExistingNombres = normalize(cliente.nombres);
      const normalizedExistingApellidoPaterno = normalize(
        cliente.apellido_paterno
      );
      const normalizedExistingApellidoMaterno = normalize(
        cliente.apellido_materno
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

    if (matchingClientes.length > 0) {
      return res.status(200).json({ clientesEncontrados: matchingClientes });
    } else {
      return res.status(200).json({ clientesEncontrados: [] });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createCliente = async (req, res) => {
  const errors = await validationCliente(req.body);

  // If there are errors, return them
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const {
    documento_identidad,
    tipo_documento,
    nombres,
    apellido_paterno,
    apellido_materno,
    num_telefono,
    distrito,
    provincia,
    direccion,
    referencia,
    comentario,
    forceCreate,
  } = req.body;

  const cliente = new Cliente({
    documento_identidad,
    tipo_documento,
    nombres,
    apellido_paterno,
    apellido_materno,
    num_telefono,
    distrito,
    provincia,
    direccion,
    referencia,
    comentario,
  });

  try {
    await cliente.save();
    res.json(cliente);
  } catch (err) {
    res.json({ error: "Hubo un error al guardar el cliente: " + err.message });
    console.log(err);

    return;
  }
};

const checkClienteExists = async (id) => {
  try {
    const cliente = await Cliente.findById(id);
    return !!cliente; // Convert to boolean
  } catch (err) {
    console.error("Error al verificar que el cliente existe:", err);
    return false;
  }
};

export const updateCliente = async (req, res) => {
  const { id } = req.params;

  console.log(req.params);
  console.log(req.body);
  const exists = await checkClienteExists(id);
  if (!exists) {
    return res.status(404).json({ error: "El cliente no existe" });
  }

  const errors = await validationCliente(req.body);

  // If there are errors, return them
  if (errors.length > 0) {
    console.log(errors);
    return res.status(400).json({ errors });
  }

  const {
    documento_identidad,
    tipo_documento,
    nombres,
    apellido_paterno,
    apellido_materno,
    num_telefono,
    distrito,
    provincia,
    direccion,
    referencia,
    comentario,
  } = req.body;

  try {
    await Cliente.findByIdAndUpdate(id, {
      documento_identidad,
      tipo_documento,
      nombres,
      apellido_paterno,
      apellido_materno,
      num_telefono,
      distrito,
      provincia,
      direccion,
      referencia,
      comentario,
    });

    res.json({ _id: id, ...req.body });
  } catch (err) {
    res.json({ error: "Hubo un error al guardar el cliente: " + err.message });
  }
};

export const getCliente = async (req, res) => {
  const { id } = req.params;

  const exists = await checkClienteExists(id);
  if (!exists) {
    return res.status(404).json({ error: "El cliente no existe" });
  }

  try {
    const cliente = await Cliente.findById(id);
    res.json(cliente);
  } catch (err) {
    res.json({ error: "Hubo un error al obtener el cliente: " + err.message });
    return;
  }
};

export const getAllClientes = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Page number
  const perPage = parseInt(req.query.perPage) || 10; // Clients per page

  try {
    const clientes = await Cliente.find()
      .populate({
        path: "historial_servicios",
        populate: {
          path: "tecnico",
        },
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    const totalClientes = await Cliente.countDocuments();

    res.json({
      clientes,
      currentPage: page,
      totalPages: Math.ceil(totalClientes / perPage),
    });
  } catch (error) {
    res.status(500).json({ message: "Hubo un error al obtener los clientes" });
  }
};

export const findCliente = async (req, res) => {
  const page = req.query.page || 1;
  const perPage = 50;

  try {
    var { data } = req.body;
    data = data.replace(/\s+/g, " ").trim().toUpperCase();

    const skipAmount = (page - 1) * perPage;

    const regex = new RegExp(data, "i");

    const clientesEncontrados = await Cliente.find({
      $or: [
        { documento_identidad: { $regex: data, $options: "i" } },
        { nombres: { $regex: data, $options: "i" } },
        { apellido_paterno: { $regex: data, $options: "i" } },
        { apellido_materno: { $regex: data, $options: "i" } },
        { num_telefono: { $regex: data, $options: "i" } },
        { distrito: { $regex: data, $options: "i" } },
        { provincia: { $regex: data, $options: "i" } },
        { direccion: { $regex: data, $options: "i" } },
        { referencia: { $regex: data, $options: "i" } },
        { comentario: { $regex: data, $options: "i" } },
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
              regex: regex,
            },
          },
        },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(perPage);

    const totalClientes = await Cliente.countDocuments({
      $or: [
        { documento_identidad: { $regex: data, $options: "i" } },
        { nombres: { $regex: data, $options: "i" } },
        { apellido_paterno: { $regex: data, $options: "i" } },
        { apellido_materno: { $regex: data, $options: "i" } },
        { num_telefono: { $regex: data, $options: "i" } },
        { distrito: { $regex: data, $options: "i" } },
        { provincia: { $regex: data, $options: "i" } },
        { direccion: { $regex: data, $options: "i" } },
        { referencia: { $regex: data, $options: "i" } },
        { comentario: { $regex: data, $options: "i" } },
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
              regex: regex,
            },
          },
        },
      ],
    });

    res.json({
      clientes: clientesEncontrados,
      currentPage: page,
      totalPages: Math.ceil(totalClientes / perPage),
    });
  } catch (error) {
    res.status(500).json({ message: "Hubo un error al obtener los clientes" });
  }
};

export const deleteCliente = async (req, res) => {
  const { id } = req.params;

  const exists = await checkClienteExists(id);
  if (!exists) {
    return res.status(404).json({ error: "El cliente no existe" });
  }

  try {
    const clienteEliminado = await Cliente.findOneAndDelete({ _id: id });

    if (!clienteEliminado) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    await Servicio.deleteMany({ cliente: clienteEliminado._id });

    return res.status(200).json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el cliente:", error);
    return res.status(500).json({ error: "Error al eliminar el cliente" });
  }
};

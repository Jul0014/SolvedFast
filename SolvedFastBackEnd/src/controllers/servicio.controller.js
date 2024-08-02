import Servicio from "../models/servicio.model.js";
import Cliente from "../models/cliente.model.js";
import Reprogramacion from "../models/reprogramacion.model.js"

const groupServicesByClient = (servicios) => {
  return servicios.reduce((accumulator, servicio) => {
    const { cliente } = servicio;
    const clienteId = cliente._id.toString();

    if (servicio === null) {
      return accumulator; // Skip this iteration if servicio is null
    }

    const servicioData = {
      numero_llamada: servicio.numero_llamada,
      marca: servicio.producto ? servicio.producto.marca : "",
      turno: servicio.turno,
      tecnico: servicio.tecnico,
      producto: servicio.producto,
      tipo_servicio: servicio.tipo_servicio,
      comentario: servicio.comentario,
      color: servicio.color,
    };

    const foundIndex = accumulator.findIndex(
      (item) => item.cliente._id.toString() === clienteId
    );

    if (foundIndex !== -1) {
      accumulator[foundIndex].servicios.push(servicioData);
    } else {
      accumulator.push({
        cliente,
        servicios: [servicioData],
      });
    }

    return accumulator;
  }, []);
};

export const asignarServicio = async (req, res) => {
  const { date, idTecnico, clienteId } = req.body; // Assuming you pass clienteId in the request body
  console.log(req.body)
  const day = new Date(date);

  try {
    // Retrieve services for the specified day and client
    const servicios = await Servicio.find({ fecha_visita: day, 'cliente': clienteId })
      .populate({
        path: 'cliente',
        select: 'nombres apellido_paterno apellido_materno num_telefono distrito direccion referencia',
      })
      .populate({
        path: 'producto',
        select: 'nombre_producto marca',
      })
      .populate({
        path: 'tecnico',
        select: 'nombres',
      });

    if (servicios.length === 0) {
      return res.status(500).json({ message: 'No hay servicios para mostrar' });
    }

    // Update technician for each service
    for (const servicio of servicios) {
      await Servicio.findByIdAndUpdate(servicio._id, { tecnico: idTecnico });
    }

    res.json({ mensaje: "Asignación satisfactoria" });

  } catch (error) {
    console.error('Error al asignar técnico a servicios:', error);
    res.status(500).json({ mensaje: "Error al asignar" });
  }
};

export const reprogramarServicio = async (req, res) => {
  const { id, date } = req.body;

  try {
    // Find the existing service
    const servicio = await Servicio.findById(id);
    if (!servicio) {
      return res.status(404).json({ message: "No se ha encontrado el servicio." });
    }

    // Create a new reprogramacion document
    const newReprogramacion = new Reprogramacion({
      servicio: servicio._id,
      fecha_inicial_servicio: servicio.fecha_visita,
    });
    await newReprogramacion.save();

    // Update the service's fecha_visita and historial_reprogramaciones
    servicio.fecha_visita = new Date(date);
    servicio.historial_reprogramaciones.push(newReprogramacion._id);
    await servicio.save();

    return res.status(200).json({ message: "Actualizado correctamente.", servicio });
  } catch (error) {
    return res.status(500).json({ message: "Hubo un error al reprogramar el servicio: " + error.message });
  }
};

export const createServicio = async (req, res) => {
  const {
    cliente,
    historial_reprogramaciones,
    numero_llamada,
    tienda,
    marca,
    producto,
    serie,
    fecha_visita,
    tipo_servicio,
    estado_realizado,
    turno,
    color,
    comentario,
    tecnico,
  } = req.body;

  const servicio = new Servicio({
    cliente,
    historial_reprogramaciones,
    numero_llamada,
    tienda,
    marca,
    producto,
    serie,
    fecha_visita,
    tipo_servicio,
    estado_realizado,
    turno,
    color,
    comentario,
    tecnico,
  });

  try {
    await servicio.save();
    res.status(201).json(servicio);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Hubo un error al guardar el servicio: " + err.message });
  }
};

export const updateServicio = async (req, res) => {
  const {
    _id,
    numero_llamada,
    tienda,
    producto,
    serie,
    fecha_visita,
    tipo_servicio,
    estado_realizado,
    turno,
    color,
    comentario,
  } = req.body;

  try {
    const servicio = await Servicio.findByIdAndUpdate(
      _id,
      {
        numero_llamada,
        tienda,
        producto: producto._id,
        serie,
        fecha_visita,
        tipo_servicio,
        estado_realizado,
        turno,
        color,
        comentario,
      },
      { new: true }
    );

    if (!servicio) {
      return res.status(404).json({ message: "Servicio no encontrado" });
    }

    res.status(200).json(servicio);
  } catch (err) {
    res.status(500).json({
      error: "Hubo un error al actualizar el servicio: " + err.message,
    });
  }
};

export const deleteServicio = async (req, res) => {
  const { id_servicio } = req.params;

  try {
    const servicioEliminado = await Servicio.findOneAndDelete({
      _id: id_servicio,
    });

    if (!servicioEliminado) {
      return res.status(404).json({ message: "Servicio no encontrado" });
    }

    return res
      .status(200)
      .json({ message: "Servicio eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el servicio:", error);
    return res.status(500).json({ error: "Error al eliminar el servicio" });
  }
};

export const checkServicio = async (req, res) => {
  const { id } = req.params;

  try {
    const servicio = await Servicio.findById(id);

    if (!servicio) {
      return res.status(404).json({ message: "El servicio no fue encontrado" });
    }

    servicio.estado_realizado = !servicio.estado_realizado;
    await servicio.save();

    res.status(200).json({ message: "Servicio checkeado correctamente" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Hubo un error al checkear el servicio: " + err.message });
  }
};

export const getServiciosCliente = async (req, res) => {
  const { id_cliente } = req.params;

  try {
    const cliente = await Cliente.findById(id_cliente)
      .populate("hist_servicios")
      .exec();

    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    res.status(200).json(cliente.hist_servicios);
  } catch (err) {
    res.status(500).json({
      error: "Hubo un error al obtener los servicios: " + err.message,
    });
  }
};

export const getServicio = async (req, res) => {
  const { id_servicio } = req.params;

  try {
    const servicio = await Servicio.findById(id_servicio);

    if (!servicio) {
      return res.status(404).json({ message: "Servicio no encontrado" });
    }

    res.status(200).json(servicio);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Hubo un error al obtener el servicio: " + err.message });
  }
};

export const getAllServicios = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 50;

  try {
    const count = await Servicio.countDocuments();
    const servicios = await Servicio.find()
      .sort({ createdAt: -1 })
      .populate({ path: "cliente", select: "nombre_apellido" })
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      servicios,
      currentPage: page,
      totalPages: Math.ceil(count / perPage),
    });
  } catch (err) {
    res.status(500).json({
      error: "Hubo un error al obtener los servicios: " + err.message,
    });
  }
};

export const findServicio = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 50;
  const data = String(req.body.data || "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

  const skipAmount = (page - 1) * perPage;

  try {
    const clienteIds = await Cliente.find({
      nombre_apellido: { $regex: data, $options: "i" },
    }).select("_id");

    const serviciosEncontrados = await Servicio.find({
      $or: [
        { numero_llamada: { $regex: data, $options: "i" } },
        { cliente: { $in: clienteIds } },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(perPage)
      .populate("cliente");

    const totalServicios = await Servicio.countDocuments({
      $or: [
        { numero_llamada: { $regex: data, $options: "i" } },
        { cliente: { $in: clienteIds } },
      ],
    });

    res.status(200).json({
      servicios: serviciosEncontrados,
      currentPage: page,
      totalPages: Math.ceil(totalServicios / perPage),
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Hubo un error al buscar los servicios: " + err.message });
  }
};

export const countServiciosByDate = async (req, res) => {
  const { fecha1 } = req.params;

  console.log(fecha1)
  try {
    const day = new Date(`${fecha1}T00:00:00Z`);

    const count = await Servicio.countDocuments({
      fecha_visita: day
    });

    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({
      error: "Hubo un error al obtener el número de servicios: " + err.message
    });
  }
};

export const getServiciosByDate = async (req, res) => {
  const { fecha2 } = req.params; 
  console.log(fecha2)
  try {
    const day = new Date(`${fecha2}T00:00:00Z`);

    const servicios = await Servicio.find({
      fecha_visita: day
    });

    res.status(200).json({ servicios });
  } catch (err) {
    res.status(500).json({
      error: "Hubo un error al obtener los servicios por día: " + err.message
    });
  }
};


// Function to count services for a specific client and date
export const countServiciosByClienteAndDate = async (req, res) => {
  const { id, date } = req.params;
  const day = new Date(`${date}T00:00:00Z`);

  try {
    const count = await Servicio.countDocuments({
      cliente: id,
      fecha_visita: day
    });

    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({
      error: "Hubo un error al obtener el número de servicios: " + err.message
    });
  }
};

export const deleteServiciosWithoutCliente = async (req, res) => {
  try {
    // Find all servicios and populate the cliente field
    const servicios = await Servicio.find().populate('cliente');

    // Filter servicios where cliente is null
    const serviciosWithoutCliente = servicios.filter(servicio => servicio.cliente === null);

    // Get the ids of servicios without cliente
    const idsToDelete = serviciosWithoutCliente.map(servicio => servicio._id);

    if (idsToDelete.length > 0) {
      // Delete servicios where cliente is null
      await Servicio.deleteMany({ _id: { $in: idsToDelete } });
    }

    return res.status(200).json({
      message: "Servicios sin cliente eliminados correctamente",
      deletedCount: idsToDelete.length,
    });
  } catch (error) {
    console.error("Error al eliminar servicios sin cliente:", error);
    return res.status(500).json({ error: "Error al eliminar servicios sin cliente" });
  }
};

export const deleteServiciosWithoutProduct = async (req, res) => {
  try {
    // Find all servicios and populate the cliente field
    const servicios = await Servicio.find().populate('producto');

    // Filter servicios where cliente is null
    const serviciosWithoutProduct= servicios.filter(servicio => servicio.producto === null);

    // Get the ids of servicios without cliente
    const idsToDelete = serviciosWithoutProduct.map(servicio => servicio._id);

    if (idsToDelete.length > 0) {
      // Delete servicios where cliente is null
      await Servicio.deleteMany({ _id: { $in: idsToDelete } });
    }

    return res.status(200).json({
      message: "Servicios sin producto eliminados correctamente",
      deletedCount: idsToDelete.length,
    });
  } catch (error) {
    console.error("Error al eliminar servicios sin producto:", error);
    return res.status(500).json({ error: "Error al eliminar servicios sin producto" });
  }
};
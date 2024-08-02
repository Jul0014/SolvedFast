import Servicio from "../models/servicio.model.js";
import ExcelJS from "exceljs";
import fs from 'fs/promises'; // Use promises version of fs
import path from 'path';
import pkg from 'bluebird';
const { promisify } = pkg;
import libre from 'libreoffice-convert';
import { fileURLToPath } from 'url';
import axios from 'axios';
import dotenv from 'dotenv';
import nodemailer from "nodemailer";

dotenv.config();

const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const distritos = [
  "YURA", "CERRO COLORADO", "CAYMA", "YANAHUARA", "SACHACA", "UCHUMAYO",
  "AREQUIPA", "ALTO SELVA ALEGRE", "MIRAFLORES", "MARIANO MELGAR", "PAUCARPATA",
  "JOSE LUIS BUSTAMANTE Y RIVERO", "JACOBO HUNTER", "SOCABAYA", "CHARACATO",
  "MOLLENDO", "MEJIA", "PUNTA DE BOMBON", "MATARANI",
];

const ordenarServiciosPorDistrito = (servicios) => {
  return servicios.sort((a, b) => {
    const distritoAIndex = distritos.indexOf(a.cliente.distrito);
    const distritoBIndex = distritos.indexOf(b.cliente.distrito);

    if (distritoAIndex === -1) return 1;
    if (distritoBIndex === -1) return -1;

    return distritoAIndex - distritoBIndex;
  });
};

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

export const sendFile = async (req, res) => {
  const { date } = req.body;
  const day = new Date(date); // Parse date string into Date object

  if (isNaN(day.getTime())) {
    return res.status(400).json({ message: 'Invalid date format' });
  }

  try {
    // Retrieve data from database and prepare Excel
    const servicios = await Servicio.find({ fecha_visita: day })
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
        select: 'nombres correo',
      });

    if (servicios.length === 0) {
      return res.status(500).json({ message: 'No hay servicios para mostrar' });
    }

    // Get unique technicians
    const tecnicos = servicios.map(servicio => servicio.tecnico);
    const uniqueTecnicos = [...new Set(tecnicos.filter(tecnico => tecnico !== undefined).map(tecnico => JSON.stringify(tecnico)))].map(tecnico => JSON.parse(tecnico));

    // Group services by technician
    const sortedServicios = ordenarServiciosPorDistrito(servicios);
    const serviciosPorCliente = groupServicesByClient(sortedServicios);

    // Create a temporary directory
    const __dirname = fileURLToPath(new URL('.', import.meta.url));
    const tempDir = path.join(__dirname, 'temp');
    await fs.mkdir(tempDir, { recursive: true });

    // Generate and send PDF report for each technician
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
    });

    for (const tecnico of uniqueTecnicos) {
      const serviciosTecnico = serviciosPorCliente.filter(servicio => {
        return servicio.servicios.some(s => {
          const tecnicoId = s.tecnico && s.tecnico._id; // Check if tecnico and _id exist
          return tecnicoId && tecnicoId.toString() === tecnico._id.toString();
        });
      });
    
      if (serviciosTecnico.length === 0) {
        console.log(`No services found for technician ${tecnico.nombres}`);
        continue; // Skip if no services found for this technician
      }

      // Create Excel workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Servicios');
      worksheet.pageSetup.fitToPage = true; // Fit to one page
      worksheet.pageSetup.orientation = 'landscape'; // Set landscape orientation

      // Define worksheet columns
      worksheet.columns = [
        { header: 'Número de Llamada', key: 'numeroLlamada', width: 20 },
        { header: 'Descripción', key: 'descripcion', width: 80 },
        { header: 'Turno', key: 'turno', width: 10 },
        { header: 'Color', key: 'color', width: 15 },
        { header: 'Técnico', key: 'tecnico', width: 20 },
      ];

      // Populate Excel worksheet with data for this technician
      serviciosTecnico.forEach((servicio) => {
        const { cliente, servicios } = servicio;
        const { productos, comentarios, numeroLlamada } = makeDescription(servicios);
        const turno = servicios[0].turno.toUpperCase();

        const row = worksheet.addRow({
          numeroLlamada: numeroLlamada.toUpperCase(),
          descripcion: '',
          turno,
          color: colorDescriptions[servicios[0].color],
          tecnico: servicios[0].tecnico ? servicios[0].tecnico.nombres.toUpperCase() : '',
        });

        const listaTelefonos = makeTelephons(cliente.num_telefono);
        const descriptionText = [
          { text: `${cliente.nombres.toUpperCase()} ${cliente.apellido_paterno.toUpperCase()} ${cliente.apellido_materno.toUpperCase()}`, font: { bold: true } },
          { text: ` ${listaTelefonos} `, font: { color: { argb: 'FF0000' }, bold: true } },
          { text: ` ${cliente.distrito.toUpperCase()} `, font: { color: { argb: '800080' }, bold: true } },
          { text: ` ${cliente.direccion.toUpperCase()} Ref/ ${cliente.referencia.toUpperCase()} - ${productos.toUpperCase()} `, font: { bold: true } },
          { text: `${comentarios.toUpperCase()}`, font: { color: { argb: 'FF0000' }, bold: true } },
        ];

        if (servicios[0].tipo_servicio == 'REVISION') {
          worksheet.getCell(`A${row.number}`).value = { richText: [{ text: numeroLlamada.toUpperCase(), font: { bold: true, color: { argb: '008000' } } }] };
        } else {
          worksheet.getCell(`A${row.number}`).value = { richText: [{ text: numeroLlamada.toUpperCase(), font: { bold: true } }] };
        }

        worksheet.getCell(`B${row.number}`).value = { richText: descriptionText };

        const turnoCell = worksheet.getCell(`C${row.number}`);
        turnoCell.font = { bold: true };

        if (turno === 'T/M' || turno === 'T/T') {
          turnoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
        }

        const colorCell = worksheet.getCell(`D${row.number}`);
        if (colorDescriptions[servicios[0].color]) {
          colorCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: getColorCode(servicios[0].color) } };
          colorCell.font = { bold: true };
        }

        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          cell.alignment = { wrapText: true, vertical: 'middle' };
        });
      });

      // Write Excel file to a buffer
      const excelBuffer = await workbook.xlsx.writeBuffer();

      // Write Excel buffer to a temporary file
      const tempExcelFile = path.join(tempDir, `${tecnico.nombres}_${date}.xlsx`);
      await fs.writeFile(tempExcelFile, excelBuffer);

      // Convert Excel data to PDF using libreoffice-convert
      const xlsxBuf = await fs.readFile(tempExcelFile);
      const convertAsync = promisify(libre.convert);
      const pdfFile = await convertAsync(xlsxBuf, '.pdf', undefined);

      // Write PDF buffer to a temporary file
      const tempPDFFile = path.join(tempDir, `${tecnico.nombres}_${date}.pdf`);
      await fs.writeFile(tempPDFFile, pdfFile);

      // Send email with the PDF attachment
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: tecnico.correo, // Assuming 'correo' is the email field of tecnico
        subject: 'PDF Report',
        text: 'Attached is the PDF report generated.',
        attachments: [{
          filename: `${tecnico.nombres}_${date}.pdf`,
          path: tempPDFFile,
        }],
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
      } catch (error) {
        console.error('Error sending email:', error);
      }

      // Clean up temporary files after sending email
      await fs.unlink(tempExcelFile);
      await fs.unlink(tempPDFFile);
    }

    res.status(200).json({ message: 'Emails sent successfully.' });

  } catch (err) {
    console.error('Error exporting Excel to PDF:', err);
    res.status(500).json({ message: 'Error exporting Excel to PDF' });
  }
};

const colorDescriptions = {
  PINK: "REPUESTO",
  GRAY: "COBRAR",
  BLUE: "TRANSPORTE",
  YELLOW: "URGENTE",
  ORANGE: "POSTERGADO",
  RED: "RECLAMO",
  PURPLE: "VENTA",
};

const makeDescription = (servicios) => {
  let productos = "";
  let comentarios = " ";
  let numeroLlamada = "";

  servicios.map((servicio, i) => {
    if (i != 0) {
      productos += " - ";
      numeroLlamada += "\n";
    }
    if (i != 0 && servicio.comentario != "") comentarios += " // ";

    productos += servicio.producto ? `${servicio.producto.nombre_producto} (${servicio.tipo_servicio})`: "";
    comentarios += servicio.comentario;
    numeroLlamada += servicio.producto ? servicio.producto.marca + " / " + servicio.numero_llamada : "";
  });

  return { productos, comentarios, numeroLlamada };
};

const makeTelephons = (telfs) => {
  return telfs.join("/");
};

const getColorCode = (colorDescription) => {
  switch (colorDescription) {
    case "PINK":
      return "FFC0CB"; // Rosa
    case "GRAY":
      return "808080"; // Gris
    case "BLUE":
      return "0000FF"; // Azul
    case "YELLOW":
      return "FFFF00"; // Amarillo
    case "ORANGE":
      return "FFA500"; // Naranja
    case "RED":
      return "FF0000"; // Rojo
    case "PURPLE":
      return "800080"; // Morado
    default:
      return "FFFFFF"; // Blanco (si no hay coincidencia)
  }
};
import request from "supertest";
import app from "../src/app.js";


describe("API Servicio", () => {

    test("Get Servicios", async () => {
        const response = await request(app).get("/api/servicios?page=1").send();
        
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.tecnicos).toBeInstanceOf(Array);
        expect(response.body.currentPage).toBe("1");  
        xpect(response.body.totalPages).toBeGreaterThan(0); 
    })

})

describe("API Tecnicos", () => {
    
    // test("Delete Técnico", async () => {
    // const tecnicoId = "664fad334f8d2efd50b937fb"
    //     const response = await request(app).delete(`/api/tecnico/${tecnicoId}`).send();
    
    //     expect(response.status).toBe(200);
    
    //     expect(response.body).toBeInstanceOf(Object);
    //     expect(response.body.message).toBe("Tecnico eliminado correctamente");
    // });

    // test("Delete Técnico - Técnico no encontrado", async () => {
    //     const tecnicoId = "664fad334f8d2efd50b937fb"

    //     const response = await request(app).delete(`/api/tecnico/${tecnicoId}`).send();

    //     expect(response.status).toBe(404);

    //     expect(response.body).toBeInstanceOf(Object);
    //     expect(response.body.message).toBe("Tecnico no encontrado");
    // });

    // test("Update Tecnicos", async () => {
    //     const tecnicoId = "664e739cd96381422bed9d54"
    //     const updatedTecnico = {
    //         documento_identidad: "87654321",
    //         tipo_documento: 1,
    //         nombres: "Pedro",
    //         apellido_paterno: "López",
    //         apellido_materno: "Martínez",
    //         num_telefono: "123456789",
    //         especialidad: ["664fac2ac8794db4861ef772"],
    //         estado: false
    //       };
      
    //       const response = await request(app).put(`/api/tecnico/${tecnicoId}`).send(updatedTecnico);
      
    //       expect(response.status).toBe(200);
      
    //       expect(response.body).toBeInstanceOf(Object);
          
    //       console.log(response.body);
    //       expect(response.body.documento_identidad).toBe(updatedTecnico.documento_identidad);
    //       expect(response.body.tipo_documento).toBe(updatedTecnico.tipo_documento);
    //       expect(response.body.nombres).toBe(updatedTecnico.nombres);
    //       expect(response.body.apellido_paterno).toBe(updatedTecnico.apellido_paterno);
    //       expect(response.body.apellido_materno).toBe(updatedTecnico.apellido_materno);
    //       expect(response.body.estado).toBe(updatedTecnico.estado);

    // })

    // test("Get Tecnicos", async () => {

    //     const response = await request(app).get("/api/tecnicos?page=1").send();
        
    //     expect(response.body).toBeInstanceOf(Object);
    //     expect(response.body.tecnicos).toBeInstanceOf(Array);
    //     expect(response.body.currentPage).toBe("1");  
    //     // Falta este --> expect(response.body.totalPages).toBeGreaterThan(0); 

    // })

    // test("Create Tecnico", async () => {
    //     const newTecnico = {
    //         documento_identidad: "12345678",
    //         tipo_documento: 1,
    //         nombres: "Juan ",
    //         apellido_paterno: "Arnalodo",
    //         apellido_materno: "Lopez",
    //         num_telefono: ["987654321"],
    //         especialidad: ["664fac2ac8794db4861ef772"]
    //     }
    //     const response = await request(app).post("/api/tecnico").send(newTecnico);

    //     expect(response.status).toBe(200);

    //     expect(response.body).toBeInstanceOf(Object);

    //     expect(response.body.tecnico.documento_identidad).toBe(newTecnico.documento_identidad);
    //     expect(response.body.tecnico.tipo_documento).toBe(newTecnico.tipo_documento);
    //     expect(response.body.tecnico.nombres).toBe(newTecnico.nombres);
    //     expect(response.body.tecnico.apellido_paterno).toBe(newTecnico.apellido_paterno);
    //     expect(response.body.tecnico.apellido_materno).toBe(newTecnico.apellido_materno);

    // })


})

describe("API Clientes", () => {  

    // test("Get Clientes", async () => {
    //     const response = await request(app).get("/api/clientes?page=1").send();
        
    //     expect(response.body).toBeInstanceOf(Object);
    //     expect(response.body.clientes).toBeInstanceOf(Array);
    //     expect(response.body.currentPage).toBe("1");  
    //     expect(response.body.totalPages).toBeGreaterThan(0); 
    // });
   

    // test("Create Cliente", async () => {
    //     const newCliente = {
    //         documento_identidad: "12345678",
    //         tipo_documento: 1,
    //         nombres: "Luzito",
    //         apellido_paterno: "Pérez",
    //         apellido_materno: "Gómez",
    //         num_telefono: "987654321",
    //         distrito: "Lima",
    //         provincia: "Lima",
    //         direccion: "Av. Siempre Viva 123",
    //         referencia: "Cerca del parque",
    //         comentario: "Cliente frecuente"
    //     };

    //     const response = await request(app).post("/api/cliente").send(newCliente);

    //     expect(response.status).toBe(200);

    //     expect(response.body).toBeInstanceOf(Object);

    //     expect(response.body.documento_identidad).toBe(newCliente.documento_identidad);
    //     expect(response.body.tipo_documento).toBe(newCliente.tipo_documento);
    //     expect(response.body.nombres).toBe(newCliente.nombres);
    //     expect(response.body.apellido_paterno).toBe(newCliente.apellido_paterno);
    //     expect(response.body.apellido_materno).toBe(newCliente.apellido_materno);
    //     expect(response.body.distrito).toBe(newCliente.distrito);
    //     expect(response.body.provincia).toBe(newCliente.provincia);
    //     expect(response.body.direccion).toBe(newCliente.direccion);
    //     expect(response.body.referencia).toBe(newCliente.referencia);
    //     expect(response.body.comentario).toBe(newCliente.comentario);

    // });

     // test("Update a Cliente", async () => {

    //     const clienteId = "664f9ba8fc20b1d7e828c5d3"

    //     const updatedCliente = {
    //         documento_identidad: "12345678",
    //         tipo_documento: 1,
    //         nombres: "Luzito kbro",
    //         apellido_paterno: "Pérez",
    //         apellido_materno: "Gómez",
    //         num_telefono: ["987654321"],
    //         distrito: "Lima",
    //         provincia: "Lima",
    //         direccion: "Av. Siempre Viva 123",
    //         referencia: "Cerca del parque",
    //         comentario: "Cliente frecuente"
    //     }

    //     const response = await request(app).put(`/api/cliente/${clienteId}`).send(updatedCliente);
    //     expect(response.status).toBe(200);
    //     expect(response.body).toBeInstanceOf(Object);

    //     expect(response.body.documento_identidad).toBe(updatedCliente.documento_identidad);
    //     expect(response.body.tipo_documento).toBe(updatedCliente.tipo_documento);
    //     expect(response.body.nombres).toBe(updatedCliente.nombres);
    //     expect(response.body.apellido_paterno).toBe(updatedCliente.apellido_paterno);
    //     expect(response.body.apellido_materno).toBe(updatedCliente.apellido_materno);
    //     expect(response.body.distrito).toBe(updatedCliente.distrito);
    //     expect(response.body.provincia).toBe(updatedCliente.provincia);
    //     expect(response.body.direccion).toBe(updatedCliente.direccion);
    //     expect(response.body.referencia).toBe(updatedCliente.referencia);
    //     expect(response.body.comentario).toBe(updatedCliente.comentario);
    // })

    // test("Delete Cliente", async () => {

    //     const clienteId = "664f9ba8fc20b1d7e828c5d3"

    //     const response = await request(app).delete(`/api/cliente/${clienteId}`).send();
    
    //     expect(response.status).toBe(200);
    
    //     expect(response.body).toBeInstanceOf(Object);
    //     expect(response.body.message).toBe("Cliente eliminado correctamente");
    
    // });

    // test("Delete Cliente - Cliente no encontrado", async () => {
    //     const clienteId = "123"

    //     const response = await request(app).delete(`/api/clientes/${clienteId}`).send();
    
    //     expect(response.status).toBe(404);
    
    //     expect(response.body).toBeInstanceOf(Object);
    //     expect(response.body.message).toBe("Cliente no encontrado");
    // });

});

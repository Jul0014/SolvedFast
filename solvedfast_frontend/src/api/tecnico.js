import axios from "axios";

const token = localStorage.getItem('token'); 

//create
export const createTecnicoRequest = async (Tecnico) =>
  axios.post("/api/tecnico", Tecnico, 
    {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    }
    );

//read
export const getAllTecnicosRequest = async (page) =>
  axios.get(`/api/tecnicos?page=${page}`, {},
    {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    }
    );

export const getTecnicoRequest = async (id) => axios.get(`/api/tecnico/${id}`, 
  {
      headers: {
          "Authorization": `Bearer ${token}`,
      }
  }
  );

export const findTecnicoRequest = async (data, page) =>
  axios.post(`/api/tecnico/find?page=${page}`, data, 
    {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    }
    );

//update
export const updateTecnicoRequest = async (id, Tecnico) =>
  axios.put(`/api/tecnico/${id}`, Tecnico, 
    {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    }
    );

//delete
export const deleteTecnicoRequest = async (id) =>
  axios.delete(`/api/tecnico/${id}`, {}, 
    {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    }
    );
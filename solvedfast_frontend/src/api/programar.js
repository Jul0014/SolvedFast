import axios from "axios";

const token = localStorage.getItem('token'); 

export const programarRequest = (formData) =>
  axios.post("http://localhost:8000/api/programar", formData, 
    {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    }
    );
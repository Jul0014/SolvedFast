import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Paper,
} from "@mui/material";

export default function LoginPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState({ username: "", password: "" });
  const [error, setError] = useState(""); // State for error message

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/user/login", user);
      localStorage.setItem('token', response.data.token);
      if (response.status === 200) {
        // Handle successful login here
        navigate("/welcome"); // Adjust the path as needed
      }
    } catch (error) {
      setError("Error de inicio de sesión: " + (error.response?.data?.message || error.message)); // Set error message
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper elevation={3} sx={{ padding: 3, width: "100%" }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Iniciar Sesión
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Usuario"
            variant="outlined"
            fullWidth
            margin="normal"
            id="username"
            name="username"
            value={user.username}
            onChange={handleInputChange}
          />
          <TextField
            label="Contraseña"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            id="password"
            name="password"
            value={user.password}
            onChange={handleInputChange}
          />
          {error && (
            <Typography variant="body2" color="error" align="center">
              {error}
            </Typography>
          )}
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              id="iniciar_sesion"
              sx={{ width: "50%" }}
            >
              Iniciar Sesión
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

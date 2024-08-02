import * as React from 'react';
import { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const menuOptions = [
    { id: 0, name: "Home", color: "inherit", variant: "text", navigate: "/welcome" },
    { id: 1, name: "Programar", color: "primary", variant: "contained", navigate: "/programar" },
    { id: 2, name: "Técnicos", color: "inherit", variant: "text", navigate: "/tecnicos" },
    { id: 3, name: "Clientes", color: "inherit", variant: "text", navigate: "/clientes" },
    { id: 5, name: "Hoja de Trabajo", color: "inherit", variant: "text", navigate: "/hojatrabajo" },
    { id: 6, name: "Log Out", color: "inherit", variant: "text", navigate: "/logout" },
];

export default function Menu() {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeRoute, setActiveRoute] = useState(location.pathname);

    useEffect(() => {
        setActiveRoute(location.pathname);
    }, [location]);
      
    const handleNavigate = async (route) => {
        if (route === "/logout") {
            try {
                const token = localStorage.getItem('token');
    
                if (!token) {
                    console.error("No token found in localStorage.");
                    return;
                }
    
                // Send POST request to logout endpoint
                await axios.post("http://localhost:8000/api/user/logout", {}, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    }
                });
    
                // Clear token from localStorage
                localStorage.removeItem('token');
    
                // Redirect to login or home page after logout
                navigate("/"); // Assuming navigate is a function to handle routing
            } catch (error) {
                console.error("Error logging out:", error);
                // Handle error (e.g., show a notification)
            }
        } else {
            // Handle other routes
            navigate(route); // Assuming navigate is a function to handle routing
            setActiveRoute(route); // Optionally set active route state
        }
    };

    return (
        <AppBar position="static" color="transparent" sx={{ boxShadow: 0 }}>
            <Toolbar sx={{ justifyContent: "flex-end" }}>
                {menuOptions.map((option) => (
                    <Button
                        color={option.navigate === activeRoute ? "primary" : option.color}
                        variant={option.navigate === activeRoute ? "outlined" : option.variant}
                        sx={{ margin: 1 }}
                        key={option.id}
                        onClick={() => handleNavigate(option.navigate)}
                    >
                        {option.name}
                    </Button>
                ))}
            </Toolbar>
        </AppBar>
    );
}
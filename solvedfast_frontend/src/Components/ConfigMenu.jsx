import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

import BuildCircleIcon from '@mui/icons-material/BuildCircle';

const menuOptions = [
    { id: 1, name: "Catálogo de Productos", color: "inherit", variant: "text", navigate: "/productos" },
    { id: 2, name: "Categoría de Productos", color: "inherit", variant: "text", navigate: "/categorias" },
    { id: 3, name: "Especialidades de Técnicos", color: "inherit", variant: "text", navigate: "/especialidades" },
];

export default function ConfigMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [activeRoute, setActiveRoute] = React.useState(location.pathname);

    React.useEffect(() => {
        setActiveRoute(location.pathname);
    }, [location]);

    const handleNavigate = (route) => {
        navigate(route);
        setActiveRoute(route);
        handleClose();
    };

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <BuildCircleIcon fontSize="large" sx={{ color: "#C2C3C7" }} />
            </IconButton>

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {menuOptions.map((option) => (
                    <MenuItem
                        color={option.navigate === activeRoute ? "primary" : option.color}
                        variant={option.navigate === activeRoute ? "outlined" : option.variant}
                        sx={{ margin: 1 }}
                        key={option.id}
                        onClick={() => handleNavigate(option.navigate)}
                    >
                        {option.name}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}

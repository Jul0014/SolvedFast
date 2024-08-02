import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Welcome from "./Pages/Welcome";
import Tecnicos from "./Pages/Tecnicos";
import Clientes from "./Pages/Clientes";
import Programar from "./Pages/Programar";
import HojaTrabajo from "./Pages/HojaTrabajo";
import Productos from "./Pages/Productos";
import Especialidades from "./Pages/Especialidades";
import Categorias from "./Pages/Categorias";
import LoginPage from "./Pages/Login";
import NotFound from "./Pages/NotFound";
import PrivateRoute from "./js/PrivateRoute";

export default function App() {
  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/welcome" element={<PrivateRoute element={Welcome} />} />
          <Route path="/tecnicos" element={<PrivateRoute element={Tecnicos} />} />
          <Route path="/clientes" element={<PrivateRoute element={Clientes} />} />
          <Route path="/programar" element={<PrivateRoute element={Programar} />} />
          <Route path="/hojatrabajo" element={<PrivateRoute element={HojaTrabajo} />} />
          <Route path="/productos" element={<PrivateRoute element={Productos} />} />
          <Route path="/especialidades" element={<PrivateRoute element={Especialidades} />} />
          <Route path="/categorias" element={<PrivateRoute element={Categorias} />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer />
      </main>
    </Router>
  );
}
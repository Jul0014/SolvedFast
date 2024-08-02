import { createContext, useContext, useState } from "react";
import { 
        createTecnicoRequest,
        getAllTecnicosRequest,
        findTecnicoRequest,
        updateTecnicoRequest,
        deleteTecnicoRequest,
} from "../api/tecnico.js";

const TecnicoContext = createContext();

export const useTecnicos = () => {

    const context = useContext(TecnicoContext);
    if (!context) throw new Error("useAuth must be used within a AuthProvider");
    return context;
    };

    export const TecnicoProvider = ({ children }) => {
    const [tecnicos, setTecnicos] = useState([]);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const getAllTecnics = async (page) => {
        try {
        const res = await getAllTecnicosRequest(page);
        if (res.status === 200) {
            setTecnicos(res.data.tecnicos);
            setCurrentPage(res.data.currentPage);
            setTotalPages(res.data.totalPages);
            setLoading(false);
        }
        } catch (error) {
            setErrors(error.response.data.message);
        }
    };

    const findTecnico = async (data, page) => {
        try {
            const res = await findTecnicoRequest({ data }, page);
            setTecnicos(res.data.tecnicos);
            setCurrentPage(res.data.currentPage);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            setErrors(error.response.data.message);
        }
    };

    const findTecnicoReturn = async (data, page) => {
        try {
            const res = await findTecnicoRequest({ data }, page);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    };

    const createTecnico = async (data, page) => {
        try {
            const res = await createTecnicoRequest(data);
            if (res.status === 200) {
                getAllTecnics(currentPage);
                return res.data;
            }
        } catch (error) {
            setErrors(error.response.data.message);
        }
    };

    const deleteTecnico = async (id) => {
        try {
            const res = await deleteTecnicoRequest(id);
            if (res.status === 200) {
                getAllTecnics(currentPage);
            }
        } catch (error) {
            setErrors(error.response.data.message);
        }
    };

    const updateTecnico = async (id, data) => {
        try {
            const res = await updateTecnicoRequest(id, data);
            if (res.status === 200) {
                getAllTecnics(currentPage);
            }
        } catch (error) {
            setErrors(error.response.data.message);
        }
    };
    const handleSetCurrentPage = (page) => {
        setCurrentPage(page);
        getAllTecnics(page);
    };

    return (
        <TecnicoContext.Provider
        value={{
            tecnicos,
            currentPage,
            totalPages,
            errors,
            loading,
            setCurrentPage: handleSetCurrentPage,
            getAllTecnics,
            createTecnico,
            deleteTecnico,
            findTecnicoReturn,
            updateTecnico,
            findTecnico,
        }}
        >
        {children}
        </TecnicoContext.Provider>
    );
};
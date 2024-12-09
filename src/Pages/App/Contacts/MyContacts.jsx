import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { API_URL } from "../../../ExportUrl";
import { AuthContext } from "../../../Context/AuthContext";
import ReusableTable from "../../../Components/App/ReusableTable";
import "../../../Styles/css/custom-table.css";

export default function MyContacts() {
    const [contacts, setContacts] = useState([]);
    const { UserInfo } = useContext(AuthContext);

    // Función para obtener contactos desde la API
    const fetchContacts = async (search = "", last_id = null) => {
        try {
            const formData = new FormData();
            formData.append("id_company", UserInfo?.company?.id_company || "");
            if (search) formData.append("search", search);
            if (last_id) formData.append("last_id", last_id);

            const response = await axios.post(`${API_URL}/api/get/contacts`, formData, { withCredentials: true });
            setContacts(response.data?.result || []);
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    // Columnas configuradas para la tabla reutilizable
    const columns = [
        { key: "email", label: "Email" },
        { key: "name", label: "Nombre" },
        { key: "lastname", label: "Apellido" },
        { key: "phone", label: "Teléfono" },
        {
            key: "status",
            label: "Estatus",
            render: (value) => (
                <span className={`status-badge ${value === "Activo" ? "badge-green" : "badge-red"}`}>
                    {value || "Activo"}
                </span>
            ),
        },
        {
            key: "actions",
            label: "Acciones",
            render: (_, row) => (
                <button onClick={() => console.log(`Editar contacto ${row.email}`)} className="action-button">
                    ✏️
                </button>
            ),
        },
    ];

    return (
        <div>
            <div className="page-info">
                <div>
                    <p className="title">Mis Contactos</p>
                    <span>Esta es tu lista de contactos, puedes revisarlos y exportarlos</span>
                </div>
            </div>

            <div className="table-container">
                <ReusableTable
                    data={contacts}
                    columns={columns}
                    onSearch={(query) => fetchContacts(query)}
                    enablePagination
                    enableExport
                    enableRowSelection
                />
            </div>
        </div>
    );
}

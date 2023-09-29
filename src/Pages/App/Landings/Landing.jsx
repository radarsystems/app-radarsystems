import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../ExportUrl";

export default function Landing() {
    const params = useParams();

    useEffect(() => {
        function LoadHtml() {
            const formData = new FormData();
            formData.append("token", params.id);

            axios.post(API_URL + "/api/get/landing", formData)
                .then((response) => response.data)
                .then((data) => {
                    // Limpia el documento eliminando todos los elementos HTML existentes
                    document.documentElement.innerHTML = "";

                    // Agrega el nuevo HTML al documento
                    document.documentElement.innerHTML = data.html;
                });
        }

        LoadHtml();
    }, [params.id]);

    return null; // No es necesario devolver nada desde este componente
}

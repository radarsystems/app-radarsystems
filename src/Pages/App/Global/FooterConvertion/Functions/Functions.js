import axios from "axios";
import { API_URL } from "../../../../../ExportUrl";
import { useContext } from "react";
import { AuthContext } from "../../../../../Context/AuthContext";
import { downloadFile } from "../../../../../Functions/Global";


function updateLoading(fn, name, boolean) {
    fn(prevData => ({ ...prevData, [name]: boolean }));
}

export function DownloadContacts(id_lists, id_company, setLoading) {

    updateLoading(setLoading, "downloadContacts", true)
    let formData = new FormData()
    formData.append("id_company", id_company)
    formData.append("id_lists", id_lists);

    axios.post(API_URL + "/api/get/downloadContacts", formData, { withCredentials: true })
        .then((response) => { return response.data })
        .then((data) => {
            if (data.status) {
                downloadFile(API_URL + "/api/get/downloadfile?route=temp&name=" + data.name_file, "contacts")
            }
        })
        .finally(() => {
            updateLoading(setLoading, "downloadContacts", false)
        })
}
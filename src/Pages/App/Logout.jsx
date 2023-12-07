import { useEffect } from "react"
import { SetCookie } from "../../Functions/Global"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../ExportUrl";

export function Logout() {

    const Navigator = useNavigate()

    useEffect(() => {

        axios.get(API_URL + "/api/get/logout", { withCredentials: true })
            .then((response) => { return response.json })
            .then((data) => {
                SetCookie('token', "", true);
                SetCookie('company', "", true)
                window.location.href = "/"
            })
            .catch((err) => {
                SetCookie('token', "", true);
                SetCookie('company', "", true)
                window.location.href = "/"
            })
    }, [])

    return (
        <>

        </>
    )
}
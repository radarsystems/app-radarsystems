import axios from "axios"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { API_URL } from "../../../ExportUrl"
import { useContext } from "react"
import { AuthContext } from "../../../Context/AuthContext"
import { useEffect } from "react"

export default function ButtonsStats() {

    const params = useParams()
    const [stat, setStat] = useState()
    const { UserInfo } = useContext(AuthContext)

    function searchStat() {
        let formData = new FormData()

        formData.append("token", params.id);
        formData.append("id_company", UserInfo?.company?.id_company)

        axios.post(API_URL + "/api/get/statbuttons", formData, { withCredentials: true })
    }

    useEffect(() => {
        searchStat()
    }, [])

    return (
        <>
            <div className="page-info">
                <div className="">
                    <p className="title">Botonera: {params.id}</p>
                    <span>Estas son las estadisticas de tu encuesta</span>
                </div>
            </div>


            <div className="row">
                <div className="col-md-6">
                    <div className="box stat box-padding">
                        <div className="top">
                            <p>Estadisticas de enlaces</p>
                        </div>

                        <div className="result countryr">

                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    lorem
                </div>
            </div>
        </>
    )
}
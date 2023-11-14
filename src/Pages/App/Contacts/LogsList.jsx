import axios from "axios"
import { IoArrowBackOutline } from "react-icons/io5"
import { useNavigate, useParams } from "react-router-dom"
import { API_URL } from "../../../ExportUrl"
import { useEffect } from "react"
import { useState } from "react"
import { useContext } from "react"
import { AuthContext } from "../../../Context/AuthContext"

export default function LogsList() {

    const Navigator = useNavigate()
    const params = useParams()
    const [intentUpload, setIntentUpload] = useState([])
    const { UserInfo } = useContext(AuthContext)

    function getIntentUpload() {
        let formData = new FormData()
        formData.append("id_list", params.id)
        formData.append("id_company", UserInfo?.company?.id_company)


        axios.post(API_URL + "/api/get/logslists", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {

            })
            .catch((err) => {

            })
    }

    useEffect(() => {
        getIntentUpload()
    }, [])

    return (
        <>
            <div className="page-info">
                <div className="">
                    <p className="title">Logs de lista: {params.id}</p>
                    <span>Ve los detalle de tus listas y ve si estan listas para ser utilizadas.</span>

                </div>

                <div className="right">
                    <button className="go-wizard" onClick={(ev) => { Navigator("/contacts/detail/" + params.id) }}><IoArrowBackOutline /></button>
                </div>
            </div>


            <div className="row">

                {intentUpload.map((element, key) => (
                    <div className="col-md-3" key={key}>
                        <div className="box box-padding">
                        </div>
                    </div>
                ))}


            </div>

        </>
    )
}
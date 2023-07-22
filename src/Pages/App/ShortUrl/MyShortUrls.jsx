import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { API_SHORT, API_URL } from "../../../ExportUrl"
import { useContext } from "react"
import { AuthContext } from "../../../Context/AuthContext"
import { useEffect } from "react"
import { IoColorWandOutline, IoStatsChartOutline, IoTrashOutline } from "react-icons/io5"
import ModalSmall from "../../../Components/App/ModalSmall"

export default function MyShortUrls() {

    const Navigator = useNavigate()

    const [urls, setUrls] = useState([])
    const [loading, setLoading] = useState(true)
    const { UserInfo } = useContext(AuthContext)

    function LoadUrls() {
        let formData = new FormData()
        formData.append("id_company", UserInfo?.company?.id_company)

        axios.post(API_URL + "/api/get/myurls", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setUrls(data)
            })
    }

    useEffect(() => {
        LoadUrls()
    }, [])

    return (<>

        <ModalSmall visible={true}>
            xd
        </ModalSmall>

        <div className="page-info">
            <div className="">
                <p className="title">Tus urls </p>
                <span>Estas son tus urls cortas que has creado donde podras llevar las estadisticas de cada una.</span>
            </div>
            <div className="right">
                <button className="add" onClick={""}>Crear nueva URL</button>
            </div>
        </div>

        <div className="row">
            <div className="col-md-12">
                <div className="box box-padding">
                    {urls.map((element, key) => (
                        <div className="item flex" key={key}>
                            <div className="info">
                                <div className="icon">
                                    <img src="img/icons/campaign_profile.png" alt="" />
                                </div>

                                <div className="text">
                                    <p className="title">URL CORTA</p>
                                    <span className="desc">{API_SHORT}/{element.token}</span>
                                    <br />
                                    <span className="desc">{API_SHORT}/{element.token}</span>
                                </div>
                            </div>


                            <div>
                                <p>URL</p>
                                <span>{element.real_link}</span>
                            </div>

                            <div className="actions">
                                <button onClick={(ev) => { Navigator("") }}><IoTrashOutline /></button>
                                <button onClick={(ev) => { Navigator("/shorturls/" + element.id_shortlink) }}><IoStatsChartOutline /> </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    </>)
}
import axios from "axios"
import { useState } from "react"
import { useEffect } from "react"
import { API_URL } from "../../../ExportUrl"
import { useContext } from "react"
import { AuthContext } from "../../../Context/AuthContext"
import { Time } from "../../../Functions/Global"
import LoadingCircleApp from "../../../Components/App/LoadingCircle"
import { useNavigate } from "react-router-dom"
import { IoEyeOutline } from "react-icons/io5"

export default function MyLandings() {

    const [landings, setLandings] = useState([])

    const { UserInfo } = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const Navigator = useNavigate()


    function loadLandings() {
        let formData = new FormData()
        formData.append("id_company", UserInfo?.company?.id_company)

        axios.post(API_URL + "/api/get/landings", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setLandings(data)
                setLoading(false)
            })
    }

    useEffect(() => {
        loadLandings()
    }, [])

    return (
        <>
            <div className="page-info">
                <div className="">
                    <p className="title">Mis Landings</p>
                    <span>Aqui veras todas tus landings creadas con anterioridad podras editarlas o eliminarlas.</span>
                </div>

                <div className="right">
                    <button className="add" onClick={(ev) => { Navigator("/editor/landings") }}>Crear nueva landing</button>
                </div>
            </div>

            <div className="row">

                {loading == false ?
                    landings.map((element, key) =>
                        <div className="col-md-3" key={key}>
                            <div className="box survey-b">
                                <div className="preview" style={{ background: `url(/img/icons/default-img.jpg)` }}>
                                    <div className="right-top">
                                        <button onClick={(ev) => { Navigator(`/landing/${element.token}`) }}><IoEyeOutline /></button>
                                    </div>
                                </div>

                                <div className="top" style={{ padding: "10px" }}>
                                    <p>{element?.name}</p>
                                    <span>Encuesta agregada el: {Time(element.time_add)}</span>
                                </div>
                            </div>
                        </div>
                    )
                    : <div className="col-md-12">
                        <div className="box box-padding">
                            <LoadingCircleApp />
                        </div>
                    </div>
                }

            </div>
        </>
    )
}
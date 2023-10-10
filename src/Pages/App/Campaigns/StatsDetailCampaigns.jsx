import axios from "axios";
import { useContext } from "react";
import { useEffect } from "react";
import { IoArrowBackOutline } from "react-icons/io5"
import { Link, useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../../../Context/AuthContext";
import { API_URL } from "../../../ExportUrl";

export default function StatsDetailCampaigns() {

    const Navigator = useNavigate()
    const params = useParams();
    const { UserInfo } = useContext(AuthContext)

    function searchDetailSend() {
        let formData = new FormData()

        formData.append("id_company", UserInfo?.company?.id_company)

        axios.post(API_URL + "/api/get/detailsends", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                console.log(data)
            })
    }


    useEffect(() => {
        searchDetailSend()
    }, [])

    return (
        <>

            <div className="page-info">
                <div className="">
                    <p className="title">Estadisticas de campaña: {params?.id}</p>
                    <span>Estadisticas de campaña visualiza las estadisticas generalmente de cada una y comparalas</span>

                </div>

                <div className="right">
                    <button className="go-wizard" onClick={(ev) => { Navigator("/campaigns/stats/" + params.id) }}><IoArrowBackOutline /></button>
                    <button className="go-wizard" onClick={(ev) => { Navigator("/campaigns/stats/" + params.id) }}>Descargar CSV</button>
                    <button className="go-wizard" onClick={(ev) => { Navigator("/campaigns/stats/" + params.id) }}>Descargar JSON</button>

                </div>
            </div>

            <div className="menu-top">
                <ul>
                    <li>
                        <Link to="/companys">General</Link>
                    </li>


                    <li>
                        <Link to="/companys/users">Errores</Link>
                    </li>

                    <li>
                        <Link to="/companys/roles">Clicks</Link>
                    </li>
                    <li>
                        <Link to="/companys/roles">Leidos</Link>
                    </li>
                </ul>
            </div>


            <div className="box stat box-padding">
                <p>xd</p>
            </div>
        </>
    )
}
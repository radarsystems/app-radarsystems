import axios from "axios";
import { useContext } from "react";
import { useEffect } from "react";
import { IoArrowBackOutline } from "react-icons/io5"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../../../Context/AuthContext";
import { API_URL } from "../../../ExportUrl";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function StatsDetailCampaigns() {

    const Navigator = useNavigate()
    const params = useParams();
    const Location = useLocation()
    const { UserInfo } = useContext(AuthContext)
    const [lastId, setLastId] = useState(null)
    const [stats, setStats] = useState([])
    const [loading, setLoading] = useState(true)

    function searchDetailSend(where = undefined) {
        let formData = new FormData()

        setLoading(true)

        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("id_campaign", params.id)
        if (where !== undefined) {
            formData.append("type", where);
        }

        axios.post(API_URL + "/api/get/detailsends", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setStats(data)
                setLoading(false)
            })
    }


    useEffect(() => {
        searchDetailSend()
    }, [])

    useEffect(() => {
        let where = new URLSearchParams(Location.search).get("where")

        if (where) {
            searchDetailSend(where)
        }

    }, [Location])

    return (
        <>

            <div className="page-info">
                <div className="">
                    <p className="title">Estadisticas de campaña: {params?.id}</p>
                    <span>Estadisticas de campaña visualiza las estadisticas generalmente de cada una y comparalas</span>

                </div>

                <div className="right">
                    <button className="go-wizard" onClick={(ev) => { Navigator("/campaigns/stats/" + params.id) }}><IoArrowBackOutline /></button>
                    <button className="go-wizard" onClick={(ev) => { Navigator("/campaigns/stats/" + params.id) }}>Crear Segmento</button>
                    <button className="go-wizard" onClick={(ev) => { Navigator("/campaigns/stats/" + params.id) }}>Descargar</button>

                </div>
            </div>

            <div className="menu-top">
                <ul>
                    <li>
                        <Link to={`/campaigns/stats/detail/${params.id}`}>General</Link>
                    </li>


                    <li>
                        <Link to={`/campaigns/stats/detail/${params.id}?where=error`}>Errores</Link>
                    </li>

                    <li>
                        <Link to={`/campaigns/stats/detail/${params.id}?where=clicks`}>Clicks</Link>
                    </li>
                    <li>
                        <Link to={`/campaigns/stats/detail/${params.id}?where=reads`}>Leidos</Link>
                    </li>
                </ul>
            </div>


            <div className="box stat box-padding">
                <div className="top">
                    <p>Resultados de busqueda</p>
                    <span>Te mostraremos el listado detallado de tus envios</span>
                </div>

                <div className="control-scroll stats-detail">
                    <div className="row">
                        <InfiniteScroll hasMore={true} dataLength={10}>
                            {stats.map((element, index) => (
                                <div className="item flex">
                                    <div>
                                        <span>{element.email}</span>
                                    </div>
                                </div>
                            ))}
                        </InfiniteScroll>


                    </div>
                </div>

            </div>
        </>
    )
}
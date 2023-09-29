import axios from "axios"
import { useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { API_SHORT, API_URL } from "../../../ExportUrl"
import { useContext } from "react"
import { AuthContext } from "../../../Context/AuthContext"
import { useState } from "react"
import { LoadFlagCountry, LoadLogoSystems, LoadNameCountry } from "../../../Functions/Global"
import QrCode from "qrcode.react"
import Chart from "react-apexcharts"
import QrStyling from "qr-code-styling"


export default function DetailShortUrl() {
    const params = useParams()
    const { UserInfo } = useContext(AuthContext)
    const [countrys, setCountry] = useState([])
    const [data, setData] = useState([])
    const [token, setToken] = useState();
    const [devices, setDevices] = useState([])
    const ref = useRef(null);
    const [charts, setCharts] = useState({
        series: [{
            name: "Respuestas",
            data: []
        }],
        chart: {
            type: 'area',
            height: 350,
            stacked: true
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: true,
            }
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: [],
        }
    })

    const QrCode = new QrStyling({
        width: 600,
        height: 600,
        image:
            "/img/icons/iconsvg.png",
        dotsOptions: {
            color: "gradient",
            type: "extra-rounded",
            gradient: {
                colorStops: [{ offset: 0, color: '#000' }, { offset: 1, color: '#000' }]
            }
        },
        imageOptions: {
            crossOrigin: "anonymous",
            margin: 20
        }
    });

    function StatsShortLink(data) {
        let formData = new FormData()
        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("month", data.month)
        formData.append("year", data.year)
        formData.append("id_shortlink", params.id)

        axios.post(API_URL + "/api/get/statshortlink", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setCountry(data.countrys)
                setDevices(data.devices)
                setCharts((prevData) => {
                    prevData.series[0].data = data.dayResponse
                    prevData.xaxis.categories = data.days
                    return prevData
                })
                setToken(data.token)
            })
    }

    useEffect(() => {
        StatsShortLink({ month: new Date().getMonth() + 1 })




    }, [])

    useEffect(() => {
        if (token) {
            QrCode.append(ref.current);
            QrCode.update({ data: API_SHORT + "/" + token + "?qr=true" })
        }
    }, [token])

    return (
        <>


            <div className="page-info">
                <div className="">
                    <p className="title">Detalle de enlace: {params.id}</p>
                    <span>Estas son las estadisticas de tu enlace corto</span>
                </div>

                <div className="right">
                    <button className="add" onClick={""}>Volver</button>
                </div>
            </div>

            <div className="body-stats">

                <div className="row">
                    <div className="col-md-12">
                        <div className="stat box box-padding">
                            <div className="top">
                                <p>Clicks este mes</p>
                                <span>Aca podras evaluar los clicks hecho por el mes actual y anteriores.</span>
                            </div>

                            {charts?.series[0]?.data?.length ? <Chart options={charts} series={charts.series} type="area" height={300} />
                                : ''}

                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="box stat box-padding">
                            <div className="top">
                                <p>Visitas</p>
                            </div>
                            <div className="resp-number">
                                <p>20</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="box stat box-padding">
                            <div className="top">
                                <p>QR Code</p>
                            </div>
                            <div className="resp-number">
                                <div className="qr-code">
                                    <div ref={ref} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="box stat box-padding">
                            <div className="top">
                                <p className="title">Tops Paises</p>
                                <span>Tops de los paises que mas visitaron el enlace</span>
                            </div>

                            <div className="result countryr">
                                {countrys.map((element, key) => (
                                    <div className="country" key={key}>
                                        <img src={LoadFlagCountry(element.country)} alt="" />
                                        <p className="">{element.country == "" ? 'Undefined' : LoadNameCountry(element.country)}</p>
                                        <span>({element.count})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                    <div className="col-md-6">
                        <div className="box stat box-padding">
                            <div className="top">
                                <p className="title">Tops Os</p>
                                <span>Top de los sistemas operativos mas usado por los usuarios</span>
                            </div>

                            <div className="result countryr">
                                {devices.map((element, key) => (
                                    <div className="country" key={key}>
                                        <img src={LoadLogoSystems(element.device)} alt="" />
                                        <p className="">{element.device}</p>
                                        <span>({element.count})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
import axios from "axios";
import { useEffect, useState } from "react";
import { IoAlertCircleOutline, IoArrowBackOutline, IoCheckmarkSharp, IoCloseSharp, IoDocumentTextOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { API_SHORT, API_URL } from "../../../ExportUrl";
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import Chart from "react-apexcharts"
import NotFoundItems from "../../../Components/App/NotFoundItems";
import FooterConvertion from "../Global/FooterConvertion/FooterConvertion";


export default function StatsCampaigns() {

    const params = useParams()
    const [statsLoaded, setStatsLoaded] = useState(false); // Variable de estado para controlar si los datos ya se cargaron
    const Navigator = useNavigate()
    const { UserInfo } = useContext(AuthContext)
    const [stats, setStats] = useState({ total_clicks: 0, total_errors: 0, total_reads: 0, total_sends: 0, last_sends: [], last_errors: [] })
    const [charts, setCharts] = useState({
        series: [{
            name: 'Enviados',
            data: []
        }, {
            name: 'Clicks',
            data: []
        }, {
            name: 'Leidos',
            data: []
        }
            , {
            name: 'Errores',
            data: []
        }],
        chart: {
            height: 350,
            type: 'line'
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        xaxis: {

            categories: []
        },
        tooltip: {
            x: {
                format: 'dd/MM/yy HH:mm'
            },
        }
    })

    function searchStats() {

        if (statsLoaded) {




            let formData = new FormData();
            formData.append("id_company", UserInfo?.company?.id_company);
            formData.append("id_campaign", params.id);
            formData.append("case", "campaign");

            axios.post(API_URL + "/api/get/stats", formData, { withCredentials: true })
                .then((response) => response.data)
                .then((data) => {
                    let days = data.daysResponse.length;


                    setStats({
                        ...stats,
                        total_sends: data.total_sends,
                        total_reads: data.total_reads,
                        total_errors: data.total_errors,
                        total_clicks: data.total_clicks,
                        last_sends: data.last_sends,
                        last_errors: data.last_errors,
                        type_campaign: data.type_campaign
                    });


                    if (days) {
                        setCharts((prevData) => ({
                            ...prevData,
                            series: [
                                {
                                    ...prevData.series[0],
                                    data: prevData.series[0].data.concat(data.daysResponse.map((value) => value.send)),
                                },
                                {
                                    ...prevData.series[1],
                                    data: prevData.series[1].data.concat(data.daysResponse.map((value) => value.clicks)),
                                },
                                {
                                    ...prevData.series[2],
                                    data: prevData.series[2].data.concat(data.daysResponse.map((value) => value.reads)),
                                },
                                {
                                    ...prevData.series[3],
                                    data: prevData.series[3].data.concat(data.daysResponse.map((value) => value.errors)),
                                },
                                // Aquí puedes continuar agregando más objetos para cada serie adicional si es necesario.
                            ],
                            xaxis: {
                                ...prevData.xaxis,
                                categories: data.daysTotal,
                            },
                        }));

                    }

                })
                .catch((err) => {
                    // Manejar errores
                });

        }
    }

    useEffect(() => {
        // Llama a searchStats() solo si la serie de datos está vacía
        setStatsLoaded(true); // Marca los datos como cargados

        if (statsLoaded) {
            searchStats();
        }

    }, [statsLoaded]);

    return (
        <>
            <div className="page-info">
                <div className="">
                    <p className="title">Estadisticas de campaña: {params?.id}</p>
                    <span>Estadisticas de campaña visualiza las estadisticas generalmente de cada una y comparalas</span>

                </div>

                <div className="right">
                    <button className="go-wizard" onClick={(ev) => { Navigator("/campaigns/detail/" + params.id) }}><IoArrowBackOutline /></button>

                </div>
            </div>

            <div className="row">

                <div className="col-md-3">
                    <div className="box stat box-padding">
                        <div className="top">
                            <p>Enviados</p>
                        </div>
                        <div className="resp-number">
                            <p>{Number(stats.total_sends)}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="box stat box-padding">
                        <div className="top">
                            <p>Devueltos</p>
                        </div>
                        <div className="resp-number">
                            <p>{Number(stats.total_errors)}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="box stat box-padding">
                        <div className="top">
                            <p>Recibidos</p>
                        </div>
                        <div className="resp-number">
                            <p>{Number(stats.total_sends) - Number(stats.total_errors)}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="box stat box-padding">
                        <div className="top">
                            <p>Leidos</p>
                        </div>
                        <div className="resp-number">
                            <p>{Number(stats.total_clicks)}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="box stat box-padding">
                        <div className="top">
                            <p>No Leidos </p>
                        </div>
                        <div className="resp-number">
                            <p>{Number(stats.total_errors)}</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="box stat box-padding">
                        <div className="top">
                            <p>Opt Out</p>
                        </div>
                        <div className="resp-number">
                            <p>{Number(stats.total_errors)}</p>
                        </div>
                    </div>
                </div>


                <div className="col-md-3">
                    <div className="box stat box-padding">
                        <div className="top">
                            <p>Opt Net</p>
                        </div>
                        <div className="resp-number">
                            <p>{Number(stats.total_errors)}</p>
                        </div>
                    </div>
                </div>



                <div className="col-md-3">
                    <div className="box stat box-padding">
                        <div className="top">
                            <p>Rep Spam</p>
                        </div>
                        <div className="resp-number">
                            <p>{Number(stats.total_errors)}</p>
                        </div>
                    </div>
                </div>


            </div>

            <div className="box box-padding stat">

                <div className="top">
                    <p>Estadisticas Generales</p>
                    <span>ve las estadisticas de forma general y recorre por cada dia y mes</span>
                </div>
                {charts?.series[0]?.data?.length ? <Chart options={charts} series={charts.series} type="line" height={300} />
                    : ''}
            </div>
            <div className="row ">
                <div className="col-md-6">
                    <div className="box stat box-padding">
                        <div className="top">
                            <p>Analisis General</p>
                            <span>Analisis generales</span>
                        </div>

                        <div className="result">
                            <span><b>Enviados:</b> {stats.total_sends}</span>
                        </div>
                        <div className="result">
                            <span><b>Clicks:</b> {stats.total_clicks}</span>
                        </div>
                        <div className="result">
                            <span><b>Leidos:</b> {stats.total_reads}</span>
                        </div>
                        <div className="result">
                            <span><b>Errores:</b> {stats.total_errors}</span>
                        </div>
                        <div className="result">
                            <span><b>Aceptacion General:</b> {stats.total_sends} %</span>
                        </div>
                    </div>

                    <div className="box stat box-padding">
                        <div className="top">
                            <p>Ultimos Errores</p>
                            <span>Los ultimos errores registrados</span>
                        </div>
                        <div className="results">
                            {stats.last_errors.map((element, index) => (
                                <div className="item flex">
                                    <div>
                                        <span>{stats.type_campaign == "em" ? element.email : ''}</span>
                                    </div>
                                    <div>
                                        <button className={`status-send`}><IoDocumentTextOutline /></button>
                                        <button className={`status-send ${element.error ? 'error' : ''}`}>{element.error ? (<>Error <IoAlertCircleOutline /></>) : (<>Enviado  <IoCheckmarkSharp /></>)}</button>
                                    </div>
                                </div>
                            ))}


                            {stats.last_errors.length == 0 ?
                                <>
                                    <NotFoundItems name={"errores"} />
                                </> :
                                <div className="show-all">
                                    <button onClick={(ev) => { Navigator("/campaigns/stats/detail/" + params.id) }}>Ver detalles completo</button>
                                </div>
                            }
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="box stat box-padding">
                        <div className="top">
                            <p>Ultimos Enviados</p>
                            <span>Los ultimos envios salientes</span>
                        </div>

                        <div className="results">
                            {stats.last_sends.map((element, index) => (
                                <div className="item flex">
                                    <div>
                                        <span>{stats.type_campaign.indexOf("em") >= 0 ? element.email : stats.type_campaign.indexOf("sms") >= 0 ? element.phone : ''}</span>
                                    </div>
                                    <div>
                                        <button className={`status-send ${element.error ? 'error' : ''}`}>{element.error ? (<>Error <IoAlertCircleOutline /></>) : (<>Enviado  <IoCheckmarkSharp /></>)}</button>
                                    </div>
                                </div>
                            ))}

                            {stats.last_sends.length == 0 ?
                                <>
                                    <NotFoundItems name={"errores"} />
                                </> :
                                <div className="show-all">
                                    <button onClick={(ev) => { Navigator("/campaigns/stats/detail/" + params.id) }}> Ver detalles completo</button>
                                </div>
                            }
                        </div>
                    </div>
                </div>




            </div>
            <FooterConvertion type="campaign" />

        </>
    )
}
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { API_URL } from "../../../ExportUrl"
import { AuthContext } from "../../../Context/AuthContext"
import { Time } from "../../../Functions/Global"
import { IoArrowForward, IoEyeOutline, IoStatsChartOutline } from "react-icons/io5"
import ModalSmall from "../../../Components/App/ModalSmall"
import NotFoundItems from "../../../Components/App/NotFoundItems"

export default function Home() {

    const Navigator = useNavigate()
    const { UserInfo } = useContext(AuthContext)

    const [lastCampaignSms, setLastCampaignSms] = useState([])
    const [lastCampaignEmail, setLastCampaignEmail] = useState([])
    const [lastCampaignEmailMt, setLastCampaignEmailMt] = useState([])
    const [lastCampaignSmsMt, setLastCampaignSmsMt] = useState([])
    const [lastCampaignWhatsapp, setLastCampaignWhatsapp] = useState([]);
    const [topsCampaignSms, setTopsCampaignSms] = useState([])
    const [topsCampaignEmail, setTopsCampaignEmail] = useState([])
    const [templates, setTemplates] = useState([])
    const [surveys, setSurveys] = useState([])
    const [stats, setStats] = useState({})

    function getStatsGlobalHome(type) {
        let formData = new FormData()
        formData.append("id_company", UserInfo?.company?.id_company)

        axios.post(API_URL + "/api/get/stats/global", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setStats(data);
            })
    }


    function getLastCampaigns(type) {
        let formData = new FormData()

        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("type", type)
        formData.append("limit", "5")

        axios.post(API_URL + "/api/get/campaign", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                switch (type) {
                    case 'sms':
                        setLastCampaignSms(data.results)
                        break;

                    case 'em':
                        setLastCampaignEmail(data.results ?? [])
                        break;

                    case 'em-mt':
                        setLastCampaignEmailMt(data.results ?? [])
                        break;

                    case 'sms-mt':
                        setLastCampaignSmsMt(data.results ?? [])
                        break;
                }
            })
    }

    function getTemplates() {
        let formData = new FormData()
        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("limit", "10");

        axios.post(API_URL + "/api/get/templatesall", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setTemplates(data)
            })
    }

    function getSurveys() {

        let formData = new FormData()

        formData.append("id_company", UserInfo?.company?.id_company)

        axios.post(API_URL + "/api/get/surveys", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setSurveys(data)
            })

    }

    useEffect(() => {
        getLastCampaigns("em")
        getLastCampaigns("em-mt")
        getLastCampaigns("sms")
        getLastCampaigns("sms-mt")

        getTemplates()
        getSurveys()
        getStatsGlobalHome()
    }, [])

    return (
        <>

            <ModalSmall visible={false}>
                STATS
            </ModalSmall>
            <div className="page-info">
                <div className="">
                    <p className="title">MI INICIO</p>
                    <span>Bienvenido a RadarSystems aca podras ver todas tus estadisticas y estados de tu cuenta</span>
                </div>
            </div>

            <div className="body-stat">
                <div className="row">
                    <div className="col-md-3">
                        <div className="box stat box-padding">
                            <div className="top">
                                <p>Total Envios Emails</p>
                            </div>

                            <div className="resp-number">
                                <p>{stats.total_sends}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="box stat box-padding">
                            <div className="top">
                                <p>Total Envios Sms</p>
                            </div>

                            <div className="resp-number">
                                <p>{stats.total_sends_sms}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="box stat box-padding">
                            <div className="top">
                                <p>Campañas Creadas</p>
                            </div>

                            <div className="resp-number">
                                <p>{stats.total_campaigns}</p>
                            </div>
                        </div>
                    </div>


                    <div className="col-md-3">
                        <div className="box stat box-padding">
                            <div className="top">
                                <p>Total Contactos</p>
                            </div>

                            <div className="resp-number">
                                <p>{stats.total_contacts}</p>
                            </div>
                        </div>
                    </div>


                    <div className="col-md-6">
                        <div className="box stat box-padding hr">
                            <div className="top">
                                <p>Top's Campañas EMAIL</p>
                                <span>Ve las campanas mas demandadas</span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="box stat box-padding hr">
                            <div className="top">
                                <p>Top's Campañas SMS</p>
                                <span>Ve las campanas mas demandadas</span>
                                <span></span>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="box stat box-padding hr">
                            <div className="top">
                                <p>Ultimas Campañas Email Marketing</p>
                                <span>Ve las campanas mas demandadas</span>
                                <span></span>
                            </div>

                            <table className="stat-home">

                                <tr>
                                    <td>Campaña</td>
                                    <td>Env.</td>
                                    <td>Dev.</td>
                                    <td>Rec.</td>
                                    <td>Lei.</td>
                                    <td>No Lei.</td>
                                    <td>Click.</td>
                                    <td>Rep. Spam</td>
                                    <td>Opt. Out</td>
                                    <td>Opt. Net</td>
                                    <td>
                                        <IoStatsChartOutline />
                                    </td>



                                </tr>


                                {lastCampaignEmail.map((element, key) => (
                                    <tr id={key}>
                                        <td><span>{element.name}</span>
                                            <br />
                                            {Time(element.time_add)}
                                        </td>
                                        <td>{element.send}</td>
                                        <td>{element.send}</td>
                                        <td>{element.returned}</td>
                                        <td>{element.reads}</td>
                                        <td>{element.clicks}</td>
                                        <td>{element.clicks}</td>
                                        <td>{element.clicks}</td>
                                        <td>{element.clicks}</td>
                                        <td>{element.clicks}</td>
                                        <td><Link to={"/campaigns/detail/" + element.id_campaign}><IoStatsChartOutline /></Link></td>
                                    </tr>
                                ))}
                            </table>

                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="box stat box-padding hr">
                            <div className="top">
                                <p>Ultimas Campañas Email Transaccional (MT)</p>
                                <span>Ve las campanas mas demandadas</span>
                                <span></span>
                            </div>

                            <table className="stat-home">

                                <tr>
                                    <td>Campaña</td>
                                    <td>Env.</td>
                                    <td>Dev.</td>
                                    <td>Rec.</td>
                                    <td>Lei.</td>
                                    <td>No Lei.</td>
                                    <td>Click.</td>
                                    <td>Rep. Spam</td>
                                    <td>Opt. Out</td>
                                    <td>Opt. Net</td>
                                    <td><IoStatsChartOutline /></td>



                                </tr>


                                {lastCampaignEmailMt.map((element, key) => (
                                    <tr id={key}>
                                        <td><span>{element.name}</span>
                                            <br />
                                            {Time(element.time_add)}
                                        </td>
                                        <td>{element.send}</td>
                                        <td>{element.send}</td>
                                        <td>{element.returned}</td>
                                        <td>{element.reads}</td>
                                        <td>{element.clicks}</td>
                                        <td>{element.clicks}</td>
                                        <td>{element.clicks}</td>
                                        <td>{element.clicks}</td>
                                        <td>{element.clicks}</td>
                                        <td><Link><IoStatsChartOutline /></Link></td>
                                    </tr>
                                ))}
                            </table>

                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="box stat box-padding hr">
                            <div className="top">
                                <p>Ultimas Campañas Sms Marketing</p>
                                <span>Ve las campanas mas demandadas</span>
                                <span></span>
                            </div>

                            <table className="stat-home">

                                <tr>
                                    <td>Campaña</td>
                                    <td>Env.</td>
                                    <td>Dev.</td>
                                    <td>Rec.</td>
                                    <td>Click.</td>
                                    <td><IoStatsChartOutline /></td>

                                </tr>


                                {lastCampaignSms.map((element, key) => (
                                    <tr id={key}>
                                        <td>
                                            <span>{element.name}</span>
                                            <br />
                                            {Time(element.time_add)}
                                        </td>
                                        <td>{element.send}</td>
                                        <td>{element.returned}</td>
                                        <td>{element.reads}</td>
                                        <td>{element.clicks}</td>
                                        <td><Link><IoStatsChartOutline /></Link></td>

                                    </tr>
                                ))}
                            </table>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="box stat box-padding hr">
                            <div className="top">
                                <p>Ultimas Campañas Sms Transaccional (MT)</p>
                                <span>Ve las campanas mas demandadas</span>
                                <span></span>
                            </div>

                            <table className="stat-home">

                                <tr>
                                    <td>Campaña</td>
                                    <td>Env.</td>
                                    <td>Dev.</td>
                                    <td>Rec.</td>
                                    <td>Click.</td>
                                    <td><IoStatsChartOutline /></td>

                                </tr>


                                {lastCampaignSmsMt.map((element, key) => (
                                    <tr id={key}>
                                        <td>
                                            <span>{element.name}</span>
                                            <br />
                                            {Time(element.time_add)}
                                        </td>
                                        <td>{element.send}</td>
                                        <td>{element.returned}</td>
                                        <td>{element.reads}</td>
                                        <td>{element.clicks}</td>
                                        <td><Link><IoStatsChartOutline /></Link></td>

                                    </tr>
                                ))}
                            </table>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="box stat box-padding hr">
                            <div className="top">
                                <p>Ultimas Campañas Whatsapp Marketing</p>
                                <span>Ve las campanas mas demandadas de whatsapp</span>
                                <span></span>
                            </div>

                            <table className="stat-home">

                                <tr>
                                    <td>Campaña</td>
                                    <td>Env.</td>
                                    <td>Dev.</td>
                                    <td>Rec.</td>
                                    <td>Click.</td>
                                    <td><IoStatsChartOutline /></td>

                                </tr>


                                {lastCampaignWhatsapp.map((element, key) => (
                                    <tr id={key}>
                                        <td>
                                            <span>{element.name}</span>
                                            <br />
                                            {Time(element.time_add)}
                                        </td>
                                        <td>{element.send}</td>
                                        <td>{element.returned}</td>
                                        <td>{element.reads}</td>
                                        <td>{element.clicks}</td>
                                        <td><Link><IoStatsChartOutline /></Link></td>

                                    </tr>
                                ))}
                            </table>

                            {lastCampaignWhatsapp.length == 0 ? <NotFoundItems name={"Whatsapp"} /> : ''}
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="box stat box-padding hr">
                            <div className="top">
                                <p>Ultimas Campañas Whatsapp Transaccional (MT)</p>
                                <span>Ve las campanas mas demandadas de whatsapp</span>
                                <span></span>
                            </div>

                            <table className="stat-home">

                                <tr>
                                    <td>Campaña</td>
                                    <td>Env.</td>
                                    <td>Dev.</td>
                                    <td>Rec.</td>
                                    <td>Click.</td>
                                    <td><IoStatsChartOutline /></td>

                                </tr>


                                {lastCampaignWhatsapp.map((element, key) => (
                                    <tr id={key}>
                                        <td>
                                            <span>{element.name}</span>
                                            <br />
                                            {Time(element.time_add)}
                                        </td>
                                        <td>{element.send}</td>
                                        <td>{element.returned}</td>
                                        <td>{element.reads}</td>
                                        <td>{element.clicks}</td>
                                        <td><Link><IoStatsChartOutline /></Link></td>

                                    </tr>
                                ))}
                            </table>

                            {lastCampaignWhatsapp.length == 0 ? <NotFoundItems name={"Whatsapp"} /> : ''}
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="box stat box-padding hr">
                            <div className="top">
                                <p>Plantillas Creadas</p>
                                <span>Ve las campanas mas demandadas</span>
                                <span></span>
                            </div>

                            <div className="result-go">
                                {templates.map((element, key) => (
                                    <div className="i">
                                        <div className="left">
                                            <p className="name">{element.title}</p>
                                            <span className="date">{Time(element.time_add)}</span>
                                        </div>

                                        <div className="right">
                                            <button><IoEyeOutline /> Ver </button>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="box stat box-padding hr">
                            <div className="top">
                                <p>Encuestas</p>
                                <span>Ve las campanas mas demandadas</span>
                                <span></span>
                            </div>

                            <div className="result-go">
                                {surveys.map((element, key) => (
                                    <div className="i">
                                        <div className="left">
                                            <p className="name">{element.header.title}</p>
                                            <span className="date">{Time(element.time_add)}</span>
                                        </div>

                                        <div className="right">
                                            <button><IoEyeOutline /> Ver</button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>


                </div>
            </div >
        </>
    )
}
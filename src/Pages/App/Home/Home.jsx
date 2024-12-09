import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { API_URL } from "../../../ExportUrl"
import { AuthContext } from "../../../Context/AuthContext"
import { Time } from "../../../Functions/Global"
import { IoArrowForward, IoEyeOutline, IoStatsChartOutline } from "react-icons/io5"
import ModalSmall from "../../../Components/App/ModalSmall"
import NotFoundItems from "../../../Components/App/NotFoundItems"
import { Card, Metric, Text, Flex, Icon, BarChart } from "@tremor/react";
import "../../../Styles/css/custom-table.css";
import StatsDashboard from "../../../Components/App/StatsDashboard";
import ReusableTable from "../../../Components/App/ReusableTable";


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
    const columns = [
        {
            key: "name",
            label: <span data-tooltip="Email Marketing" data-tooltip-position="bottom">Campañas</span>,
            render: (value, row) => (
                <div>
                    <span>{value}</span>
                    <br />
                    <small>{Time(row.time_add)}</small>
                </div>
            ),
        },
        { key: "send", label: <span data-tooltip="Enviados" data-tooltip-position="bottom">Env</span>, },
        { key: "returned", label: <span data-tooltip="Devueltos" data-tooltip-position="bottom">DEV</span>, },
        { key: "received", label: <span data-tooltip="Recibidos" data-tooltip-position="bottom">REC</span>, },
        { key: "reads", label: <span data-tooltip="Leidos" data-tooltip-position="bottom">Leidos</span>, },
        { key: "not_reads", label: <span data-tooltip="No Leidos" data-tooltip-position="bottom">No Leidos</span>, },
        { key: "clicks", label: <span data-tooltip="Click" data-tooltip-position="bottom">Click</span>, },
        { key: "spam_reports", label: <span data-tooltip="Reporte Spam" data-tooltip-position="bottom">Spam</span>, },
        { key: "opt_out", label: <span data-tooltip="Opt. Out" data-tooltip-position="bottom">Opt. Out</span>, },
        { key: "opt_net", label: <span data-tooltip="Opt. Net" data-tooltip-position="bottom">Opt. Net</span>, },
        {
            key: "id_campaign",
            label: <span data-tooltip="Acciones" data-tooltip-position="bottom">Acciones</span>,
            render: (value) => (
                <Link to={`/campaigns/detail/${value}`}>
                    <IoStatsChartOutline />
                </Link>
            ),

        },
    ];

    const columnsem_mt = [
        {
            key: "name",
            label: <span data-tooltip="Email Transaccional" data-tooltip-position="bottom">Campañas</span>,
            render: (value, row) => (
                <div>
                    <span>{value}</span>
                    <br />
                    <small>{Time(row.time_add)}</small>
                </div>
            ),
        },
        { key: "send", label: <span data-tooltip="Enviados" data-tooltip-position="bottom">Env.</span>, },
        { key: "returned", label: <span data-tooltip="Devueltos" data-tooltip-position="bottom">DEV</span>, },
        { key: "rec", label: <span data-tooltip="Recibidos" data-tooltip-position="bottom">REC</span>, },
        { key: "reads", label: <span data-tooltip="Leidos" data-tooltip-position="bottom">Leidos</span>, },
        { key: "unread", label: <span data-tooltip="No Leidos" data-tooltip-position="bottom">No Leidos</span>, },
        { key: "clicks", label: <span data-tooltip="Clicks" data-tooltip-position="bottom">Clicks</span>, },
        { key: "spam", label: <span data-tooltip="Reporte Spam" data-tooltip-position="bottom">Spam</span>, },
        { key: "optOut", label: <span data-tooltip="Opt. Out" data-tooltip-position="bottom">Opt. Out</span>, },
        { key: "optNet", label: <span data-tooltip="Opt. Net" data-tooltip-position="bottom">Opt. Net</span>, },
        {
            key: "action",
            label: <span data-tooltip="Acciones" data-tooltip-position="bottom">Acciones</span>,
            render: (value) => (
                <Link to={`/campaigns/detail/${value}`}>
                    <IoStatsChartOutline />
                </Link>
            ),

        },
    ];
    const columnsms = [
        {
            key: "name",
            label: <span data-tooltip="Sms Marketing" data-tooltip-position="bottom">Campañas</span>,
            render: (value, row) => (
                <div>
                    <span>{value}</span>
                    <br />
                    <small>{Time(row.time_add)}</small>
                </div>
            ),
        },
        { key: "send", label: <span data-tooltip="Enviados" data-tooltip-position="bottom">Env.</span>, },
        { key: "returned", label: <span data-tooltip="Devueltos" data-tooltip-position="bottom">Dev.</span>, },
        { key: "reads", label: <span data-tooltip="Recibidos" data-tooltip-position="bottom">Rec.</span>, },
        { key: "clicks", label: <span data-tooltip="Click" data-tooltip-position="bottom">Click.</span>, },
        {
            key: "action",
            label: <span data-tooltip="Acciones" data-tooltip-position="bottom">Acciones</span>,
            render: (value) => (
                <Link to={`/campaigns/detail/${value}`}>
                    <IoStatsChartOutline />
                </Link>
            ),

        },
    ];
    const columnsms_mt = [
        {
            key: "name",
            label: <span data-tooltip="Sms Transaccional" data-tooltip-position="bottom">Campañas</span>,
            render: (value, row) => (
                <div>
                    <span>{value}</span>
                    <br />
                    <small>{Time(row.time_add)}</small>
                </div>
            ),
        },
        { key: "send", label: <span data-tooltip="Enviados" data-tooltip-position="bottom">Env.</span>, },
        { key: "returned", label: <span data-tooltip="Devueltos" data-tooltip-position="bottom">Dev.</span>, },
        { key: "reads", label: <span data-tooltip="Recibidos" data-tooltip-position="bottom">Rec.</span>, },
        { key: "clicks", label: <span data-tooltip="Click" data-tooltip-position="bottom">Click.</span>, },
        {
            key: "action",
            label: <span data-tooltip="Acciones" data-tooltip-position="bottom">Acciones</span>,
            render: (value) => (
                <Link to={`/campaigns/detail/${value}`}>
                    <IoStatsChartOutline />
                </Link>
            ),

        },
    ];



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

                <div className="row"> {/*
                    <div className="col-md-3">
                        <div className="box stat box-padding">
                            <div className="top">
                                <p>Total Contactos Unicos</p>
                            </div>

                            <div className="resp-number">
                                <p>{stats.total_campaigns}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="box stat box-padding">
                            <div className="top">
                                <p>Total contactos en listas </p>
                            </div>

                            <div className="resp-number">
                                <p>{stats.total_sends_sms}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="box stat box-padding">
                            <div className="top">
                                <p>Total Listas </p>
                            </div>

                            <div className="resp-number">
                                <p>{stats.total_sends}</p>
                            </div>
                        </div>
                    </div>


                    <div className="col-md-3">
                        <div className="box stat box-padding">
                            <div className="top">
                                <p>Total Campañas Enviadas </p>
                            </div>

                            <div className="resp-number">
                                <p>{stats.total_contacts}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="box stat box-padding">
                            <div className="top">
                                <p>Total Emails marketing</p>
                            </div>

                            <div className="resp-number">
                                <p>{stats.total_contacts}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="box stat box-padding">
                            <div className="top">
                                <p>Total Emails Transaccionales</p>
                            </div>

                            <div className="resp-number">
                                <p>{stats.total_contacts}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="box stat box-padding">
                            <div className="top">
                                <p>Total SMS Marketing</p>
                            </div>

                            <div className="resp-number">
                                <p>{stats.total_contacts}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="box stat box-padding">
                            <div className="top">
                                <p>Total SMS Transaccionales</p>
                            </div>

                            <div className="resp-number">
                                <p>{stats.total_contacts}</p>
                            </div>
                        </div>
                    </div>   */}
                    <div className="p-6">
                        <h1 className="text-2xl font-bold mb-4">Panel de Estadísticas</h1>
                        <StatsDashboard stats={stats} />
                    </div>
                    <div className="col-md-6">
                        <div className="box stat box-padding hr shadow-lg rounded-lg bg-white p-4">
                            <div className="top">
                                <p className="font-semibold text-lg text-gray-700 mb-4">Saldo SMS Marketing</p>
                                <div className="balance-info flex items-center justify-between">
                                    {/* Circular Progress Bar */}
                                    <div className="progress-circle" data-tooltip="Saldo consumido" data-tooltip-position="top" >
                                        <div className="circle">
                                            <div className="mask full">
                                                <div className="fill"></div>
                                            </div>
                                            <div className="mask half">
                                                <div className="fill"></div>
                                            </div>
                                            <div className="inside-circle">
                                                65%
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expiry Info */}
                                    <div className="expiry-info ml-4">
                                        <p className="text-sm text-gray-500 mb-1">
                                            Saldo disponible: <strong className="text-gray-800">6,500 SMS</strong>
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Vence: <strong className="text-gray-800">15/12/2024</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="box stat box-padding hr shadow-lg rounded-lg bg-white p-4">
                            <div className="top">
                                <p className="font-semibold text-lg text-gray-700 mb-4">Saldo SMS Transaccional</p>
                                <div className="balance-info flex items-center justify-between">
                                    {/* Circular Progress Bar */}
                                    <div className="progress-circle" data-tooltip="Saldo consumido">
                                        <div className="circle">
                                            <div className="mask full">
                                                <div className="fill"></div>
                                            </div>
                                            <div className="mask half">
                                                <div className="fill"></div>
                                            </div>
                                            <div className="inside-circle">
                                                35%
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expiry Info */}
                                    <div className="expiry-info ml-4">
                                        <p className="text-sm text-gray-500 mb-1">
                                            Saldo disponible: <strong className="text-gray-800">500 SMS</strong>
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Vence: <strong className="text-gray-800">30/12/2024</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="box stat box-padding hr shadow-lg rounded-lg bg-white p-4">
                            <div className="top">
                                <p className="font-semibold text-lg text-gray-700 mb-4">Saldo Email Marketing</p>
                                <div className="balance-info flex items-center justify-between">
                                    {/* Circular Progress Bar */}
                                    <div className="progress-circle" data-tooltip="Saldo consumido">
                                        <div className="circle">
                                            <div className="mask full">
                                                <div className="fill"></div>
                                            </div>
                                            <div className="mask half">
                                                <div className="fill"></div>
                                            </div>
                                            <div className="inside-circle">
                                                35%
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expiry Info */}
                                    <div className="expiry-info ml-4">
                                        <p className="text-sm text-gray-500 mb-1">
                                            Saldo disponible: <strong className="text-gray-800">500 SMS</strong>
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Vence: <strong className="text-gray-800">30/12/2024</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="box stat box-padding hr shadow-lg rounded-lg bg-white p-4">
                            <div className="top">
                                <p className="font-semibold text-lg text-gray-700 mb-4">Saldo Email Transaccional</p>
                                <div className="balance-info flex items-center justify-between">
                                    {/* Circular Progress Bar */}
                                    <div className="progress-circle" data-tooltip="Saldo consumido" data-tooltip-position="top">
                                        <div className="circle">
                                            <div className="mask full">
                                                <div className="fill"></div>
                                            </div>
                                            <div className="mask half">
                                                <div className="fill"></div>
                                            </div>
                                            <div className="inside-circle">
                                                85%
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expiry Info */}
                                    <div className="expiry-info ml-4">
                                        <p className="text-sm text-gray-500 mb-1">
                                            Saldo disponible: <strong className="text-gray-800">500 SMS</strong>
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Vence: <strong className="text-gray-800">30/12/2024</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="col-md-12">
                        <div className="box stat box-padding hr">
                            <div className="table-container">
                                <h2 className="text-lg font-semibold mb-2">Últimas Campañas Email Marketing</h2>
                                <ReusableTable
                                    data={lastCampaignEmail} // Cambia según el tipo de campaña
                                    columns={columns}
                                    enablePagination={true}
                                    enableExport={true}
                                    enableRowSelection={false}
                                />
                            </div>

                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="box stat box-padding hr">
                            <div className="table-container">
                                <h2 className="text-lg font-semibold mb-2">Últimas Campañas Email Transacional</h2>
                                <ReusableTable
                                    data={lastCampaignEmailMt}
                                    columns={columnsem_mt}
                                    enablePagination={true}
                                    enableExport={true}
                                    enableRowSelection={false}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="box stat box-padding hr">
                            <div className="table-container">
                                <h2 className="text-lg font-semibold mb-2">Últimas Campañas SMS Marketing</h2>
                                <ReusableTable
                                    data={lastCampaignSms}
                                    columns={columnsms}
                                    enablePagination={true}
                                    enableExport={true}
                                    enableRowSelection={false}
                                />
                            </div>
                        </div>
                    </div>


                    <div className="col-md-6">
                        <div className="box stat box-padding hr">
                            <div className="table-container">
                                <h2 className="text-lg font-semibold mb-2">Últimas Campañas SMS Transaccional</h2>
                                <ReusableTable
                                    data={lastCampaignSmsMt}
                                    columns={columnsms_mt}
                                    enablePagination={true}
                                    enableExport={true}
                                    enableRowSelection={false}
                                />
                            </div>


                        </div>
                    </div>




                    {/* Expiry Info 
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

*/}
                </div>
            </div >
        </>
    )
}
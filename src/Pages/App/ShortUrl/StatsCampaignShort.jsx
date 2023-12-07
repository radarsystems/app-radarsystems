import { useParams } from "react-router-dom"
import ModalSmall from "../../../Components/App/ModalSmall"
import { useEffect, useState } from "react"
import { useContext } from "react"
import { AuthContext } from "../../../Context/AuthContext"
import axios from "axios"
import { API_URL } from "../../../ExportUrl"
import { toast } from "react-hot-toast"
import LoadingCircleApp from "../../../Components/App/LoadingCircle"
import { IoDocumentTextOutline } from "react-icons/io5"
import { LoadIconApp, getRealAppName } from "../../../Functions/Global"
import Chart from "react-apexcharts"


export default function StatsCampaignShort() {
    const params = useParams()
    const [viewModal, setViewModal] = useState(false)
    const [pending, setPending] = useState(false)
    const { UserInfo } = useContext(AuthContext)
    const [loading, setLoading] = useState(true);
    const [loadStat, setLoadStat] = useState(false)
    const [data, setData] = useState({})

    let defaultForm = { url: "", app: "others" };
    const [form, setForm] = useState(defaultForm)

    const [charts, setCharts] = useState({
        series: [
            {
                name: "Funnel Series",
                data: [],
            },
        ],
        chart: {
            type: 'bar',
            height: 350,
        },
        plotOptions: {
            bar: {
                borderRadius: 0,
                horizontal: true,
                distributed: true,
                barHeight: '80%',
                isFunnel: true,
            },
        },
        dataLabels: {
            enabled: true,
            formatter: function (val, opt) {
                return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val
            },
        },
        colors: [
            '#F44F5E',
            '#E55A89',
            '#D863B1',
            '#CA6CD8',
            '#B57BED',
            '#8D95EB',
            '#62ACEA',
            '#4BC3E6',
        ],
        xaxis: {
            categories: [],
        },
        legend: {
            show: true
        }
    })


    function handleSetForm(ev) {
        ev.stopPropagation()
        setForm({ ...form, [ev.target.name]: ev.target.value })
    }

    function Campaign() {

        let formData = new FormData();

        setLoading(true)
        setData({})

        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("id_campaign", params.id)

        axios.post(API_URL + "/api/get/shortlinkcampaign", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setLoading(false)
                setData(data)

                const counts = [];
                let app = [];
                let total = 0;

                data?.stats?.forEach((value, index) => {
                    total = total + value.count;
                });

                data?.stats?.forEach((value, index) => {

                    counts.push(value.count)
                    app.push(getRealAppName(value.app) + " (" + (value.count * 100 / total).toFixed(0) + "%)")
                });


                setCharts((prevData) => {
                    // Copiamos los arrays para no modificar el estado original directamente
                    const newData = { ...prevData };

                    // Agregamos los nuevos datos
                    newData.series[0].data = counts;
                    newData.xaxis.categories = app;

                    return newData;
                });


            }).catch((err) => {

            })
    }

    function AddNewShortlink() {
        setPending(true)
        let formData = new FormData()
        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("id_campaign", params?.id)
        formData.append("url", form.url)
        formData.append("app", form.app)

        axios.post(API_URL + "/api/upload/shortlink", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setPending(false)
                if (data.status) {
                    setViewModal(false)
                    Campaign()
                }
                if (data.msg) {
                    toast.error(data.msg)
                }
            })
            .catch((err) => {
                setPending(false)
            })
    }

    useEffect(() => {
        if (!loadStat) {

            setCharts((prevData) => {
                const newData = { ...prevData };
                newData.series[0].data = [];
                newData.xaxis.categories = [];
                return newData;
            });

            Campaign();
        }
    }, [loadStat]);

    return (
        <>

            <ModalSmall next={"Agregar"} visible={viewModal} callback={setViewModal} onClick={AddNewShortlink} Pending={pending}>
                <div className="top">
                    <p>Nuevo enlace</p>
                    <span>Agrega un nuevo enlace a tu campana</span>
                </div>

                <br />

                <div className="form-input">
                    <input type="text" placeholder="URL destino" onChange={handleSetForm} name="url" />
                </div>

                <div className="form-input">
                    <select name="app" id="" onChange={handleSetForm}>
                        <option value="">Selecciona la aplicacion</option>
                        <option value="fb">Facebook</option>
                        <option value="in">Instagram</option>
                        <option value="x">X (Twitter)</option>
                        <option value="email">Correo</option>
                        <option value="sms">Sms</option>
                        <option value="tik">Tiktok</option>
                        <option value="linkd">Linkedin</option>
                        <option value="yt">Youtube</option>
                        <option value="tele">Telegram</option>
                        <option value="ws">Whatsapp</option>
                        <option value="others">Otros</option>
                    </select>
                </div>

            </ModalSmall>
            <div className="page-info">
                <div className="">
                    <p className="title">Campaña de enlace: {params.id}</p>
                    <span>Agrega nuevos enlaces para tu campana general de urls</span>
                </div>

                <div className="right">
                    <button onClick={(ev) => { setViewModal(true) }} className="add" >Agregar nuevo enlace</button>
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

                            {loading == false ? <Chart options={charts} series={charts.series} type="bar" height={300} /> : ''}

                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="box box-padding">
                            {data?.links?.map((element, key) => (
                                <div className="item flex" key={key}>
                                    <div className="info">
                                        <div className="icon">
                                            <img src="/img/icons/default_link.png" alt="" />
                                        </div>

                                        <div className="text">
                                            <p className="title">{element.real_link}</p>
                                            <span className="desc">Creado el: 29 de may de 2023</span>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="title">App</p>
                                        <span><img className="icon-app" src={LoadIconApp(element.app)} alt="" /></span>
                                    </div>

                                    <div className="actions">
                                        <button><IoDocumentTextOutline /></button>
                                    </div>
                                </div>
                            ))}
                            {loading ? <LoadingCircleApp /> : !data?.links?.length ? '' : ''}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
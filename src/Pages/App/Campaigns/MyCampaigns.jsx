import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { API_URL } from "../../../ExportUrl"
import LoadingCircleApp from "../../../Components/App/LoadingCircle";
import WizardCampaign from "../../../Components/App/Campaigns/WizardCampaign";
import { AuthContext } from "../../../Context/AuthContext";
import { IoColorWandOutline, IoDocumentTextOutline, IoStatsChartOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { Time, existsStringInPath } from "../../../Functions/Global";
import NotFoundItems from "../../../Components/App/NotFoundItems";
import { Icon } from "@iconify/react/dist/iconify.js";
import SearchsBasic from "../../../Components/Inputs/SearchsBasic";
import { ShowStatsMiniature } from "../../../Components/App/Campaigns/ShowStatsMiniature";


export default function MyCampaigns() {

    const { UserInfo } = useContext(AuthContext)
    const Navigate = useNavigate()

    const [campaign, setCampaign] = useState([])
    const [modalWizard, setModalWizard] = useState(false)
    const [loading, setLoading] = useState(true)
    const location = useLocation()

    useEffect(() => {
        if (existsStringInPath("/new")) {
            setModalWizard(true)
        }
    }, [location])

    function searchCampaign(next) {
        let formData = new FormData()

        setLoading(true)

        let type = "em";
        if (existsStringInPath("/em")) {
            type = "em"
        }

        if (existsStringInPath("/em-mt")) {
            type = "em-mt"
        }


        if (existsStringInPath("/sms")) {
            type = "sms"
        }


        if (existsStringInPath("/sms-mt")) {
            type = "sms-mt"
        }


        if (!next) {
            setCampaign([])
        }

        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("type", type);
        axios.post(API_URL + "/api/get/campaign", formData, { withCredentials: true }).then((response) => { return response.data }).then((data) => {
            if (data?.results?.length) {
                setCampaign(data.results)
            }

            setLoading(false)
        }).catch((err) => {
            setLoading(false)
        })
    }

    useEffect(() => {

        searchCampaign(false)

    }, [location])


    function ViewDetail(ev) {
        let value = ev.target.dataset.value
        Navigate("/campaigns/detail/" + value)
    }

    function showStatsCampaign(key) {
        axios.post(API_URL + "/api/get/stats", { formData }, { withCredentials: true })
    }
    function toggleStats(keySearch) {
        setCampaign(prevData => {
            let newData = prevData.map((campaign, key) => {
                if (key === keySearch) {
                    return {
                        ...campaign,
                        showStats: !(campaign.showStats || false)
                    };
                }
                return campaign;
            });

            return newData;
        });
    }


    return (
        <>

            <WizardCampaign Visible={modalWizard} Close={setModalWizard} key={`${modalWizard ? 'x' : 'x2'}`} />

            <div className="page-info">
                <div className="">
                    <p className="title">Campañas</p>
                    <span>Crea y ve tus campañas rapidamente, tambien puedes entrar a nuestro sistema automatizado </span>

                </div>

                <div className="right">
                    <button className="add" onClick={(ev) => { setModalWizard(true) }}>Crear nueva campaña</button>
                    <button className="go-wizard" onClick={(ev) => { setModalWizard(true) }}>Wizard</button>
                </div>
            </div>

            <SearchsBasic />

            <div className="row">
                <div className="col-md-12">
                    <div className="box box-padding">
                        {campaign?.map((element, key) => (
                            <div className="item " style={{ padding: 0 }}>
                                <div className="item flex">
                                    <div className="info">
                                        <div className="icon">
                                            <img src="/img/icons/campaign_profile.png" alt="" />
                                        </div>

                                        <div className="text">
                                            <p className="title">NOMBRE DE CAMPANA: {element.name}</p>
                                            <span className="desc">FECHA: {Time(element.time_add)}</span>

                                            <br style={{ marginBottom: "10px" }} />
                                            <div className="details-campaign" >
                                                <span className="desc"><b>Enviados:</b> 12</span>
                                                <span className="desc"><b>Devueltos:</b> 12</span>
                                                <span className="desc"><b>Recibidos:</b> 12</span>
                                                <span className="desc"><b>Leidos:</b> 12</span>
                                                <span className="desc"><b>Clicks:</b> 12</span>
                                                <span className="desc"><b>Removidos:</b> 0</span>
                                            </div>

                                        </div>

                                    </div>

                                    <div className="actions">
                                        <button className="blue" onClick={ViewDetail} data-value={element.id_campaign}><Icon icon="line-md:cog-loop" /></button>
                                        <button className="green" onClick={(ev) => { toggleStats(key) }}>
                                            {element.showStats ? <Icon icon="grommet-icons:up" /> : <Icon icon="ps:stats" />}
                                        </button>
                                    </div>
                                </div>

                                {element.showStats &&
                                    <>
                                        <div className="stats">
                                            <ShowStatsMiniature idCampaign={element.id_campaign} idCompany={UserInfo?.company?.id_company} />
                                        </div>
                                    </>
                                }
                            </div>
                        ))}

                        {loading == false ? campaign?.length == 0 ? <NotFoundItems name={"campanas"} /> : '' : <LoadingCircleApp />}
                    </div>
                </div>
            </div>
        </>
    )
}
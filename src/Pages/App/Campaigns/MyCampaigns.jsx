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
        let value = ev.target.value
        Navigate("/campaigns/detail/" + value)
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


            <div className="row">
                <div className="col-md-12">
                    <div className="box box-padding">
                        {campaign?.map((element, key) => (
                            <div className="item flex">
                                <div className="info">
                                    <div className="icon">
                                        <img src="/img/icons/campaign_profile.png" alt="" />
                                    </div>

                                    <div className="text">
                                        <p className="title">{element.name}</p>
                                        <span className="desc">Creado el: {Time(element.time_add)}</span>
                                    </div>

                                </div>

                                <div className="actions">
                                    <button onClick={ViewDetail} value={element.id_campaign}><IoDocumentTextOutline /></button>
                                    <button><IoStatsChartOutline /></button>
                                </div>
                            </div>
                        ))}

                        {loading == false ? campaign?.length == 0 ? <NotFoundItems name={"campanas"} /> : '' : <LoadingCircleApp />}
                    </div>
                </div>
            </div>
        </>
    )
}
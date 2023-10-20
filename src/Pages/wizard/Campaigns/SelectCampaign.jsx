import { useContext, useEffect, useState } from "react";
import BottomAction from "../../../Components/Wizard/BottomActions";
import { WizardContext } from "../../../Context/WizardContext";
import axios from "axios";
import { API_URL } from "../../../ExportUrl";
import LoadingWizard from "../../../Components/Wizard/LoadingWizard";
import toast from "react-hot-toast"
import { IoCheckmark } from "react-icons/io5"
import SelectContacts from "./SelectContacts";
import SelectType from "./SelectType";

export default function SelectCampaign() {

    const { setPosition, setWizard, wizard, SelectorItem } = useContext(WizardContext)
    const [loading, setLoading] = useState(true);
    const [campaign, setCampaign] = useState();

    const [data, setData] = useState([]);


    function Next() {
        if (campaign >= 1) {
            setPosition(position => (position + 1))
        } else {
            toast.error("!Opps no has seleccionado una campaign")
        }
    }

    function SelectCampaign(value) {
        setWizard(prevData => ({ ...prevData, process: { ...prevData.process, id_campaign: value } }))
        setCampaign(value)
    }

    useEffect(() => {
        let formData = new FormData();
        formData.append("id_company", wizard.company.id_company)
        axios.post(API_URL + "/api/get/campaign", formData, { withCredentials: true }).then((response) => { return response.data }).then((data) => {
            setData(data.results)
            setLoading(false)
        }).catch((err) => {
            setLoading(false)
        })
    }, [])

    useEffect(() => {
        console.log(wizard)
    }, [wizard])

    return (<>
        <div className="option ">
            <div className="left">
                <div className="img-center">
                    <p>Elige tu campaña</p>
                    <img src={"img/icons/wizard-selectcampaign.png"} />
                </div>
            </div>
            <div className="right">
                <div className="info">
                    <p className="title">Elige tu campaña</p>
                    <span className="desc">Selecciona rapidamente una de tus campañas para seguir al siguiente paso.</span>
                </div>

                <div className="items-result">
                    {data.map((data, key) => (<>
                        <div className="item select" value={data.id_campaign} onClick={(ev) => { SelectorItem(ev, SelectCampaign) }}>
                            <img src="img/icons/campaign_profile.png" alt="" />
                            <div className="info">
                                <p>{data.name}</p>
                                <span>Creada el {data.time_add}</span>

                                <div className="circle"><i><IoCheckmark /></i></div>
                            </div>

                        </div>
                    </>))}

                    <LoadingWizard loading={loading} />
                </div>

                <BottomAction Next={Next} />
            </div>
        </div>

        {Number(campaign) == 'NaN' ? <SelectType /> : ''}
    </>)
}
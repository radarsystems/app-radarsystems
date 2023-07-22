import $ from "jquery"
import { useContext, useState } from "react";
import NewCampaign from "./Campaigns/NewCampaign";
import SelectCampaign from "./Campaigns/SelectCampaign";
import { toast } from "react-hot-toast";
import { WizardContext } from "../../Context/WizardContext";
import BottomAction from "../../Components/Wizard/BottomActions";

export default function Campaigns() {
    const [campaign, setCampaign] = useState({ campaign: "", campaign_name: "", actions: { campaign: "" } })
    const { Selector, Prev, position, setPosition } = useContext(WizardContext)

    function Next() {
        Observer()
    }

    function Observer() {
        let next = false;

        switch (position) {
            case 2:
                if (campaign.actions.campaign == "new" || campaign.actions.campaign == "select") {
                    next = true;
                } else {
                    toast.error("Opps no has seleccionado nada.")
                }
                break;
        }

        if (next) {
            setPosition(position + 1)

        }
    }

    function CampaignCase(value) {
        setCampaign({ ...campaign, actions: { campaign: value } })
    }

    return (<>

        <div className="option" style={{ display: "none" }}>
            <div className="left">
                <div className="img-center">
                    <p>Campañas</p>
                    <img src={"img/icons/email-alert.png"} />
                </div>
            </div>
            <div className="right">
                <div className="info">
                    <p className="title">Elige tu campana</p>
                    <span className="desc">Crea tu campana rapidamente solamente eligiendo un nombre y ajustandola a tus preferencias. Tambien puedes reutilizar alguna campana antigua.</span>
                </div>

                <div className="buttons selector">
                    <button value={"new"} onClick={(ev) => { Selector(ev, CampaignCase) }}>Crear una nueva</button>
                    <button value={"select"} onClick={(ev) => { Selector(ev, CampaignCase) }}>Ya tengo una</button>
                </div>


                <BottomAction Next={Next} />

            </div>
        </div>

        {campaign.actions.campaign == "new" ? <NewCampaign /> : <SelectCampaign />}

    </>)
}
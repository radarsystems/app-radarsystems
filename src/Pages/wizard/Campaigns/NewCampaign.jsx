import axios from "axios";
import { useContext, useEffect, useState } from "react"
import { API_URL } from "../../../ExportUrl";
import { WizardContext } from "../../../Context/WizardContext";
import { toast } from "react-hot-toast";
import SelectType from "./SelectType";

export default function NewCampaign() {
    const [form, setForm] = useState({ name: "", ocation: "", id_company: "" })
    const { AwaitButton, wizard, Prev, position, setPosition } = useContext(WizardContext)
    const [create, setCreate] = useState(false);
    const [status, setStatus] = useState(true)

    function CreateCampaign(ev) {

        AwaitButton(ev.target, 'active');

        let formData = new FormData()

        formData.append("name", form.name)
        formData.append("ocation", form.ocation)
        formData.append("id_company", form.id_company)

        if (wizard.type == "email") {
            formData.append("type_c", "em")
        }

        if (wizard.type == "sms") {
            formData.append("type_c", "sms")
        }



        axios.post(API_URL + "/api/upload/campaign", formData, { withCredentials: true }).then((response) => { return response.data }).then((data) => {
            if (data.msg) {
                toast.error(data.msg)
            }

            if (data.status) {
                setPosition(position + 1)
            }

            AwaitButton(ev.target, 'remove')
        }).catch((err) => {
            AwaitButton(ev.target, 'remove')
        })

    }

    function setNewForm(ev) {
        setForm({ ...form, [ev.target.name]: ev.target.value })
    }

    useEffect(() => {
        setForm({ ...form, id_company: wizard.company.id_company })
    }, [wizard])


    return (<>
        <div className="option">
            <div className="left">
                <div className="img-center">
                    <p>Una nueva aventura!</p>
                    <img src={"img/icons/new-campaign.png"} />
                </div>
            </div>
            <div className="right">
                <div className="info">
                    <p className="title">Crea una nueva campaña</p>
                    <span className="desc">Para crear una nueva campaña necesitas informacion basica para darle un nombre y un objetivo a tu campaña.</span>
                </div>

                <div className="form">
                    <div className="form-input">
                        <input type="text" name="name" placeholder="Titulo de campaña" onChange={setNewForm} />
                    </div>
                    <div className="form-input">
                        <select name="ocation" id="" onChange={setNewForm}>
                            <option value="default">Por defecto</option>
                            <option value="email">Cumpleaños</option>
                        </select>
                    </div>
                </div>


                <div className="buttons-action ">
                    <button className="prev" onClick={Prev}>{"<"}</button>
                    <button className="next" onClick={CreateCampaign}>Siguiente <div className="loading"></div></button>
                </div>
            </div>
        </div>

        {status == true ? <SelectType /> : ''}
    </>)
}
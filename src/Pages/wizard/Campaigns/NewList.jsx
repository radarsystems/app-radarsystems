import { useContext, useEffect, useState } from "react";
import BottomAction from "../../../Components/Wizard/BottomActions";
import { WizardContext } from "../../../Context/WizardContext";
import axios from "axios";
import { API_URL } from "../../../ExportUrl";
import { toast } from "react-hot-toast"
import UploadContacts from "./UploadContacts";

export default function NewList() {

    const { wizard, setWizard, setPosition, AwaitButton } = useContext(WizardContext)
    const [status, setStatus] = useState(false)
    const [form, setForm] = useState({ name: "" })

    function Next(ev) {


        if (!status) {
            AwaitButton(ev.target, 'active')
            let formData = new FormData()

            formData.append("name", form.name)
            formData.append("id_company", wizard.company.id_company)

            if (wizard.type == "email") {
                formData.append("type_c", "email")
            } else if (wizard.type == "sms") {
                formData.append("type_c", "sms")
            }


            axios.post(API_URL + "/api/upload/list", formData, { withCredentials: true }).then((response) => { return response.data }).then((data) => {
                if (data.status) {
                    toast.success("Lista creada existosamente!")
                    setPosition(position => (position + 1))
                    setStatus(true)

                    if (data.id_list) {
                        setWizard(prevData => ({
                            ...prevData, process: { ...prevData.process, id_list: data.id_list }
                        }))
                    }
                }

                if (data.msg) {
                    toast.error(data.msg)
                }

                AwaitButton(ev.target, 'remove')
            }).catch((err) => {
                toast.error("" + err)
                AwaitButton(ev.target, "remove")
            })
        } else {
            setPosition(position => (position + 1))
        }


    }

    function setFormInput(ev) {
        setForm(prevData => ({ ...prevData, [ev.target.name]: ev.target.value }))
    }


    return (
        <>
            <div className="option ">
                <div className="left">

                    <div className="img-center">
                        <p>Nueva lista</p>
                        <img src={"img/icons/lists.png"} />
                    </div>
                </div>

                <div className="right">
                    <div className="info">
                        <p className="title">Crear lista</p>
                        <span className="desc">Crea una nueva lista y luego ingresa los contactos</span>
                    </div>

                    <div className="form">
                        <div className="form-input">
                            <input type="text" name="name" placeholder="Nombre de lista" onChange={setFormInput} />
                        </div>

                    </div>

                    <BottomAction Next={Next} />
                </div>
            </div>

            {status == true ? <UploadContacts /> : ''}
        </>
    )
}
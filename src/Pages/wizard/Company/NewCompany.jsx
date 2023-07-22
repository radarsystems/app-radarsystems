import { useContext, useState } from "react"
import { WizardContext } from "../../../Context/WizardContext";
import CircleColor from "../../../Components/CircleColor";
import axios from "axios";
import { API_URL } from "../../../ExportUrl";
import { toast } from "react-hot-toast";
import $ from "jquery"
import BottomAction from "../../../Components/Wizard/BottomActions";

export default function NewCompany() {

    const { Prev, AwaitButton, setPosition } = useContext(WizardContext);
    const [form, setForm] = useState({ name: "", type: "", color: "", default: "false" })


    function Next() {

    }


    function setColor(value) {
        setForm({ ...form, color: value })
    }


    function SetNewForm(ev) {
        let value = ev.target.value;
        let name = ev.target.name;

        setForm({ ...form, [name]: value })
    }

    function RegisterCompany(ev) {

        if (form.name && form.type && form.color) {
            AwaitButton(ev.target, 'active')
            axios.post(API_URL + "/api/upload/company", form, { withCredentials: true }).then((response) => { return response.data }).then((data) => {
                AwaitButton(ev.target, 'remove');

                if (data.status) {
                    toast.success("Company creada con exito");
                    setPosition(1)
                    $("button.active").removeClass("active")
                }

                if (data.msg) {
                    toast.error(data.msg)
                }
            }).catch((err) => {
                AwaitButton(ev.target, 'remove');
            })
        } else {
            toast.error("Opps no has terminado los campos")
        }

    }

    return (<>

        {status == false ? <div className="option">
            <div className="left">
                <div className="img-center">
                    <p>Nuevas ideas!</p>

                    <img src={"img/icons/cohete-men.png"} />
                </div>
            </div>

            <div className="right">
                <div className="info">
                    <p className="title">Crear empresa</p>
                    <span className="desc">Personaliza tu empresa, con colores u imagen para poder identificarla si tienes otras empresas por registrar. Elige un nombre y comienza!</span>
                </div>

                <div className="form">

                    <div className="form-input">
                        <input type="text" placeholder="Nombre de empresa" name="name" onChange={SetNewForm} />
                    </div>

                    <div className="form-input">
                        <br />
                        <label htmlFor="">Tipo de empresa</label>
                        <select name="type" id="" onChange={SetNewForm}>
                            
                        </select>
                    </div>

                    <div className="form-input">
                        <br />
                        <label>Elige un color</label>
                        <span className="desc">El color te ayudara a identificar tu empresa.</span>
                        <div className="colors">
                            <CircleColor color={"#2e56ff"} fn={setColor} />
                            <CircleColor color={"#57c583"} fn={setColor} />
                            <CircleColor color={"#3fcae9"} fn={setColor} />
                            <CircleColor color={"#e9d43f"} fn={setColor} />
                            <CircleColor color={"#d77613"} fn={setColor} />
                            <CircleColor color={"#c069cb"} fn={setColor} />
                            <CircleColor color={"#cb6992"} fn={setColor} />

                        </div>
                    </div>

                    <div className="form-input">
                        <br />
                        <label>Seleccionar como predeterminada</label>
                        <span className="desc">Si la eliges como predeterminada automaticamente se usara sin necesidad de seleccionarla.</span>
                        <br />
                        <select name="default" id="" onChange={SetNewForm}>
                            <option value={"false"}>No</option>
                            <option value={"true"}>Si</option>
                        </select>

                    </div>



                </div>


                <BottomAction Prev={Prev} Next={RegisterCompany} />
            </div>


        </div> : <></>}

    </>)
}
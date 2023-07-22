import axios from "axios"
import { BlockPicker, ChromePicker, HuePicker, SketchPicker } from "react-color"
import { API_URL } from "../../../../ExportUrl"
import { useState } from "react"
import html2canvas from "html2canvas"
import { useContext } from "react"
import { AuthContext } from "../../../../Context/AuthContext"
import { toast } from "react-hot-toast"

export default function EditorLeft({ setHeader, header, json }) {
    const [pending, setPending] = useState(false)
    const { UserInfo } = useContext(AuthContext)
    const [blockPickerColor, setBlockPickerColor] = useState();

    function setChange(ev) {
        let value = ev.target.value
        let name = ev.target.name

        if (name == "background") {
            if (value.indexOf("http") >= 0 || value.indexOf("www") >= 0) {
                value = `url(${value})`
            }
        }

        setHeader(prevData => ({ ...prevData, [name]: value }))
    }




    async function UploadSurvey() {

        let formData = new FormData()


        if (header.id_survey) {
            formData.append("id_survey", header.id_survey)
        }

        formData.append("header", JSON.stringify(header))
        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("json", JSON.stringify(json))



        if (header.title) {
            if (json.length >= 1) {

                let miniature = await new Promise((resolve, reject) => {
                    html2canvas(document.querySelector(".center"), { allowTaint: false, useCORS: true }).then((canvas) => {
                        let url = canvas.toDataURL("image/png");
                        resolve(url)
                    })
                })

                if (miniature) {
                    formData.append("miniature", miniature.replace("data:image/png;base64,", ""));
                }

                setPending(true)
                axios.post(API_URL + "/api/upload/survey", formData, { withCredentials: true })
                    .then((response) => { return response.data })
                    .then((data) => {
                        if (data.status) {
                            if (data.id_survey) {
                                if (!header.id_survey) {
                                    setHeader(prevData => ({ ...prevData, id_survey: data.id_survey }))
                                }
                            }

                            if (data.token) {
                                setHeader(prevData => ({ ...prevData, token: data.token }))
                            }

                            if (data.short_link) {
                                setHeader(prevData => ({ ...prevData, short_link: data.short_link }))
                            }
                        }
                        setPending(false)
                    }).catch((err) => {
                        setPending(false)
                    })
            } else {
                toast.error("Opps no has agregado una pregunta.")
            }
        } else {
            toast.error("Opps no has elegido un titulo")
        }


    }



    return (<>

        <div className="title-top">
            <p>Personalizar encuesta</p>
            <span>Personaliza tu encuesta, imagen, fondo, titulo y logo.</span>
        </div>
        <br />
        <div className="option">
            <p className="title">Titulo</p>
            <input type="text" onChange={setChange} defaultValue={header.title} name="title" placeholder="Ej: Encuesta de fidelidad" />
        </div>

        <div className="option">
            <p className="title" >Ingresa url de tu logo</p>
            <input type="text" onChange={setChange} defaultValue={header.logo} name="logo" />
        </div>

        <div className="option">
            <p className="title">Elige el fondo</p>
            <input type="text" onChange={setChange} defaultValue={header.background} name="background" />
        </div>


        <div className="option">
            <p className="title">Blur</p>
            <input type="range" defaultValue={0.0} step={"0.1"} max={"10"} value={header.blur} onChange={setChange} name="blur" />
        </div>

        <div className="option">
            <p className="title">Brillo</p>
            <input type="range" defaultValue={1} step={"0.0"} max={"1"} value={header.brightness} onChange={setChange} name="brightness" />
        </div>

        <br />

        <div className="title-top">
            <p>Personalizar Cajas</p>
            <span>Personaliza de tu manera preferida tus cajas.</span>
        </div>

        <br />

        <div className="option">
            <p className="title">Border Radius</p>
            <input type="range" defaultValue={0.1} step={"0.1"} max={"20"} onChange={setChange} name="borderRadius" />
        </div>


        <div className="option">
            <p className="title">Fondo</p>

            <div className="flex-colors">
                <button onClick={(ev) => { setChange(ev) }} name="colorBox" value="ligth">Modo Claro</button>
                <button onClick={(ev) => { setChange(ev) }} name="colorBox" value="dark">Modo Oscuro</button>
                <button onClick={(ev) => { setChange(ev) }} name="colorBox" value="transparent">Transparente</button>
            </div>
        </div>

        <div className="option">
            <button className={`save ${pending ? 'await' : ''}`} onClick={UploadSurvey}>Guardar <div className="loading"></div></button>
        </div>


    </>)
}
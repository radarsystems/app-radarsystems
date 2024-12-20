import { useContext, useEffect, useState } from "react"
import $ from "jquery"
import axios from "axios"
import { API_URL } from "../../../ExportUrl"
import { useParams } from "react-router-dom"
import { AuthContext } from "../../../Context/AuthContext"
import { Icon } from "@iconify/react/dist/iconify.js"
import toast from "react-hot-toast"
import PreviewTemplateHtml from "../../../Components/App/Global/PreviewTemplate"

export default function AutoResponders() {

    const [count, setCount] = useState(0)
    const { UserInfo } = useContext(AuthContext)
    const [campaign, setCampaign] = useState({})
    const [autoResponse, setAutoResponse] = useState({ type_response: "", view: "", childrens: [] })
    const [htmlPreview, setHtmlPreview] = useState("")
    const [showHtml, setShowHtml] = useState(false)
    const params = useParams()

    function getInfoCampaign() {

        let formData = new FormData()
        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("id_campaign", params.id)

        axios.post(API_URL + "/api/get/campaign", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setCampaign(data)
            })
    }


    useEffect(() => {
        $(".case.active").removeClass('active')
        $(".case").eq(count).addClass("active")
    }, [count])

    useEffect(() => {
        getInfoCampaign()
    }, [])

    function viewConfig(ev) {
        let value = ev.currentTarget.dataset.value

        let go = true;

        setAutoResponse((prevData) => {
            let newData = { ...prevData, childrens: [...(prevData?.childrens || [])] };

            if (!newData.childrens.some(item => item.name === value)) {
                newData.childrens.push({ type: value });
            }

            newData.view = value;
            setCount(2);

            return newData;
        });


    }

    function updateFormSelect(ev) {
        let name = ev.target.name;
        let value = ev.target.value;

        setAutoResponse(prevData => {
            let newData = { ...prevData }

            let item = newData.childrens.find(item => item.type == autoResponse.view)

            if (item) {
                item[name] = value
            }

            return newData
        })
    }

    function readFileSelect(ev) {
        let files = ev.target.files;

        if (files.length) {
            let file = files[0]
            if (file.type.indexOf("text") >= 0) {
                let reader = new FileReader()

                reader.onload = (ev) => {
                    let html = ev.target.result
                    if (html) {
                        setAutoResponse(prevData => {
                            let newData = { ...prevData }

                            let item = newData.childrens.find(item => item.type == autoResponse.view)

                            if (item) {
                                item.body = html
                                setHtmlPreview(html)
                            }

                            return newData
                        })
                    } else {
                        toast.error("Opps no tiene contenido este archivo html")
                    }
                }

                reader.readAsText(file);

            } else {
                toast.error("Opps este archvio no es compatible")
            }
        }
    }

    function saveConfig() {
        let item = autoResponse.childrens.find(item => item.type == autoResponse.view)


        if (!item.body && !item.sms) {
            toast.error("Opps no puedes dejar el contenido principal vacio")
        } else if (!item.type) {
            toast.error("Opps no hay un tipo seleccionado")
        } else {
            let formData = new FormData()

            formData.append("id_company", UserInfo?.company?.id_company)
            formData.append("type", item.type)
            formData.append("type_response", autoResponse.type_response)
            formData.append("affair", item.affair);
            formData.append("minutes", item.minutes)
            formData.append("id_campaign", params.id)

            if (item.sms) {
                formData.append("sms", item?.sms)
            } else {
                formData.append("body", item.body)
            }

            axios.post(API_URL + "/api/upload/campaign/autoresponder", formData, { withCredentials: true })
                .then((response) => { return response.data })
                .then((data) => {
                    console.log(data)
                })
                .finally(() => {

                })
        }

    }


    return (
        <>

            <PreviewTemplateHtml visible={showHtml} htmlPreview={htmlPreview} close={setShowHtml} />
            <div className={`wizard-home open`} >
                <div className="body autoresponse">
                    <div className="case">
                        <div className="top">
                            <p className="title">AutoResponse: <b>{campaign?.name}</b></p>
                            <span className="desc">Configura tu auto respuestas</span>
                        </div>

                        <div className="options-auto">
                            <div className="option" onClick={(ev) => { setAutoResponse({ ...autoResponse, type_response: "sms" }); setCount(1) }}>
                                <i><Icon icon="icon-park-twotone:message" /></i>
                                <p>Sms</p>
                            </div>

                            <div className="option" onClick={(ev) => { setAutoResponse({ ...autoResponse, type_response: "mail" }); setCount(1) }}>
                                <i><Icon icon="si:mail-duotone" /></i>
                                <p>Correo</p>
                            </div>
                        </div>
                    </div>

                    <div className="case">
                        <div className="top">
                            <p className="title">{autoResponse?.type_response}</p>
                            <span className="desc">Estas son las opciones para configurar</span>
                        </div>

                        <div className="options flex">
                            <div className="selector" onClick={viewConfig} data-value={`no-open-${autoResponse.type_response}`}>
                                <div className="check">
                                    <Icon icon="bx:cog" />
                                </div>
                                <div className="info">
                                    <p>USUARIO NO ABRE EL CORREO</p>
                                    <span>
                                        La lista de email es una herramienta que te permite administrar tus contactos de manera eficiente. Aquí podrás subir tus contactos para realizar envíos de correo electrónico de forma conveniente y efectiva.
                                    </span>
                                </div>
                            </div>

                            <div className="selector" onClick={viewConfig} data-value={`open-${autoResponse.type_response}`}>
                                <div className="check">
                                    <Icon icon="bx:cog" />
                                </div>
                                <div className="info">
                                    <p>USUARIO ABRIO EL CORREO</p>
                                    <span>
                                        La lista de email es una herramienta que te permite administrar tus contactos de manera eficiente. Aquí podrás subir tus contactos para realizar envíos de correo electrónico de forma conveniente y efectiva.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="case">
                        <div className="top">
                            <p className="title">AutoResponse: <b>{autoResponse?.type_response}</b></p>
                            <span className="desc">Configurando: {autoResponse.view}</span>
                        </div>

                        <div className="stat box box-padding">
                            <div className="top">
                                <p>Tiempo que transcurrirá</p>
                                <span>Especifica cuanto tiempo transcurrira  para efectuar el envio de este {autoResponse.type_response}</span>
                            </div>

                            <div className="form-input">
                                <input onChange={updateFormSelect} name="minutes" type="number" placeholder="Minutos..." />
                            </div>
                        </div>

                        <div className="stat box box-padding">

                            <div className="top">
                                <p>Contenido</p>
                                <span>Ingresa el contenido enviado en el {autoResponse.type_response}</span>
                            </div>

                            <div className="form-input">
                                <label htmlFor="">Asunto</label>
                                <input name="affair" type="text" onChange={updateFormSelect} placeholder="Ej: Opps no has respondido a la ultima encuesta de radarsystems!" />
                            </div>

                            <div className="form-input">
                                <label htmlFor="">Plantilla (HTML)</label>
                                <input name="body" type="file" onChange={readFileSelect} placeholder="Ej: Opps no has respondido a la ultima encuesta de radarsystems!" />
                            </div>

                            <button onClick={(ev) => { setShowHtml(true) }}>test</button>
                        </div>

                        <div className="actions">
                            <button className="next">Volver</button>
                            <button onClick={saveConfig} className="next">Guardar</button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}
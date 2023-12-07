import React, { useEffect, useState } from "react";
import $ from "jquery";
import { IoAddCircleOutline, IoArrowBackOutline, IoCloudUploadOutline, IoColorWandOutline, IoEllipsisVerticalOutline, IoFlashOutline, IoSaveOutline, IoTrashOutline } from "react-icons/io5"
import axios from "axios";
import { API_URL } from "../../../ExportUrl"
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext"
import { useNavigate, useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import { toast } from "react-hot-toast";
import ModalSmall from "../ModalSmall"
import NotFoundItems from "../NotFoundItems"
import { PreviewTemplate, Time } from "../../../Functions/Global";

export default function EditorCanvas() {
    const [loading, setLoading] = useState(true);
    const [editorLoad, setEditorLoad] = useState(false);
    const [pending, setPending] = useState({ save: false, campaign: false })
    const [templates, setTemplates] = useState({ results: [], loadingTemplate: false })
    const [modalTitle, setModalTitle] = useState(false)
    const [campaign, setCampaign] = useState({});
    const [title, setTitle] = useState("")
    const [viewTemplates, setViewTemplates] = useState(false)
    const { UserInfo } = useContext(AuthContext)
    const params = useParams()
    const [letterView, setLetter] = useState();
    let letterLoading = ['Cargando editor...', 'Nos tardaremos un poco', 'Que tal tu dia?', 'Vamos! con mucha imaginacion.', 'Ahora es un buen momento!', 'Un poco mas...', 'Ya casi!', 'Había una vez!']


    const Navigator = useNavigate();
    const letterInterval = undefined;

    function loadScript(url, callback) {
        var script = document.createElement('script');
        script.src = url;
        script.onload = callback;
        document.head.appendChild(script);
    }


    useEffect(() => {
        setEditorLoad(true)
        if (editorLoad) {

            loadScript('//editor.unlayer.com/embed.js', function (ev) {
            })

            loadScript('/draganddrop/dist/js/body.js', function (ev) {

                setTimeout(() => {
                    setLoading(false)
                }, 3500)

            })
        }

    }, [editorLoad]);

    function save() {

        unlayer.exportHtml(async function (data) {

            if (title == "" || title == undefined) {
                toast.error("Opps debes definir un titulo primero")
                setModalTitle(true)
            } else {
                setAwait("save", true)
                let formData = new FormData()

                let preview = await Capture().then((response) => {
                    return response
                })

                formData.append("preview", preview)
                formData.append("title", title)
                formData.append("html", data.html)
                formData.append("json", JSON.stringify(data.design))
                formData.append("id_company", UserInfo?.company?.id_company)
                formData.append("type", "email")

                if (params.id) {
                    formData.append("id_template", params.id)
                }




                axios.post(API_URL + "/api/upload/bodycampaign", formData, { withCredentials: true })
                    .then((response) => { return response.data })
                    .then((data) => {
                        if (data.status) {
                            if (params.id == undefined) {
                                Navigator(`/editor/canvas/${data.id_body}`)
                            }
                        }
                        setAwait("save", false)
                    }).catch((err) => {
                        setAwait("save", false)
                    })


            }
        })






    }


    function newBody() {
        setEditorLoad(true)
        $("#editor").html("")
        Navigator("/editor/canvas")
    }

    function setAwait(name, value) {
        setPending(prevData => ({ ...prevData, [name]: value }))
    }

    function LoadTemplates() {

    }

    async function Capture() {
        return new Promise((resolve, reject) => {
            let previewFrontend = document.querySelector(".preview-template")

            try {
                unlayer.exportHtml((data) => {
                    previewFrontend.innerHTML = data.html
                    if (previewFrontend.innerHTML) {
                        html2canvas(previewFrontend, { allowTaint: false, useCORS: true }).then((canvas) => {
                            let urlImage = canvas.toDataURL("image/png");
                            resolve(urlImage)
                        })
                    }
                })
            } catch (err) {
                reject(err)
            }

        })

    }

    function RequestMyTemplates() {
        let formData = new FormData()
        formData.append("id_company", UserInfo?.company?.id_company)
        axios.post(API_URL + "/api/get/templatesall", formData, { withCredentials: true }).then((response) => { return response.data })
            .then((data) => {
                setTemplates(prevData => ({ ...prevData, results: data }))
            })
            .catch((err) => {

            })
    }

    function openMyTemplates() {
        setViewTemplates(true)
    }

    function getCampaign(id) {
        let formData = new FormData()
        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("id_campaign", id)

        axios.post(API_URL + "/api/get/campaign", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                if (data) {
                    setCampaign(data)
                }
            })
    }

    useEffect(() => {

        let params = new URLSearchParams(window.location.search)
        let campaignId = params.get("campaign")


        if (campaignId) {
            getCampaign(campaignId)
        }



        RequestMyTemplates()

        let posLetter = 0;

        setLetter(letterLoading[0]);
        setInterval(() => {
            let totalPositions = letterLoading.length
            posLetter = posLetter + 1;

            setLetter(letterLoading[posLetter - 1])

            if (posLetter >= totalPositions) {
                posLetter = 0
            }

        }, 4500)




    }, [])


    useEffect(() => {
        if (params.id) {
            let formData = new FormData()
            setLoading(true)
            formData.append("id_template", params.id)
            formData.append("id_company", UserInfo?.company?.id_company)
            axios.post(API_URL + "/api/get/templatejson", formData, { withCredentials: true })
                .then((response) => { return response.data })
                .then((data) => {

                    setLoading(false)
                    if (data.json) {
                        unlayer.loadDesign(JSON.parse(data.json))
                    } else {
                        toast.error("Error al cargar la template")
                    }
                })
                .catch((err) => {
                    setLoading(false)
                })
        }
    }, [params?.id])


    function setForm(ev) {
        setTitle(ev.target.value)
    }

    function getTemplate(key) {
        Navigator(`/editor/canvas/${key}${campaign?.id_campaign ? '?campaign=' + campaign.id_campaign : ''}`)
    }

    function setTemplateCampaign() {
        setAwait("campaign", true)
        let formData = new FormData()
        formData.append("id_campaign", campaign.id_campaign)
        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("id_template", params.id)
        axios.post(API_URL + "/api/update/settemplate", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setAwait("campaign", false)

                if (data.status) {
                    toast.success(data.msg)
                    setCampaign(prevData => ({ ...prevData, id_template: params.id }))
                }
            }).catch((err) => {
                setAwait("campaign", false)
            })
    }

    function deleteTemplateCampaign() {
        let formData = new FormData()

        formData.append("id_campaign", campaign.id_campaign)
        formData.append("id_company", UserInfo?.company?.id_company)

        setCampaign(prevData => ({ ...prevData, id_template: "" }))

        axios.post(API_URL + "/api/delete/settemplate", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {

            })
    }


    return (
        <>

            {loading ? <>
                <div className="loading-template">
                    <div className="center">
                        <img src="/img/icons/logo.png" alt="" />
                        <p className="await">{letterView} <div className="loading"></div></p>
                    </div>
                </div>
            </> : ''}

            <ModalSmall visible={modalTitle} onClick={(ev) => { setModalTitle(false); }} next={"Asignar"} callback={setModalTitle}>
                <div className="top">
                    <p>Elige un titulo</p>
                </div>

                <br />
                <div className="content">
                    <div className="form-input">
                        <label htmlFor="">Esto te ayudara a identificar tu plantilla</label>
                        <input type="text" placeholder="Titulo de template" onChange={setForm} />
                    </div>
                </div>
                <br />
            </ModalSmall>
            <ModalSmall visible={viewTemplates} minWidth={"50%"} buttonSave={false} maxWidth={"150px"} callback={setViewTemplates}>
                <div className="top">
                    <p>Mis Plantillas</p>
                </div>
                <br />
                <div className="content row">
                    {templates.results.map((element, key) => (
                        <div className="col-md-4" key={key}>
                            <div className="template" onClick={(ev) => { getTemplate(element.id_template) }}>
                                <p>{element.title}</p>
                                <span>Agregada: {Time(element.time_add)}</span>
                                <img src={PreviewTemplate(UserInfo?.company?.folder_sftp, element.preview_image)} />
                            </div>
                        </div>
                    ))}

                    {templates.loadingTemplate == false ? templates.results.length == 0 ? <NotFoundItems name={"plantillas"} /> : '' : ''}
                </div>
            </ModalSmall>

            <div className="editor-canvas">
                <header>
                    <link href="/draganddrop/dist/css/style.css" rel="stylesheet" type="text/css" />
                </header>

                <div className="topnav1">

                    <div className="buttons">
                        <button style={{ background: "transparent" }} onClick={(ev) => { Navigator("/home") }}><IoArrowBackOutline /> Volver</button>
                        {campaign.name ?
                            <>
                                <div className="campaign">
                                    <img src="/img/icons/campaign_profile.png" alt="" />
                                    <p>{campaign?.name}</p>
                                    <span>Campaña seleccionada</span>
                                </div>

                                {campaign.id_template !== params.id ?
                                    < button className={`${pending.campaign == true ? 'await' : ''}`} onClick={setTemplateCampaign}>
                                        <IoFlashOutline /> Usar Plantilla
                                        <div className="loading"></div>
                                    </button>
                                    :
                                    <>
                                        <button className="use">Utilizando plantilla</button>
                                        <button onClick={deleteTemplateCampaign}><IoTrashOutline /></button>
                                    </>
                                }

                            </>
                            : ''}
                    </div>

                    <div className="buttons right">
                        <button className={`${pending.save == true ? 'await' : ''}`} onClick={save}>
                            {params.id ? <><IoColorWandOutline /> Editar</> : <> <IoSaveOutline /> Guardar</>}

                            <div className="loading"></div>
                        </button>
                        <button onClick={openMyTemplates}>
                            <IoCloudUploadOutline /> Cargar plantilla
                        </button>
                        <button onClick={newBody}>
                            <IoAddCircleOutline /> Nuevo
                        </button>

                        <button onClick={openMyTemplates}>
                            <IoEllipsisVerticalOutline />
                        </button>
                    </div>

                </div>

                <div className="preview-template">

                </div>
                <div id="editor"></div>
            </div >

        </>
    );
}

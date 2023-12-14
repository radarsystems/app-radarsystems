import { useContext, useEffect, useState } from "react"
import { IoArrowBackOutline, IoCheckmarkSharp, IoCloudUploadOutline, IoColorWandOutline, IoPushOutline, IoStatsChartOutline, IoSunnyOutline, IoTrashOutline } from "react-icons/io5"
import { FaCheck } from "react-icons/fa"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../../../Context/AuthContext"
import axios from "axios"
import { API_URL } from "../../../ExportUrl"
import LoadingCircleApp from "../../../Components/App/LoadingCircle"
import NotFoundItems from "../../../Components/App/NotFoundItems"
import $, { param } from "jquery"
import { PreviewTemplate, Time, formatNumberZero } from "../../../Functions/Global"
import { toast } from "react-hot-toast"
import ModalSmall from "../../../Components/App/ModalSmall"
import ModalDelete from "../../../Components/App/ModalDelete"
import Calendar from "react-calendar"
import 'react-calendar/dist/Calendar.css';
import ModalProgrammingCampaign from "../../../Components/App/Campaigns/ModalProgrammingCampaign"
import TextareaSms from "../../../Components/Textarea/TextareaSms"
import CampaignStatus from "../../../Components/App/Campaigns/CampaignStatus"
import ModalSendTest from "../../../Components/App/Campaigns/ModalSendTest"


export default function DetailCampaigns() {

    const params = useParams()
    const { UserInfo } = useContext(AuthContext)

    const Navigator = useNavigate()

    const [editMode, setEditMode] = useState(false)
    let editActiveDefault = { lists: false, body: false, affair: false };
    const [editActive, setEditActive] = useState(editActiveDefault)
    const [search, setSearch] = useState({ lists: [] })
    const [loading, setLoading] = useState({ lists: false })
    const [campaign, setCampaign] = useState([])
    const [pending, setPending] = useState({ sendCampaign: false });
    const [form, setForm] = useState({ affair: "" });
    const [deleteModal, setDeleteModal] = useState(false)
    const [viewModalProgramming, setModalProgramming] = useState()
    const [pendingDelete, setPendingDelete] = useState(false)
    const [formProgramming, setFormProgamming] = useState({ hh: "", mm: "", dd: "", ii: "", yy: "", timeExpire: "", "p_type": "default" })
    const [pendingProgramming, setPendingProgramming] = useState(false)
    const [template, setTemplate] = useState({})
    const [newText, setNewText] = useState()
    const [modalSendTest, setModalTest] = useState(false)

    function searchLists(search) {

        loadingLists(true)

        let formData = new FormData();
        formData.append("id_company", UserInfo?.company?.id_company)

        if (campaign.lists) {
            formData.append("ignore_id", campaign.lists)
        }
        setSearch(prevData => ({ ...prevData, lists: [] }))

        if (search) {
            formData.append("search", search)
        }

        axios.post(API_URL + "/api/get/list", formData, { withCredentials: true }).then((response) => { return response.data }).then((data) => {
            setSearch(prevData => ({ ...prevData, lists: data }))

            loadingLists(false)

        })
    }

    function loadingLists(value) {
        setLoading(prevData => ({ ...prevData, lists: value }))
    }

    let searchTimeout = 0

    function searchListsWrite(ev) {
        let value = ev.target.value

        clearTimeout(searchTimeout);


        searchTimeout = setTimeout(() => {
            searchLists(value)

        }, 250)

    }

    function cleanSearchList() {
        clearTimeout(searchTimeout)
    }


    useEffect(() => {

        if (editActive.lists) {
            searchLists()
        }

    }, [editActive])

    useEffect(() => {
        let formData = new FormData()

        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("id_campaign", params.id)

        axios.post(API_URL + "/api/get/campaign", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setCampaign(data)
            })
            .catch((err) => {

            })


    }, [])

    useEffect(() => {

        if (campaign?.id_template) {
            searchTemplateSms()
        }

    }, [campaign])

    function searchTemplateSms() {
        let formData = new FormData()
        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("id_template", campaign?.id_template)
        formData.append("type", "all")

        axios.post(API_URL + "/api/get/templatejson", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setNewText(data?.json?.msg)
            })
            .catch((err) => {
                toast.error(String(err))
            })
    }

    // LISTS CAMPAGINS

    function UseList(ev) {
        let value = ev.target.value

        if (value) {
            let formData = new FormData()
            formData.append("id_list", value)
            formData.append("id_company", UserInfo?.company?.id_company)
            formData.append("id_campaign", params.id)

            let add = false

            if (!campaign?.lists?.length) {
                setCampaign(prevData => ({ ...prevData, lists: value }))
                add = true
            } else {
                if (!campaign.lists.includes(value)) {
                    add = true
                    setCampaign(prevData => ({ ...prevData, lists: prevData.lists + "," + value }))
                }
            }

            if (add) {
                let target = $(ev.target)

                target = target.parents(".result")
                target.hide('x')

                axios.post(API_URL + "/api/update/addlistcampaign", formData, { withCredentials: true })
                    .then((response) => { return response.data })
                    .then((data) => {
                        if (data.status) {

                        }
                    })
                    .catch((err) => {

                    })

            }
        }
    }

    function DeleteList(ev) {

        let value = ev.target.value



        if (value) {
            let formData = new FormData()
            formData.append("id_campaign", campaign.id_campaign)
            formData.append("id_list", value)
            formData.append("id_company", UserInfo.company.id_company)
            axios.post(API_URL + "/api/delete/listscampaign", formData, { withCredentials: true })

            setCampaign(prevData => ({ ...prevData, lists: prevData?.lists?.replace("," + value, "").replace(value, "") }))

        }

    }

    // EDIT ACTIVE

    function ActiveList(name) {
        setEditActive(editActiveDefault)
        setEditActive(prevData => ({ ...prevData, [name]: true }))
    }

    // SENDS


    function sendCampaign(ev) {

        setAwait("sendCampaign", true)
        let formData = new FormData()
        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("id_campaign", params.id)

        axios.post(API_URL + "/api/send/campaign", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setAwait("sendCampaign", false)
                if (data.status) {
                    toast.success("Campaña enviada!")
                } else {
                    toast.error(data.msg)
                }
            }).catch((err) => {
                setAwait("sendCampaign", false)
            })
    }

    function updateForm(ev) {
        let name = ev.target.name
        let value = ev.target.value

        setForm(prevData => ({ ...prevData, [name]: value }))
    }

    function setAffair(ev) {
        let target = $(ev.target)

        target.addClass("await")

        let formData = new FormData()

        formData.append("affair", form.affair)
        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("id_campaign", campaign.id_campaign)


        axios.post(API_URL + "/api/update/setaffair", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                target.removeClass("await")

                if (data.status) {
                    setEditActive(editActiveDefault)
                    setCampaign(prevData => ({ ...prevData, affair: form.affair }))
                }
            })
            .catch((err) => {
                target.removeClass("await")

            })
    }

    function setAwait(name, value) {
        setPending(prevData => ({ ...prevData, [name]: value }))
    }

    function deleteCampaign() {

        setPendingDelete(true)

        let formData = new FormData()
        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("id_campaign", params.id)

        axios.post(API_URL + "/api/delete/campaign", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setPendingDelete(false)

                if (data.status) {
                    Navigator("/campaigns")
                }
            }).catch((err) => {
                setPendingDelete(false)
            })
    }


    function setNewProgramming(ev) {
        let value = ev.target.value
        let name = ev.target.name

        if (name == "date") {
            const dateObj = new Date(value);
            const day = dateObj.getDate();
            const year = dateObj.getFullYear();
            const month = dateObj.getMonth() + 1;


            setFormProgamming({ ...formProgramming, dd: day, yy: year, mm: month })
        } else {
            setFormProgamming({ ...formProgramming, [name]: value })
        }


    }

    function programmingCampaign() {
        let formData = new FormData()

        setPendingProgramming(true)

        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("hh", formProgramming.hh ? formProgramming.hh : "?")
        formData.append("dd", formatNumberZero(formProgramming.dd) ? formatNumberZero(formProgramming.dd) : "?")
        formData.append("yy", formProgramming.yy ? formProgramming.yy : "?")
        formData.append("mm", formProgramming.mm ? formProgramming.mm : "?")
        formData.append("ii", formProgramming.ii ? formProgramming.ii : "?")
        formData.append("id_campaign", params.id)
        formData.append("timeExpire", formProgramming?.timeExpire)
        formData.append("p_type", formProgramming?.p_type);
        formData.append("type", "campaign")

        axios.post(API_URL + "/api/update/programming", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setPendingProgramming(false)
                if (data.status) {

                    setModalProgramming(false)
                    toast.success("Campana programada con exito")
                }
            })
            .catch((err) => {
                setPendingProgramming(false)

            })

    }

    function saveBody() {

        let formData = new FormData()
        formData.append("msg", newText)
        formData.append("id_campaign", params.id)
        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("type", "sms")

        if (campaign?.id_template) {
            formData.append("id_template", campaign?.id_template)
        }

        axios.post(API_URL + "/api/upload/bodycampaign", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {

                if (data.status) {
                    toast.success("Guardado con exito")
                }
            })
            .catch((err) => {
                toast.error(String(err))
            })

    }

    function PauseCampaign() {
        let formData = new FormData()

        formData.append("id_campaign", campaign?.id_campaign)
        formData.append("id_company", UserInfo?.company?.id_company)

        axios.post(API_URL + "/api/update/pausecampaign", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                if (data.status) {
                    setCampaign({ ...campaign, status: "prepare" })
                }
            })
    }



    return (
        <>

            <ModalSmall maxWidth={400} minWidth={400} visible={modalSendTest} callback={setModalTest} buttonsActions={false}>
                <ModalSendTest Close={setModalTest} setCampaign={setCampaign} campaign={campaign} />
            </ModalSmall>

            <ModalSmall key={ModalProgrammingCampaign ? "XD" : "xd"} visible={viewModalProgramming} callback={setModalProgramming} width={"30%"} onClick={programmingCampaign} maxWidth={"500px"} next={"Programar"} Pending={pendingProgramming}>
                <ModalProgrammingCampaign setFormProgamming={setNewProgramming} campaign={campaign} />
            </ModalSmall>

            <ModalDelete visible={deleteModal} callback={setDeleteModal} Pending={pendingDelete} onClick={deleteCampaign} name={"campana"}>

            </ModalDelete>
            <div className="page-info">
                <div className="">
                    <p className="title">Detalles de campaña</p>
                    <span>Gestiona tus campañas de manera eficiente y optimiza tus estrategias de marketing con nuestra función de "Detalles de Campaña".</span>

                </div>

                <div className="right">
                    <button className="go-wizard" onClick={(ev) => { setModalWizard(true) }}><IoArrowBackOutline /></button>

                </div>
            </div>


            <div className="menu-top-right">
                <button className="programming" onClick={(ev) => { setModalProgramming(true) }}>Programar</button>
                <button className="programming" onClick={(ev) => (Navigator("/campaigns/stats/" + params?.id))}>Estadisticas</button>
                <button className="programming" onClick={(ev) => { setDeleteModal(true) }}>Eliminar</button>
                <button className={`programming ${pending.sendCampaign ? 'await' : ''}`} onClick={(ev) => { setModalTest(true) }}>Enviar Prueba <div className="loading"></div></button>
                <button className={`send-campaign ${pending.sendCampaign ? 'await' : ''}`} onClick={sendCampaign}>Enviar Campaña <div className="loading"></div></button>
            </div>


            <div className="box steps">


                <div className="item flex">
                    <div className="info">
                        <div className="icon">
                            <img src="/img/icons/default_profile.png" alt="" />
                        </div>

                        <div className="text">
                            <p className="title">{campaign.name}</p>
                            <span className="desc">Creado el: 29 de may de 2023</span>
                        </div>
                    </div>

                    <div style={{
                        position: "relative",
                        top: "21px"
                    }}>
                        <p style={{ display: "inline" }}>Estatus:</p>
                        <CampaignStatus style={{
                            marginLeft: "9px",
                            fontSize: "13px",
                            position: "relative",
                            top: "-1px"
                        }} PauseCampaign={PauseCampaign} status={campaign?.status} />
                    </div>

                    <div className="actions">
                        <button><IoColorWandOutline /></button>
                        <button><IoStatsChartOutline /> </button>
                    </div>

                </div>

                <div className="item">

                    <div className="top active">
                        <div className={`check`}>
                            <FaCheck />
                        </div>

                        <div className="information">
                            <p className="title">Crear Campaña</p>
                            <span className="desc approve">Aprobado!</span>
                        </div>

                    </div>

                </div>


                <div className="item">

                    <div className={`top active`}>
                        <div className={`check active`}>
                            <FaCheck />
                        </div>

                        <div className="information">
                            <p className="title">Elegir Tipo</p>
                            <span className="desc approve">Aprobado!</span>
                        </div>


                        <div className="right">
                            <button>Editar</button>
                        </div>
                    </div>

                </div>

                <div className="item">

                    <div className={`top ${campaign?.lists ? 'active' : ''}`}>

                        <div className={`check`}>
                            <FaCheck />
                        </div>

                        <div className="information">
                            <p className="title">Contactos</p>
                            <span className="desc approve">Aprobado!</span>

                            <div className="selects">



                                {
                                    campaign?.lists?.length >= 1 ?
                                        campaign?.lists?.split(",").map((element, key) => (
                                            <div className="select">
                                                <p>Lista: {element} <button className="delete" onClick={DeleteList} value={element}><IoTrashOutline /></button></p>
                                            </div>
                                        ))

                                        :

                                        ''

                                }
                            </div>
                        </div>

                        {editActive.lists == true ?
                            <>
                                <div className="option">
                                    <div className="form-input small">
                                        <label>Buscar lista... (Solo obtendras las listas con contactos)</label>

                                        <div className="flex">
                                            <input type="search" onKeyUp={searchListsWrite} onKeyDown={cleanSearchList} placeholder="Buscar" />
                                            <button onClick={(ev) => { Navigator("/contacts/lists/add") }}>Crear </button>
                                        </div>
                                    </div>

                                    <div className="search-result">
                                        {search.lists.map((element, key) => (
                                            <div className="result" key={key}>
                                                <div className="info">
                                                    <p>{element.name}</p>
                                                    <span>Contactos: {element.contacts}</span>
                                                    <span>Agregado: 05/05/2022</span>
                                                    <button className="select" onClick={UseList} value={element.id_list}><IoPushOutline /></button>
                                                </div>
                                            </div>
                                        ))}

                                        {loading.lists ? <LoadingCircleApp /> : loading.lists == false && search.lists.length == 0 ? <NotFoundItems name={"listas"} /> : ''}
                                    </div>

                                </div>
                            </>
                            :
                            <div className="right">
                                <button onClick={(ev) => { ActiveList("lists") }}>Editar</button>
                            </div>
                        }

                    </div>

                </div>

                {campaign?.type_c == "em" ?
                    <>
                        <div className="item">

                            <div className={`top ${campaign?.sender ? 'active' : ''}`}>
                                <div className={`check`}>
                                    <FaCheck />
                                </div>

                                <div className="information">
                                    <p className="title">Remitente</p>
                                    <span className="desc approve">Aprobado!</span>
                                </div>



                                <div className="right">
                                    <button onClick={(ev) => { ActiveList("body") }}>Editar</button>
                                </div>
                            </div>

                        </div>

                        <div className="item">

                            <div className={`top ${campaign?.affair ? 'active' : ''}`}>
                                <div className={`check`}>
                                    <FaCheck />
                                </div>

                                <div className="information">
                                    <p className="title">Asunto</p>
                                    <span className="desc approve">Aprobado!</span>
                                </div>

                                {editActive.affair == true ?
                                    <>
                                        <div className="option">
                                            <div className="form-input flex">
                                                <input type="search" onChange={updateForm} name="affair" placeholder="Asunto..." />
                                                <button onClick={setAffair} className="save">Guardar</button>
                                            </div>
                                        </div>

                                        <TextareaSms onSave={setAffair} onChange={(ev) => { setForm({ ...form, affair: ev }) }} />
                                    </>
                                    :
                                    <div className="right">
                                        <button onClick={(ev) => { ActiveList("affair") }}>Editar</button>
                                    </div>
                                }
                            </div>

                        </div>
                    </>
                    : ''}

                <div className="item">

                    <div className={`top ${campaign?.template ? 'active' : ''}`}>
                        <div className={`check`}>
                            <FaCheck />
                        </div>

                        <div className="information">
                            <p className="title">Plantilla</p>
                            <span className="desc approve">Aprobado!</span>
                        </div>

                        {editActive.body == true ?
                            <>
                                <div className="option">

                                    {campaign?.type_c == "em" ?

                                        <>
                                            {campaign?.template ?
                                                <div className="preview-template">
                                                    <p>{campaign?.template?.title}</p>
                                                    <span>Plantilla creada:  {Time(campaign?.template?.time_add)}</span>
                                                    <img src={PreviewTemplate(UserInfo?.company?.folder_sftp, campaign?.template?.preview_image)} alt="" />
                                                    <br />
                                                    <Link to={`/editor/canvas/${campaign?.template?.id_template}?campaign=` + params.id}>Editar plantilla</Link>
                                                </div>
                                                : <Link to={`/editor/canvas/?campaign=` + params.id}>Crear una plantilla</Link>
                                            }
                                        </>
                                        : ''}


                                    {campaign?.type_c == "sms" ?

                                        <>
                                            {editActive.body == true ? <>
                                                <div className="option">
                                                    <div className="form-input flex">
                                                        <TextareaSms value={newText} onChange={setNewText} onSave={saveBody} />
                                                    </div>
                                                </div>
                                            </> : ""}
                                        </>
                                        : ''}



                                </div>
                            </>
                            :
                            ''
                        }

                        {editActive.body == false ? <div className="right">
                            <button onClick={(ev) => { ActiveList("body") }}>Editar</button>
                        </div> : ""}

                    </div>

                </div>




            </div>
        </>
    )
}
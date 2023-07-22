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
import { PreviewTemplate, Time } from "../../../Functions/Global"
import { toast } from "react-hot-toast"
import ModalSmall from "../../../Components/App/ModalSmall"

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

    // LISTS CAMPAGINS

    function UseList(ev) {
        let value = ev.target.value

        if (value) {
            let formData = new FormData()
            formData.append("id_list", value)
            formData.append("id_company", UserInfo?.company?.id_company)
            formData.append("id_campaign", params.id)

            let add = false

            if (!campaign.lists.length) {
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

    return (
        <>

            <ModalSmall visible={true} width={"30%"} maxWidth={"500px"}>
                <div className="top">
                    <p>Programar campaña</p>


                    <div className="flex">
                        <select name="" id="">
                            <option disabled selected>Hora</option>
                        </select>
                        <select name="" id="">
                            <option disabled selected>Dia</option>
                        </select>
                        <select name="" id="">
                            <option disabled selected>Mes</option>
                        </select>
                        <select name="" id="">
                            <option disabled selected>Ano</option>
                        </select>
                    </div>


                    <div className="flex">
                        <div className="input-form">
                            <span>Lunes</span>
                            <input type="radio" name="day" />
                        </div>
                        <div className="input-form">
                            <span>Martes</span>
                            <input type="radio" name="day" />
                        </div>
                        <div className="input-form">
                            <span>Miercoles</span>
                            <input type="radio" name="day" />
                        </div>
                        <div className="input-form">
                            <span>Jueves</span>
                            <input type="radio" name="day" />
                        </div>
                        <div className="input-form">
                            <span>Viernes</span>
                            <input type="radio" name="day" />
                        </div>
                        <div className="input-form">
                            <span>Sabado</span>
                            <input type="radio" name="day" />
                        </div>
                        <div className="input-form">
                            <span>Domingo</span>
                            <input type="radio" name="day" />
                        </div>
                    </div>
                </div>
            </ModalSmall>
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
                <button className="programming">Programar Campaña</button>
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

                    <div>
                        <p>Estatus</p>
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
                            <span className="desc approve">Perfecto!</span>
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
                            <span className="desc approve">Perfecto!</span>
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
                            <span className="desc approve">Perfecto!</span>

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
                                    <div className="form-input">
                                        <label>Buscar lista... (Solo obtendras las listas con contactos)</label>
                                        <input type="search" onKeyUp={searchListsWrite} onKeyDown={cleanSearchList} placeholder="Buscar" />
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
                                    <span className="desc approve">Perfecto!</span>
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
                                    <span className="desc approve">Perfecto!</span>
                                </div>

                                {editActive.affair == true ?
                                    <>
                                        <div className="option">
                                            <div className="form-input flex">
                                                <input type="search" onChange={updateForm} name="affair" placeholder="Asunto..." />
                                                <button onClick={setAffair} className="save">Guardar</button>
                                            </div>
                                        </div>
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
                            <span className="desc approve">Perfecto!</span>
                        </div>

                        {editActive.body == true ?
                            <>
                                <div className="option">

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

                                </div>
                            </>
                            :
                            ''
                        }

                        <div className="right">
                            <button onClick={(ev) => { ActiveList("body") }}>Editar</button>
                        </div>
                    </div>

                </div>




            </div>
        </>
    )
}
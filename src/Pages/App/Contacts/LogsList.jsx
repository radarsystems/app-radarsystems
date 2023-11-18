import axios from "axios"
import { IoArrowBackOutline, IoCheckmark, IoDocumentTextOutline, IoSnowOutline, IoTimerOutline } from "react-icons/io5"
import { useNavigate, useParams } from "react-router-dom"
import { API_URL } from "../../../ExportUrl"
import { useEffect } from "react"
import { useState } from "react"
import { useContext } from "react"
import { AuthContext } from "../../../Context/AuthContext"
import { Time } from "../../../Functions/Global"
import { MdErrorOutline } from "react-icons/md"
import ModalSmall from "../../../Components/App/ModalSmall"
import { AiOutlineMail } from "react-icons/ai"
import InfiniteScroll from "react-infinite-scroll-component"
import NotFoundItems from "../../../Components/App/NotFoundItems"
import LoadingCircleApp from "../../../Components/App/LoadingCircle"
import LoadingModal from "../../../Components/App/LoadingModal"

export default function LogsList() {

    const Navigator = useNavigate()
    const params = useParams()
    const [intentUpload, setIntentUpload] = useState([])
    const [detailModal, setDetailModal] = useState(false)
    const { UserInfo } = useContext(AuthContext)
    const [keySearch, setKeySearch] = useState()
    const [detailList, setDetailList] = useState([])
    const [stylesMenu, setStylesMenu] = useState({ width: "", left: "" })
    const [menuChange, setMenuChange] = useState("gl")
    const [hasMore, setHasMore] = useState(true);
    const [loadingDetail, setLoadingDetail] = useState()
    const [download, setDownload] = useState(false)
    const [loadingDownload, setLoadingDownload] = useState({ csv: false, json: false })



    function getIntentUpload() {
        let formData = new FormData()
        formData.append("id_list", params.id)
        formData.append("id_company", UserInfo?.company?.id_company)


        axios.post(API_URL + "/api/get/logslists", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                if (data.length) {
                    setIntentUpload(data)
                }
            })
            .catch((err) => {

            })
    }

    function getDetailUpload(id, scroll = false, type = null, download = false, type_download = null) {

        setLoadingDetail(true)

        if (!scroll) {
            setHasMore(false)
            setDetailModal(true)
            setKeySearch(id)
            setDetailList([])
            if (type !== "error" && download !== true) {
                setStylesMenu({ width: "70", left: "10" })
                setMenuChange("gl")
            }

        }

        let formData = new FormData()
        formData.append("id_list", params.id)
        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("detail", id)

        if (detailList.length && scroll) {
            formData.append("last_id", detailList.slice(-1)[0].id_log);
        }

        if (download) {
            formData.append("download", type_download)
        }


        if (type !== null) {
            formData.append("type", type)
        }

        axios.post(API_URL + "/api/get/logslists", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {

                if (download) {
                    setLoadingDownload({ ...loadingDownload, [type_download]: true })
                    const blob = new Blob([JSON.stringify(data)], { type: download == "json" ? `application/json` : 'text/csv' });
                    const downloadUrl = URL.createObjectURL(blob);

                    const link = document.createElement("a")

                    link.href = downloadUrl
                    link.setAttribute("download", `upload-${keySearch}-list-${params.id}.json`)
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)

                    setTimeout(() => {
                        setLoadingDownload({ ...loadingDownload, [type_download]: false })
                    }, 1000)
                }

                setHasMore(true)

                setLoadingDetail(false)
                scroll === false ? setDetailList(data) : setDetailList((prevData) => [...prevData, ...data])
            })
            .catch((err) => {
                setLoadingDetail(false)
            })
    }

    useEffect(() => {
        getIntentUpload()
    }, [])

    useEffect(() => {

        if (detailModal) {
            if (menuChange == "error") {
                getDetailUpload(keySearch, false, "error")
            }

            if (menuChange == "gl") {
                getDetailUpload(keySearch, false)
            }

            if (menuChange == "dw") {
                setDownload(true)
            } else {
                setDownload(false)
            }
        }
    }, [menuChange])

    function changeMenu(ev) {
        let value = ev.target.value
        setMenuChange(value)

        setStylesMenu(prevData => ({ ...prevData, width: ev.target.offsetWidth, left: ev.target.offsetLeft }))
    }



    return (
        <>

            <ModalSmall visible={detailModal} callback={setDetailModal} maxWidth={"500px"} minWidth={"500px"} key={detailModal ? "Xd" : "x"}>
                <div className="top">
                    <p>Detalles</p>
                    <span>detalles de la subida: {keySearch}</span>
                </div>

                <div className="menu-change">
                    <ul>
                        <li><button className={`${menuChange == "gl" ? 'active' : ''}`} onClick={changeMenu} value="gl" style={{ fontSize: "13px" }}>Global</button></li>
                        <li><button className={`${menuChange == "error" ? 'active' : ''}`} onClick={changeMenu} value="error" style={{ fontSize: "13px" }}>Errores</button></li>
                        <li><button className={`${menuChange == "dw" ? 'active' : ''}`} onClick={changeMenu} value="dw" style={{ fontSize: "13px" }}>Descargar</button></li>

                        <div className="hover" style={{ left: stylesMenu.left + "px", width: stylesMenu.width + "px" }}></div>
                    </ul>
                </div>

                {download ?
                    <>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="item">

                                    <div className="top">
                                        <p>Descargar logs</p>
                                        <span>Puedes descargar los logs de esta subida {keySearch} mediante un archivo csv / json</span>

                                        <div className="actions-item complete">
                                            <button className={`download ${loadingDownload.csv ? "await" : ""}`} onClick={(ev) => { getDetailUpload(keySearch, false, null, true, "json") }}>Descargar CSV <div className="loading"></div></button>
                                            <button className={`download ${loadingDownload.json ? "await" : ""}`} onClick={(ev) => { getDetailUpload(keySearch, false, null, true, "json") }}>Descargar JSON <div className="loading"></div></button>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </>
                    :
                    <div className="data">
                        <InfiniteScroll scrollableTarget={"scrollableDiv"} hasMore={hasMore} next={() => { getDetailUpload(keySearch, true) }} dataLength={detailList.length}>
                            <div className="control-scroll lists-detail" id="scrollableDiv">
                                <div className="row">
                                    {detailList?.map((element, key) => (
                                        <div className="col-md-6">
                                            <div className="item box box-padding">
                                                <div className="top">
                                                    <span>Correo: {element.email ? element.email : "No aplica"}</span>
                                                    <br />
                                                    <span>Telefono: {element.phone ? element.phone : "No aplica"}</span>
                                                    <br />
                                                    <span>Calidad de subida: {element.error ? "error" : "success"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {loadingDetail ? <LoadingModal /> : ""}

                                    {detailList?.length === 0 ? loadingDetail === false ? <NotFoundItems name={menuChange == "gl" ? "registros" : "errores"} /> : "" : ""}
                                </div>
                            </div>
                        </InfiniteScroll>

                    </div>
                }




            </ModalSmall>


            <div className="page-info">
                <div className="">
                    <p className="title">Logs de lista: {params.id}</p>
                    <span>Ve los detalle de tus listas y ve si estan listas para ser utilizadas.</span>

                </div>

                <div className="right">
                    <button className="go-wizard" onClick={(ev) => { Navigator("/contacts/detail/" + params.id) }}><IoArrowBackOutline /></button>
                </div>
            </div>


            <div className="row">

                {intentUpload.map((element, key) => (
                    <div className="col-md-4  page-lists" key={key}>
                        <div className="box box-padding ">
                            <div className="item flex-wrap">
                                <div className="info">
                                    <div className="icon">
                                        <img src="/img/icons/upload_arrow2.webp" alt="" />
                                    </div>
                                    <div className="text">
                                        <p className="title">Subida: <b>{element.id_upload}</b></p>
                                        <span className="desc">Fecha: {Time(element.time_add, "full")}</span>
                                        <br />
                                        <span className="desc">Fecha de finalización: {Time(element.time_finish, "full")}</span>
                                        <br />
                                        <span className="desc">Contactos Subidos: 1{element?.contacts_total}</span>
                                        <br />
                                        <span className="desc">Calidad de subida:
                                        </span>

                                        {element?.insert ? <span className="quality-upload good"><IoCheckmark /> Muy Buena</span>
                                            :


                                            element?.error ? <span className="quality-upload error"> <MdErrorOutline /> Regular / Mala</span>
                                                :
                                                <span className="quality-upload await"> <IoTimerOutline /> En espera... </span>}

                                    </div>


                                </div>

                                <div className="actions">
                                    <button onClick={(ev) => { getDetailUpload(element.id_upload) }}><IoDocumentTextOutline /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}


            </div>

        </>
    )
}
import { useState } from "react"
import WizardQr from "../../../Components/App/Qr/WizardQr"
import LoadingCircleApp from "../../../Components/App/LoadingCircle"
import NotFoundItems from "../../../Components/App/NotFoundItems"
import { useContext } from "react"
import { AuthContext } from "../../../Context/AuthContext"
import axios from "axios"
import { API_URL } from "../../../ExportUrl"
import { useEffect } from "react"
import { LoadPreviewQr, existsStringInPath } from "../../../Functions/Global"
import { IoAddCircleOutline, IoAddOutline, IoCloudDownloadOutline, IoCloudUploadOutline, IoTrashOutline } from "react-icons/io5"
import $ from "jquery"
import WizardUploadQr from "../../../Components/App/Qr/WizardUploadQr"
import { useLocation } from "react-router-dom"

export default function MyQr() {

    const [modalView, setModalView] = useState(false)
    const [modalUploadView, setUploadView] = useState(false)
    const [loading, setLoading] = useState(false)
    const [qrs, setQrs] = useState([{}, {}])
    const { UserInfo } = useContext(AuthContext)
    const location = useLocation()

    useEffect(() => {
        if (existsStringInPath("/add")) {
            setModalView(true)
        }

        if (existsStringInPath("/import")) {
            setUploadView(true)
        }
    }, [location])

    function loadQrs() {
        let formData = new FormData()
        formData.append("id_company", UserInfo?.company?.id_company)


        axios.post(API_URL + "/api/get/qrs", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setQrs(data)
            })
    }

    function downloadImage(ev) {
        let target = $(ev.target);
        let src = target.parents(".item").find("img")[0].src;
        let name = target.parents(".item").find(".title").text();

        let a = document.createElement("a");

        a.href = src;
        a.download = ""; // Cambia la extensión
        a.rel = "noopener noreferrer"
        a.target = "_blank"

        document.querySelector("#root").appendChild(a);
        a.click()
        document.querySelector("#root").removeChild(a)

    }


    useEffect(() => {
        loadQrs()
    }, [])

    return (
        <>
            <div className="page-info">
                <div className="">
                    <p className="title">Qr</p>
                    <span>Crea qr personalizados con enlaces para tus webs o qr de contacto</span>
                </div>

                <WizardQr Visible={modalView} Close={setModalView} setModalView={setModalView} loadQrs={loadQrs} />
                <WizardUploadQr Visible={modalUploadView} Close={setUploadView} setModalView={setUploadView} loadQrs={loadQrs} key={modalUploadView ? 'x' : 'a'} />

                <div className="right">
                    <button className="add" onClick={(ev) => { setModalView(true) }}> Crear nuevo QR</button>
                    <button className="go-wizard" onClick={(ev) => { setUploadView(true) }}><IoCloudUploadOutline /> Importar QR</button>

                </div>
            </div>

            <div className="box box-padding">

                {qrs.map((element, key) => (
                    <div className="item flex">
                        <div className="info">
                            <div className="icon">
                                <img src={LoadPreviewQr(element.qr_preview)} alt="" />
                            </div>

                            <div className="text">
                                <p className="title">{element.title}</p>
                                <span className="desc">Creado el: 29 de may de 2023</span>
                            </div>

                        </div>

                        <div className="info">
                            <div className="text">
                                <p className="title">Tipo de QR</p>
                                <span className="desc">{element.type_qr}</span>
                            </div>

                        </div>

                        <div className="actions">
                            <button onClick={downloadImage}><IoCloudDownloadOutline /></button>
                            <button><IoTrashOutline /></button>

                        </div>
                    </div>
                ))}

                {loading ? <LoadingCircleApp /> : qrs.length == 0 ? <div className="item"><NotFoundItems name={"Qrs"} /></div> : ''}


            </div>
        </>
    )
}
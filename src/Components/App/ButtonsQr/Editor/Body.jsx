import { useContext, useEffect, useState } from "react";
import ModalSmall from "../../ModalSmall";
import axios from "axios";
import { API_URL } from "../../../../ExportUrl";
import { LoadPreviewQr } from "../../../../Functions/Global";
import { IoAdd, IoEyeOutline, IoSendOutline, IoTrashOutline } from "react-icons/io5";
import $ from "jquery"
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { AuthContext } from "../../../../Context/AuthContext";
import { toast } from "react-hot-toast";
import html2canvas from "html2canvas";
import { useParams } from "react-router-dom";


export default function BodyButtonsQr({ buttons, setButtons, editor, setEditor }) {

    const [visible, setVisible] = useState(false)
    const [visibleTitle, setVisibleTitle] = useState(false)
    const [editId, setEditId] = useState(undefined)
    const [pending, setPending] = useState(false)

    const params = useParams()

    const [myQrs, setMyQrs] = useState([])

    const { UserInfo } = useContext(AuthContext)

    function editThis(ev) {

        ev.preventDefault()
        ev.stopPropagation()


        let target = $(ev.target)
        $(".page.buttonsbody .active").removeClass("active")
        target.addClass("active")


        switch (target.attr("type")) {
            case 'addqr':
                var key = target.attr("id")

                setEditor({ type: "addqr", key })
                break;

            case 'rs':
                var key = target.attr("id")
                setEditor({ type: "rs", key })
                break;

            case 'titlespace':

                console.log(key)
                setEditor({ type: "titlespace", key: Number(target.attr("id")) })
                break;

            default:
                setEditor({ type: target.attr("type") })
                break;
        }

        return false

    }

    function getMyQrs(name) {
        let formData = new FormData()

        formData.append("id_company", UserInfo?.company?.id_company)

        axios.post(API_URL + "/api/get/qrs", formData, { withCredentials: true }).then((response) => { return response.data })
            .then((data) => {
                setMyQrs(data)
            })
    }

    function addNewBox() {
        setButtons((prevData) => {
            let newData = { ...prevData }

            newData.elements.push({ qrs: [] })

            return newData

        })
    }

    function addNewQr(ev) {
        let target = $(ev.target)

        let image = target.attr("image")
        let title = target.attr("title")

        setVisible(false)
        toast.success("Has seleccionado correctamente el QR")

        setButtons((prevData) => {
            let newData = { ...prevData }

            newData.elements[editor.key].qrs.push({ image, title })

            return newData
        })

    }

    function deleteQr(father, qr) {

    }

    async function save() {
        if (buttons.header.titlegl.length >= 1) {

            setPending(true)
            let formData = new FormData();

            formData.append("json", JSON.stringify(buttons))

            if (editId == undefined) {
                formData.append("title", buttons.header.titlegl)
            } else {
                formData.append("id_buttonsqr", editId);
            }

            formData.append("id_company", UserInfo?.company?.id_company)

            let preview = await html2canvas(document.querySelector(".page .center"), { allowTaint: false, useCORS: true }).then((response) => {
                let url = response.toDataURL()
                return url
            })

            formData.append("preview", preview);


            axios.post(API_URL + "/api/upload/buttonsqr", formData, { withCredentials: true })
                .then((response) => { return response.data })
                .then((data) => {
                    setPending(false)

                    if (data.id_buttonsqr) {
                        setEditId(data.id_buttonsqr)
                    }

                    if (data.msg) {
                        toast.error(data.msg)
                    }
                }).catch((err) => {
                    setPending(false)
                })

        } else {
            setVisibleTitle(true)
            toast.error("Opps no puedes avanzar si tu plantilla no posee un titulo")
        }
    }

    function setTitleGlobal(ev) {
        let value = ev.target.value

        setButtons((prevData) => {
            let newData = { ...prevData }

            newData.header.titlegl = value;

            return newData
        })
    }

    function saveTitleGlobal() {
        if (buttons.header.titlegl) {
            setVisibleTitle(false)
            toast.success("El titulo se aplico con exito")
        }
    }

    useEffect(() => {
        getMyQrs()

        if (params.id) {
            let formData = new FormData()
            formData.append("id_buttonsqr", params.id)
            formData.append("id_company", UserInfo?.company?.id_company);

            axios.post(API_URL + "/api/get/editbuttonsqr", formData, { withCredentials: true })
                .then((response) => { return response.data })
                .then((data) => {
                    if (data.id_buttonsqr) {
                        setButtons(JSON.parse(data.json))
                        setEditId(data.id_buttonsqr)
                    }

                })
        }
    }, [])

    return (
        <>

            <ModalSmall visible={visible} maxWidth={"450px"} callback={setVisible}>
                <div className="top">
                    <p>Galeria de Qr's</p>
                    <span>Tu galeria de qrs, donde podras seleccionar que qr quieres integrar</span>
                </div>

                <div className="data row flex">
                    {myQrs.map((element, key) => (
                        <div className="col-md-6">
                            <div className="qrs" onClick={addNewQr} image={LoadPreviewQr(element.qr_preview)} title={element.title}>
                                <img src={LoadPreviewQr(element.qr_preview)} alt="" />
                                <p>{element.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </ModalSmall>

            <ModalSmall visible={visibleTitle} close={setVisibleTitle} callback={setVisibleTitle} onClick={saveTitleGlobal}>
                <div className="top">
                    <p>Titulo</p>
                    <span>Elige un titulo general para esta plantilla</span>
                </div>

                <br />
                <div className="form-input">
                    <label htmlFor="">Titulo general</label>
                    <input onChange={setTitleGlobal} type="text" placeholder="ej: plantilla 1" />
                </div>
            </ModalSmall>


            <div className="head-top">
                <div className="right">
                    <button ><IoEyeOutline /> Previsualizar</button>
                    <button className={pending ? 'await' : ''} onClick={save}><IoSendOutline /> Guardar <div className="loading"></div></button>
                </div>
            </div>


            <div className="background2" style={{ backdropFilter: `blur(${buttons?.header?.blur}px)brightness(${buttons?.header?.brightness})`, background: buttons?.header?.background2 }}>
            </div>

            <div className={`${"page buttonsbody buttonsqr editmode " + buttons?.header?.colorBox}`}>
                <div className="center-top">


                    <img className="logo" onClick={editThis} type="logo" src={buttons?.header?.logo ? buttons?.header?.logo : "/img/icons/default-img.jpg"} alt="" />
                    <p onClick={editThis} type="title">{buttons?.header?.title ? buttons?.header?.title : "Agregar titulo"}</p>
                    <span onClick={editThis} type="desc">{buttons?.header?.desc ? buttons?.header?.desc : "Agregar Descripcion"}</span>

                    <br />
                    <br />


                    {buttons.elements.map((element, key) => (
                        <div className="boxqr">

                            <div className="top">
                                <div className="top-left">
                                    <p id={key} type="titlespace" onClick={(ev) => { editThis(ev) }}>{element.title ? element.title : 'Escribe un titulo...'}</p>
                                </div>
                                <div className="top-right">
                                    <button id={key} type="addqr" onClick={(ev) => { setVisible((true), editThis(ev)) }}>Agregar QR</button>
                                </div>

                            </div>


                            <Carousel showThumbs={false} showIndicators={false} showStatus={false}>
                                {element.qrs.map((element, key2) => (


                                    <div className="qr">
                                        <button className="delete" onClick={(ev) => { deleteQr(key, key2) }}><IoTrashOutline /></button>
                                        <img src={element.image} />
                                        <p>{element.title}</p>
                                    </div>


                                ))}
                            </Carousel>
                            {element.qrs.length == 0 ? <div className="add-qr">+</div> : ''}
                        </div>
                    ))}


                    <div className="add-new" onClick={addNewBox} ><IoAdd /> Agregar Caja</div>

                </div>
            </div>
        </>
    )
}
import { IoArrowDown, IoCloudUploadOutline, IoDocumentTextOutline, IoTrashOutline } from "react-icons/io5";
import EditDescButtons from "../../Buttons/Editor/EditDesc";
import EditLogoButtons from "../../Buttons/Editor/EditLogo";
import EditTitleButtons from "../../Buttons/Editor/EditTitle";
import EditTitleSpace from "./EditTitleSpace";
import { useContext, useRef, useState } from "react";
import ModalSmall from "../../ModalSmall";
import $ from "jquery";
import QrStyling from "qr-code-styling";
import axios from "axios";
import { API_URL } from "../../../../ExportUrl";
import { AuthContext } from "../../../../Context/AuthContext";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { randomId } from "../../../../Functions/Global";
import { Icon } from "@iconify/react";

export default function EditorRightButtonsQr({ VisibleMenu, getMyQrs, addNewQr, setVisibleQr, boxType, editor, buttons, setButtons }) {

    const [modalPdf, setModalPdf] = useState(false)
    const [modalImages, setModalImages] = useState(false)
    const [modalWifi, setModalWifi] = useState(false)
    const [modalRs, setModalRs] = useState(false)
    const [fileUpload, setFileUpload] = useState({})
    const [fileImg, setFileImg] = useState({})
    const [clickType, setClickType] = useState();
    const [formRs, setFormRs] = useState("");
    const [formWifi, setFormWifi] = useState({ ssid: "", password: "", encrypt: "" })
    const [pending, setPending] = useState({ rs: false, modalFile: false })
    const { UserInfo } = useContext(AuthContext)

    const ref = useRef(null)

    const rs = {
        "instagram": "https://www.instagram.com/",
        "twitter": "https://x.com/",
        "facebook": "https://m.facebook.com/",
        "tiktok": "https://tiktok.com/",
        "websiteurl": ""
    };

    function clickButton(ev, type) {

        let target = $(ev.target);

        if (target.css("opacity") !== "0.5") {



            setClickType(type)

            switch (type) {
                case 'qrs':
                    getMyQrs()
                    setVisibleQr(true)
                    break;

                case 'vcard':
                    setVisibleQr(true)
                    getMyQrs("qr-contact")
                    break;

                case 'vcard-add':

                    document.querySelector(".head-top .right button").click()

                    setTimeout(() => {
                        document.querySelectorAll(".wizard-home.open .case.active .selector")[1].click()
                    }, 20)

                    setTimeout(() => {
                        let next = $(document.querySelector(".wizard-home.open .next"))
                        next.click()
                    }, 20)


                    break;

                case 'instagram':
                case 'facebook':
                case 'tiktok':
                case 'twitter':
                case 'whatsapp':
                case 'websiteurl':
                    setModalRs(true)
                    break;

                case 'wifi':
                    setModalWifi(true)
                    break;

                case 'pdf':
                case 'img':
                    setModalPdf(true)
                    break;

            }
        } else {
            toast.error("Este boton no esta habilitado para este apartado.")
        }
    }

    const QrCode = new QrStyling({
        width: 600,
        height: 600,
        image:
            "/img/icons/iconsvg.png",
        dotsOptions: {
            color: "gradient",
            type: "extra-rounded",
            gradient: {
                colorStops: [{ offset: 0, color: '#000' }, { offset: 1, color: '#000' }]
            }
        },
        imageOptions: {
            crossOrigin: "anonymous",
            margin: 20
        }
    });

    function selectFile() {
        $("input[name='file']").click()
    }

    function changeFile(ev) {
        let files = ev.target.files;

        if (files[0]) {
            if (files[0].type.indexOf("/pdf") >= 0 || files[0].type.indexOf("imag") >= 0) {
                setFileUpload(files[0])
            } else {
                toast.error("El archivo no es una imagen / pdf")
            }
        }

    }

    function deleteFile(type) {
        setFileUpload({})
        $("input[name='file']").val("")

    }

    function pendingNow(name, pending) {
        setPending({ ...pending, [name]: pending })
    }

    async function CreateQr(data) {
        let formData = new FormData();

        let goForm = false
        console.log(data)
        let msg = "";

        if (modalRs) {
            if (formRs) {
                goForm = true
            } else {
                msg = "Opps no has agregado ningun usuario"
            }
        }

        if (modalWifi) {

            console.log(formWifi)
            if (formWifi.encrypt && formWifi.password.length && formWifi.ssid) {
                goForm = true
            } else {
                msg = "Has dejado campos vacios en la red wifi"
            }
        }

        if (modalPdf) {
            if (data) {
                goForm = true;
            }
        }

        if (goForm) {
            pendingNow("rs", true)

            QrCode.append(ref.current)

            QrCode.update({
                data: data
            })

            setTimeout(async () => {

                let photo = await new Promise((resolve, reject) => {
                    let canvas = document.querySelector(".qr-result canvas");
                    let url = canvas.toDataURL("image/png");

                    resolve(url);
                })

                let qrName = `${clickType + "-" + (new Date() / 1000).toFixed()}`;

                formData.append("preview", photo)
                formData.append("id_company", UserInfo?.company?.id_company)
                formData.append("formqr", JSON.stringify({ name: qrName }))

                switch (clickType) {
                    case 'facebook':
                    case 'instagram':
                    case 'twitter':
                    case 'x':
                    case 'twitter':
                    case 'linkedin':
                        formData.append("type", "qr-rs")
                        break;

                    case 'wifi':
                        formData.append("type", "qr-wifi")
                        break;
                }


                axios.post(API_URL + "/api/upload/qr", formData, { withCredentials: true })
                    .then((response) => { return response.data })
                    .then((data) => {
                        pendingNow("rs", false)

                        if (data.status) {
                            setModalRs(false)

                            try {
                                addNewQr(qrName, data.img)
                                toast.success("QR agregado con exito")
                            } catch (err) {
                                toast.error(String(err))
                            }

                        }
                    })
                    .catch((err) => {
                        pendingNow("rs", false)
                    })
            }, 150)
        } else {
            toast.error(msg)
        }

    }

    useEffect(() => {
        if (!modalRs) {
            setFormRs("")
        }
    }, [modalRs])

    function setNewFormWifi(ev) {
        let name = ev.target.name
        let value = ev.target.value
        setFormWifi({ ...formWifi, [name]: value })
    }

    async function uploadFile() {
        pendingNow("modalFile", true)
        let formData = new FormData()
        formData.append("file", fileUpload)
        formData.append("id_company", UserInfo?.company?.id_company)

        axios.post(API_URL + "/api/upload/fileqr", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then(async (data) => {
                if (data.status) {
                    toast.success("Se ha subido tu archivo correctamente, se esta procesando el QR");
                    await CreateQr(data.download)
                    pendingNow("modalFile", false)
                    setModalPdf(false)
                }
            })
            .catch((err) => {
                pendingNow("modalFile", false)
            })

    }


    return (
        <>



            <ModalSmall key={modalWifi ? 'x23' : 'x24'} visible={modalWifi} onClick={(ev) => { CreateQr(`WIFI:T:${formWifi.encrypt};S:${formWifi.ssid};P:${formWifi.password};;`) }} callback={setModalWifi} maxWidth={400} Pending={pending?.rs} >

                <div className="top">
                    <p>Red WiFi</p>
                    <span>Agrega tu red Wi-Fi favorita e integra el código QR dentro de tu botonera</span>
                </div>

                <div className="data">
                    <div className="form-input">
                        <label htmlFor="ssid">SSID</label>
                        <input
                            type="text"
                            onChange={setNewFormWifi}
                            name="ssid"
                            placeholder="Nombre de red"
                        />
                    </div>
                    <div className="form-input">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="text"
                            onChange={setNewFormWifi}
                            name="password"
                            placeholder="Contraseña de red"
                        />
                    </div>
                    <div className="form-input">
                        <label htmlFor="encryption">Selecciona el cifrado</label>
                        <select name="encrypt" id="encryption" onChange={setNewFormWifi}>
                            <option value="WPA">WPA</option>
                            <option value="WPA2">WPA2</option>
                            <option value="WEP">WEP</option>
                            <option value="nopass">Sin cifrado</option>
                        </select>
                    </div>

                </div>

            </ModalSmall>


            <ModalSmall visible={modalRs} callback={setModalRs} key={modalRs ? "12" : "13"} Pending={pending.rs} maxWidth={450} next={"Crear"} onClick={() => { CreateQr(clickType == "tiktok" ? rs[clickType] + "@" + formRs : rs[clickType] + formRs) }}>

                {clickType == "websiteurl" ?
                    <div className="top">
                        <p>Web</p>
                        <span>Agrega la url de tu sitio web</span>
                    </div>
                    :
                    <div className="top">
                        <p>Red social</p>
                        <span>Agrega tu red social favorita y integra el QR dentro de tu botonera</span>
                    </div>
                }



                <div className="data">
                    <div className="form-input">
                        <label htmlFor="">{rs[clickType]}{formRs}</label>
                        <input type="text" onChange={(ev) => { setFormRs(ev.target.value) }} name="user" placeholder={clickType == "websiteurl" ? "https://mysiteweb.com" : "@usuario"} />
                    </div>
                </div>
            </ModalSmall>


            <ModalSmall key={modalPdf ? "14" : "15"} visible={modalPdf} Pending={pending?.modalFile} callback={setModalPdf} next={"Subir"} onClick={uploadFile}>
                <input type="file" name="file" onChange={changeFile} hidden />

                <div className="top">
                    <p>Subir archivo</p>
                    <span>Sube tu imagen o pdf que no sea mayor a 5 MB</span>
                </div>

                <div className="select-file">

                    {fileUpload.name ?
                        <div className="file">
                            <div className="right">
                                <button onClick={deleteFile}><IoTrashOutline /></button>
                            </div>

                            <div className="preview">
                                <div className="fi">
                                    <div className="icon">
                                        <IoDocumentTextOutline />
                                    </div>
                                    <div className="info">
                                        <p>{fileUpload?.name}</p>
                                        <span>{fileUpload?.type}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="drop-file" onClick={selectFile}>
                            <i>
                                <IoCloudUploadOutline />
                            </i>
                        </div>
                    }


                </div>
            </ModalSmall>
            <div className={`buttons-services ${boxType}`}>

                <div className="qr-result" ref={ref} hidden />

                <div className="top-title">
                    <p>1. Servicios QR</p>
                    <button className="close mb" onClick={(ev) => { VisibleMenu() }}><Icon icon="teenyicons:x-outline" /></button>
                </div>


                <div className="button" onClick={(ev) => { clickButton(ev, 'vcard-add') }} type="vcard">
                    <div className="img">
                        <img src="/img/icons/vCard.svg" alt="" />
                    </div>
                    <p>Crear QR De Presentacion</p>
                    <span>Comparte </span>
                </div>

                <div className="button" onClick={(ev) => { clickButton(ev, 'vcard') }} type="vcard">
                    <div className="img">
                        <img src="/img/icons/vCard.svg" alt="" />
                    </div>
                    <p>Mis QR's De Presentacion</p>
                    <span>Comparte </span>
                </div>



                <div className="submenu">
                    <p>Social Media</p>
                    <i><IoArrowDown /></i>
                </div>
                <br />

                <div className="button" onClick={(ev) => { clickButton(ev, 'whatsapp') }} type="rs">
                    <div className="img">
                        <img src="/img/icons/apps/whatsapp-icon.svg" alt="" />
                    </div>
                    <p>Crear Whatsapp</p>
                    <span>Link to a website of your choice</span>
                </div>
                <div className="button" onClick={(ev) => { clickButton(ev, 'instagram') }} type="rs">

                    <div className="img">
                        <img src="/img/icons/apps/instagram.svg" alt="" />
                    </div>

                    <p>Crear Instagram</p>
                    <span>Link to a website of your choice</span>
                </div>
                <div className="button" onClick={(ev) => { clickButton(ev, 'facebook') }} type="rs">

                    <div className="img">
                        <img src="/img/icons/apps/facebook.svg" alt="" />
                    </div>

                    <p>Crear Facebook</p>
                    <span>Link to a website of your choice</span>
                </div>
                <div className="button" onClick={(ev) => { clickButton(ev, 'twitter') }} type="rs">

                    <div className="img">
                        <img src="/img/icons/apps/twitter.svg" alt="" />
                    </div>

                    <p>Crear X</p>
                    <span>Link to a website of your choice</span>
                </div>
                <div className="button" onClick={(ev) => { clickButton(ev, 'tiktok') }} type="rs">

                    <div className="img">
                        <img src="/img/icons/apps/tiktok.svg" alt="" />
                    </div>

                    <p>Crear Tiktok</p>
                    <span>Link to a website of your choice</span>
                </div>

                <div className="button" onClick={(ev) => { clickButton(ev, 'websiteurl') }} type="rs">
                    <div className="img">
                        <img src="/img/icons/website.png" alt="" />
                    </div>

                    <p>Crear Website URL</p>
                    <span>Link to a website of your choice</span>
                </div>

                <br />




                <div className="submenu">
                    <p>Documentos</p>
                    <i><IoArrowDown /></i>
                </div>
                <br />

                <div className="button" onClick={(ev) => { clickButton(ev, 'pdf') }}>
                    <div className="img">
                        <img src="/img/icons/pdf.svg" alt="" />
                    </div>

                    <p>Subir PDF</p>
                    <span>Link to a website of your choice</span>
                </div>
                <div className="button" onClick={(ev) => { clickButton(ev, 'img') }}>

                    <div className="img">
                        <img src="/img/icons/images.svg" alt="" />
                    </div>
                    <p>Subir Imagenes</p>
                    <span>Link to a website of your choice</span>
                </div>

                <br />


                <div className="button" onClick={(ev) => { clickButton(ev, 'wifi') }}>


                    <div className="img">
                        <img src="/img/icons/wifi.svg" alt="" />
                    </div>

                    <p>Crear WIFI</p>
                    <span>Link to a website of your choice</span>
                </div>

                <div className="button" onClick={(ev) => { clickButton(ev, 'qrs') }}>


                    <div className="img">
                        <img src="/img/icons/apps.svg" alt="" />
                    </div>


                    <p>Mis QRS Favoritos</p>
                    <span>Link to a website of your choice</span>
                </div>



            </div>
        </>
    )
}
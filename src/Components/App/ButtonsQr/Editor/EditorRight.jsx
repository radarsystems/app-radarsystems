import { IoArrowDown, IoCloudUploadOutline, IoDocumentTextOutline, IoTrashOutline } from "react-icons/io5";
import EditDescButtons from "../../Buttons/Editor/EditDesc";
import EditLogoButtons from "../../Buttons/Editor/EditLogo";
import EditTitleButtons from "../../Buttons/Editor/EditTitle";
import EditTitleSpace from "./EditTitleSpace";
import { useContext, useRef, useState } from "react";
import ModalSmall from "../../ModalSmall";
import $, { data } from "jquery";
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
    const [nameQr, setFormName] = useState()
    const { UserInfo } = useContext(AuthContext)

    const ref = useRef(null)

    const rs = {
        "instagram": "https://www.instagram.com/",
        "twitter": "https://x.com/",
        "facebook": "https://facebook.com/",
        "tiktok": "https://tiktok.com/",
        "whatsapp": "https://api.whatsapp.com/send/?phone=",
        "websiteurl": "",
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

        "width": 600,
        "height": 600,
        "margin": 0,
        "qrOptions": {
            "typeNumber": "0",
            "mode": "Byte",
            "errorCorrectionLevel": "Q"
        },
        "imageOptions": {
            "hideBackgroundDots": true,
            "imageSize": 0.4,
            "margin": 10
        },
        "dotsOptions": {
            "type": "dots",
            "color": "#000000"
        },
        "backgroundOptions": {
            "color": "#ffffff",
            "gradient": null
        },
        "image": "/img/icons/logo_color_1.png",
        "dotsOptionsHelper": {
            "colorType": {
                "single": true,
                "gradient": false
            },
            "gradient": {
                "linear": true,
                "radial": false,
                "color1": "#6a1a4c",
                "color2": "#6a1a4c",
                "rotation": "0"
            }
        },
        "cornersSquareOptions": {
            "type": "extra-rounded",
            "color": "#000000"
        },
        "cornersSquareOptionsHelper": {
            "colorType": {
                "single": true,
                "gradient": false
            },
            "gradient": {
                "linear": true,
                "radial": false,
                "color1": "#000000",
                "color2": "#000000",
                "rotation": "0"
            }
        },
        "cornersDotOptions": {
            "type": "dot",
            "color": "#000000"
        },
        "cornersDotOptionsHelper": {
            "colorType": {
                "single": true,
                "gradient": false
            },
            "gradient": {
                "linear": true,
                "radial": false,
                "color1": "#000000",
                "color2": "#000000",
                "rotation": "0"
            }
        },
        "backgroundOptionsHelper": {
            "colorType": {
                "single": true,
                "gradient": false
            },
            "gradient": {
                "linear": true,
                "radial": false,
                "color1": "#ffffff",
                "color2": "#ffffff",
                "rotation": "0"
            }
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

        let goForm = false
        let msg = "";

        if (modalRs) {
            if (formRs) {
                goForm = true
            } else {
                msg = "Opps no has agregado ningun usuario"
            }
        }

        if (modalWifi) {

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

            let formData = new FormData()

            let dataQr = data;
            formData.append("url", data)
            formData.append("id_company", UserInfo?.company?.id_company)

            axios.post(API_URL + "/api/upload/shortlink", formData, { withCredentials: true })
                .then((response) => {
                    return response.data
                })
                .then((data) => {

                    QrCode.update({
                        data: data.shortlink
                    })

                    QrCode.getRawData().then((blob) => {

                        let reader = new FileReader()

                        reader.onload = function (ev) {
                            goCreateQRForm(ev.target.result, Number(data.id_shortlink), dataQr)
                        }

                        reader.readAsDataURL(blob)
                    })
                })




        }
    }


    function goCreateQRForm(image, id_concat = null, dataQr) {

        let formData = new FormData();

        if (id_concat) {
            formData.append("id_concat", id_concat)
        }

        let qrName = `${clickType + "-" + (new Date() / 1000).toFixed()}`;
        formData.append("preview", image)
        formData.append("dataQr", dataQr)
        formData.append("id_company", UserInfo?.company?.id_company)

        if (nameQr == null) {
            formData.append("formqr", JSON.stringify({ name: qrName }))
        } else {
            qrName = nameQr
            formData.append("formqr", JSON.stringify({ name: nameQr }))
        }

        console.log(clickType)

        switch (clickType) {
            case 'facebook':
            case 'instagram':
            case 'x':
            case 'twitter':
            case 'linkedin':
            case 'whatsapp':
                formData.append("type", "qr-rs")
                break;

            case 'pdf':
            case 'img':
                formData.append("type", "qr-file")
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
                    VisibleMenu(false)

                    setModalRs(false)

                    try {
                        addNewQr(qrName, data.img)
                        toast.success("QR agregado con exito")
                    } catch (err) {
                        toast.error(String(err))
                    }

                } else {
                    toast.error(`${data.msg}`)
                }

                setFormName(null)
            })
            .catch((err) => {
                setFormName(null)
                pendingNow("rs", false)
            })
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

    useEffect(() => {
        if (!modalPdf) {
            setFileUpload([])
        }
    }, [modalPdf])



    return (
        <>



            <ModalSmall key={modalWifi ? 'x23' : 'x24'} visible={modalWifi} onClick={(ev) => { CreateQr(`WIFI:T:${formWifi.encrypt};S:${formWifi.ssid};P:${formWifi.password};;`) }} callback={setModalWifi} maxWidth={400} Pending={pending?.rs} >

                <div className="top">
                    <p>Red WiFi</p>
                    <span>Agrega tu red Wi-Fi favorita e integra el código QR dentro de tu botonera</span>
                </div>

                <div className="data">


                    <div className="form-input">
                        <label htmlFor="ssid">Nombre QR</label>
                        <input type="text" onChange={(ev) => { setFormName(ev.target.value) }} name="user" placeholder={clickType == "websiteurl" ? "https://mysiteweb.com" : "Nombre del QR"} />
                    </div>
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
                        <input type="text" onChange={(ev) => { setFormName(ev.target.value) }} name="user" placeholder={"Nombre del QR"} />
                    </div>

                    <div className="form-input">
                        <label htmlFor="">{rs[clickType]}{formRs}</label>
                        <input type="text" onChange={(ev) => { setFormRs(ev.target.value) }} name="user" placeholder={clickType == "websiteurl" ? "https://mysiteweb.com" : "@usuario"} />
                    </div>
                </div>
            </ModalSmall>


            <ModalSmall key={modalPdf ? "14sd" : "15asdas"} visible={modalPdf} Pending={pending?.modalFile} callback={setModalPdf} next={"Subir"} onClick={uploadFile}>
                <input type="file" name="file" onChange={changeFile} hidden />

                <div className="top">
                    <p>Subir archivo</p>
                    <span>Sube tu imagen o pdf que no sea mayor a 5 MB</span>
                </div>

                <div className="select-file">

                    <br />

                    <div className="form-input">
                        <input type="text" onChange={(ev) => { setFormName(ev.target.value) }} name="user" placeholder={clickType == "websiteurl" ? "https://mysiteweb.com" : "Nombre del QR"} />
                    </div>

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

                            <span className="desc">Has click aca para buscar tu archivo</span>

                        </div>
                    }


                </div>
            </ModalSmall>
            <div className={`buttons-services ${boxType}`}>

                <div className="qr-result-2" ref={ref} hidden >
                </div>

                <div className="top-title">
                    <p>1. Servicios QR</p>
                    <button className="close mb" onClick={(ev) => { VisibleMenu(false) }}><Icon icon="teenyicons:x-outline" /></button>
                </div>


                <div className="button" onClick={(ev) => { clickButton(ev, 'vcard-add') }} type="vcard">
                    <div className="img">
                        <img src="/img/icons/vCard.svg" alt="" />
                    </div>
                    <p>Crear Tarjeta De Presentacion QR</p>
                    <span>Comparte </span>
                </div>

                <div className="button" onClick={(ev) => { clickButton(ev, 'vcard') }} type="vcard">
                    <div className="img">
                        <img src="/img/icons/vCard.svg" alt="" />
                    </div>
                    <p>Mis Tarjeta De Presentacion QR</p>
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
                    <p>Crear Otros QR's</p>
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


                <div className="button" onClick={(ev) => { clickButton(ev, 'wifi') }}>


                    <div className="img">
                        <img src="/img/icons/wifi.svg" alt="" />
                    </div>

                    <p>Crear Acceso WIFI</p>
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
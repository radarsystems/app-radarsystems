import { useContext, useEffect, useState } from "react"
import { IoCheckmarkSharp, IoChevronBackOutline } from "react-icons/io5"
import { randomId } from "../../../Functions/Global"
import $, { data, type } from "jquery"
import axios from "axios"
import { API_URL } from "../../../ExportUrl"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../../Context/AuthContext"
import QrStyling from "qr-code-styling"
import { useRef } from "react"
import { toast } from "react-hot-toast"
import html2canvas from "html2canvas"


export default function WizardQr({ Visible, Close, loadQrs = () => { }, callbackUrl = (title, img) => { } }) {

    const { UserInfo } = useContext(AuthContext)
    const ref = useRef(null)
    const [count, setCount] = useState(0)
    const [idOptions, setIdOptions] = useState([randomId()])
    const [form, setForm] = useState({ type: "" })
    const [qr, setQr] = useState({})
    const [pending, setPending] = useState(false)
    const idModal = randomId()

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

    let defaultQr = { url: "" };
    let defaultQrContact = {};
    const [formQr, setFormQr] = useState(defaultQr)

    const Navigate = useNavigate()


    function selectOption(ev) {
        ev.stopPropagation()
        ev.preventDefault()

        let target = $(ev.target)

        target.parents(".options").find(".active").removeClass("active")
        target.addClass("active")
        let value = target.attr("value")

        setForm(prevData => ({ ...prevData, type: value }))
    }

    async function Next(ev) {
        let approve = false
        let target = $(ev.target)

        if (count === 0 && form.type == "qr-stand" || form.type == "qr-contact" || form.type == "qr-file") {
            approve = true
        }

        if (count === 1) {

            const element = document.querySelector(".qr-result")

            if (form.type == "qr-contact") {
                QrCode.update({
                    data: 'BEGIN:VCARD\n' +
                        'VERSION:3.0\n' +
                        'N:' + formQr.lname + ';' + formQr.fname + ';;;\n' +
                        'FN:' + formQr.fname + ' ' + formQr.lname + '\n' +
                        'ORG:' + formQr.company + ';\n' +
                        'TITLE:' + formQr.jobtitle + '\n' +
                        'TEL;type=CELL:' + formQr.number + '\n' +
                        'TEL;type=WORK:' + formQr.officenum + '\n' +
                        'EMAIL;type=INTERNET;type=WORK;type=pref:' + formQr.email + '\n' +
                        'URL:' + formQr.web + '\n' +
                        'ADR;TYPE=work:;;' + formQr.address1 + ';' + formQr.address2 + ';' + formQr.city + ';' + formQr.province + ';' + formQr.country + ';' + formQr.pcode + '\n' +
                        'REV:' + new Date() + '\n' +
                        'END:VCARD'
                });
            } else {
                QrCode.update({
                    data: formQr.url
                })
            }

            element.innerHTML = ""

            QrCode.append(element)

            await QrCode.getRawData()
                .then((blob) => {
                    let reader = new FileReader();
                    reader.onload = function (event) {
                        const base64URL = event.target.result
                        setForm({ ...form, base64: base64URL })
                    }

                    reader.readAsDataURL(blob)
                })

            approve = true
        }

        if (count === 2) {

            if (formQr.name) {

                let formLink = new FormData()



                setPending(true)

                if (form.type == "qr-stand") {
                    await new Promise((resolve, reject) => {

                        formLink.append("url", formQr.url)
                        formLink.append("id_company", UserInfo?.company?.id_company)

                        axios.post(API_URL + "/api/upload/shortlink", formLink, { withCredentials: true })
                            .then((response) => { return response.data })
                            .then((data) => {

                                QrCode.update({
                                    data: data.shortlink
                                })

                                QrCode.getRawData()
                                    .then((blob) => {
                                        let reader2 = new FileReader();
                                        reader2.onload = function (event) {
                                            const base64URL = event.target.result
                                            goUploadQr(base64URL, data.id_shortlink, formQr.url)

                                        }

                                        reader2.readAsDataURL(blob)
                                    })
                            })

                    })

                } else {
                    goUploadQr(form.base64)
                }



            } else {
                approve = false
                toast.error("Opps no has elegido un nombre para tu qr")
            }
        }



        if (approve) {
            setCount(prevData => (prevData + 1))
        }

    }

    function goUploadQr(image, id_concat = undefined, dataQr) {
        let formData = new FormData()
        formData.append("formqr", JSON.stringify(formQr))
        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("type", form.type)
        formData.append("preview", image)
        formData.append("dataQr", dataQr)

        if (id_concat) {
            formData.append("id_concat", id_concat)
        }
        axios.post(API_URL + "/api/upload/qr", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {

                if (data.status) {
                    try {
                        loadQrs()
                        callbackUrl(formQr.name, data.img)
                    } catch (err) {
                    }

                    toast.success('Has subido tu qr con exito')
                }

                Close(false)

                setPending(false)
            }).catch((err) => {
                setPending(false)
            })
    }

    function setNewForm(ev) {
        let name = ev.target.name
        let value = ev.target.value

        setForm(prevData => ({ ...prevData, [name]: value }))
    }

    function setNewFormqr(ev) {
        let name = ev.target.name
        let value = ev.target.value

        setFormQr(prevData => ({ ...prevData, [name]: value }))
    }

    useEffect(() => {
        $(`#modal-${idModal} .case.active`).removeClass('active')
        $(`#modal-${idModal} .case`).eq(count).addClass("active")
    }, [count])




    return (
        <>


            <div className={`wizard-home ${Visible ? 'open' : 'close'}`} id={`modal-${idModal}`}>

                <div className="top-actions">

                    {count > 0 ? <button className="return" onClick={(ev) => { setCount(prevData => (prevData - 1)) }}><IoChevronBackOutline /> <span>Volver</span> </button> : ''}


                    <button className="closed" onClick={(ev) => { Close(false) }}>X</button>
                </div>

                <div className="body">
                    <div className="case active">
                        <div className="top">
                            <p className="title">Crear un nuevo QR individual</p>
                            <span className="desc">Selecciona el tipo de qr que quieres crear</span>
                        </div>

                        <div className="options " id={`options-${idOptions[0]}`}>
                            <div className="selector" style={{ marginBottom: "10px" }} onClick={selectOption} value={"qr-stand"}>
                                <div className="check">
                                    <IoCheckmarkSharp />
                                </div>
                                <div className="info">
                                    <p>QR Estandar</p>
                                    <span>Qr Estandar es un qr basico donde podras almacenar enlaces de tus webs</span>
                                </div>
                            </div>

                            <div className="selector" style={{ marginBottom: "10px" }} onClick={selectOption} value={"qr-contact"}>
                                <div className="check">
                                    <IoCheckmarkSharp />
                                </div>
                                <div className="info">
                                    <p>QR Contacto</p>
                                    <span>Qr Contacto, este es un qr donde podras escanearlo y almacenar un contacto con informacion importante</span>
                                </div>
                            </div>

                            <div className="selector" style={{ marginBottom: "10px" }} onClick={selectOption} value={"qr-file"}>
                                <div className="check">
                                    <IoCheckmarkSharp />
                                </div>
                                <div className="info">
                                    <p>QR Archivo</p>
                                    <span>Qr Archivo, este es un qr donde podras guardar un archivo de tu preferencia</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {form.type == "qr-stand" &&
                        <>
                            <div className="case">
                                <div className="top">
                                    <p className="title">Personalizar campaña</p>
                                    <span className="desc">Selecciona el tipo de campaña que te gustaría enviar</span>
                                </div>

                                <div className="form">
                                    <div className="form-input">
                                        <label>Enlace del qr</label>
                                        <input type="url" name="url" onChange={setNewFormqr} placeholder="Enlace" />
                                    </div>

                                    <div className="form-input">
                                        <label>Nombre del qr</label>
                                        <input type="text" onChange={setNewFormqr} name="name" placeholder="Nombre para tu QR" />
                                    </div>
                                </div>
                            </div>
                        </>
                    }

                    {form.type == "qr-file" &&
                        <div className="case">
                            <div className="top">
                                <p className="title">Qr archivo</p>
                                <span className="desc">Sube tu archivo de tu preferencia para crear tu qr y luego utilizarlo en la nube</span>

                                <br />
                                <div className="form-input">
                                    <input type="file" />
                                </div>
                                <br />
                            </div>
                        </div>
                    }

                    {form.type == "qr-contact" &&
                        <div className="case">
                            <div className="top">
                                <p className="title">Personaliza tu QR</p>
                                <span className="desc">Este es un QR de contacto para generar tu tarjeta de presentacion, puedes personalizarlo con tu informacion necesaria.</span>
                            </div>


                            <div className="form">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-input">
                                            <label>Nombre del QR</label>
                                            <input type="text" onChange={setNewFormqr} name="name" placeholder="Nombre para tu QR" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-input">
                                            <label>Nombre</label>
                                            <input type="text" name="fname" onChange={setNewFormqr} placeholder="ej: Roberto" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-input">
                                            <label>Apellido</label>
                                            <input type="text" name="lname" onChange={setNewFormqr} placeholder="ej: Martinez" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-input">
                                            <label>Empresa</label>
                                            <input type="text" name="company" onChange={setNewFormqr} placeholder="ej: Cocacola" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-input">
                                            <label>Cargo</label>
                                            <input type="text" name="jobtitle" onChange={setNewFormqr} placeholder="ej: Director" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-input">
                                            <label>Celular</label>
                                            <input type="text" name="number" onChange={setNewFormqr} placeholder="ej: +58412000000" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-input">
                                            <label>Numero de Oficina</label>
                                            <input type="text" name="officenum" onChange={setNewFormqr} placeholder="ej: (12)" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-input">
                                            <label>Correo Electronico</label>
                                            <input type="text" name="email" onChange={setNewFormqr} placeholder="ej: example@example.com" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-input">
                                            <label>Pagina Web</label>
                                            <input type="text" name="web" onChange={setNewFormqr} placeholder="ej: www.example.com" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-input">
                                            <label>Direccion</label>
                                            <input type="text" name="address1" onChange={setNewFormqr} placeholder="ej: Chicago, ST " />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-input">
                                            <label>Direccion del Trabajo</label>
                                            <input type="text" name="address2" onChange={setNewFormqr} placeholder="ej: Chicago ST, Down Ryder " />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-input">
                                            <label>Ciudad</label>
                                            <input type="text" name="city" onChange={setNewFormqr} placeholder="ej: Chicago" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-input">
                                            <label>Estado</label>
                                            <input type="text" name="province" onChange={setNewFormqr} placeholder="ej: Chicago" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-input">
                                            <label>Pais</label>
                                            <input type="text" name="country" onChange={setNewFormqr} placeholder="ej: Estados Unidos" />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-input">
                                            <label>Codigo postal</label>
                                            <input type="text" name="pcode" onChange={setNewFormqr} placeholder="ej: (15306)" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }


                    <div className="case">

                        <div className="top">
                            <p className="title">Previsualiza tu QR </p>
                            <span className="desc">Este es el QR que has creado, dale click para subirlo.</span>
                        </div>


                        <div className="qr-result">
                            <canvas></canvas>
                        </div>
                    </div>



                    <div className="actions">
                        <button className={`next ${pending ? 'await' : ' '}`} onClick={Next}>Siguiente <div className="loading"></div></button>
                    </div>
                </div>
            </div >
        </>
    )
}
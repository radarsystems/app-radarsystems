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


export default function WizardQr({ Visible, Close, loadQrs }) {

    const { UserInfo } = useContext(AuthContext)
    const ref = useRef(null)
    const [count, setCount] = useState(0)
    const [idOptions, setIdOptions] = useState([randomId()])
    const [form, setForm] = useState({ type: "" })
    const [qr, setQr] = useState({})
    const [pending, setPending] = useState(false)

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

        if (count === 0 && form.type == "qr-stand" || form.type == "qr-contact") {
            approve = true
        }

        if (count === 1) {

            QrCode.append(ref.current);

            if (form.type == "qr-contact") {
                QrCode.update({
                    data: 'BEGIN:VCARD \
                VERSION:3.0 \
                N:' + formQr.lname + ';' + formQr.fname + ';;;' + '\n' + 'FN:' + formQr.fname + ' ' + formQr.lname + '\n' + 'ORG:' + formQr.company + ';' + '\n' + 'TITLE:' + formQr.jobtitle + '\n' + 'TEL;type=CELL:' + formQr.number + '\n' + 'TEL;type=WORK:' + formQr.officenum + '\n' + 'EMAIL;type=INTERNET;type=WORK;type=pref:' + formQr.email + '\n' + 'URL%3A' + formQr.web + '%0A' + '\n' + 'ADR;TYPE=work:;;' + formQr.address1 + ';' + formQr.address2 + ';' + formQr.city + ';' + formQr.province + ';' + formQr.country + ';' + formQr.pcode + '\n' + 'REV:' + new Date() + '\n' + 'END:VCARD'
                })
            } else {
                QrCode.update({
                    data: formQr.url
                })
            }

            approve = true
        }

        if (count === 2) {

            if (formQr.name) {

                setPending(true)
                let formData = new FormData()
                formData.append("formqr", JSON.stringify(formQr))
                formData.append("id_company", UserInfo?.company?.id_company)
                formData.append("type", form.type)

                let photo = await new Promise((resolve, reject) => {
                    let canvas = document.querySelector(".qr-result canvas");
                    let url = canvas.toDataURL("image/png");

                    resolve(url);
                })

                formData.append("preview", photo)

                axios.post(API_URL + "/api/upload/qr", formData, { withCredentials: true })
                    .then((response) => { return response.data })
                    .then((data) => {
                        Close(false)
                        if (data.status) {
                            loadQrs()
                        }


                        setPending(false)
                    }).catch((err) => {
                        setPending(false)
                    })
            } else {
                approve = false
                toast.error("Opps no has elegido un nombre para tu qr")
            }
        }



        if (approve) {
            setCount(prevData => (prevData + 1))
        }

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
        $(".case.active").removeClass('active')
        $(".case").eq(count).addClass("active")
    }, [count])




    return (
        <>

            <div className={`wizard-home ${Visible ? 'open' : 'close'}`} >

                <div className="top-actions">

                    {count > 0 ? <button className="return" onClick={(ev) => { setCount(prevData => (prevData - 1)) }}><IoChevronBackOutline /> <span>Volver</span> </button> : ''}


                    <button className="closed" onClick={(ev) => { Close(false) }}>X</button>
                </div>
                <div className="body">
                    <div className="case">
                        <div className="top">
                            <p className="title">Crear un nuevo QR</p>
                            <span className="desc">Selecciona el tipo de qr que quieres crear</span>
                        </div>

                        <div className="options flex" id={`options-${idOptions[0]}`}>
                            <div className="selector" onClick={selectOption} value={"qr-stand"}>
                                <div className="check">
                                    <IoCheckmarkSharp />
                                </div>
                                <div className="info">
                                    <p>QR Estandar</p>
                                    <span>Qr Estandar es un qr basico donde podras almacenar enlaces de tus webs</span>
                                </div>
                            </div>

                            <div className="selector" onClick={selectOption} value={"qr-contact"}>
                                <div className="check">
                                    <IoCheckmarkSharp />
                                </div>
                                <div className="info">
                                    <p>QR Contacto</p>
                                    <span>Qr Contacto, este es un qr donde podras escanearlo y almacenar un contacto con informacion importante</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {form.type == "qr-stand" ?
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
                        :
                        <div className="case">
                            <div className="top">
                                <p className="title">Personaliza tu QR</p>
                                <span className="desc">Este es un qr para agregar contactos a un dispositivo movil, puedes personalizarlo con tu informacion necesaria</span>
                            </div>


                            <div className="form">
                                <div className="row">
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
                            <p className="title">Elige un nombre</p>
                            <span className="desc">Elige un nombre a tu qr para poder identificarlo</span>
                        </div>


                        <div className="qr-result" ref={ref} />
                    </div>



                    <div className="actions">
                        <button className={`next ${pending ? 'await' : ' '}`} onClick={Next}>Siguiente <div className="loading"></div></button>
                    </div>
                </div>
            </div >
        </>
    )
}
import { useContext, useEffect, useState } from "react"
import { IoCheckmarkSharp, IoChevronBackOutline, IoCloudUploadOutline } from "react-icons/io5"
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


export default function WizardUploadQr({ Visible, Close, loadQrs }) {

    const { UserInfo } = useContext(AuthContext)
    const ref = useRef(null)
    const [count, setCount] = useState(0)
    const [idOptions, setIdOptions] = useState([randomId()])
    const [form, setForm] = useState({ type: "" })
    const [pending, setPending] = useState(false)
    const Navigate = useNavigate()


    async function Next(ev) {
        let approve = false
        let target = $(ev.target)

        if (form.name && form.image) {
            let formData = new FormData()

            formData.append("preview", form.image)
            formData.append("id_company", UserInfo?.company?.id_company)
            formData.append("type", "qr-stand");
            formData.append("formqr", JSON.stringify(form))

            axios.post(API_URL + "/api/upload/qr", formData, { withCredentials: true })
                .then((response) => { return response.data })
                .then((data) => {
                    console.log(data)
                })

        } else {
            toast.error("Opps hay algo imcompleto")
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

    function OpenUploadFile() {
        $("#file").click()
    }

    function scanFile(ev) {
        let file = ev.target.files
        let input = $(ev.target);

        if (file.length) {
            let readFile = new FileReader()

            readFile.onload = function (ev) {
                if (file[0].type.indexOf("image") >= 0) {
                    let image = new Image()

                    image.src = ev.target.result

                    image.onload = function () {
                        if (image.width <= 6000 && image.height <= 6000) {
                            setForm({ ...form, image: image.src })
                        } else {
                            toast.error(`Opps maximo 600x600 tu imagen es de ${image.width}x${image.height}`)
                        }
                    }
                } else {
                    input.val("")
                    toast.error("Opps solo aceptamos imagenes")
                }
            }


            readFile.readAsDataURL(file[0])
        }


    }

    useEffect(() => {
        $("#wizard2").find(".case").eq(0).addClass("active")
    }, [])


    return (
        <>

            <div className={`wizard-home ${Visible ? 'open' : 'close'}`} id="wizard2">

                <div className="top-actions">

                    {count > 0 ? <button className="return" onClick={(ev) => { setCount(prevData => (prevData - 1)) }}><IoChevronBackOutline /> <span>Volver</span> </button> : ''}


                    <button className="closed" onClick={(ev) => { Close(false) }}>X</button>
                </div>

                <div className="body">
                    <div className="case ">
                        <div className="top">
                            <p className="title">Subir nuevo QR</p>
                            <span className="desc">Importa la imagen del nuevo qr que quieres integrar</span>
                        </div>

                        <div className="form">
                            <div className="form-input">
                                <label>Nombre del qr</label>
                                <input type="text" onChange={setNewForm} name="name" placeholder="Nombre para tu QR" />
                            </div>

                            <div className="upload-qr">

                                {form.image == undefined ?
                                    <div className="upload" onClick={OpenUploadFile}>
                                        <IoCloudUploadOutline />
                                    </div>
                                    :
                                    <div className="preview">
                                        <img src={form.image} alt="" />
                                    </div>
                                }


                                <input type="file" id="file" onChange={scanFile} hidden />

                            </div>
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
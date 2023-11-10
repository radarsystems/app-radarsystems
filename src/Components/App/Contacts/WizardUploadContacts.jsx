import { useContext, useEffect, useState } from "react"
import { IoCheckmarkSharp, IoChevronBackOutline, IoTrashOutline } from "react-icons/io5"
import { AnalizeFileCsv, randomId } from "../../../Functions/Global"
import $, { data, type } from "jquery"
import axios from "axios"
import { API_URL } from "../../../ExportUrl"
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../../../Context/AuthContext"
import { AiOutlineFileAdd, AiOutlineFileText } from "react-icons/ai"
import LoadingCircleApp from "../LoadingCircle"
import { toast } from "react-hot-toast"

export default function WizardUploadContacts({ Visible, Close, Callback }) {
    const { UserInfo } = useContext(AuthContext)

    const [count, setCount] = useState(0)
    const [idOptions, setIdOptions] = useState([randomId()])
    const [form, setForm] = useState({ type: "", file: {} })
    const defaultActions = { analize: false, percentAnalize: "0", approve: false };
    const [actions, setActions] = useState(defaultActions)
    const [pending, setPending] = useState(false)
    let inputFile = $("input[type='file']")

    const Navigator = useNavigate()
    const params = useParams()


    function selectOption(ev) {
        ev.stopPropagation()
        ev.preventDefault()

        let target = $(ev.target)

        target.parents(".options").find(".active").removeClass("active")
        target.addClass("active")
        let value = target.attr("value")

        setForm(prevData => ({ ...prevData, type: value }))
    }

    function Next(ev) {
        let approve = false
        let target = $(ev.target)

        if (count === 0 && form.type == "auto" || form.type == "manu") {
            approve = true
        }


        switch (form.type) {
            case 'auto':
                if (count == 1) {
                    if (form?.file?.name !== undefined) {
                        UploadFile()
                    }
                }
                break;

            case 'manu':
                if (count == 1) { }
                break;
        }

        if (approve) {
            setCount(prevData => (prevData + 1))
        }

    }

    useEffect(() => {
        $(".case.active").removeClass('active')
        $(".case").eq(count).addClass("active")


    }, [count])

    function OpenInputFile() {
        document.querySelector("input[type='file']").click()
    }

    function setPercentAnalize(value) {
        setActions(prevData => ({ ...prevData, percentAnalize: value }))
    }

    function ObserverFile(ev) {
        setActions(prevData => ({ ...prevData, analize: true }))
        AnalizeFileCsv(ev, setPercentAnalize).then((response) => {

            console.log(response)
            if (response.analize == "good") {
                setActions(prevData => ({ ...prevData, approve: true }))
                setForm(prevData => ({ ...prevData, file: response.file }))
            }
        }).catch((err) => {
            DeleteFile()
            toast.error("Opps! el archivo que intentastes subir no es compatible o tiene algun error.")
            setActions(prevData => ({ ...prevData, analize: false, percentAnalize: 0 }))
        })
    }

    function UploadFile() {
        setPending(true)
        let formData = new FormData()

        formData.append("id_list", params.id)
        formData.append("contacts", form.file)
        formData.append("id_company", UserInfo?.company?.id_company)

        axios.post(API_URL + "/api/upload/contacts", formData, { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }).then((response) => { return response.data }).then((data) => {
            setPending(false)

            if (data.status) {
                Navigator("/contacts/detail/" + params.id)
            } else {
                toast.error(data.msg)
            }
        }).catch((err) => {
            setPending(false)
        })
    }

    function DeleteFile() {
        setForm(prevData => ({ ...prevData, file: {} }))
        setActions(defaultActions)
        inputFile.val("")
    }

    return (
        <>
            <div className={`wizard-home ${Visible ? 'open' : 'close'}`} >

                <div className="top-actions">

                    {count > 0 ? <button className="return" onClick={(ev) => { setCount(prevData => (prevData - 1)) }}><IoChevronBackOutline /> <span>Volver</span> </button> : ''}


                    <button className="closed" onClick={(ev) => { Navigator("/contacts/detail/" + params.id) }}>X</button>
                </div>
                <div className="body">

                    <div className="case">
                        <div className="top">
                            <p className="title">Subir nuevos contactos</p>
                            <span className="desc">Selecciona de que manera quieres subir los contactos</span>
                        </div>

                        <div className="options flex" id={`options-${idOptions[0]}`}>
                            <div className="selector" onClick={selectOption} value={"manu"}>
                                <div className="check">
                                    <IoCheckmarkSharp />
                                </div>
                                <div className="info">
                                    <p>SUBIR MANUALMENTE</p>
                                    <span>
                                        Agrega tus contactos de forma rápida y sencilla, uno por uno, rellenando los campos de manera dinámica. Con solo unos pocos clics, podrás tener tus contactos listos para comunicarte con ellos de manera personalizada.
                                    </span>
                                </div>
                            </div>

                            <div className="selector" onClick={selectOption} value={"auto"}>
                                <div className="check">
                                    <IoCheckmarkSharp />
                                </div>
                                <div className="info">
                                    <p>SUBIR MEDIANTE ARCHIVO</p>
                                    <span>Importa tus contactos de manera rápida y eficiente mediante un archivo. Solo necesitas preparar un archivo en formato (.csv o .txt) con los detalles de tus contactos y nuestro sistema se encargará de procesarlo y añadirlos a tu lista en un instante.</span>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="case">

                        <div className="top">
                            <p className="title">Subir Archivo</p>
                            <span className="desc">Sube tu archivo rapidamente para procesarlo en tu lista de contactos.</span>
                        </div>

                        {
                            actions.approve == true ?
                                <>
                                    <div className="file-adjunt">
                                        <i className="icon">
                                            <AiOutlineFileText />
                                        </i>
                                        <div className="file">
                                            <p>{form?.file?.name}</p>
                                            <div className="info">
                                                <span>Tipo de archivo: {form.file.type}</span>
                                                <span>Peso: {form.file.size} kb</span>
                                            </div>

                                            <button className="delete" onClick={DeleteFile}><IoTrashOutline /></button>
                                        </div>

                                    </div>
                                </>
                                :

                                <div className="upload-contact">
                                    <input type="file" accept=".csv,.txt" onChange={ObserverFile} hidden />

                                    {actions.analize == true ?
                                        <>
                                            <p>Estamos analizando tu archivo... {actions.percentAnalize}%</p>
                                        </>

                                        :
                                        <center>

                                            <div className="select-upload" onClick={OpenInputFile}>
                                                <i className="icon">
                                                    <AiOutlineFileAdd />
                                                </i>
                                                <p>Selecciona tu archivo de contactos</p>
                                            </div>

                                        </center>
                                    }

                                </div>

                        }





                    </div>

                    <div className="actions center">
                        <button className={`next ${pending == true ? 'await' : ''}`} onClick={Next}>Siguiente <div className="loading"></div></button>
                    </div>
                </div>
            </div >
        </>
    )
}
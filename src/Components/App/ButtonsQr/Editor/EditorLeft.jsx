import { Icon } from "@iconify/react"
import ColorPickerBasic from "../../ColorPicker/ColorPickerBasic"
import { HuePicker } from "react-color"
import ModalSmall from "../../ModalSmall"
import { useContext, useState } from "react"
import { IoCloudUploadOutline, IoDocumentTextOutline, IoTrashOutline } from "react-icons/io5"
import { AnalizeFileCsv, AnalizeImage } from "../../../../Functions/Global"
import toast from "react-hot-toast"
import { AuthContext } from "../../../../Context/AuthContext"
import axios from "axios"
import { API_URL } from "../../../../ExportUrl"


export default function EditorLeftButtonsQr({ setButtons, Visible, VisibleMenu }) {

    const [fileUpload, setFileUpload] = useState({})
    const [visibleUpload, setVisibleUpload] = useState(false)
    const [pending, setPending] = useState(false)

    const { UserInfo } = useContext(AuthContext)

    function changeTheme(ev) {
        let value = ev.target.value

        let name = ev.target.name

        if (name == "background") {
            if (value.indexOf("http") >= 0) {
                value = `url(${value})`
            }
        }


        setButtons((prevData) => {
            let newData = { ...prevData }

            newData.header[ev.target.name] = value

            console.log(newData)
            return newData
        })
    }

    function setColor(color) {
        setButtons(prevData => {
            let newData = { ...prevData }

            newData.header.background = color;

            return newData
        })
    }

    function selectFile() {
        document.querySelector("input[name='file-wallpaper']").click()
    }

    function ObserverImage(ev) {
        let file = ev.target.files[0]
        let analize = AnalizeImage(file);

        if (analize) {
            setFileUpload(file)
        }
    }

    function deleteFile() {
        setFileUpload({})
        document.querySelector("input[name='file-wallpaper']").value = ""
    }

    function goUploadPhoto() {



        if (fileUpload?.name) {

            setPending(true)
            let formData = new FormData()
            formData.append("id_company", UserInfo?.company?.id_company)
            formData.append("file", fileUpload);
            axios.post(API_URL + "/api/upload/fileqr", formData, { withCredentials: true })
                .then((response) => { return response.data })
                .then((data) => {

                    if (data.download) {
                        setButtons(prevData => {
                            let newData = { ...prevData }

                            newData.header.background = `url(${data.download})`

                            return newData
                        })

                    }

                    setVisibleUpload(false)

                    setPending(false)
                }).catch((err) => {
                    setPending(false)
                })

        } else {
            toast.error("Opps no has seleccionado ningun archivo")
        }
    }


    return (
        <>
            <ModalSmall visible={visibleUpload} callback={setVisibleUpload} onClick={goUploadPhoto} Pending={pending}>
                <div className="top">
                    <p>Subir imagen</p>
                    <span>sube tu imagen que no sea mayor a 5MB</span>
                </div>

                <input type="file" onChange={ObserverImage} name="file-wallpaper" accept=".png,.jpg,.jpeg" hidden />

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

                            <span className="desc">Has click aca para buscar tu archivo</span>
                        </div>
                    }


                </div>

            </ModalSmall>
            <div className="title-top">
                <p>Personalizar botonera</p>
                <span>Personaliza tu botonera, cambiando imagenes, fondo, texto, botones, enlaces.</span>
                <button className="close mb" onClick={VisibleMenu}><Icon icon="teenyicons:x-outline" /></button>
            </div>

            <br />
            <div className="option">
                <p className="title">Elige el fondo</p>
                <input type="text" defaultValue={"#fff"} onChange={changeTheme} name="background" />

                <button onClick={(ev) => { setVisibleUpload(true) }} className="action-complete"><Icon icon="material-symbols:upload-rounded" /> Elegir Imagen</button>

                <hr />
                <p className="title">Colores</p>
                <ColorPickerBasic onClick={setColor} />
                <br />
            </div>

            <div className="option">
                <p className="title">Fondo</p>

                <div className="flex-colors">
                    <button name="theme" onClick={changeTheme} value="ligth">Modo Claro</button>
                    <button name="theme" onClick={changeTheme} value="dark">Modo Oscuro</button>
                </div>
            </div>

            <br />

            <div className="option">
                <p className="title">Blur</p>
                <input type="range" onChange={changeTheme} defaultValue={0.0} step={"0.1"} max={"10"} name="blur" />
            </div>

            <div className="option">
                <p className="title">Brillo</p>
                <input type="range" onChange={changeTheme} defaultValue={1} step={"0.1"} max={"1"} name="brightness" />
            </div>

            <div className="option">
                <p className="title">Border radius</p>
                <input type="range" onChange={changeTheme} defaultValue={1} step={"0.1"} max={"50"} name="radius" />
            </div>


        </>
    )
}
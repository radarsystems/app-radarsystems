import { useContext, useEffect } from "react"
import { AuthContext } from "../../../Context/AuthContext"
import { BsUpload } from "react-icons/bs"
import { useState } from "react"
import $ from "jquery"
import axios from "axios"
import { API_URL } from "../../../ExportUrl"
import { LoadImageProfile } from "../../../Functions/Global"
import { JconfigSucces } from "../../../Functions/Jquery"
import toast from "react-hot-toast"

export default function CompanyAccount() {


    const { UserInfo } = useContext(AuthContext)

    const [uploadPhoto, setUploadPhoto] = useState({})
    const [urlPhoto, setUrlPhoto] = useState()
    const [loading, setLoading] = useState({ photo: "" })

    function changePhoto(ev) {
        let files = ev.nativeEvent.target.files

        if (files.length) {
            let file = files[0]

            if (file.type.indexOf("image") >= 0) {
                setUploadPhoto(file);

                let url = URL.createObjectURL(file)
                setUrlPhoto(url)

            }

        }
    }

    function deletePhoto(ev) {
        $("input[name='photo']").val("")
        setUrlPhoto("")
        setUploadPhoto({})
    }

    function GetUploadPhoto() {
        let formData = new FormData()
        formData.append("file", uploadPhoto)
        formData.append("id_company", UserInfo?.company?.id_company)

        setLoading({ photo: "await" })

        axios.post(API_URL + "/api/upload/newphoto", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                if (data.status) {
                    $(".header-top .body  img").attr("src", urlPhoto)
                    JconfigSucces()
                    setUploadPhoto({})
                    toast.success("Has cambiado correctamente la foto de perfil")
                }

                setLoading({ photo: "" })
            })
            .catch((err) => {
                setLoading({ photo: "" })
            })
    }


    return (<>

        <div className="settings-account">
            <div className="case">
                <div className="info">
                    <p>Establece una foto de perfil</p>
                    <span>cambia la foto de perfil y integra una foto con tu logo o algo de tu marca</span>
                    <button>Cambiar</button>
                </div>

                <div className="action">
                    <div className="change-photo">
                        <div className="photo" style={{ background: `url(${urlPhoto ? urlPhoto : LoadImageProfile(UserInfo)})` }}></div>

                        <div className="buttons">
                            {uploadPhoto?.name ?
                                <>
                                    <button className={loading.photo} onClick={GetUploadPhoto}>Guardar <div className="loading"></div></button>
                                    <button onClick={deletePhoto}>Cancelar</button>
                                </>
                                : <button onClick={(ev) => { $("input[name='photo']").click() }}>Subir <i><BsUpload /></i> </button>
                            }
                        </div>
                        <input type="file" name="photo" onChange={changePhoto} hidden />
                    </div>
                </div>
            </div>

        </div>
    </>)
}
import { useContext, useEffect, useState } from "react";
import ModalSmall from "../../ModalSmall";
import axios from "axios";
import { API_URL } from "../../../../ExportUrl";
import { LoadPreviewQr } from "../../../../Functions/Global";
import { IoAdd, IoCheckmark, IoCloudUploadOutline, IoDocumentTextOutline, IoEyeOutline, IoSendOutline, IoTrashOutline } from "react-icons/io5";
import $ from "jquery"
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { AuthContext } from "../../../../Context/AuthContext";
import { toast } from "react-hot-toast";
import html2canvas from "html2canvas";
import { useParams } from "react-router-dom";
import WizardUploadQr from "../../Qr/WizardUploadQr";
import WizardQr from "../../Qr/WizardQr";
import { FiUpload } from "react-icons/fi"


export default function BodyButtonsQr({ type, visibleQr, setVisibleQr, buttons, setBoxType, setButtons, editor, setEditor }) {

    const [visibleTitle, setVisibleTitle] = useState(false)
    const [editId, setEditId] = useState(undefined)
    const [pending, setPending] = useState(false)
    const [pendingPhoto, setPendingPhoto] = useState(false)
    const [importQr, setImportQr] = useState(false)
    const [first, setFirst] = useState(true)
    const [modalPhoto, setModalPhoto] = useState(false)
    const [photoUpload, setPhotoUpload] = useState({})

    const params = useParams()


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

                switch (key) {
                    case "0":
                        setBoxType("vcard")
                        break;


                    case '1':
                        setBoxType("rs")
                        break;

                    default:
                        setBoxType("all")
                        break;
                }

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


    function addNewBox(ev) {
        ev.stopPropagation()

        let add = true;
        setButtons(prevData => {

            const newData = { ...prevData };

            if (add) {
                add = false
                newData.elements.push({ qrs: [] });
            }
            return newData;
        });

    }

    function addNewQr(ev) {
        ev.stopPropagation()
        console.log('addNewQr function called');

        let target = $(ev.target)

        let image = target.attr("image")
        let title = target.attr("title")

        setVisibleQr(false)
        toast.success("Has seleccionado correctamente el QR")

        let upload = true;

        setButtons((prevData) => {
            const newData = { ...prevData };
            if (upload) {
                upload = false
                // Hacer una copia del estado anterior


                // Crear una nueva instancia del array qrs con el contenido actual y agregar un nuevo elemento
                const updatedQrs = [...newData.elements[editor.key].qrs, { image, title }];

                // Actualizar el array qrs dentro del estado copiado
                newData.elements[editor.key].qrs = updatedQrs;

            }
            return newData;
        });

    }

    function deleteQr(father, qr) {
        setButtons(prevData => {
            const newData = { ...prevData };
            if (newData.elements[father] && newData.elements[father].qrs[qr]) {
                newData.elements[father].qrs.splice(qr, 1);
            }
            return newData;
        });
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

    function updateEditing() {
        $("#title").text(buttons?.header?.title ? buttons?.header?.title : "Agregar Nombre...")
        $("#desc").text(buttons?.header?.desc ? buttons?.header?.des : "Agregar descripcion...")

        buttons?.elements?.forEach((element, key) => {
            console.log(element)
            $("p[type='titlespace']").eq(key).text(element.title)
        })
    }

    useEffect(() => {

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

    useEffect(() => {

        updateEditing()

    }, [editId, type])

    function changeTitle(ev) {

        setButtons((prevData) => {
            let newData = { ...prevData }
            newData.header.title = ev.target.textContent
            return newData
        })
    }

    function changeTitleSpace(ev) {
        setButtons((prevData) => {
            let newData = { ...prevData }
            newData.elements[editor.key].title = ev.target.textContent
            return newData
        })
    }

    function deleteBox(idBox) {

        let Delete = true

        setButtons(prevData => {

            let newData = { ...prevData }

            if (Delete) {
                Delete = false
                newData.elements.splice(idBox, 1);
            }


            return newData
        })
    }

    function selectPhoto() {
        document.querySelector("input[name='photo']").click()
    }

    function changePhoto(ev) {
        let file = ev.target.files[0]


        if (file) {
            if (file?.type.indexOf("image") >= 0) {
                setPhotoUpload(file)
            } else {
                toast.error("El archivo no es compatible")
            }
        }
    }

    function uploadPhoto() {
        setPendingPhoto(true);

        if (photoUpload) {
            let formData = new FormData();
            formData.append("id_company", UserInfo?.company?.id_company)
            formData.append("file", photoUpload)

            axios.post(API_URL + "/api/upload/fileqr", formData, { withCredentials: true })
                .then((response) => { return response.data })
                .then((data) => {
                    setPendingPhoto(false)
                    if (data.status) {
                        setButtons(prevData => {
                            let newData = { ...prevData }
                            newData.header.logo = data.download;
                            return newData
                        })

                        deletePhoto()
                        setModalPhoto(false)
                        toast.success("Nueva imagen!")
                    }
                })
                .catch((err) => {

                    setPendingPhoto(false)

                })

        }

    }

    function deletePhoto() {
        setPhotoUpload({})
        document.querySelector("input[name='photo']").value = ""
    }

    return (
        <>

            <ModalSmall visible={modalPhoto} callback={setModalPhoto} onClick={uploadPhoto} Pending={pendingPhoto}>
                <input type="file" name="photo" onChange={changePhoto} hidden />

                <div className="top">
                    <p>Subir archivo</p>
                    <span>Sube tu imagen que no sea mayor a 5 MB</span>
                </div>

                <div className="select-file">

                    {photoUpload.name ?
                        <div className="file">
                            <div className="right">
                                <button onClick={deletePhoto}><IoTrashOutline /></button>
                            </div>

                            <div className="preview">
                                <div className="fi">
                                    <div className="icon">
                                        <IoDocumentTextOutline />
                                    </div>
                                    <div className="info">
                                        <p>{photoUpload?.name}</p>
                                        <span>{photoUpload?.type}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="drop-file" onClick={selectPhoto}>
                            <i>
                                <IoCloudUploadOutline />
                            </i>
                        </div>
                    }


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

            <WizardUploadQr Visible={importQr} Close={setImportQr} />


            <div className="head-top">
                <div className="right">
                    <button ><IoCloudUploadOutline /> Subir QR</button>
                    <button onClick={(ev) => { setImportQr(true) }}><IoCloudUploadOutline /> Importar QR</button>
                    <button ><IoEyeOutline /> Previsualizar</button>
                    <button className={pending ? 'await' : ''} onClick={save}><IoSendOutline /> Guardar <div className="loading"></div></button>
                </div>
            </div>


            <div className="background2" style={{ backdropFilter: `blur(${buttons?.header?.blur}px)brightness(${buttons?.header?.brightness})`, background: buttons?.header?.background2 }}>
            </div>

            <div className={`${"page buttonsbody buttonsqr editmode " + buttons?.header?.colorBox}`}>
                <div className="center-top">


                    <img className="logo" onClick={editThis} type="logo" src={buttons?.header?.logo ? buttons?.header?.logo : "/img/icons/default-img.jpg"} alt="" />

                    <button className="action" onClick={(ev) => { setModalPhoto(true) }}><FiUpload /> Cambiar Foto</button>
                    <br />


                    <p id="title" onClick={editThis} onInput={changeTitle} suppressContentEditableWarning={true} contentEditable={true}>{"Agregar titulo"}</p>
                    <span id="desc" onClick={editThis} suppressContentEditableWarning={true} contentEditable={true} type="desc">{"Agregar Descripcion"}</span>

                    <br />
                    <br />


                    {buttons.elements.map((element, key) => (
                        <div className="boxqr" key={key}>

                            <div className="top">
                                <div className="top-left">
                                    <p id={key} suppressContentEditableWarning={true} contentEditable={true} type="titlespace" onInput={changeTitleSpace} onClick={(ev) => { editThis(ev) }}>{'Escribe titulo...'}</p>
                                </div>
                                <div className="top-right">
                                    <button className={`${editor?.key == key ? editor?.type == "addqr" ? "select" : "" : ""}`} id={key} type="addqr" onClick={(ev) => { editThis(ev) }}>
                                        <i><IoCheckmark /></i>  Agregar
                                    </button>
                                    <button id={key} onClick={(ev) => { deleteBox(key) }}>Eliminar</button>

                                </div>

                            </div>


                            <Carousel showThumbs={false} showStatus={false} >
                                {element.qrs.map((element, key2) => (


                                    <div className="qr" key={key2}>
                                        <button className="delete" onClick={(ev) => { deleteQr(key, key2) }}><IoTrashOutline /></button>
                                        <img src={element.image} />
                                        <p>{element.title}</p>
                                        <br />
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
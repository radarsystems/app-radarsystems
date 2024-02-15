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
import { useNavigate, useParams } from "react-router-dom";
import WizardUploadQr from "../../Qr/WizardUploadQr";
import WizardQr from "../../Qr/WizardQr";
import { FiUpload } from "react-icons/fi"
import { Icon } from "@iconify/react";


export default function BodyButtonsQr({ addNewQr, setMyQrs, VisibleMenu, type, visibleQr, setVisibleQr, buttons, setBoxType, setButtons, editor, setEditor }) {

    const [visibleTitle, setVisibleTitle] = useState(false)
    const [editId, setEditId] = useState(undefined)
    const [token, setToken] = useState();
    const [pending, setPending] = useState(false)
    const [pendingPhoto, setPendingPhoto] = useState(false)
    const [importQr, setImportQr] = useState(false)
    const [createQr, setCreateQr] = useState(false)
    const [first, setFirst] = useState(true)
    const [modalPhoto, setModalPhoto] = useState(false)
    const [fixRepeat, setFixRepeat] = useState(false)
    const [photoUpload, setPhotoUpload] = useState({})

    const params = useParams()
    const Navigator = useNavigate()


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

            let preview = []
            formData.append("preview", preview);


            axios.post(API_URL + "/api/upload/buttonsqr", formData, { withCredentials: true })
                .then((response) => { return response.data })
                .then((data) => {
                    setPending(false)

                    if (data.id_buttonsqr) {
                        setEditId(Number(data.id_buttonsqr))
                        setToken(data.token)
                        if (!params.id) {
                            Navigator(`/editor/buttonsqr/${Number(data.id_buttonsqr)}`)
                        }
                    }

                    if (data.status) {
                        toast.success("Guardado con exito")
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
        $("#title").val(buttons?.header?.title)
        $("#desc").val(buttons?.header?.desc)

        buttons?.elements?.forEach((element, key) => {
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
                        setToken(data.token)
                    }
                })
        }
    }, [])
    let limitUpdate = 0;

    useEffect(() => {


        if (!fixRepeat) {
            if (
                (type === 'company' && editId === undefined && buttons.elements[0]?.title === 'Business Card') ||
                (type !== 'company')
            ) {
                if (buttons && buttons.elements.length > 0) {
                    updateEditing();
                    setFixRepeat(true);

                }
            }
        }



    }, [editId, type, buttons])

    function changeTitle(ev) {

        setButtons((prevData) => {
            let newData = { ...prevData }
            newData.header.title = ev.target.value
            return newData
        })
    }

    function changeDesc(ev) {

        setButtons((prevData) => {
            let newData = { ...prevData }
            newData.header.desc = ev.target.value
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


    useEffect(() => {
        VisibleMenu()
    }, [modalPhoto, importQr])


    return (
        <>

            <ModalSmall visible={modalPhoto} next={`Agregar`} callback={setModalPhoto} onClick={uploadPhoto} Pending={pendingPhoto}>
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

                            <span className="desc">Has click aca para buscar tu archivo</span>

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

            <WizardUploadQr Visible={importQr} Close={setImportQr} key={importQr ? "x12" : "x23"} />

            <WizardQr callbackUrl={addNewQr} Visible={createQr} Close={setCreateQr} key={createQr ? "s14" : "s15"} />

            <div className="head-top">
                <div className="right">
                    <button onClick={(ev) => { setCreateQr(true) }}><IoCloudUploadOutline /> Crear QR</button>
                    <button onClick={(ev) => { setImportQr(true) }}><IoCloudUploadOutline /> Importar QR</button>
                    <button onClick={(ev) => { }}><IoEyeOutline /> Previsualizar</button>
                    {token ?
                        <button onClick={(ev) => { Navigator(`/buttonsqr/${token}?install=true`) }}><Icon icon="ic:round-install-mobile" /> Instalar</button>
                        : ""}
                    <button className={pending ? 'await' : ''} onClick={save}><IoSendOutline /> Guardar <div className="loading"></div></button>
                </div>
            </div>


            <div className="background2" style={{ backdropFilter: `blur(${buttons?.header?.blur}px)brightness(${buttons?.header?.brightness})`, WebkitBackdropFilter: `blur(${buttons?.header?.blur}px)`, background: buttons?.header?.background2 }}>
            </div>
            <div className="header" style={{ background: buttons?.header?.backgroundHeader }}></div>

            <div className={`${"page buttonsbody buttonsqr editmode " + buttons?.header?.theme}`}>

                <div className="center-top">


                    <img className="logo" onClick={editThis} type="logo" src={buttons?.header?.logo ? buttons?.header?.logo : "/img/icons/default-img.jpg"} alt="" />

                    <button className="action" onClick={(ev) => { setModalPhoto(true) }}><FiUpload /> Agregar Imagen</button>
                    <br />

                    <input id="title" onClick={editThis} onChange={changeTitle} suppressContentEditableWarning={true} contentEditable={true} placeholder="Nombre" />
                    <textarea placeholder="Descripcion" id="desc" onClick={editThis} onChange={changeDesc} suppressContentEditableWarning={true} contentEditable={true} type="desc"></textarea>

                    <br />
                    <br />


                    {buttons.elements.map((element, key) => (
                        <div className="boxqr" key={key}>

                            <div className="top">
                                <div className="top-left">
                                    <p id={key} suppressContentEditableWarning={true} contentEditable={true} type="titlespace" onInput={changeTitleSpace} onClick={(ev) => { editThis(ev) }}>{'Escribe titulo...'}</p>
                                </div>
                                <div className="top-right">
                                    <button className={`${editor?.key == key ? editor?.type == "addqr" ? "select" : "" : ""}`} id={key} type="addqr" onClick={(ev) => { editThis(ev), VisibleMenu('right') }}>
                                        <i><IoCheckmark /></i>  Seleccionar QR
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
                    <br />

                    <div className="actions-bottom">
                        <button className={pending ? 'await' : ''} onClick={save} ><IoAdd /> Guardar <div className="loading"></div></button>
                        <br />
                        <button onClick={(ev) => { Navigator(`/buttonsqr/${token}?install=true`) }} ><Icon icon="ic:round-install-mobile" /> Instalar</button>

                    </div>


                </div>
            </div >
        </>
    )
}
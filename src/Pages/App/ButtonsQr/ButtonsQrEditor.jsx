import { useState } from "react"
import EditorLeftButtonsQr from "../../../Components/App/ButtonsQr/Editor/EditorLeft";
import EditorRightButtonsQr from "../../../Components/App/ButtonsQr/Editor/EditorRight";
import BodyButtonsQr from "../../../Components/App/ButtonsQr/Editor/Body";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import WizardButtonsQr from "../../../Components/App/ButtonsQr/WizardButtonsQr";
import ModalSmall from "../../../Components/App/ModalSmall";
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import axios from "axios";
import { API_URL } from "../../../ExportUrl";
import { LoadPreviewQr } from "../../../Functions/Global";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";

export default function ButtonsQrEditor() {
    const [buttons, setButtons] = useState({ header: { titlegl: "", title: "", desc: "", img: "", background: "", theme: "ligth" }, elements: [] });
    const [editor, setEditor] = useState({ key: "", type: "" })
    const params = useParams()
    const [type, setType] = useState(undefined)
    const [wizardVisible, setWizardVisible] = useState(false)
    const [boxType, setBoxType] = useState()
    const [visibleQr, setVisibleQr] = useState(false)
    const [myQrs, setMyQrs] = useState([])
    const { UserInfo } = useContext(AuthContext)
    const [menuVisible, setMenuVisible] = useState({ left: false, right: false })

    useEffect(() => {
        switch (type) {
            case 'personal':
                setButtons({ header: { titlegl: "", title: "", desc: "", img: "", background: "" }, elements: [] })
                break;

            case 'company':
                setButtons({ header: { titlegl: "", title: "", desc: "", img: "", background: "" }, elements: [{ title: "Business Card", qrs: [] }, { title: "Redes Sociales", qrs: [] }, { title: "Presentaciones", qrs: [] }] })
                break;
        }


    }, [type])

    function VisibleMenu(what) {
        let updatedMenuVisible = { left: false, right: false };

        switch (what) {
            case 'left':
                updatedMenuVisible = { ...updatedMenuVisible, left: true };
                break;

            case 'right':
                updatedMenuVisible = { ...updatedMenuVisible, right: true };
                break;

            default:
                break;
        }

        setMenuVisible(updatedMenuVisible);
    }


    function addNewQr(title, image) {
        let upload = true;
        setVisibleQr(false)
        toast.success("Qr agregado con exito")
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

    function getMyQrs(name) {
        let formData = new FormData()

        formData.append("id_company", UserInfo?.company?.id_company)

        if (name) {
            formData.append("type", name);
        }

        axios.post(API_URL + "/api/get/qrs", formData, { withCredentials: true }).then((response) => { return response.data })
            .then((data) => {
                setMyQrs(data)
            })
    }

    useEffect(() => {
        getMyQrs()
        if (!params.id) {
            setWizardVisible(true)
        }
    }, [])


    useEffect(() => {
        VisibleMenu()
    }, [visibleQr])

    function deleteQr(ev) {

        ev.preventDefault()
        ev.stopPropagation()

        let id = Number(ev.target.dataset.idqr)

        setMyQrs(prevData => {
            let newData = prevData.filter(item => item.id_qr !== id);
            return newData
        })

        toast.success("Qr Eliminado");

        let formData = new FormData()

        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("id_qr", id)

        axios.post(API_URL + "/api/delete/qr", formData, { withCredentials: true })
            .finally(() => {
            })
    }


    return (
        <>

            <ModalSmall visible={visibleQr} maxWidth={"450px"} callback={setVisibleQr}>
                <div className="top">
                    <p>Galeria de Qr's</p>
                    <span>Tu galeria de qrs, donde podras seleccionar que qr quieres integrar</span>
                </div>

                <div className="data row flex control-scroll-qrs">


                    {myQrs.map((element, key) => (
                        <div className="col-md-6" key={key}>
                            <div className="qrs" onClick={(ev) => { addNewQr(element?.title, LoadPreviewQr(element.qr_preview)) }} image={LoadPreviewQr(element.qr_preview)} title={element.title}>
                                <img src={LoadPreviewQr(element.qr_preview)} alt="" />
                                <p>{element.title}</p>
                                <button className="delete" onClick={deleteQr} data-idqr={element.id_qr}><Icon icon="ph:trash-bold" /></button>
                            </div>
                        </div>
                    ))}
                </div>

            </ModalSmall>

            <WizardButtonsQr Visible={wizardVisible} Callback={setWizardVisible} setType={setType} TypeSelect={type} />

            <div className="editor-surveys">

                <button className="fixed-button-right mb" onClick={(ev) => { VisibleMenu('left') }}>
                    <Icon icon="streamline:paint-palette" />
                </button>
                <div className="rows">
                    <div className={`left ${menuVisible.left == true ? 'active' : ''}`}>
                        <EditorLeftButtonsQr VisibleMenu={VisibleMenu} Visible={menuVisible.left} editor={editor} setEditor={setEditor} buttons={buttons} setButtons={setButtons} />
                    </div>
                    <div className="center " style={{ background: buttons?.header?.background }}>
                        <BodyButtonsQr setMyQrs={setMyQrs} addNewQr={addNewQr} VisibleMenu={VisibleMenu} type={type} setVisibleQr={setVisibleQr} visibleQr={visibleQr} boxType={boxType} setBoxType={setBoxType} editor={editor} setEditor={setEditor} buttons={buttons} setButtons={setButtons} />
                    </div>

                    <div className={`right ${menuVisible.right == true ? 'active' : ''}`}>
                        <div className="type-editor">
                            <EditorRightButtonsQr VisibleMenu={VisibleMenu} Visible={menuVisible.right} getMyQrs={getMyQrs} addNewQr={addNewQr} setVisibleQr={setVisibleQr} visibleQr={visibleQr} boxType={boxType} setBoxType={setBoxType} editor={editor} setEditor={setEditor} buttons={buttons} setButtons={setButtons} />
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}
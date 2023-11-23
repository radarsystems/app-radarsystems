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

export default function ButtonsQrEditor() {
    const [buttons, setButtons] = useState({ header: { titlegl: "", title: "", desc: "", img: "", background: "" }, elements: [] });
    const [editor, setEditor] = useState({ key: "", type: "" })
    const params = useParams()
    const [type, setType] = useState(undefined)
    const [wizardVisible, setWizardVisible] = useState(false)
    const [boxType, setBoxType] = useState()
    const [visibleQr, setVisibleQr] = useState(false)
    const [myQrs, setMyQrs] = useState([])
    const { UserInfo } = useContext(AuthContext)

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

    function addNewQr(title, image) {
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
                            </div>
                        </div>
                    ))}
                </div>

            </ModalSmall>

            <WizardButtonsQr Visible={wizardVisible} Callback={setWizardVisible} setType={setType} TypeSelect={type} />

            <div className="editor-surveys">
                <div className="rows">
                    <div className="left">
                        <EditorLeftButtonsQr editor={editor} setEditor={setEditor} buttons={buttons} setButtons={setButtons} />
                    </div>
                    <div className="center " style={{ background: buttons?.header?.background }}>
                        <BodyButtonsQr type={type} setVisibleQr={setVisibleQr} visibleQr={visibleQr} boxType={boxType} setBoxType={setBoxType} editor={editor} setEditor={setEditor} buttons={buttons} setButtons={setButtons} />
                    </div>


                    <div className="right">
                        <div className="type-editor">
                            <EditorRightButtonsQr getMyQrs={getMyQrs} addNewQr={addNewQr} setVisibleQr={setVisibleQr} visibleQr={visibleQr} boxType={boxType} setBoxType={setBoxType} editor={editor} setEditor={setEditor} buttons={buttons} setButtons={setButtons} />
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}
import { useContext, useState } from "react";
import BottomAction from "../../../Components/Wizard/BottomActions";
import { IoChevronBackOutline, IoTrashOutline, IoCloudUpload, IoCloudUploadOutline, IoFileTrayOutline, IoFileTrayFullOutline } from "react-icons/io5"
import $ from "jquery"
import { WizardContext } from "../../../Context/WizardContext";
import { toast } from "react-hot-toast"
import AsignContact from "./AsignContact";

export default function CreateBodyEmail() {

    const { setPosition, wizard, setWizard } = useContext(WizardContext)
    const [action, setAction] = useState({ status: false, preview: false, isHtml: false, file: {}, preview_html: "", affair: "", vars: [] })

    function Next() {
        if (action.affair) {
            if (action.preview_html) {
                setWizard(prevState => ({ ...prevState, process: { ...prevState.process, "body": action.preview_html, "affair": action.affair, "vars": action.vars } }))
                setPosition(position => (position + 1))
                setAction(action => ({ ...action, status: true }))
            } else {
                toast.error("No tienes ningun formato html asignado.")
            }
        } else {
            toast.error("Opps has dejado el asunto vacio.")
        }
    }

    function ObserverFile(ev) {
        let file = ev.target.files[0];


        if (file.type == "text/html") {

            setAction(actions => ({ ...action, file: file }))
            let fileReader = new FileReader();
            fileReader.onload = function (e) {
                setAction(action => ({ ...action, preview_html: e.target.result }))
            };

            fileReader.readAsText(file);
        }
    }

    function GoToPreview() {
        setAction(action => ({ ...action, preview: true }))
    }

    function RemoveFile() {
        setAction(action => ({ ...action, preview_html: "", preview: false, file: {} }))

        document.querySelector(".option.active input[type='file']").value = ""
    }


    function StopPreview() {
        setAction(action => ({ ...action, preview: false }))
    }

    function setAffair(ev) {
        setAction(action => ({ ...action, affair: ev.target.value }))
    }

    function AddVar(ev) {
        let target = $(ev.target)
        let input = target.parents(".form-input").find("input")
        let value = input.val();

        if (action.vars.length < 8) {
            setAction(action => ({ ...action, vars: [...action.vars, value] }))
            input.val("")
        }

    }

    function RemoveTag(ev) {
        let value = ev.target.value;

        setAction(prevState => ({
            ...prevState,
            vars: prevState.vars.filter(item => item !== value)
        }));
    }



    return (
        <>
            <div className="option">

                {action.preview == false ?
                    <>
                        <div className="left">
                            <div className="img-center">
                                <p>Personaliza tu frontend</p>
                                <img src="img/icons/frontend.png" alt="" />
                            </div>
                        </div>

                        <div className="right">
                            <div className="info">
                                <p className="title">Personalizar body</p>
                                <span className="desc">Personaliza tu body para tu envio</span>
                            </div>

                            <div className="form">
                                <div className="form-input">
                                    <label htmlFor="xd">Este campo es especial, dale click al signo de interrogacion para ver sus funcionalidades.</label>
                                    <input type="text" placeholder="Asunto" onChange={setAffair} />
                                </div>

                                <div className="form-input">
                                    <label htmlFor="xd">Estas variables se enviaran en forma organizada, es decir desde el principio al fin. y deben de ser interpretadas en su archivo .html con un $1,$2.</label>

                                    <div className="special">
                                        <input type="text" placeholder="Variables" onChange={setAffair} />
                                        <button className="action" onClick={AddVar}>Agregar</button>
                                    </div>

                                    <div className="tags">
                                        {action.vars.map((element, key) => (
                                            <button onClick={RemoveTag} value={element} key={key}>{element}</button>
                                        ))}

                                    </div>
                                </div>

                                <div className="buttons">
                                    {action.file.type == "text/html" ?
                                        <div className="file-on">
                                            <span className="name-file"><IoFileTrayFullOutline /> {action.file.name}</span>
                                            <button className="remove" onClick={RemoveFile}><IoTrashOutline /></button>
                                        </div>
                                        : <button onClick={(ev) => { document.querySelector(".option.active input[type='file']").click() }}><IoCloudUploadOutline /> Subir Archivo</button>}
                                </div>
                            </div>

                            <div className="buttons">
                                {action.file.type !== "text/html" ? <button>Editor html</button> : <button onClick={GoToPreview}>Vista previa</button>}


                            </div>


                            <BottomAction Next={Next} />
                        </div>
                    </>
                    :
                    <>
                        <div className="preview-html">
                            <div className="actions-preview">
                                <button className="left" onClick={StopPreview}><IoChevronBackOutline /></button>
                                <button className="left" onClick={RemoveFile}><IoTrashOutline /></button>

                                <div className="right-preview">
                                    <button className="upload-new" onClick={(ev) => { document.querySelector(".option.active input[type='file']").click() }}><IoCloudUploadOutline /> Subir nuevo archivo</button>
                                </div>
                            </div>
                            <div className="preview" dangerouslySetInnerHTML={{ __html: action.preview_html }}></div>
                        </div>
                    </>
                }

                <input type="file" accept=".html" onChange={ObserverFile} hidden />

            </div>

            {action.status == true ? <AsignContact /> : ''}
        </>
    )
}
import { IoAdd, IoCogOutline, IoEyeOutline, IoSaveOutline, IoSendOutline, IoTrashOutline } from "react-icons/io5";
import Question from "../Question";
import ModalSmall from "../../ModalSmall"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineMail } from "react-icons/ai"
import { FiLink2 } from "react-icons/fi"
import { ImEmbed2 } from "react-icons/im"
import { API_SHORT } from "../../../../ExportUrl";

export default function SurveysBodyEditor({ json = [], header = {}, setJson, setEdit, edit }) {
    const [modalImage, setModalImage] = useState(false)
    const [modalSend, setModalSend] = useState(false);
    const [contactsSend, setContactsSend] = useState([]);
    const [menuChange, setMenuChange] = useState("email")
    const [stylesMenu, setStylesMenu] = useState({ width: "", left: "" })
    const Navigator = useNavigate()

    function addNew() {
        setJson(prevData => ([...prevData, { quests: [{ title: "", desc: "", type: "radio", questions: [] }] }]))
    }

    function addNewQuest(key) {
        let click = true;
        setJson(prevData => {
            let update = [...prevData]
            let quests = update[key]?.quests

            if (click) {
                update[key].quests = [...quests, { title: "", desc: "", type: "radio", img: "", questions: [] }]
                click = false;
            }


            return update
        })
    }

    function DeletePage(key) {
        setJson(prevData => {
            let update = [...prevData]



            let newUpdate = []
            update.forEach((element, keypage) => {
                if (keypage !== key) {
                    newUpdate.push(element)
                }
            })
            update = newUpdate



            return update

        })
    }

    function setImage() {
        let value = document.querySelector("#image-edit").value

        setJson(prevData => {
            let update = [...prevData]
            update[edit.page].quests[edit.key].img = value
            return update
        })
        setModalImage(false)
    }



    function PreviewNow() {

        window.localStorage.setItem("surveyPreview", JSON.stringify(json))
        window.localStorage.setItem("surveyPreviewHead", JSON.stringify(header))
        window.open("/surveys/preview", "_blank")


    }

    function changeMenu(ev) {
        let value = ev.target.value
        setMenuChange(value)

        setStylesMenu(prevData => ({ ...prevData, width: ev.target.offsetWidth, left: ev.target.offsetLeft }))
    }


    return (<>

        <div className="head-top">
            <div className="right">
                <button onClick={PreviewNow}><IoEyeOutline /> Previsualizar</button>
                <button onClick={(ev) => { setModalSend(true) }}><IoSendOutline /> Enviar</button>
            </div>
        </div>

        <ModalSmall visible={modalSend} minWidth={"35%"} callback={setModalSend}>
            <div className="top">
                <p>Enviar</p>
                <span>Tienes distintas opciones para enviar esta encuesta</span>
            </div>

            {header.short_link == undefined ? <span className="alert-save">Opps! aun no puedes usar esta funcion no has guardado la encuesta.</span> : ''}

            <div className="menu-change">
                <ul>
                    <li><span>Enviar por</span></li>
                    <li><button className={`${menuChange == "email" ? 'active' : ''}`} onClick={changeMenu} value="email"><AiOutlineMail /></button></li>
                    <li><button className={`${menuChange == "link" ? 'active' : ''}`} onClick={changeMenu} value="link"><FiLink2 /></button></li>
                    <li><button className={`${menuChange == "embed" ? 'active' : ''}`} onClick={changeMenu} value="embed"><ImEmbed2 /></button></li>
                    <li><button className={`${menuChange == "settings" ? 'active' : ''}`} onClick={changeMenu} value="settings"><IoCogOutline /></button></li>

                    <div className="hover" style={{ left: stylesMenu.left + "px", width: stylesMenu.width + "px" }}></div>
                </ul>
            </div>



            <div className={`result-menu ${header.short_link == undefined ? 'disabled' : ''} ${menuChange == "email" ? 'show' : ''}`} >
                <div className="form-input">
                    <label>Correo electronico</label>
                    <input type="text" placeholder="contactos" />
                </div>

                <div className="form-input">
                    <label>Asunto</label>
                    <input type="text" placeholder="informacion de contacto" />
                </div>
            </div>

            <div className={`result-menu ${header.short_link == undefined ? 'disabled' : ''} ${menuChange == "link" ? 'show' : ''}`}>
                <div className="form-input">
                    <label>Enlace</label>
                    <input type="text" placeholder="contactos" value={`${API_SHORT}/survey/${header.token}`} disabled />
                </div>
                <div className="form-input">
                    <label htmlFor="">Enlace Corto</label>
                    <input type="text" placeholder="url corta" value={header.short_link} disabled />
                </div>
            </div>

            <div className={`result-menu ${header.short_link == undefined ? 'disabled' : ''} ${menuChange == "embed" ? 'show' : ''}`}>
                <div className="form-input">
                    <label>Incorporar HTML</label>
                    <input type="text" placeholder="contactos" />
                </div>
            </div>


            <div className={`result-menu ${header.short_link == undefined ? 'disabled' : ''} ${menuChange == "settings" ? 'show' : ''}`}>

                <div className="form-input">
                    <label htmlFor="">Condicion de respuesta </label>
                    <select name="" id="">
                        <option value="">Responder varias veces</option>
                        <option value="">Responder solo una vez</option>
                    </select>
                </div>

                <div className="form-input">

                </div>

            </div>

        </ModalSmall>

        <ModalSmall visible={modalImage} callback={setModalImage} onClick={setImage} >
            <div className="top">
                <p>Url de imagen</p>
                <span>Ingresa la url de la imagen que quieres integrar en tu pregunta</span>
            </div>
            <br />
            <div className="form-input">
                <input type="text" id="image-edit" placeholder="https://image.com/image.png" />
            </div>
        </ModalSmall>

        <div className="background2" style={{ backdropFilter: `blur(${header.blur}px)brightness(${header.brightness})`, background: header.background2 }}>
        </div>
        <div className="survey">

            <div className="head">
                <center>
                    {header?.logo?.length ? <img className="logo" src={header?.logo} /> : ''}
                    {header?.title?.length ? <p className="">{header.title}</p> : ''}
                </center>
            </div>

            {json?.map((element, key) => (
                <div className="page" key={key}>

                    <div className="info-page">
                        <p>Pagina {key + 1}</p>
                        <button className="delete" onClick={(ev) => { DeletePage(key) }}><IoTrashOutline /></button>
                    </div>

                    {element.quests?.map((element, keyquests) => (
                        <Question header={header} setModalImage={setModalImage} value={element} page={key} key={keyquests} keyid={keyquests} setEdit={setEdit} setJson={setJson} />
                    ))}

                    <button className="add-new" onClick={(ev) => { addNewQuest(key) }}><IoAdd /> Nueva pregunta</button>
                </div>
            ))}<div className="add-new" onClick={addNew}><IoAdd /> Nueva pagina</div>

        </div>


    </>)
}
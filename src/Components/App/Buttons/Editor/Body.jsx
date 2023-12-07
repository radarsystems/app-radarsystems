import { useContext, useEffect } from "react";
import { IoAdd, IoEyeOutline, IoLogoDiscord, IoLogoFacebook, IoLogoInstagram, IoLogoLinkedin, IoLogoTiktok, IoLogoTwitter, IoLogoWhatsapp, IoMailOpenOutline, IoSendOutline, IoTrashOutline } from "react-icons/io5";

import $ from "jquery"
import ModalSmall from "../../ModalSmall";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BsSpotify, BsTelegram } from "react-icons/bs"
import html2canvas from "html2canvas";
import { AuthContext } from "../../../../Context/AuthContext";
import axios from "axios";
import { API_URL } from "../../../../ExportUrl";
import { useParams } from "react-router-dom";

export default function BodyButtonsEditor({ buttons, setButtons, editor, setEditor }) {

    const [visibleModal, setVisibleModal] = useState(false)
    const [visibleTitle, setVisibleTitle] = useState(false)
    const [pending, setPending] = useState(false)
    const [editId, setEditId] = useState(undefined)
    const { UserInfo } = useContext(AuthContext)
    const params = useParams()



    function addNewButton() {
        setButtons((prevData) => ({
            ...prevData,
            buttons: prevData.buttons.concat({})
        }));
    }

    function editThis(ev) {
        ev.preventDefault()
        ev.stopPropagation()



        let target = $(ev.target)
        $(".page.buttonsbody .active").removeClass("active")
        target.addClass("active")


        switch (target.attr("type")) {
            case 'buttons':
                var key = target.attr("id")
                setEditor({ type: "button", key })
                break;

            case 'rs':
                var key = target.attr("id")
                setEditor({ type: "rs", key })
                break;

            default:
                setEditor({ type: target.attr("type") })
                break;
        }

        return false
    }

    function deleteButton(key) {

        setButtons((prevData) => {
            const newData = { ...prevData };

            // Supongamos que 'key' es el índice del elemento que deseas eliminar
            newData.buttons = newData.buttons.filter((element, id) => id !== key);
            setEditor({ type: "", key: "" })
            return newData;
        });

    }

    function addNewRs() {

        let select = document.querySelector("#select-rs").value
        let url = document.querySelector("#input-rs").value

        if (buttons?.rs.length <= 3) {
            setButtons(prevButtons => {
                // Crea una copia del array 'rs'
                const newRs = [...prevButtons.rs];

                // Agrega el nuevo elemento al array
                newRs.push({ type: select, url: url });

                // Crea una nueva versión del estado con el array 'rs' actualizado
                const newButtons = { ...prevButtons, rs: newRs };

                return newButtons;
            });

        } else {
            toast.error("Opps ya has agregado muchas redes sociales")
        }
    }


    async function Save() {
        if (buttons.header?.titlegl?.length >= 1) {

            setPending(true)
            let formData = new FormData();

            formData.append("json", JSON.stringify(buttons))

            if (editId == undefined) {
                formData.append("title", buttons.header.titlegl)
            } else {
                formData.append("id_buttons", editId);
            }

            formData.append("id_company", UserInfo?.company?.id_company)

            let preview = await html2canvas(document.querySelector(".page .center"), { allowTaint: false, useCORS: true }).then((response) => {
                let url = response.toDataURL()
                return url
            })

            formData.append("preview", preview);

            axios.post(API_URL + "/api/upload/buttons", formData, { withCredentials: true })
                .then((response) => { return response.data })
                .then((data) => {
                    setPending(false)

                    if (data.id_buttons) {
                        setEditId(data.id_buttons)
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

    useEffect(() => {
        if (params.id) {
            let formData = new FormData()
            formData.append("id_buttons", params.id)
            formData.append("id_company", UserInfo?.company?.id_company);

            axios.post(API_URL + "/api/get/editbuttons", formData, { withCredentials: true })
                .then((response) => { return response.data })
                .then((data) => {
                    if (data.id_buttons) {
                        setButtons(JSON.parse(data.json))
                        setEditId(data.id_buttons)
                    }

                })
        }
    }, [])

    return (
        <>


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

            <ModalSmall visible={visibleModal} callback={setVisibleModal} onClick={addNewRs}>


                <div className="top">
                    <p>Redes Sociales</p>
                    <span>Selecciona que red social quieres agregar</span>
                    <div className="form-input">
                        <br />
                        <input type="url" placeholder="Enlace (URL)" id="input-rs" />
                        <br />
                        <br />
                        <select name="" id="select-rs">
                            <option value="" disabled selected>Seleccionar</option>
                            <option value="fb">Facebook</option>
                            <option value="x">X (Twitter)</option>
                            <option value="in">Instagram</option>
                            <option value="link">Linkedin</option>
                            <option value="disc">Discord</option>
                            <option value="tik">TikTok</option>
                            <option value="email">Email</option>
                            <option value="spot">Spotify</option>
                            <option value="tele">Telegram</option>
                            <option value="ws">Whatsapp</option>
                        </select>
                        <br />
                    </div>
                </div>
            </ModalSmall>


            <div className="head-top">
                <div className="right">
                    <button ><IoEyeOutline /> Previsualizar</button>
                    <button className={pending ? 'await' : ''} onClick={Save}><IoSendOutline /> Guardar <div className="loading"></div></button>
                </div>
            </div>

            <div className="background2" style={{ backdropFilter: `blur(${buttons?.header?.blur}px)brightness(${buttons?.header?.brightness})`, background: buttons?.header?.background2 }}>
            </div>

            <div className={`${"page buttonsbody " + buttons?.header?.colorBox}`}>

                <div className="center-top">
                    <img className="logo" onClick={editThis} type="logo" src={buttons?.header?.logo ? buttons?.header?.logo : "/img/icons/default-img.jpg"} alt="" />
                    <p onClick={editThis} type="title">{buttons?.header?.title ? buttons?.header?.title : "Agregar titulo"}</p>
                    <span onClick={editThis} type="desc">{buttons?.header?.desc ? buttons?.header?.desc : "Agregar Descripcion"}</span>
                </div>


                <div className="buttons">
                    {buttons?.buttons?.map((element, key) => (
                        <div key={key}>
                            <div className="edit-active">
                                <button onClick={(ev) => { deleteButton(key) }}><IoTrashOutline /></button>
                            </div>
                            <a onClick={editThis} style={{ borderRadius: buttons?.header?.radius + "px" }} key={key} type="buttons" id={key} href={element.url} > {element?.name ? element?.name : 'Elegir nombre...'}</a>
                        </div>
                    ))}
                </div >

                <div className="rs">
                    {buttons?.rs?.map((element, key) => (
                        <div className="r" key={key}>

                            <a href="" onClick={editThis} id={key} type="rs">
                                {
                                    element.type == "in" ? <IoLogoInstagram /> : ''
                                }
                                {
                                    element.type == "tik" ? <IoLogoTiktok /> : ''
                                }
                                {
                                    element.type == "disc" ? <IoLogoDiscord /> : ''
                                }
                                {
                                    element.type == "spot" ? <BsSpotify /> : ''
                                }

                                {
                                    element.type == "tele" ? <BsTelegram /> : ''
                                }

                                {
                                    element.type == "ws" ? <IoLogoWhatsapp /> : ''
                                }

                                {
                                    element.type == "email" ? <IoMailOpenOutline /> : ''
                                }

                                {
                                    element.type == "fb" ? <IoLogoFacebook /> : ''
                                }

                                {
                                    element.type == "x" ? <IoLogoTwitter /> : ''
                                }

                                {
                                    element.type == "link" ? <IoLogoLinkedin /> : ''
                                }
                            </a>

                        </div>
                    ))}
                </div>




                <div className="add-new" onClick={addNewButton} ><IoAdd /> Agregar Boton</div>
                <br />
                <div className="add-new" onClick={(ev) => { setVisibleModal(true) }} ><IoAdd /> Agregar Red Social</div>

            </div >
        </>
    )
}
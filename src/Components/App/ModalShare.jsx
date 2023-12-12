import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

export default function ModalShare({ Visible, CallbackVisible }) {

    const Navigator = useNavigate()

    let options = {
        facebook: "https://www.facebook.com/sharer.php?u=" + window.location.href,
        whatsapp: "https://api.whatsapp.com/send/?text=" + "Mira esta nueva botonera de enlace " + window.location.href,
        linkedin: "https://www.linkedin.com/sharing/share-offsite/?url=" + window.location.href,
        messenger: "https://www.messenger.com/new",
        email: "mailto:?subject= Check out this Radarsystems! &body= " + "Mira esta nueva botonera de enlace " + window.location.href,
    }

    function lestGo(ev) {
        let data = ev.target.dataset.type

        let goTo = options[data]

        window.open(goTo, "_blank")
    }

    return (
        <>
            <div className="modal-share" style={{ display: `${Visible ? 'flex' : "none"}` }}>
                <div className="body">
                    <div className="bk">
                        <div className="top">
                            <p>Compartir desde Radarsystems</p>

                            <button onClick={(ev) => { CallbackVisible(false) }} className="closed"><Icon icon="carbon:close-large" /></button>
                        </div>

                        <div className="buttons">
                            <button onClick={lestGo} data-type="facebook"><i className="left"><Icon icon="logos:facebook" /></i > Compartir en Facebook <i className="right"><Icon icon="uiw:right" /></i></button>
                            <button onClick={lestGo} data-type="tiktok"><i className="left"><Icon icon="logos:tiktok-icon" /></i> Compartir en Tiktok <i className="right"><Icon icon="uiw:right" /></i></button>
                            <button onClick={lestGo} data-type="linkedin"><i className="left"><Icon icon="logos:linkedin-icon" /></i > Compartir en Linkedln <i className="right"><Icon icon="uiw:right" /></i></button>
                            <button onClick={lestGo} data-type="whatsapp"><i className="left"><Icon icon="logos:whatsapp-icon" /></i> Compartir en Whatsapp <i className="right"><Icon icon="uiw:right" /></i></button>
                            <button onClick={lestGo} data-type="messenger"><i className="left"><Icon icon="logos:messenger" /></i> Compartir en Messenger <i className="right"><Icon icon="uiw:right" /></i></button>
                        </div>

                        <div className="url">
                            <span>{window.location.href}</span>
                        </div>

                        <div className="register">
                            <p>Create your own Linktree</p>
                            <span>The only link in bio trusted by 35M+ people.</span>

                            <div className="actions">
                                <button onClick={(ev) => { Navigator("/register") }}>Sign up free</button>
                                <button onClick={(ev) => { Navigator("/auth") }}>Find out more</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}
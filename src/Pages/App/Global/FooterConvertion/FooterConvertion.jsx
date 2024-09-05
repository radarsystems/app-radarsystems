
import { Icon } from "@iconify/react/dist/iconify.js"
import "./FooterConvertion.css"
import { useState } from "react"
import { DownloadContacts } from "./Functions/Functions"
import { Link } from "react-router-dom"

export default function FooterConvertion({ type = "lists,campaigns", id_company, id_list = null, id_campaign = null }) {
    const [modalDownloadList, setModalDownloadList] = useState(false)
    const [loading, setLoading] = useState({ downloadContacts: false })


    return (
        <>
            <div className="footer-convertion">
                <div className="title">
                    <p>Acciones Rapidas</p>
                    <span>Elige que quieres hacer de forma rapida y sencilla</span>
                </div>

                <hr />

                <div className="flex" style={{ gap: "10px" }}>
                    {type == "lists" &&
                        <>
                            <Link to={"/contacts/segments/add"}><Icon icon="ph:line-segments" /> Segmentar Lista</Link>
                            <button onClick={(ev) => { DownloadContacts(id_list, id_company, setLoading) }} className={loading.downloadContacts ? 'await' : ''}><Icon icon="material-symbols:download" /> Descargar Contactos <div className="loading"></div></button>
                            <Link to={"/campaigns/add"} className={loading.downloadContacts ? 'await' : ''}><Icon icon="gg:add" /> Crear Campana <div className="loading"></div></Link>
                        </>}
                </div>

            </div>
        </>
    )
}
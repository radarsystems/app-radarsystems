import { IoArrowBackOutline } from "react-icons/io5"
import { useNavigate } from "react-router-dom"

export default function MySegments() {

    const Navigator = useNavigate()

    return (
        <>
            <div className="page-info">
                <div className="">
                    <p className="title">Mis Segmentos</p>
                    <span>Esta es tu lista de contactos, puedes revisarlo y exportarlos</span>
                </div>

                <div className="right">
                    <button className="add" onClick={(ev) => { "" }}>Crear nuevo segmento</button>
                </div>
            </div>
        </>
    )
}
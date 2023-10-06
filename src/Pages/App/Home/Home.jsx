import { useNavigate } from "react-router-dom"

export default function Home() {

    const Navigator = useNavigate()

    return (
        <>
            <div className="page-info">
                <div className="">
                    <p className="title">Mi Home</p>
                    <span>Bienvenido a RadarSystems aca podras ver todas tus estadisticas y estados de tu cuenta</span>
                </div>
            </div>
        </>
    )
}
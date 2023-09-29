import { useParams } from "react-router-dom"

export default function ButtonsStats() {

    const params = useParams()

    return (
        <>
            <div className="page-info">
                <div className="">
                    <p className="title">Botonera: {params.id}</p>
                    <span>Estas son las estadisticas de tu encuesta</span>
                </div>
            </div>


            <div className="row">
                <div className="col-md-6">
                    lorem
                </div>

                <div className="col-md-6">
                    lorem
                </div>
            </div>
        </>
    )
}
import { Link, useParams } from "react-router-dom"

export default function TopMenuSurvey() {
    const params = useParams()
    return (<>

        <div className="menu-top">
            <ul>
                <li>
                    <Link to={`/stats/survey/${params.id}`}>Estadisticas</Link>
                </li>

                <li>
                    <Link to={`/stats/survey/${params.id}/detail`}>Detalles de respuestas</Link>
                </li>

                <li>
                    <Link to={`/stats/survey/${params.id}/response`}>Respuestas</Link>
                </li>
            </ul>
        </div>
    </>)
}
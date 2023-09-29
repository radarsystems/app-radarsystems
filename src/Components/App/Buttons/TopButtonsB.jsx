import { useParams } from "react-router-dom"

export default function TopButtonsB() {

    const params = useParams();
    return (<>
        <div className="menu-top">
            <ul>
                <li>
                    <Link to={`/stats/buttons/${params.id}`}>Visitas</Link>
                </li>

                <li>
                    <Link to={`/stats/buttons/${params.id}/detail`}>Clicks</Link>
                </li>

                <li>
                    <Link to={`/stats/buttons/${params.id}/response`}>Respuestas</Link>
                </li>
            </ul>
        </div>
    </>)
}
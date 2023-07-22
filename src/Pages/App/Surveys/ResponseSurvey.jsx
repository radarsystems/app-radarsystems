import { useEffect } from "react";
import TopMenuSurvey from "../../../Components/App/Surveys/TopMenuSurvey";
import axios from "axios";
import { API_URL } from "../../../ExportUrl";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { useState } from "react";

export default function ResponseSurvey() {
    let params = useParams()
    const [response, setResponse] = useState([]);
    const [jsonResponse, setJson] = useState([]);
    const [loading, setLoading] = useState(false);

    const { UserInfo } = useContext(AuthContext)

    function LoadResponse() {

        let formData = new FormData()
        formData.append("id_survey", params.id)
        formData.append("id_company", UserInfo?.company?.id_company)

        axios.post(API_URL + "/api/get/responsesurvey", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                if (data.length) {
                    setResponse(data)
                    data.forEach((value, index) => {
                        setJson(prevData => ([...prevData, JSON.parse(value.json_response)]))
                    })
                }
            })
    }

    useEffect(() => {
        setLoading(true)
        if (loading) {
            LoadResponse()
        }

    }, [loading])

    return (
        <>
            <div className="page-info">
                <div className="">
                    <p className="title">Respuestas</p>
                    <span>Ver todas las respuestas hechas en tu encuesta</span>

                </div>

                <div className="right">
                </div>
            </div>

            <TopMenuSurvey />

            <div className="row">

                {jsonResponse.map((item, index) => (
                    <div className="col-6" key={index}>
                        <div className="box box-padding">
                            <div className="stat">

                                <div className="top">
                                    <div className="top">
                                        <p>Respuesta #{index + 1}</p>
                                    </div>
                                </div>
                                <div className="response">
                                    {Object.entries(item).map(([name, value]) => (
                                        <div key={name}>
                                            <span>{name}: {value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}




            </div>


        </>
    )
}


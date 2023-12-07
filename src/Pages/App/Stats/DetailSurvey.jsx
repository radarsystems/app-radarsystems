import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../../ExportUrl";
import { useContext, useEffect } from "react";
import { useState } from "react";
import Chart from "react-apexcharts"
import { IoCloseOutline } from "react-icons/io5";
import TopMenuSurvey from "../../../Components/App/Surveys/TopMenuSurvey";
import { AuthContext } from "../../../Context/AuthContext";


export default function DetailSurvey() {

    const params = useParams()
    const Navigator = useNavigate()
    const { UserInfo } = useContext(AuthContext)

    const [survey, setSurvey] = useState([]);
    const [modal, setModal] = useState(false)
    const [charts, setCharts] = useState({
        series: [{
            name: "Respuestas",
            data: []
        }],
        chart: {
            type: 'area',
            height: 350,
            stacked: true
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: true,
            }
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: [],
        }
    })

    const [donut, setDonut] = useState({
        series: [],
        theme: {
            palette: "palette3",
        },

        labels: [],
        chart: {
            type: 'donut'
        }
    })

    const loadSurvey = () => {
        let formData = new FormData()

        formData.append("key", params.id)
        axios.post(API_URL + "/api/get/survey", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setSurvey(JSON.parse(data.json))
                AnalizeResponse(data)
            })
    }

    function AnalizeResponse(data) {
        let json = JSON.parse(data.json)
        let updatedXaxis = []
        let updateResponse = []
        let labelDonut = []
        let seriesDonut = []

        json.map((page, pagekey) => {
            page.quests.map((quests, key) => {
                if (quests.type == "radio") {


                    quests.questions.map((question, keyquestion) => {

                        updatedXaxis.push(`${question.title} (${pagekey + 1})`)
                        updateResponse.push(question.response);

                        labelDonut.push(`${quests.title} - ${question.title}`)

                        seriesDonut.push(question.response)

                        setCharts((prevData) => ({
                            ...prevData, xaxis: { ...prevData, categories: updatedXaxis }
                        }));
                        setCharts((prevData) => {
                            prevData.series = [{ name: "Respuesta", data: updateResponse }]
                            return prevData
                        });

                        setDonut((prevData) => {
                            prevData.labels = labelDonut
                            prevData.series = seriesDonut

                            return prevData
                        })





                    })


                }

            })
        })



    }

    function DownloadSource(type) {
        let formData = new FormData()
        formData.append("id_company", UserInfo?.company?.id_company);
        formData.append("id_survey", params.id)
        formData.append("case", type)

        axios.post(API_URL + "/api/get/downloadsurvey", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
            })
    }

    useEffect(() => {
        loadSurvey()
    }, [])

    return (
        <>

            <div className="modal-map" style={{ display: modal ? 'block' : 'none' }}>

                <div className="info">
                    <p>Mapa completo</p>
                    <span>Puedes ver el mapa completamente de las respuestas de los usuarios.</span>

                    <button className="close" onClick={(ev) => { setModal(false) }}><IoCloseOutline /></button>
                </div>
                <div className="map-suv complete">
                    {survey?.map((page, pagekey) =>
                        <div className="pg">
                            <div className="info">
                                <p>Pagina {pagekey + 1}</p>
                            </div>

                            <div className="separate"></div>

                            {page.quests.map((quests, questionskey) =>
                                <div className="quests" key={questionskey}>

                                    <div className="info">
                                        <p>{quests.title}</p>
                                    </div>
                                    <div className="separate"></div>

                                    <div className="questions-type">
                                        {quests.questions.map((question, questionkey) =>
                                            <div className="question">
                                                <div className="separate quest"></div>

                                                <span className="value">
                                                    {question.title}
                                                    {quests.type == "radio" ? <> ({question.response}) </> : ''}

                                                </span>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            )}

                        </div>
                    )}
                </div>
            </div>

            <div className="page-info">
                <div className="">
                    <p className="title">Detalles De Encuesta </p>
                    <span>Estas son los detalles de las respuestas</span>
                </div>


                <div className="right">
                    <button className="go-wizard">Descargar (CSV)</button>
                    <button className="go-wizard" onClick={(ev) => { DownloadSource('json') }}>Descargar (JSON)</button>
                    <button className="go-wizard" onClick={(ev) => { Navigator(`/stats/survey/${params.id}/response`) }}>Respuestas</button>

                </div>
            </div>

            <TopMenuSurvey />

            <div className="row">
                <div className="col-md-12">
                    <div className="box box-padding stat">
                        <div className="top">
                            <p>Estadisticas de respuestas</p>
                            <span>Estadisticas de las respuestas, veras cuantas veces respondieron a algo.</span>
                        </div>
                        <Chart options={charts} series={charts.series} type="bar" height={300} />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="box box-padding stat">
                        <div className="top ">
                            <p>Porcentaje de respuesta</p>
                            <span>Este es el porcentaje de respuesta por cada pregunta.</span>
                        </div>

                        {donut.labels.length ?
                            <Chart options={donut} series={donut.series} type="donut" height={300} />
                            : ''}


                    </div>
                </div>
                <div className="col-md-6">
                    <div className="box box-padding stat">
                        <div className="top ">
                            <p>Mapa de encuesta</p>
                            <span>Este es mapa de tu encuesta, donde veras un mapa sobre la encuesta ejecutada.</span>
                        </div>


                        <div className="map-suv maxheight">
                            {survey?.map((page, pagekey) =>
                                <div className="pg">
                                    <div className="info">
                                        <p>Pagina {pagekey + 1}</p>
                                    </div>

                                    <div className="separate"></div>

                                    {page.quests.map((quests, questionskey) =>
                                        <div className="quests" key={questionskey}>

                                            <div className="info">
                                                <p>{quests.title}</p>
                                            </div>
                                            <div className="separate"></div>

                                            <div className="questions-type">
                                                {quests.questions.map((question, questionkey) =>
                                                    <div className="question">
                                                        <div className="separate quest"></div>

                                                        <span className="value">
                                                            {question.title}
                                                            {quests.type == "radio" ? <> ({question.response}) </> : ''}

                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                        </div>
                                    )}

                                </div>
                            )}
                        </div>

                        <button className="action-complete" onClick={(ev) => { setModal(true) }}>Ver mapa completo</button>

                    </div>
                </div>
            </div>
        </>
    )
}
import { Link, useParams } from "react-router-dom"
import ApexCharts from 'apexcharts'
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../../Context/AuthContext"
import axios from "axios"
import { API_URL } from "../../../ExportUrl"
import Chart from "react-apexcharts"
import { LoadFlagCountry, LoadNameCountry } from "../../../Functions/Global"
import TopMenuSurvey from "../../../Components/App/Surveys/TopMenuSurvey"


export default function StatsSurvey() {
    const { UserInfo } = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const [survey, setSurvey] = useState({})
    const [countrys, setCountry] = useState([])
    const [days, setDays] = useState([]);
    const [daysResponse, setDaysResponse] = useState([])
    const [dataResponse, setData] = useState({})
    const [charts, setCharts] = useState({
        options: {
            chart: {
                id: "basic-bar"
            },
            xaxis: {
                categories: []
            }
        },
        series: [
            {
                name: "series-1",
                data: []
            },
        ]
    })

    const params = useParams()


    function LoadStats() {
        let formData = new FormData()

        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("id_survey", params.id)

        axios.post(API_URL + "/api/get/statsurvey", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setDays(data.days)
                setData(data)
                setDaysResponse(data.daysResponse)
                setCountry(data.countrys)
            })
    }


    useEffect(() => {

        LoadStats()

        setLoading(true)
    }, [loading])

    useEffect(() => {
        setCharts(prevData => ({
            ...prevData, options: {
                ...prevData.options,
                xaxis: {
                    categories: days
                }
            },
            series: [
                {
                    name: "serie 1",
                    data: daysResponse
                }
            ]
        }))
    }, [daysResponse])



    return (
        <>
            <div className="page-info">
                <div className="">
                    <p className="title">Encuesta: {params.id}</p>
                    <span>Estas son las estadisticas de tu encuesta</span>
                </div>
            </div>

            <TopMenuSurvey />

            <div className="body-stats">

                <div className="row">
                    <div className="col-md-12">
                        <div className="stat box box-padding">

                            <div className="top">
                                <p>Respuestas este mes</p>
                            </div>
                            <Chart options={charts.options} series={charts.series} type="area" height={300} />
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="box stat box-padding">
                            <div className="top">
                                <p>Preguntas Totales</p>
                            </div>
                            <div className="resp-number">
                                <p>{dataResponse?.totalQuestions}</p>
                            </div>
                        </div>

                    </div>

                    <div className="col-md-3">
                        <div className="box stat box-padding">
                            <div className="top">
                                <p>Paginas Totales</p>
                            </div>
                            <div className="resp-number">
                                <p>{dataResponse?.pageTotal}</p>
                            </div>
                        </div>

                    </div>

                    <div className="col-md-3">
                        <div className="box stat box-padding">
                            <div className="top">
                                <p>Respuestas Totales</p>
                            </div>

                            <div className="resp-number">
                                <p>{dataResponse.totalResponse}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="box stat box-padding">
                            <div className="top">
                                <p>Visitas</p>
                            </div>

                            <div className="resp-number">
                                <p>100</p>
                            </div>
                        </div>
                    </div>


                    <div className="col-md-6">
                        <div className="box stat box-padding">
                            <div className="top">
                                <p className="title">Tops Paises</p>
                            </div>

                            <div className="result countryr">
                                {countrys.map((element, key) => (
                                    <div className="country" key={key}>
                                        <img src={LoadFlagCountry(element.country)} alt="" />
                                        <p className="">{element.country == "" ? 'Undefined' : LoadNameCountry(String(element.country).toLocaleLowerCase())}</p>
                                        <span>({element.amount})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">

                        <div className="box stat box-padding">
                            <div className="top">
                                <p className="title">Tops Respuestas</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}
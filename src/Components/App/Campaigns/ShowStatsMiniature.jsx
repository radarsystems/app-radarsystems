import axios from "axios"
import { useEffect, useState } from "react"
import { API_URL } from "../../../ExportUrl"
import Chart from "react-apexcharts"


export function ShowStatsMiniature({ idCampaign, idCompany }) {

    const [request, setRequest] = useState(false)

    const [charts, setCharts] = useState({
        series: [{
            name: 'Enviados',
            data: []
        }, {
            name: 'Clicks',
            data: []
        }, {
            name: 'Leidos',
            data: []
        }
            , {
            name: 'Errores',
            data: []
        }],
        chart: {
            height: 350,
            type: 'area'
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {

            categories: []
        },
        tooltip: {
            x: {
                format: 'dd/MM/yy HH:mm'
            },
        }
    })


    function getStats() {

        setRequest(true)
        let formData = new FormData()

        formData.append("id_company", idCompany)
        formData.append("id_campaign", idCampaign)
        formData.append("case", "campaign")

        axios.post(API_URL + "/api/get/stats", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                let days = data.daysResponse.length;

                if (days) {
                    setCharts((prevData) => ({
                        ...prevData,
                        series: [
                            {
                                ...prevData.series[0],
                                data: prevData.series[0].data.concat(data.daysResponse.map((value) => value.send)),
                            },
                            {
                                ...prevData.series[1],
                                data: prevData.series[1].data.concat(data.daysResponse.map((value) => value.clicks)),
                            },
                            {
                                ...prevData.series[2],
                                data: prevData.series[2].data.concat(data.daysResponse.map((value) => value.reads)),
                            },
                            {
                                ...prevData.series[3],
                                data: prevData.series[3].data.concat(data.daysResponse.map((value) => value.errors)),
                            },
                            // Aquí puedes continuar agregando más objetos para cada serie adicional si es necesario.
                        ],
                        xaxis: {
                            ...prevData.xaxis,
                            categories: data.daysTotal,
                        },
                    }));
                }
            })
    }


    useEffect(() => {

        if (!request) {
            getStats()
        }
    }, [])

    return (
        <>

            <div className="box">
                {charts?.series[0]?.data?.length ? <Chart options={charts} series={charts.series} type="area" height={300} />
                    : ''}
            </div>
        </>
    )
}
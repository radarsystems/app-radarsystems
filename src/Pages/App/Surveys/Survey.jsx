import { useState } from "react";
import { useEffect } from "react"
import { useParams } from "react-router-dom";
import "./Surveys.css"
import axios from "axios";
import { API_URL } from "../../../ExportUrl";


export default function ViewSurvey() {
    const params = useParams();
    const [surveyData, setSurveyData] = useState([]);
    const [loading, setLoading] = useState(true)
    const [survey, setSurvey] = useState([])
    const [header, setHeader] = useState();
    const [page, setPage] = useState(0);

    function loadSurvey() {
        let formData = new FormData()
        formData.append("key", params.id)
        axios.post(API_URL + "/api/get/survey", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setLoading(false)
                setSurveyData(data)
            }).catch((err) => {
                setLoading(false)
            })
    }

    function nextPage(ev) {
        ev.preventDefault()
        setPage(prevData => (prevData + 1))
    }

    function prevPage(ev) {
        ev.preventDefault()

        setPage(prevData => (prevData - 1))
    }

    useEffect(() => {
        if (params.id && loading == true) {
            loadSurvey()
        }
    }, [])

    useEffect(() => {
        if (surveyData.header) {
            setHeader(JSON?.parse(surveyData?.header));
            setSurvey(JSON.parse(surveyData.json))
        }
    }, [surveyData])

    function sendForm(ev) {
        ev.preventDefault()

        let form = document.querySelector("#form");
        let formData = new FormData(form)
        formData.append("key", params.id)

        axios.post(API_URL + "/api/upload/responseSurvey", formData, { withCredentials: true })
    }

    return (<>
        {loading ?
            <div className="app">
                <div className="loading-template">
                    <div className="center">
                        <img src="/img/icons/logo.png" alt="" />
                        <p className="await">Cargando encuesta... <div className="loading"></div></p>
                    </div>
                </div>
            </div>
            :
            <div className="survey real" colorBox={header?.colorBox} style={{ background: header?.background }}>

                <div className="background2" style={{ backdropFilter: `blur(${header?.blur}px)brightness(${header?.brightness})` }}>
                </div>

                <div className="margin-survey">
                    <div className="head">
                        <center>
                            {header?.logo?.length ? <img className="logo" src={header?.logo} /> : ''}
                            {header?.title?.length ? <p className="">{header.title}</p> : ''}
                        </center>
                    </div>

                    <form method="POST" encType="multipart/form-data" id="form">
                        {survey.map((pages, key) => (
                            <div className={`page ${key == page ? 'active' : ''}`}>
                                {pages?.quests?.map((quest, idquest) => (
                                    <div className="question" key={idquest} style={{ borderRadius: header?.borderRadius + "px" }}>
                                        <div className="top">
                                            <p>{quest.title}</p>
                                            <span>{quest.desc}</span>
                                        </div>

                                        {quest?.img ? <img className="img-quest" src={quest.img} /> : ''}
                                        {quest?.questions?.map((question, idquestion) => (
                                            <div className="quest" key={idquestion}>
                                                {quest.type == "input" ?
                                                    <>
                                                        <input type="text" name={`${key}-${idquest}-${idquestion}`} placeholder={`${question.title}`} />
                                                    </>
                                                    : ''}
                                                {/* CHECK RADIO 1*/}
                                                {quest.type == "radio" ?
                                                    <div className="radio">
                                                        <input type="radio" name={`${key}-${idquest}`} value={question.title} /> <span>{question.title}</span>
                                                    </div>
                                                    : ''}
                                                {/*CHECK MULTIPLE*/}
                                                {quest.type == "check" ?
                                                    <div className="radio">
                                                        <input type="checkbox" name={`${key}-${idquest}-${idquestion}`} /> <span>{question.title}</span>
                                                    </div>
                                                    : ''}

                                                {/*CHECK LARGE RESPONSE*/}
                                                {quest.type == "input-large" ?
                                                    <>
                                                        <textarea name={`${key}-${idquest}-${idquestion}`} placeholder={question.title} style={{ width: "100%" }}></textarea>
                                                    </>

                                                    : ''}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </form>

                    <div className="buttons-bottom">
                        {
                            page == (survey.length - 1)
                                ?
                                <>
                                    {page ? <button onClick={prevPage}>Volver</button> : ''}
                                    <button onClick={sendForm} className="pending">Terminar <div className="loading"></div></button>
                                </>
                                :
                                <>
                                    {page ? <button onClick={prevPage}>Volver</button> : ''}
                                    <button onClick={nextPage}>Siguiente</button>
                                </>
                        }
                    </div>

                </div>

            </div>

        }



    </>)
}
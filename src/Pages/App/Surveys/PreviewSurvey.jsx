import { useEffect } from "react"
import { useState } from "react"

import "./Surveys.css"

export default function PreviewSurvey() {

    const [survey, setSurvey] = useState([])
    const [pages, setPages] = useState(0)
    const [header, setHeader] = useState({})
    const [pageNow, setPageNow] = useState(0)

    useEffect(() => {
        setSurvey(JSON.parse(window.localStorage.getItem("surveyPreview")))
        setHeader(JSON.parse(window.localStorage.getItem("surveyPreviewHead")))
    }, [])

    useEffect(() => {
        if (survey.length) {
            setPages(survey.length)
        }
    }, [survey])

    function NextPage() {
        setPageNow(prevData => (prevData + 1))
    }

    function PrevPage() {
        setPageNow(prevData => (prevData - 1))
    }

    return (
        <div className="survey real" colorBox={header?.colorBox} style={{ background: header?.background }}>
            <div className="background2" style={{ backdropFilter: `blur(${header.blur}px)brightness(${header.brightness})` }}>
            </div>
            <div className="margin-survey">

                <div className="head">
                    <center>
                        {header?.logo?.length ? <img className="logo" src={header?.logo} /> : ''}
                        {header?.title?.length ? <p className="">{header.title}</p> : ''}
                    </center>
                </div>



                {survey[pageNow]?.quests?.map((quest, idquest) => (
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
                                        <input type="text" disabled placeholder={`${question.title}`} />
                                    </>
                                    : ''}
                                {/* CHECK RADIO 1*/}
                                {quest.type == "radio" ?
                                    <div className="radio">
                                        <input type="radio" name={0} /> <span>{question.title}</span>
                                    </div>
                                    : ''}
                                {/*CHECK MULTIPLE*/}
                                {quest.type == "check" ?
                                    <div className="radio">
                                        <input type="checkbox" name={0} /> <span>{question.title}</span>
                                    </div>
                                    : ''}

                                {/*CHECK LARGE RESPONSE*/}
                                {quest.type == "input-large" ?
                                    <>
                                        <textarea name={0} placeholder={question.title} style={{ width: "100%" }}></textarea>
                                    </>

                                    : ''}
                            </div>
                        ))}
                    </div>
                ))}

                <div className="buttons-bottom">
                    {pageNow == (pages - 1)


                        ?
                        <>
                            {pageNow ? <button onClick={PrevPage}>Volver</button> : ''}
                            <button>Terminar</button>

                        </>
                        : pageNow < (pages - 1) ?
                            <>
                                {pageNow ? <button onClick={PrevPage}>Volver</button> : ''}
                                <button onClick={NextPage}>Siguiente</button>
                            </> : ''}
                </div>
            </div>

        </div>

    )
}
import { useState } from "react"
import SurveysBodyEditor from "../../../Components/App/Surveys/Editor/Body"
import EditorLeft from "../../../Components/App/Surveys/Editor/EditorLeft"
import EditorRight from "../../../Components/App/Surveys/Editor/EditorRight"
import "./Surveys.css"
import { useParams } from "react-router-dom"
import { useEffect } from "react"
import axios from "axios"
import { API_URL } from "../../../ExportUrl"
import { useContext } from "react"
import { AuthContext } from "../../../Context/AuthContext"
import { toast } from "react-hot-toast"

export default function SurveysEditor() {
    const [header, setHeader] = useState({ title: "", logo: "", background: "", blur: "0.5", brightness: "" });
    const [json, setJson] = useState([]);
    const [edit, setEdit] = useState({ type: "", key: "", quest_key: "", page: "" });
    const { UserInfo } = useContext(AuthContext)
    const params = useParams();
    const [loading, setLoading] = useState(true)

    function LoadSurvey() {

        setLoading(true)

        let formData = new FormData()
        formData.append("id_survey", params.idsurvey);
        formData.append("id_company", UserInfo?.company?.id_company)


        axios.post(API_URL + "/api/get/surveys", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setLoading(false)
                if (data.header) {
                    setHeader(JSON.parse(data.header))
                }

                if (data.json) {
                    setJson(JSON.parse(data.json))
                }
            }).catch((err) => {
                setLoading(false)
                toast.error(String(err));
            })
    }

    useEffect(() => {
        if (params.idsurvey) {
            LoadSurvey()
        } else {
            setTimeout(() => {
                setLoading(false)
            }, 1000)
        }
    }, [])

    return (<>

        {loading ?
            <div className="loading-template">
                <div className="center">
                    <img src="/img/icons/logo.png" alt="" />
                    <p className="await">Cargando... <div className="loading"></div></p>
                </div>
            </div>
            : ''}

        <div className="editor-surveys">
            <div className="rows">
                <div className="left">
                    <EditorLeft setHeader={setHeader} header={header} json={json} />
                </div>
                <div className="center" style={{ background: header.background }}>
                    <SurveysBodyEditor json={json} header={header} edit={edit} setJson={setJson} setEdit={setEdit} />
                </div>
                <div className="right">
                    <div className="type-editor">
                        <EditorRight edit={edit} setJson={setJson} json={json} header={header} />
                    </div>
                </div>
            </div>
        </div>
    </>)
}
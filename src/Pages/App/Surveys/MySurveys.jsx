import { useState } from "react";
import { IoArrowBackOutline, IoColorWandOutline, IoDocumentTextOutline, IoStatsChartOutline, IoTrash, IoTrashOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import LoadingCircleApp from "../../../Components/App/LoadingCircle";
import { useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../../ExportUrl";
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { toast } from "react-hot-toast";
import { Time } from "../../../Functions/Global";
import ModalDelete from "../../../Components/App/ModalDelete";
import NotFoundItems from "../../../Components/App/NotFoundItems";

export default function MySurveys() {

    const Navigator = useNavigate()
    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(true)
    const [modalDelete, setModalDelete] = useState({ id_delete: undefined, pending: false })
    const [viewModalDelete, setViewModalDelete] = useState(false)

    const { UserInfo } = useContext(AuthContext)

    function LoadSurveys() {
        setLoading(true)
        let formData = new FormData()
        formData.append("id_company", UserInfo?.company?.id_company)

        axios.post(API_URL + "/api/get/surveys", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setSurveys(data)
                setLoading(false)
            }).catch((err) => {
                setLoading(false)
                toast.error(String(err))
            })
    }

    useEffect(() => {

        if (loading) {
            LoadSurveys()
        }

    }, [])

    function deleteSurvey() {
        setModalDelete(prevData => ({ ...prevData, pending: true }))
        let formData = new FormData();

        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("id_survey", modalDelete.id_delete)

        axios.post(API_URL + "/api/delete/survey", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {

                setViewModalDelete(false)
                if (data.status) {
                    LoadSurveys();
                }
                setModalDelete(prevData => ({ ...prevData, pending: false }))
            }).catch((err) => {
                setModalDelete(prevData => ({ ...prevData, pending: false }))
            })
    }


    return (
        <>

            <ModalDelete visible={viewModalDelete} Pending={modalDelete.pending} onClick={deleteSurvey} callback={setViewModalDelete} />
            <div className="page-info">
                <div className="">
                    <p className="title">Mis encuestas</p>
                    <span>Gestiona tus encuestas rapidamente y optimiza tus estrategias</span>

                </div>

                <div className="right">
                    <button className="add" onClick={(ev) => { Navigator("/surveys/editor") }}>Crear nueva encuesta</button>
                </div>
            </div>

            <div className="row">

                {loading == false ?
                    surveys.map((element, key) => (
                        <div className="col-md-3" key={key}>
                            <div className="box survey-b">

                                <div className="preview" style={{ background: `url(${API_URL}/api/get/previewsurvey?miniature=${element.miniature})` }}>
                                    <div className="right-top">
                                        <button onClick={(ev) => { setViewModalDelete(true); setModalDelete(prevData => ({ ...prevData, id_delete: element.id_survey })) }}><IoTrashOutline /></button>
                                        <button onClick={(ev) => { Navigator("/surveys/editor/" + element.id_survey) }}><IoColorWandOutline /></button>
                                        <button onClick={(ev) => { Navigator(`/stats/survey/${element.id_survey}`) }}><IoDocumentTextOutline /></button>
                                    </div>
                                </div>
                                <div className="top" style={{ padding: "10px" }}>
                                    <p>{element?.header?.title}</p>
                                    <span>Encuesta agregada el: {Time(element.time_add)}</span>
                                </div>
                            </div>
                        </div>
                    ))
                    :
                    <div className="col-md-12">
                        <div className="box box-padding">
                            <LoadingCircleApp />
                        </div>
                    </div>
                }

                {loading == false ? surveys.length == 0 ? <NotFoundItems name={"encuestas"} /> : '' : ''}

            </div>
        </>
    )
}
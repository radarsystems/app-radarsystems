import axios from "axios";
import { useParams } from "react-router-dom"
import { API_URL } from "../../../ExportUrl";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { HistoryBack, unescapeHTML } from "../../../Functions/Global";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function Template() {

    const params = useParams();
    const { UserInfo } = useContext(AuthContext)
    const [html, setHtml] = useState("");

    function getTemplate() {

        axios.get(API_URL + `/api/get/previewtemplate?token=${params.token}`, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setHtml(data)
            })
    }


    useEffect(() => {
        getTemplate();
    }, [])
    return (
        <>
            <div className="preview-html">
                <div className="controls">
                    <div className="left">
                        <button className="btn-action" onClick={(ev) => { HistoryBack() }}><Icon icon="icon-park-outline:return" /></button>
                    </div>

                    <p className="title">Previsualizar HTML</p>
                </div>
                <div className="body" dangerouslySetInnerHTML={{ __html: unescapeHTML(html) }}></div>
            </div>
        </>
    )
}
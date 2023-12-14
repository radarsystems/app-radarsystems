import { useContext, useEffect, useState } from "react";
import WizardContactsList from "../../../Components/App/Contacts/WizardContacts";
import LoadingCircleApp from "../../../Components/App/LoadingCircle";
import NotFoundItems from "../../../Components/App/NotFoundItems";
import axios from "axios";
import { API_URL } from "../../../ExportUrl";
import { AuthContext } from "../../../Context/AuthContext";
import { IoDocumentTextOutline } from "react-icons/io5";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import RequireLists from "../../../Components/App/Lists/RequireLists";

export default function Lists() {

    const [openWizard, setOpenWizard] = useState()
    const [lists, setLists] = useState([])
    const [loading, setLoading] = useState(false)
    const { UserInfo } = useContext(AuthContext)
    const params = useParams()

    const Navigator = useNavigate()
    const location = useLocation()


    function CallbackWizard(value) {
        if (value) {
            setOpenWizard(false)
        }
    }

    function loadLists() {
        let formData = new FormData()
        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("type", params?.type)

        setLoading(true)
        setLists([])

        axios.post(API_URL + "/api/get/list", formData, { withCredentials: true }).then((response) => { return response.data }).then((data) => {
            setLists(data)
            setLoading(false)
        })
    }

    useEffect(() => {
        loadLists()

        if(location.pathname == "/contacts/lists/add"){
            setOpenWizard(true)
        }

    }, [params?.type])




    return (
        <>

            <WizardContactsList Visible={openWizard} Close={setOpenWizard} Callback={CallbackWizard} loadLists={loadLists} />

            <div className="page-info">
                <div className="">
                    <p className="title">Mis Listas</p>
                    <span>Estas son tus listas de contactos, puedes subir contactos rapidamente creando una lista y seleccionando tu archivo csv</span>
                </div>

                <div className="right">
                    <button className="add" onClick={(ev) => { setOpenWizard(true) }}>Crear nueva lista</button>
                </div>
            </div>

            {params.type == undefined ? <div className="row">
                <div className="col-md-3">
                    <div className="box select-list">
                        <div className="top">
                            <img src="/img/icons/email_list.png" alt="" />
                            <span>Listas Correos</span>
                            <button onClick={(ev) => { Navigator("/contacts/lists/em") }}>Ir</button>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="box select-list">
                        <div className="top">
                            <img src="/img/icons/message_list.png" alt="" />
                            <span>Listas Telefonicas</span>
                            <button onClick={(ev) => { Navigator("/contacts/lists/sms") }}>Ir</button>
                        </div>
                    </div>
                </div>
            </div > : <RequireLists lists={lists} type={params?.type} />}






        </>
    )
}
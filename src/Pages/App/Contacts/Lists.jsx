import { useContext, useEffect, useState } from "react";
import WizardContactsList from "../../../Components/App/Contacts/WizardContacts";
import LoadingCircleApp from "../../../Components/App/LoadingCircle";
import NotFoundItems from "../../../Components/App/NotFoundItems";
import axios from "axios";
import { API_URL } from "../../../ExportUrl";
import { AuthContext } from "../../../Context/AuthContext";
import { IoDocumentTextOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function Lists() {

    const [openWizard, setOpenWizard] = useState()
    const [lists, setLists] = useState([])
    const [loading, setLoading] = useState(false)
    const { UserInfo } = useContext(AuthContext)

    const Navigator = useNavigate()


    function CallbackWizard(value) {
        if (value) {
            setOpenWizard(false)
        }
    }

    function loadLists() {
        let formData = new FormData()
        formData.append("id_company", UserInfo?.company?.id_company)

        setLoading(true)
        setLists([])

        axios.post(API_URL + "/api/get/list", formData, { withCredentials: true }).then((response) => { return response.data }).then((data) => {
            setLists(data)
            setLoading(false)
        })
    }

    useEffect(() => {
        loadLists()
    }, [])



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

            <div className="box box-padding row ">

                {lists.map((element, key) => (
                    <div className="item flex">
                        <div className="info">
                            <div className="icon">
                                <img src="/img/icons/lists.png" alt="" />
                            </div>

                            <div className="text">
                                <p className="title">{element.name}</p>
                                <span className="desc">Creado el: 29 de may de 2023</span>
                            </div>

                        </div>

                        <div className="actions">
                            <button onClick={(ev) => { Navigator("/contacts/detail/" + element.id_list) }}><IoDocumentTextOutline /></button>
                        </div>
                    </div>
                ))}

                {loading ? <LoadingCircleApp /> : lists.length == 0 ? <div className="item"><NotFoundItems name={"listas"} /></div> : ''}

            </div>




        </>
    )
}
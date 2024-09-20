import { IoArrowBackOutline } from "react-icons/io5";
import { HistoryBack, limitText } from "../../../Functions/Global";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../ExportUrl";
import { AuthContext } from "../../../Context/AuthContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import ModalDelete from "../../../Components/App/ModalDelete";
import toast from "react-hot-toast";
import LoadingCircleApp from "../../../Components/App/LoadingCircle";
import NotFoundItems from "../../../Components/App/NotFoundItems";

export default function ContactsList() {

    const { UserInfo } = useContext(AuthContext)
    const [dates, setDates] = useState({ contacts: [] })
    const [viewModalD, setViewModalD] = useState(false)
    const [pending, setPending] = useState({ delete: false })
    const [idDelete, setIdDelete] = useState(null)
    const params = useParams()
    const [loading, setLoading] = useState(true)
    const Navigator = useNavigate()

    function getContacts() {
        let formData = new FormData()
        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("id_list", params.id)

        axios.post(API_URL + "/api/get/lists/contacts", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setDates(data)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    function deleteContactFromList() {

        let formData = new FormData()

        if (idDelete) {

            setPending({ ...pending, delete: true })
            formData.append("id_company", UserInfo?.company?.id_company)
            formData.append("id_list", params.id)
            formData.append("id_user", idDelete)

            axios.post(API_URL + "/api/delete/lists/contacts", formData, { withCredentials: true })
                .then((response) => { return response.data })
                .then((data) => {
                    if (data.status) {
                        toast.success("Contacto eliminado de la lista")
                        setViewModalD(false)
                        setDates(prevDates => ({
                            ...prevDates,
                            contacts: prevDates.contacts.filter(user => user.id_user !== idDelete)
                        }));
                    }
                })
                .finally(() => {
                    setIdDelete(null)
                    setPending({ ...pending, delete: false })

                })
        } else {
            toast.error("Error al intentar eliminar")
        }

    }

    function uploadContact() {
        Navigator("/contacts/upload/" + params.id)
    }

    useEffect(() => {
        getContacts()
    }, [])


    return (
        <>


            <ModalDelete Pending={pending?.delete} onClick={deleteContactFromList} visible={viewModalD} callback={setViewModalD} name={"contacto"}>

            </ModalDelete>
            <div className="page-info">
                <div className="">
                    <p className="title">CONTACTOS: <Link to={"/contacts/detail/" + params.id}>{dates?.list?.name}</Link> </p>
                    <span>Ve todos los contactos que estan en esta lista</span>

                </div>

                <div className="right">
                    <button className="go-wizard" onClick={HistoryBack}><IoArrowBackOutline /></button>
                </div>
            </div>


            {loading == false && dates?.contacts?.length <= 0 && <>

                <NotFoundItems name={"contactos"} addNew={true} buttonName={"Contactos"} callback={uploadContact} />
            </>}


            <div className="row">
                {dates?.contacts.map((element, key) => (
                    <div className="col-md-3 page-lists">
                        <div className="box box-padding">
                            <div className="item flex-wrap">
                                <div className="info">
                                    <div className="icon">
                                        <img src="/img/icons/contacts.webp" alt="" />
                                    </div>


                                    <div className="text">
                                        <p className="title" title={element.name}>
                                            {limitText(element.name, 10)}
                                        </p>
                                        <span className="desc"><Icon icon="mdi:email" /> {limitText(element.email, 10)}  </span>
                                        {element.phone && <>
                                            <br />
                                            <span className="desc"><Icon icon="mdi:phone" /> {element.phone}</span>
                                        </>}
                                        <br />
                                    </div>
                                </div>

                                <div className="actions">
                                    <button className="red" onClick={(ev) => { setViewModalD(true); setIdDelete(element.id_user) }}><Icon icon="iconoir:trash" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
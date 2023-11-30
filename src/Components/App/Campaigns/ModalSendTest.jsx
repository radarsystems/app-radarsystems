import axios from "axios"
import { useState } from "react"
import { useEffect } from "react"
import { API_URL } from "../../../ExportUrl"
import { useContext } from "react"
import { AuthContext } from "../../../Context/AuthContext"
import { ConvertCampaignTypeToList } from "../../../Functions/Global"
import toast from "react-hot-toast"
import { IoCloudUpload, IoCloudUploadOutline, IoTrashOutline } from "react-icons/io5"

export default function ModalSendTest({ Close, campaign, setCampaign }) {
    const [lists, setLists] = useState([])
    const { UserInfo } = useContext(AuthContext)

    function searchLists() {

        let formData = new FormData()
        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("type", ConvertCampaignTypeToList(campaign.type_c))


        axios.post(API_URL + "/api/get/list", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                console.log(data)

                setLists(data)
            })
    }

    function selectList(list) {
        if (list.contacts > 1 && list.contacts < 5) {
            setCampaign(prevData => {
                let newData = { ...prevData }

                newData.lists_test = list.id_list

                return newData
            })
        } else {
            toast.error("Tu lista no cumple los requisitos")
        }
    }

    function deleteListSelect() {
        setCampaign({ ...campaign, lists_test: "" })
    }

    useEffect(() => {
        if (!campaign.lists_test) {
            searchLists()
        }
    }, [])

    return (
        <>
            <div className="top">
                <p>Envio de prueba</p>

                {campaign?.lists_test ?
                    <span>envia una prueba a tu lista preferida</span>
                    :
                    <span>Selecciona una lista para usar en este envio de pruebas no puede exceder los 5 usuarios</span>
                }
            </div>

            {campaign?.lists_test ?

                <>
                    <br />
                    <div className="box">

                        <div className="item flex-wrap" >
                            <div className="info">
                                <div className="icon">
                                    <img src="/img/icons/lists.png" alt="" />
                                </div>

                                <div className="text">
                                    <p className="title">Lista {campaign?.lists_test}</p>
                                    <span className="desc">Esta es la lista seleccionada para el envio de pruebas</span>
                                </div>
                            </div>

                            <div className="actions">
                                <button onClick={deleteListSelect}><IoTrashOutline /></button>
                            </div>

                        </div>

                    </div>

                    <div className="actions">
                        <button onClick={(ev) => { Close(false) }}>Cerrar</button>
                        <button>Enviar</button>
                    </div>
                </>
                :
                <div className="data">
                    <div className="row">
                        {lists.map((element, key) => (
                            <div className="col-md-12 page-lists" >
                                <div className="box">
                                    <div className="item flex-wrap select" >
                                        <div className="info">
                                            <div className="icon">
                                                <img src="/img/icons/lists.png" alt="" />
                                            </div>

                                            <div className="text">
                                                <p className="title">{element.name}</p>
                                                <span className="desc">Contactos: {element.contacts}</span>
                                            </div>
                                        </div>

                                        <div className="actions">
                                            <button onClick={(ev) => { selectList(element) }}><IoCloudUploadOutline /></button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            }

        </>
    )
}
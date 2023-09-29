import axios from "axios"
import { useEffect } from "react"
import { API_URL } from "../../../ExportUrl"
import { useState } from "react"
import { useContext } from "react"
import { AuthContext } from "../../../Context/AuthContext"
import MenuContacts from "../../../Components/App/Contacts/MenuContacts"

export default function MyContacts() {

    const [contacts, setContacts] = useState([])

    const { UserInfo } = useContext(AuthContext)

    function Contacts(search, last_id) {

        let formData = new FormData()

        if (search) {

        }

        formData.append("id_company", UserInfo?.company?.id_company)

        axios.post(API_URL + "/api/get/contacts", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setContacts(data.result)
            })

    }


    useEffect(() => {
        Contacts()
    }, [])

    return (
        <>
            <div className="page-info">
                <div className="">
                    <p className="title">Mis Contactos</p>
                    <span>Esta es tu lista de contactos, puedes revisarlo y exportarlos</span>
                </div>
            </div>

            <MenuContacts />

            <div className="box box-padding">


                <table>
                    <tbody>
                        <tr>
                            <td>Email</td>
                            <td>Nombre</td>
                            <td>Apellido</td>
                            <td>Dni</td>
                            <td>Numero</td>
                            <td>Sexo</td>
                            <td>Email Verificado</td>
                            <td>Estatus</td>

                        </tr>

                        {contacts.map((element, key) => (

                            <tr>
                                <td><span>{element.email ? element.email : 'No disponible'}</span></td>
                                <td><span>{element.name ? element.name : 'No disponible'}</span></td>
                                <td><span>{element.lastname ? element.lastname : 'No disponible'}</span></td>

                                <td><span>{element.dni ? element.dni : 'No disponible'}</span></td>

                                <td><span>{element.number ? element.number : 'No disponible'}</span></td>

                                <td><span>{element.sexo ? element.name : 'No disponible'}</span></td>

                                <td><span>{element.email_verified ? element.email_Verified : 'No disponible'}</span></td>

                                <td><span>{element.status ? element.status : 'No disponible'}</span></td>

                            </tr>

                        ))}
                    </tbody>
                </table>


            </div>
        </>
    )
}
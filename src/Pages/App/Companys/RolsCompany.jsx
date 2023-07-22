import { useNavigate } from "react-router-dom";
import CompanyMenuTop from "../../../Components/App/Companys/MenuTop";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { toast } from "react-hot-toast";
import axios from "axios";
import { API_URL } from "../../../ExportUrl";
import LoadingCircleApp from "../../../Components/App/LoadingCircle";
import ModalSmall from "../../../Components/App/ModalSmall";
import { addWait, removeAwait } from "../../../Functions/Global";
import $ from "jquery"
import { IoCheckmark, IoCloseOutline, IoCreateOutline, IoTrash, IoTrashOutline } from "react-icons/io5";
import ModalDelete from "../../../Components/App/ModalDelete";
import NotFoundItems from "../../../Components/App/NotFoundItems";

export default function RolsCompany() {


    const { UserInfo, LoadingAuth } = useContext(AuthContext)
    const [modalAddRol, setModalAddRol] = useState(false)
    const [modalRemoveRol, setModalRemoveRol] = useState(false)
    const [permissions, setPermissions] = useState(["delete", "read", "send", "add"])
    const [editMode, setEditMode] = useState(false)
    let defaultForm = { type_add: "", delete: 0, add: 0, read: 0, send: 0, sadmin: 0 }
    const [formAddRol, setFormAddRol] = useState(defaultForm)
    const [idRolDelete, setIdRolDelete] = useState()
    const [loading, setLoading] = useState(true)
    const Navigator = useNavigate()
    const [roles, setRoles] = useState([])

    async function LoadRoles() {


        let formData = new FormData()
        formData.append('id_company', UserInfo?.company?.id_company)
        setRoles([])
        setLoading(true)

        axios.post(API_URL + "/api/get/roles", formData, { withCredentials: true }).then((response) => { return response.data }).then((data) => {
            setRoles(data)
            setLoading(false)
        })
    }

    useEffect(() => {


        if (!LoadingAuth) {
            if (!UserInfo.company) {
                Navigator("/companys")
                toast.error("Selecciona una empresa ")
            }
        }

        if (loading) {
            LoadRoles()
        }



    }, [LoadingAuth])


    function updateFormAdd(ev) {
        let value = ev.target.value
        if ($(ev.target).is("input[type='checkbox']")) {

            setFormAddRol(prevData => ({ ...prevData, sadmin: 0 }))
            if ($(ev.target).is("input[type='checkbox']:checked")) {
                setFormAddRol(prevData => ({ ...prevData, [ev.target.name]: 1 }))
            } else {
                setFormAddRol(prevData => ({ ...prevData, [ev.target.name]: 0 }))
            }
        } else {
            setFormAddRol(prevData => ({ ...prevData, [ev.target.name]: value }))

            if (value == "sadmin") {
                setFormAddRol(prevData => ({ ...prevData, sadmin: 1 }))
            }
        }

    }

    function addRol(ev) {


        let formData = new FormData()

        if (formAddRol.rol !== undefined && formAddRol.type_add !== undefined) {


            formData.append("sadmin", formAddRol?.sadmin ? formAddRol.sadmin : 0)
            formData.append("delete", formAddRol?.delete ? formAddRol.delete : 0)
            formData.append("read", formAddRol?.read ? formAddRol.read : 0)
            formData.append("add", formAddRol?.add ? formAddRol.add : 0)
            formData.append("send", formAddRol?.send ? formAddRol.send : 0)



            formData.append("rol", formAddRol.rol)
            formData.append("id_company", UserInfo.company.id_company)

            if (!editMode) {
                addWait(ev.target)



                axios.post(API_URL + "/api/upload/rol", formData, { withCredentials: true }).then((response) => { return response.data }).then((data) => {
                    if (data.status) {
                        formData.append("id_rol", data.id_rol)

                        axios.post(API_URL + "/api/update/permissions", formData, { withCredentials: true }).then((response) => { return response.data }).then(async (data) => {
                            if (data.status) {
                                await LoadRoles()
                                setModalAddRol(false)
                                removeAwait(ev.target)
                            }

                            if (data.msg) {
                                toast.error("Opps error al aplicar cambios de permisos");
                                removeAwait(ev.target)
                            }

                        }).catch((err) => {
                            removeAwait(ev.target)

                        })
                    } else {
                        if (data.msg) {
                            toast.error(data.msg)
                        }

                        removeAwait(ev.target)
                    }
                }).catch((err) => {
                    removeAwait(ev.target)
                })
            } else {
                // Modo edicion
                addWait(ev.target)
                formData.append("id_rol", formAddRol?.id_rol)
                axios.post(API_URL + "/api/update/permissions", formData, { withCredentials: true }).then((response) => { return response.data }).then(async (data) => {
                    if (data.status) {
                        await LoadRoles()
                        setModalAddRol(false)
                        removeAwait(ev.target)
                    }

                    if (data.msg) {
                        toast.error("Opps error al aplicar cambios de permisos");
                        removeAwait(ev.target)
                    }

                }).catch((err) => {
                    removeAwait(ev.target)

                })
            }
        }
    }

    function OpenModalRemove(ev) {
        let value = ev.target.value


        if (value) {
            setIdRolDelete(value)
            setModalRemoveRol(true)
        }
    }

    function handleClickDelete(ev) {
        addWait(ev.target)

        let formData = new FormData()

        formData.append("id_company", UserInfo.company.id_company)
        formData.append("id_rol", idRolDelete)


        if (idRolDelete) {
            axios.post(API_URL + "/api/delete/rol", formData, { withCredentials: true }).then((response) => { return response.data }).then((data) => {
                if (data.status) {
                    setModalRemoveRol(false)
                    LoadRoles()
                }

                if (data.msg) {
                    toast.error(data.msg)
                }

                removeAwait(ev.target)
            }).catch((err) => {
                removeAwait(ev.target)
            })
        } else {
            toast.error("No has seleccionado ningun id")
        }

    }

    function OpenEdit(ev) {

        let value = ev.target.value
        setModalAddRol(true)
        setEditMode(true)

        setFormAddRol(prevData => ({ ...prevData, id_rol: roles[value].id_rol, rol: roles[value].rol }))

        setTimeout(() => {
            if (roles[value].permissions.sadmin) {
                setFormAddRol(prevData => ({ ...prevData, type_add: "sadmin" }))
                document.querySelector("select").value = "sadmin"
            } else {
                setFormAddRol(prevData => ({ ...prevData, type_add: "pers" }))
                document.querySelector("select").value = "pers"

                permissions.forEach((element, key) => {
                    let permission = roles[value].permissions[element]

                    if (permission) {
                        document.querySelector(`input[name='${element}']`).click()
                    }
                })
            }
        }, 25)

    }

    return (
        <>

            <ModalDelete visible={modalRemoveRol} callback={setModalRemoveRol} onClick={handleClickDelete} key={modalRemoveRol ? 'opxen' : 'clxose'}></ModalDelete>

            <ModalSmall onClick={addRol} maxWidth={380} visible={modalAddRol} callback={setModalAddRol} next={editMode ? "Actualizar" : 'Guardar'} key={modalAddRol ? 'open' : 'close'}>
                <div className="top">
                    <p>{editMode ? 'Editar rol' : 'Agregar rol'}</p>
                </div>

                <div className="content">
                    {!editMode ?
                        <div className="form-input">
                            <input type="text" placeholder="Nombre de rol" name={"rol"} onChange={updateFormAdd} value={formAddRol?.rol == undefined ? '' : formAddRol?.rol} />
                        </div>
                        :
                        ''
                    }

                    <div className="form-input">
                        <select name="type_add" id="" onChange={updateFormAdd}>
                            <option selected disabled>Seleccionar tipo</option>
                            <option value="pers">Personalizado</option>
                            <option value="sadmin">Super Admin</option>
                        </select>
                    </div>

                    {formAddRol.type_add == "pers" ?
                        <table>
                            <tbody>
                                <tr>
                                    <td>Permisos</td>
                                    <td>Seleccionar</td>
                                </tr>
                                {permissions.map((value) => (
                                    <tr>
                                        <td>
                                            {value}
                                        </td>
                                        <td>
                                            <input type="checkbox" onChange={updateFormAdd} name={value} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        :
                        formAddRol.type_add == "sadmin"
                            ?
                            <div className="ad">
                                <p>Advertencia</p>
                                <span>Al asignar un rol con permisos de super administrador, le daras derecho a hacer las mismas acciones que tu cuenta principal, podra manipular empresas o hacer cosas que solamente tu puedes hacer.</span>
                            </div>
                            :
                            <></>
                    }

                </div>
            </ModalSmall>

            <div className="page-info">
                <div className="">
                    <p className="title">Tus roles</p>
                    <span>Crea y elimina los roles de tu empresa, da permisos a usuarios para que puedan iniciar sesion y manipular tu empresa</span>

                </div>

                <div className="right">
                    <button className="add" onClick={(ev) => { setModalAddRol(true); setFormAddRol(defaultForm); setEditMode(false) }}>Crear nuevo rol</button>
                </div>
            </div>

            <div className="row">
                <div className="col-md-12">

                    <CompanyMenuTop />


                    <div className="box box-padding">
                        {roles.map((element, key) => (
                            <div className="item flex" key={key}>

                                <div className="info">

                                    <div className="text">
                                        <p className="title">{element.rol} {element.permissions.sadmin == true ? <span className="super-adm">ADM</span> : ''} </p>
                                        <span className="desc">Creado el: 29 de may de 2023</span>
                                    </div>

                                </div>
                                <div>
                                    <p>Lectura</p>

                                    <div className="center-roles">
                                        {element?.permissions?.read ? <span className="yes"><IoCheckmark /></span> : element?.permissions?.sadmin == true ? <span className="yes"><IoCheckmark /></span> : <span className="no"><IoCloseOutline /></span>}
                                    </div>
                                </div>

                                <div>
                                    <p>Envio</p>

                                    <div className="center-roles">
                                        {element?.permissions?.send ? <span className="yes"><IoCheckmark /></span> : element?.permissions?.sadmin == true ? <span className="yes"><IoCheckmark /></span> : <span className="no"><IoCloseOutline /></span>}
                                    </div>
                                </div>

                                <div>
                                    <p>Borrar</p>

                                    <div className="center-roles">
                                        {element?.permissions?.delete ? <span className="yes"><IoCheckmark /></span> : element?.permissions?.sadmin == true ? <span className="yes"><IoCheckmark /></span> : <span className="no"><IoCloseOutline /></span>}
                                    </div>
                                </div>
                                <div>
                                    <p>Agregar</p>

                                    <div className="center-roles">
                                        {element?.permissions?.add ? <span className="yes"><IoCheckmark /></span> : element?.permissions?.sadmin == true ? <span className="yes"><IoCheckmark /></span> : <span className="no"><IoCloseOutline /></span>}
                                    </div>
                                </div>

                                <div>
                                    <div className="actions">
                                        <button onClick={OpenEdit} value={key}><IoCreateOutline /></button>
                                        <button onClick={OpenModalRemove} value={element.id_rol}><IoTrashOutline /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading ? <LoadingCircleApp /> : roles.length == 0 ? <NotFoundItems /> : ''}
                    </div>
                </div>
            </div>
        </>
    )
}
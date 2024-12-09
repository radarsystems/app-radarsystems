import { useContext, useEffect, useState } from "react";
import CompanyMenuTop from "../../../Components/App/Companys/MenuTop";
import { AuthContext } from "../../../Context/AuthContext";
import ModalSmall from "../../../Components/App/ModalSmall";
import axios from "axios";
import { API_URL } from "../../../ExportUrl";
import { toast } from "react-hot-toast";
import NotFoundItems from "../../../Components/App/NotFoundItems";
import LoadingCircleApp from "../../../Components/App/LoadingCircle";
import { IoCreateOutline, IoTrashOutline } from "react-icons/io5";
import ModalDelete from "../../../Components/App/ModalDelete";
import { Time } from "../../../Functions/Global"

export default function UsersCompany() {
    const { UserInfo } = useContext(AuthContext)
    const [users, setUsers] = useState([])
    const [modalUser, setModalUser] = useState(false)
    const [createUser, setCreateUser] = useState({ name: "", password: "", email: "", id_rol: "" })
    const [pending, setPending] = useState(false)
    const [rols, setRols] = useState([])
    const [loading, setLoading] = useState(false)
    const [deleteId, setDeleteId] = useState()
    const [modalEdit, setModalEdit] = useState(false)
    const [editUser, setEditUser] = useState({ id_user: "", id_rol: "" });
    const [modalDelete, setModalDelete] = useState(false)

    function setForm(ev) {
        let value = ev.target.value
        let name = ev.target.name

        setCreateUser(prevData => ({ ...prevData, [name]: value }))
    }

    function LoadUsers() {
        setLoading(true)
        let formData = new FormData()
        formData.append("id_company", UserInfo?.company?.id_company)
        axios.post(API_URL + "/api/get/subusers", formData, { withCredentials: true }).then((response) => { return response.data }).then((data) => {
            setLoading(false)

            setUsers(data)
        }).catch((err) => {
            setLoading(false)
        })
    }

    function UploadUser() {

        if (createUser.name && createUser.email && createUser.password && createUser.id_rol) {
            if (createUser.password.length >= 6) {
                let formData = new FormData()
                setPending(true)
                formData.append("name", createUser.name)
                formData.append("email", createUser.email)
                formData.append("password", createUser.password)
                formData.append("id_rol", createUser.id_rol)
                formData.append("id_company", UserInfo.company?.id_company)


                axios.post(API_URL + "/api/upload/subuser", formData, { withCredentials: true }).then((response) => { return response.data }).then((data) => {
                    setPending(false)
                    if (data.status) {
                        setModalUser(false)
                        setUsers([])
                        LoadUsers()
                    } else {
                        toast.error(data.msg)
                    }

                }).catch((err) => {
                    setPending(false)

                })
            } else {
                toast.error("Tu password no es correcta debe de tener 6 o mas caracteres")
            }

        } else {
            toast.error("Opps has dejado campos vacios")
        }

    }

    function OpenEdit(key) {
        setEditUser(prevData => ({ ...prevData, id_user: users[key].id, id_rol: users[key].id_rol, name: users[key].name }))

        setTimeout(() => {
            document.querySelector("select").value = users[key].id_rol;
        }, 20)

        setModalEdit(true)
    }

    function OpenModalRemove(key) {
        let id = users[key].id_admin

        if (id) {
            setDeleteId(id)
            setModalDelete(true)
        }
    }


    useEffect(() => {
        let formData = new FormData()
        formData.append("id_company", UserInfo?.company?.id_company)
        axios.post(API_URL + "/api/get/roles", formData, { withCredentials: true }).then((response) => { return response.data }).then((data) => {
            setRols(data)
        })
        LoadUsers()
    }, [])

    function HandleEditUser() {
        if (editUser.id_rol && editUser.id_user) {
            setPending(true)

            let formData = new FormData()

            formData.append("id_company", UserInfo?.company?.id_company)
            formData.append("id_rol", editUser.id_rol)
            formData.append("id_user", editUser.id_user)

            axios.post(API_URL + "/api/update/subuser", formData, { withCredentials: true }).then((response) => { return response.data }).then((data) => {
                if (data.status) {
                    LoadUsers()
                    setUsers([])
                    toast.success("Has editato el usuario correctamente.")
                    setModalEdit(false)
                }

                setPending(false)
            }).catch((err) => {
                setPending(false)
            })
        }
    }

    function DeleteUser() {
        if (deleteId) {
            setPending(true)
            let formData = new FormData()

            formData.append("id_user", deleteId)
            formData.append("id_company", UserInfo?.company?.id_company)

            axios.post(API_URL + "/api/delete/subuser", formData, { withCredentials: true }).then((response) => { return response.data }).then((data) => {
                if (data.status) {
                    setModalDelete(false)
                    setPending(false)
                    LoadUsers()
                    setUsers([])
                    toast.success("Has borrado el usuario correctamente.")
                }

                if (data.msg) {
                    toast.error(data.msg)
                }

            })
                .finally(() => {
                    setPending(false)
                })
        } else {
            toast.error("Opps no has seleccionado nada")
        }
    }

    return (
        <>

            <ModalDelete visible={modalDelete} callback={setModalDelete} onClick={DeleteUser} Pending={pending} >
            </ModalDelete>

            <ModalSmall visible={modalEdit} callback={setModalEdit} Pending={pending} onClick={HandleEditUser} next={"Editar"}>
                <div className="top">
                    <p>Editar</p>
                </div>

                <div className="form-input">
                    <label>Editar rol del usuario @{editUser.name}</label>
                    <select onChange={(ev) => { setEditUser(prevData => ({ ...prevData, id_rol: ev.target.value })) }} name="" id="">
                        <option disabled selected>Seleccionar Rol</option>
                        {rols.map((element, key) => (
                            <option value={element.id_rol}>{element.rol}</option>
                        ))}
                    </select>
                </div>
            </ModalSmall>

            <ModalSmall visible={modalUser} callback={setModalUser} next={"Agregar"} key={`${modalUser ? 'open' : 'close'}`} onClick={UploadUser} Pending={pending} >
                <div className="top">
                    <p>Agregar</p>

                    <div className="form-input">
                        <input type="text" placeholder="Nombre" name={"name"} onChange={setForm} />
                    </div>

                    <div className="form-input">
                        <input type="text" placeholder="Email" name={"email"} onChange={setForm} />
                    </div>

                    <div className="form-input">
                        <input type="password" placeholder="Contraseña" name={"password"} onChange={setForm} />
                    </div>

                    <div className="form-input">
                        <select name="id_rol" id="" onChange={setForm}>
                            <option value="">Seleccionar Rol</option>
                            {rols.map((element, key) => (
                                <option value={element.id_rol}>{element.rol}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </ModalSmall>


            <div className="page-info">
                <div className="">
                    <p className="title">Tus usuarios</p>
                    <span>Crea y elimina usuarios, estos usuarios son de tu empresa, deben de tener un rol asignado para poder hacer ciertas funciones. Estos usuarios pueden utilizar la api si le das el acceso y podran consumir recursos desde alli.</span>
                </div>

                <div className="right">
                    <button className="add" onClick={(ev) => { setModalUser(true); }}>Crear nuevo usuario</button>
                </div>
            </div>

            <CompanyMenuTop />

            <div className="row">
                <div className="col-md-12">
                    <div className="box box-padding">

                        {users.map((element, key) => (
                            <div className="item flex" key={key}>
                                <div className="info">
                                    <div className="icon">
                                        <img src="/img/icons/default-user.jpg" alt="" />
                                    </div>

                                    <div className="text">
                                        <p className="title">{element.user}</p>
                                        {element.is_owner ?
                                            <span className="desc">Rol - Creador</span>
                                            :
                                            <span className="desc">Rol - {element.rol}</span>

                                        }
                                        <br />
                                        <span className="desc">Creado el: {Time(users.time_add)}</span>
                                    </div>

                                </div>

                                <div>
                                    <div className="actions">
                                        <button className="edit-btn" onClick={(ev) => { OpenEdit(key) }} value={key}><IoCreateOutline /></button>
                                        <button className="remove-btn" onClick={(ev) => { OpenModalRemove(key) }} value={element.id_rol}><IoTrashOutline /></button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {loading == false ? users.length == 0 ? <NotFoundItems name={"usuarios"} /> : '' : <LoadingCircleApp />}
                    </div>
                </div>
            </div>


        </>
    )
}
import { Link, useLocation, useParams } from "react-router-dom";
import CompanyMenuTop from "../../../Components/App/Companys/MenuTop";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../ExportUrl";
import { IoCreateOutline, IoPlay, IoPlayOutline, IoStarOutline, IoTrashOutline } from "react-icons/io5";
import LoadingCircleApp from "../../../Components/App/LoadingCircle";
import ModalSmall from "../../../Components/App/ModalSmall";
import CircleColor from "../../../Components/CircleColor";
import SelectTypeCompany from "../../../Components/SelectTypeCompany";
import $ from "jquery"
import { GetCookie, SetCookie, existsStringInPath, randomId } from "../../../Functions/Global";
import { AuthContext } from "../../../Context/AuthContext";
import { toast } from "react-hot-toast";

export default function MyCompanys() {


    const [companys, setCompanys] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalEditCompany, setModalEditCompany] = useState(false)
    const [modeEdit, setModeEdit] = useState(false)
    const [editCompany, setEditCompany] = useState({})
    const [formCompany, setFormCompany] = useState({ name: "", color: "", type: "" })
    const { setUserInfo, UserInfo } = useContext(AuthContext)
    const [pending, setPending] = useState(false)
    const location = useLocation()


    useEffect(() => {
        if (existsStringInPath("/add")) {
            setModalEditCompany(true)
        }
    }, [location])

    function LoadCompanys() {
        setCompanys([])
        setLoading(true)
        axios.post(API_URL + "/api/get/companys", {}, { withCredentials: true }).then((response) => { return response.data }).then((data) => {
            setLoading(false)
            setCompanys(data)
        })
    }


    useEffect(() => {
        LoadCompanys()
    }, [])

    function setColorEdit() {

    }


    useEffect(() => {

    }, [editCompany])

    function setTypeEdit() {

    }

    function setColor(color) {
        if (modeEdit) {
            setEditCompany(prevData => ({ ...prevData, color: color }))
        } else {
            setFormCompany(prevData => ({ ...prevData, color: color }))
        }
    }

    function SaveEdit(ev) {
        if (modeEdit) {
            let target = $(ev.target)
            target.addClass('await')

            let formData = new FormData()
            formData.append("name", editCompany.name)
            formData.append("color", editCompany.color)
            formData.append("type", editCompany.type)
            formData.append("id_company", editCompany.id_company)

            axios.post(API_URL + "/update/editcompany", formData, { withCredentials: true }).then((response) => { return response.data }).then((data) => {

                if (data.status) {
                    setModalEditCompany(false)
                    toast.success("Has editado correctamente.")
                    LoadCompanys()
                }

                if (data.msg) {
                    toast.error(data.msg)
                }

                target.removeClass('await')
            }).catch((err) => {
                target.removeClass('await')
            })
        } else {
            setPending(true)
            let formData = new FormData()
            formData.append("name", formCompany.name)
            formData.append("color", formCompany.color)
            formData.append("type", formCompany.type)

            axios.post(API_URL + "/api/upload/company", formData, { withCredentials: true }).then((response) => { return response.data }).then((data) => {
                if (data.status) {
                    LoadCompanys()
                    setModalEditCompany(false)
                    toast.success("Has creado tu empresa correctamente.")
                }

                if (data.msg) {
                    toast.error(data.msg)
                }

                setPending(false)

            }).catch((err) => {
                setPending(false)
            })
        }
    }

    useEffect(() => {

        $(`.colors .option-color`).css({ opacity: "0.5" })
        $(`.colors .option-color[value='${editCompany.color}']`).addClass('active').css({ opacity: 1 })

        $(`.form-input input[name='name']`).val(editCompany.name)
    }, [editCompany])

    function OpenEdit(key) {
        setModalEditCompany(true);
        setEditCompany(companys[key]);
    }

    function UseCompany(ev, key) {
        ev.stopPropagation()

        try {
            setUserInfo(prevData => ({ ...prevData, company: companys[key] }))
            document.cookie = `company=${companys[key].id_company}`
            toast.success("Empresa asignada correctamente.")
        } catch (err) {

        }
    }

    function AsignFavorite(ev, key) {
        ev.stopPropagation()
    }

    function updateForm(ev) {

        console.log(modeEdit)
        if (modeEdit) {

        } else {
            setFormCompany(prevData => ({ ...prevData, [ev.target.name]: ev.target.value }))
        }
    }

    return (
        <>

            <ModalSmall onClick={SaveEdit} visible={modalEditCompany} callback={setModalEditCompany} close={(ev) => { setEditCompany({}) }} Pending={pending} next={`${modeEdit ? 'Editar' : 'Agregar'}`}>
                <div className="top">
                    <p>{modeEdit ? 'Editar empresa' : 'Agregar empresa'}</p>
                </div>

                <div className="content">
                    <div className="form-input">
                        <label>Nombre</label>
                        <input name="name" type="text" onChange={updateForm} />
                    </div>

                    <div className="form-input">
                        <label>Tipo</label>
                        <SelectTypeCompany name={"type"} onChange={updateForm} valueDefault={`${modeEdit ? editCompany.type : 'def'}`} callback={setTypeEdit} key={modalEditCompany ? "modal-open" : "modal-closed"} />
                    </div>

                    <div className="form-input">
                        <label>Elige color de empresa</label>
                        <span className="desc">El color te ayudara a identificar tu empresa.</span>
                        <div className="colors" key={modalEditCompany ? 'a' : 'x'}>
                            <CircleColor color={"#2e56ff"} fn={setColor} />
                            <CircleColor color={"#57c583"} fn={setColor} />
                            <CircleColor color={"#3fcae9"} fn={setColor} />
                            <CircleColor color={"#e9d43f"} fn={setColor} />
                            <CircleColor color={"#d77613"} fn={setColor} />
                            <CircleColor color={"#c069cb"} fn={setColor} />
                            <CircleColor color={"#cb6992"} fn={setColor} />
                        </div>

                    </div>
                </div>
            </ModalSmall>


            <div className="page-info">
                <div className="">
                    <p className="title">MIS CUENTAS</p>
                    <span>Crea y administra tus empresas, agrega nuevos encargados u nuevos cargos</span>

                </div>

                <div className="right">
                    <button className="add" onClick={(ev) => { setModalEditCompany(true); setModeEdit(false) }}>Crear nueva empresa</button>
                </div>
            </div>


            <div className="row">
                <div className="col-md-12">

                    <CompanyMenuTop />


                    <div className="box box-padding">

                        {companys.map((element, key) => (
                            <div className="item flex" key={key}>

                                <div className="info">
                                    <div className="icon">
                                        <img src="img/icons/default_profile.png" alt="" />
                                    </div>

                                    <div className="text">
                                        <p className="title">{element.name}</p>
                                        <span className="desc">Creado el: 29 de may de 2023</span>
                                    </div>

                                </div>

                                <div className="actions">
                                    <button onClick={(ev) => { AsignFavorite(ev, key) }}><IoStarOutline /></button>
                                    <button onClick={(ev) => { OpenEdit(key); setModeEdit(true) }}>
                                        <IoCreateOutline />
                                    </button>
                                    <button onClick={(ev) => { UseCompany(ev, key) }}> {UserInfo?.company?.id_company == element.id_company ? <IoPlay /> : <IoPlayOutline />} </button>
                                </div>
                            </div>
                        ))}


                        {loading == true ? <>  <LoadingCircleApp /></> : ''}


                    </div>
                </div>
            </div>
        </>
    )
}
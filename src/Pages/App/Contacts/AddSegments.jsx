import axios from "axios"
import { useContext, useState } from "react"
import { IoCheckmarkOutline } from "react-icons/io5"
import { API_URL } from "../../../ExportUrl"
import { AuthContext } from "../../../Context/AuthContext"

export default function AddSegments() {

    const [skeleton, setSkeleton] = useState({ type: undefined, map: {} })
    const [wheres, setWheres] = useState({})
    const [pending, setPending] = useState(false)
    const [form, setForm] = useState({ name: "", desc: "" })

    const { UserInfo } = useContext(AuthContext)

    function updateValue(ev) {
        let name = ev.target.name
        let value = ev.target.value

        setSkeleton({ ...skeleton, [name]: value })
    }

    function updateMap(ev) {
        let name = ev.target.name
        let value = ev.target.value
        let action = ev.target.getAttribute("action")

        console.log(action)

        switch (action) {
            case 'add':
                setSkeleton((prevSkeleton) => ({
                    ...prevSkeleton,
                    map: {
                        ...prevSkeleton.map,
                        [name]: value,
                    },
                }));
                break;


            case 'push':
                setSkeleton({ ...skeleton, ...skeleton.map, [name]: value })
                break;
        }


    }

    function searchLists() {

        let formData = new FormData()

        formData.append("id_company", UserInfo?.company?.id_company)

        axios.post(API_URL + "/api/get/list", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setWheres((prevData) => {
                    prevData.lists = data
                    return prevData
                })
            })
    }

    function pushWhereLists(ev) {
        ev.preventDefault();

        setSkeleton((prevData) => {
            let newData = { ...prevData };

            if (!newData.map.wheres) {
                newData.map.wheres = [];
            }

            newData.map.wheres.push({ [newData.map.typeWhereContact]: newData.formValue });

            return newData;
        });
    }

    function saveSegment() {
        let formData = new FormData()

        formData.append("json", JSON.stringify(skeleton))
        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("name", form.name)
        formData.append("desc", form.desc)


        axios.post(API_URL + "/api/upload/segments", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                console.log(data)
            })
    }

    function updateForm(ev) {
        let name = ev.target.name
        let value = ev.target.value

        if (name && value) {
            setForm({ ...form, [name]: value })
        }
    }


    return (
        <>
            <div className="page-info">
                <div className="">
                    <p className="title">Mis Segmentos</p>
                    <span>Esta es tu lista de contactos, puedes revisarlo y exportarlos</span>
                </div>

                <div className="right">
                    <button className="go-wizard" >Cancelar Creacion</button>
                </div>
            </div>


            <div className="segments-creator">

                <form id="form-segment">

                    <div className="form-input">
                        <label htmlFor="">Nombre</label>
                        <input type="text" name="name" onChange={updateForm} placeholder="Nombre del segmento" />
                    </div>

                    <div className="form-input">
                        <label htmlFor="">Descripcion</label>
                        <input type="text" name="desc" onChange={updateForm} placeholder="Descripcion del segmento" />
                    </div>
                    <div className="inputs">
                        <select id="" name="type" onChange={updateValue}>
                            <option disabled selected>Selecciona un tipo</option>
                            <option value="lists">Listas</option>
                            <option value="campaings">Campañas</option>
                            <option value="surveys">Encuestas</option>
                        </select>


                        {skeleton.type == "lists" ?
                            <>
                                <select id="" name="type_lists" action="add" onChange={updateMap}>
                                    <option selected disabled>Selecciona...</option>
                                    <option value="all">Todas las listas</option>
                                    <option value="where">Lista Especifica</option>
                                </select>

                                <i>=</i>

                                {skeleton?.map.type_lists == "all" ?
                                    <>
                                        <option value=""></option>
                                    </>
                                    :
                                    skeleton?.map?.type_lists == "where" ?
                                        <>
                                            {searchLists()}


                                            <select name="lists" action="add" id="" onChange={updateMap}>
                                                <option value="" selected disabled>Selecciona la lista...</option>
                                                {wheres?.lists?.map((element, key) => (
                                                    <option value={element.id_list}>{element.name}</option>
                                                ))}
                                            </select>

                                            {skeleton?.map?.lists >= 1 ? (
                                                <div className="multiple">

                                                    <div className="">
                                                        <select name="typeWhereContact" action="add" onChange={updateMap}>
                                                            <option selected disabled>Selecciona una condicion</option>
                                                            <option value="email">Correo</option>
                                                            <option value="name">Nombre</option>
                                                            <option value="lastname">Apellido</option>
                                                            <option value="age">Edad</option>
                                                            <option value="country">Pais</option>
                                                        </select>

                                                        {skeleton?.map?.typeWhereContact == "email" ? (
                                                            <select name="formValue" onChange={updateValue}>
                                                                <option value=".es">.es</option>
                                                                <option value=".com">.com</option>
                                                                <option value=".net">.net</option>
                                                                <option value=".org">.org</option>
                                                                <option value="gmail.com">gmail.com</option>
                                                                <option value="hotmail.com">hotmail.com</option>
                                                                <option value="hotmail.es">hotmail.es</option>
                                                                <option value="outlook.com">outlook.com</option>
                                                                <option value="outlook.es">outlook.es</option>
                                                                <option value="icloud.com">icloud.com</option>


                                                            </select>
                                                        ) : ''}

                                                        {['name', 'lastname', 'age', 'country'].includes(skeleton?.map?.typeWhereContact) && (<>
                                                            <input type="text" name="formValue" onChange={updateValue} placeholder={skeleton?.map?.typeWhereContact} />
                                                        </>)}

                                                        <button className="add-button" onClick={pushWhereLists}><IoCheckmarkOutline /></button>

                                                    </div>

                                                    {skeleton?.map?.wheres?.map((element, key) => (
                                                        <div key={key}>
                                                            {Object.entries(element).map(([key, value]) => (
                                                                <div className="where-contact" key={key}>
                                                                    <p>{key} (Where)</p>
                                                                    <p>{value}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))}





                                                </div>

                                            ) : ''}

                                        </>
                                        : ''
                                }

                                {["name", 'lastname', 'age', 'country', 'state'].includes(skeleton?.type_where_now) && (
                                    <>
                                        <input type="text" placeholder={skeleton?.type_where_now} />
                                        <button><IoCheckmarkOutline /></button>
                                    </>
                                )}


                            </>
                            : ''}



                    </div>
                </form>


                <div className="buttons-right">
                    <button>Cancelar</button>
                    <button className={`save ${pending ? "await" : ""}`} onClick={saveSegment}>Guardar <div className="loading"></div></button>
                </div>
            </div>

        </>
    )
}
import { useEffect, useState } from "react";
import { Time, limitText } from "../../../Functions/Global";
import MenuViewLists from "./MenuViewLists";
import { IoEyeOutline, IoTrashOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import ModalDelete from "../ModalDelete";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function RequireLists({ type, lists }) {
    const [selectMultiple, setSelectMultiple] = useState(false);
    const [selects, setSelects] = useState([]);
    const [modalDelete, setModalDelete] = useState(false)
    const Navigator = useNavigate()

    const handleCheckboxChange = (id) => {
        setSelects((prevSelects) => {
            if (prevSelects.includes(id)) {
                // If the id is already in the selects array, remove it
                return prevSelects.filter((selectedId) => selectedId !== id);
            } else {
                // Otherwise, add the id to the selects array
                return [...prevSelects, id];
            }
        });
    };

    const resetSelection = () => {
        setSelects([]);
        setSelectMultiple(false);
    };

    return (
        <>
            <MenuViewLists functions={{ resetSelection, selects, selectMultiple, setSelectMultiple }} />

            <ModalDelete visible={modalDelete} callback={setModalDelete} />

            <div className="row">
                {lists.map((element, key) => (
                    <div className="col-md-6 page-lists" key={key}>
                        <div className="box box-padding">
                            <div className="item flex-wrap item-list">
                                <div className="info">
                                    <div className="icon">
                                        <img src="/img/icons/lists.png" alt="" />
                                    </div>

                                    <div className="text">
                                        <p className="title" style={{ textTransform: "uppercase", fontWeight: 600 }} title={element.name}>
                                            {limitText(element.name, 15)}

                                        </p>
                                        <span className="desc">Creado el: {Time(element.time_add)}</span>
                                        <br />
                                        <span className="desc">Contactos: {element.contacts}</span>
                                        <br />




                                        {selectMultiple && (
                                            <input
                                                type="checkbox"
                                                onChange={() => handleCheckboxChange(element.id_list)}
                                                checked={selects.includes(element.id_list)}
                                            />
                                        )}

                                        <button onClick={(ev) => { Navigator("/contacts/upload/" + element.id_list) }} className="upload">
                                            <Icon icon="mdi:upload" />
                                        </button>

                                    </div>



                                </div>

                                <div className="actions">
                                    <button className="blue" onClick={(ev) => { Navigator("/contacts/detail/" + element.id_list) }}>
                                        <IoEyeOutline />
                                    </button>
                                    <button className="blue" onClick={(ev) => { Navigator("/contacts/detail/" + element.id_list) }}>
                                        <Icon icon="tdesign:edit" />
                                    </button>
                                    <button className="red" onClick={(ev) => { setModalDelete(true) }}>
                                        <IoTrashOutline />
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

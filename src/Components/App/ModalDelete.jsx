import { useEffect, useState } from "react";
import { randomId } from "../../Functions/Global";
import $ from "jquery"
import { toast } from "react-hot-toast";

export default function ModalDelete({ visible, onClick, callback, Pending }) {
    const [visibleModal, setVisible] = useState(visible == false ? false : true);
    const [modalId, setModalId] = useState(randomId());

    function closeModal(ev) {
        ev.stopPropagation()

        let target = $(ev.target)
        let buttonAwait = target.parents(".actions").find(".done.await")

        if (!buttonAwait.length) {
            $(`#modal-${modalId}`).removeClass('open')
            target.parents(".modal-small").addClass("close")

            setTimeout(() => {
                target.parents(".modal-small").removeClass("close")
                setVisible(false)
                callback(false)
            }, 600)
        } else {
            toast.error("No puedes salir en este momento...")
        }

    }


    useEffect((ev) => {
        if (visible == true) {
            setVisible(true)

            setTimeout(() => {
                $(`#modal-${modalId}`).removeClass('close')
                $(`#modal-${modalId}`).addClass('open')
            }, 25)

        } else {
            $(`#modal-${modalId}`).addClass('close')
            $(`#modal-${modalId}`).removeClass('open')
            close("cerro")
        }
    }, [visible])

    return (
        <>
            <div className="modal-small delete" id={`modal-${modalId}`} style={{ display: visibleModal == true ? 'flex' : 'none' }}>
                <div className="closed"></div>
                <div className="body" >

                    <div className="top">
                        <p>Eliminar</p>
                    </div>

                    <span className="dialog">
                        Estas apunto de eliminar este objeto, estas seguro que quieres eliminarlo?
                    </span>
                    <div className="actions">
                        <button id="close" onClick={closeModal}>{'Cancelar'}</button>
                        <button className={`done ${Pending == true ? 'await' : ''}`} onClick={onClick}>Eliminar <div className="loading"></div></button>
                    </div>
                </div>
            </div>
        </>
    )
}
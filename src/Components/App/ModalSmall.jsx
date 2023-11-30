import { useEffect, useState } from "react";
import $ from "jquery"
import { randomId } from "../../Functions/Global";

export default function ModalSmall({ buttonsActions = true, minWidth, maxWidth, children, width, visible, buttonSave = true, cancel, onClick, next, callback, Pending, close = function () { } }) {

    const [visibleModal, setVisible] = useState(visible == false ? false : visible);
    const [modalId, setModalId] = useState(randomId());

    function closeModal(ev) {
        ev.stopPropagation()

        let target = $(ev.target)
        $(`#modal-${modalId}`).removeClass('open')
        target.parents(".modal-small").addClass("close")

        setTimeout(() => {
            target.parents(".modal-small").removeClass("close")
            setVisible(false)
            callback(false)
        }, 400)
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
            <div className="modal-small" id={`modal-${modalId}`} style={{ display: visibleModal == true ? 'flex' : 'none', overflow: "auto" }}>
                <div className="closed"></div>
                <div className="body" style={{ maxWidth: maxWidth, minWidth: minWidth, width: width }}>
                    {children}

                    {buttonsActions ?
                        <div className="actions">
                            <button id="close" onClick={closeModal}>{cancel == undefined ? 'Cancelar' : cancel}</button>

                            {buttonSave ? <button className={`done ${Pending == true ? ' await' : ''}`} onClick={onClick}>{next == undefined ? 'Guardar' : next} <div className="loading"></div></button> : ''}
                        </div>
                        : ""}

                </div>
            </div>
        </>
    )

}
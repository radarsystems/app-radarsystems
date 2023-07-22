import { useContext, useState } from "react"
import { WizardContext } from "../../../Context/WizardContext"
import BottomAction from "../../../Components/Wizard/BottomActions"
import NewList from "./NewList";
import SelectList from "./SelectList";

export default function SelectContacts() {

    const { Selector, setPosition } = useContext(WizardContext)
    const [action, setAction] = useState();

    function selectTypeContacts(value) {
        setAction(value)
    }

    function Next() {
        if (action == "new" || action == "select") {
            setPosition(position => (position + 1))
        }
    }
    return (<>
        <div className="option ">
            <div className="left">
                <div className="img-center">
                    <p>Elegir lista</p>
                    <img src={"img/icons/wizard-contacts.png"} />
                </div>
            </div>

            <div className="right">
                <div className="info">
                    <p className="title">Elige tu lista</p>
                    <span className="desc">Desde aqui puedes elegir rapidamente una lista de contactos, subirla o subirlos manualmente.</span>
                </div>

                <div className="buttons selector">
                    <button value={"select"} onClick={(ev) => { Selector(ev, selectTypeContacts) }}>Seleccionar de una lista</button>
                    <button value={"new"} onClick={(ev) => { Selector(ev, selectTypeContacts) }}>Crear una nueva lista</button>
                </div>

                <BottomAction Next={Next} />
            </div>
        </div>

        {action == "new" ? <NewList /> : action == "select" ? <SelectList /> : ''}
    </>)
}
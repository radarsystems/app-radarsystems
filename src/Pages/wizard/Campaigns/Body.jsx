import { useContext, useState } from "react";
import BottomAction from "../../../Components/Wizard/BottomActions";
import { WizardContext } from "../../../Context/WizardContext";
import CreateBodyEmail from "./CreateBodyEmail";
import SelectBody from "./SelectBody";

export default function Body() {
    const { Selector, setPosition } = useContext(WizardContext)
    const [body, setBody] = useState();


    function Next() {
        if (body == "new" || body == "select") {
            setPosition(position => (position + 1))
        }
    }

    function SelectBodyType(value) {
        setBody(value)
    }


    return (
        <>
            <div className="option">
                <div className="left">
                    <div className="img-center">
                        <p>Selecciona la plantilla</p>
                        <img src="img/icons/body-html.png" alt="" />
                    </div>
                </div>
                <div className="right">
                    <div className="info">
                        <p className="title">Selecciona tu estructura</p>
                        <span className="desc">Selecciona la estructura de correo que usaras para enviar esta campaign</span>
                    </div>

                    <div className="buttons selector">
                        <button value={"new"} onClick={(ev) => { Selector(ev, SelectBodyType) }}>Crear un body</button>
                        <button value={"select"} onClick={(ev) => { Selector(ev, SelectBodyType) }}>Ya tengo uno</button>
                    </div>

                    <BottomAction Next={Next} />
                </div>
            </div>

            {body == "new" ? <CreateBodyEmail /> : body == "select" ? <SelectBody /> : ''}
        </>
    )
}
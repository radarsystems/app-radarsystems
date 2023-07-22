import { useContext, useState } from "react"
import { WizardContext } from "../../Context/WizardContext"
import { toast } from "react-hot-toast";
import NewCompany from "./Company/NewCompany";
import BottomAction from "../../Components/Wizard/BottomActions";
import UseCompany from "./Company/UseCompany";

export default function Company() {

    const [company, setCompany] = useState({ action: "" });
    const { Selector, Prev, position, setPosition } = useContext(WizardContext)

    function SelectType(value) {
        setCompany({ ...company, action: value })
    }

    function Next() {
        Observer()
    }

    function Observer() {

        let next = false;

        switch (company.action) {
            case 'go':
                next = true
                break;

            case 'new':
                next = true
                break;
        }

        if (next) {
            setPosition(position + 1)
        } else {
            toast.error("No has seleccionado ninguna opcion.")
        }
    }

    return (<>
        <div className="option">
            <div className="left">
                <div className="img-center">
                    <p>Tu empresa</p>
                    <img src={"img/icons/hot-company.png"} />
                </div>
            </div>
            <div className="right">
                <div className="info">
                    <p className="title"> Elige tu empresa</p>
                    <span className="desc">Debes elegir tu empresa para comenzar, o tambien podrias crear una empresa nueva. Estas empresas tendran (estadisticas,contactos,envios) totalmente autonomos.</span>
                </div>

                <div className="form">
                    <div className="buttons selector">
                        <button onClick={(ev) => { Selector(ev, SelectType) }} value={"go"}>Ya tengo una</button>
                        <button onClick={(ev) => { Selector(ev, SelectType) }} value={"new"}>Crear una nueva</button>
                    </div>
                </div>
                <BottomAction Prev={Prev} Next={Next} />
            </div>
        </div>


        {company.action == "new" ? <NewCompany /> : <UseCompany />}
    </>)
}
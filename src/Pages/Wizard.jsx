import { useContext, useEffect, useState } from "react"
import $ from "jquery"
import { IoChevronBackOutline } from "react-icons/io5"
import { toast } from "react-hot-toast";
import Campaigns from "./wizard/Campaings";
import { WizardContext } from "../Context/WizardContext";
import Company from "./wizard/Company";
import VerifiedEmail from "./wizard/VerifiedEmail";
import BottomAction from "../Components/Wizard/BottomActions";
import "../Styles/css/Wizard.css"

export default function Wizard() {

    const { position, setPosition, wizard, setWizard, Selector, Prev } = useContext(WizardContext)

    function Next() {
        Observer()
    }

    function Observer() {
        let next = false;
        switch (position) {
            case 0:
                next = true;
                break;

            case 1:
                if (wizard.type) {

                    switch (wizard.type) {
                        case 'email':
                            if (wizard.company) {
                                next = true;
                            } else {
                                toast.error("No tienes una empresa seleccionada.")
                            }
                            break;

                        case 'sms':
                            if (wizard.company) {
                                next = true;
                            } else {
                                toast.error("No tienes una empresa seleccionada.")
                            }
                            break;

                        default:
                            next = true;
                            break;
                    }

                } else {
                    toast.error("No has seleccionado ninguna opcion")
                }

                break;
        }


        if (next) {
            setPosition(position + 1)

        }
    }

    function setType(value) {
        setWizard({ ...wizard, type: value })
    }

    useEffect(() => {

        $(".wizard .option.active").removeClass("active")
        $(".wizard .option").eq(position).addClass("active");


    }, [position]);


    const loadComponent = {
        email: <Campaigns />,
        sms: <Campaigns />,
        verifiedEmail: <VerifiedEmail />
    }






    return (
        <>
            <div className="wizard">


                <div className="body">

                    {wizard.loading ? <div className="wizard-loading">
                        <div className="center">
                            <img className="logo-center" src="img/icons/logo-l1.png" alt="" />
                            <div className="line"></div>
                        </div>

                    </div> : <></>}

                    <div className="options">
                        <div className="option center active">
                            <div className="center">
                                <img className="logo-center" src="img/icons/logo-l1.png" alt="" />

                                <div className="info">
                                    <p className="title">Welcome to RadarSystems</p>
                                    <span className="desc">Hola este wizard te ayudara a armar tu primera campaign de emails / sms te, te mostraremos paso por paso como hacer lo que necesitas.</span>
                                </div>

                                <div className="form-input">
                                    <select name="" id="">
                                        <option value="" selected disabled>Seleccionar Idioma</option>
                                        <option value="">Espanol</option>
                                        <option value="">Ingles</option>
                                    </select>
                                </div>
                            </div>

                            <div className="buttons-action ">
                                <button className="next" onClick={Next}>Comenzar</button>
                            </div>
                        </div>

                        {/* ELECTOR */}

                        {
                            wizard.company == ""
                                ?
                                <Company />
                                :
                                <div className="option">

                                    <div className="left">
                                        <div className="img-center">
                                            <p>Empezemos ahora</p>
                                            <img src={"img/icons/wizard-help.png"} />
                                        </div>
                                    </div>
                                    <div className="right">
                                        <div className="info">
                                            <p className="title">¿Qué necesitas?</p>
                                            <span>Puedes hacer diferentes acciones en la que podemos ayudarte mediante este wizard. Elige cual es de tu interes, asi podremos ayudarte facilmente.</span>
                                        </div>

                                        <div className="buttons selector">
                                            <button onClick={(ev) => { Selector(ev, setType) }} value="ac">Elegir Empresa</button>
                                            <button onClick={(ev) => { Selector(ev, setType) }} value="email">Campañas de Correos</button>
                                            <button onClick={(ev) => { Selector(ev, setType) }} value="sms">Campañas de Sms</button>
                                            <button className={wizard.tutorial_wizard == true ? 'opacity-tutorial' : ''} onClick={(ev) => { Selector(ev, setType) }} value="vemail">Verificador de Correos</button>
                                            <button className={wizard.tutorial_wizard == true ? 'opacity-tutorial' : ''} onClick={(ev) => { Selector(ev, setType) }} value="ac">Acortador de Url</button>
                                        </div>

                                        <BottomAction Prev={Prev} Next={Next} />
                                    </div>
                                </div>}




                        {loadComponent[wizard.type]}

                    </div>

                </div>
            </div>
        </>
    )
}
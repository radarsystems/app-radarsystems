import { useContext, useEffect, useState } from "react";
import BottomAction from "../../../Components/Wizard/BottomActions";
import { MyCompanys } from "../../../Functions/Global";
import { WizardContext } from "../../../Context/WizardContext";
import LoadingWizard from "../../../Components/Wizard/LoadingWizard";

export default function UseCompany() {
    const { wizard, setWizard, setPosition } = useContext(WizardContext)
    const [Companys, setCompanys] = useState([])
    const [loading, setLoading] = useState(true);

    function Prev() {

    }

    function Next() {

    }

    useEffect(() => {
        (async function () {
            setCompanys(await MyCompanys())
            setLoading(false)
        }())
    }, [])


    useEffect(() => {
        if (wizard.company) {

        }
    }, [wizard])


    function useCompany(ev, id) {
        ev.stopPropagation()
        let company = Companys[id]

        if (company.id_company) {
            setPosition(1)
            setWizard({ ...wizard, company: company })
        }
    }


    return (
        <>
            <div className="option">
                <div className="left">
                    <div className="img-center">
                        <p>Usa tu empresa</p>
                        <img src={"img/icons/hot-company.png"} />
                    </div>
                </div>

                <div className="right">
                    <div className="info">
                        <p className="title">Elige una empresa</p>
                        <span>Elige una de las empresar anteriormente creadas.</span>
                    </div>

                    <div className="companys">
                        {Companys.map((company, key) => (

                            <div className="company" key={key}>
                                <img className="photo-profile" src={"img/icons/default_profile.png"} alt="" />
                                <span className="title">{company.name} <span className="color" style={{ background: company.color }}></span></span>
                                <button className="use" onClick={(ev) => { useCompany(ev, key) }}>Usar</button>
                            </div>

                        ))}

                        <LoadingWizard loading={loading} />
                    </div>

                    <BottomAction Next={Next} />
                </div>
            </div>
        </>
    )
}
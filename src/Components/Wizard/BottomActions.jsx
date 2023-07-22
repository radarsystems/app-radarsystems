import { useContext, useEffect, useState } from "react"
import { WizardContext } from "../../Context/WizardContext"
import { IoChevronDownOutline } from "react-icons/io5"

export default function BottomAction({ Next }) {
    const { setPosition, position } = useContext(WizardContext)
    const { wizard, setWizard } = useContext(WizardContext)

    const [Company, setCompany] = useState({})

    function Prev() {
        setPosition(position - 1)
    }


    useEffect(() => {
        if (wizard.company) {
            setCompany(wizard.company)
        }
    }, [wizard])

    return (
        <>
            <div className="buttons-action ">

                {Company?.name !== undefined ? <>
                    <button className="button-company"><img src="img/icons/default_profile.png" alt="" />{Company.name}</button>
                </> : ''}


                <button className="prev" onClick={Prev}>{"<"}</button>
                <button className="next" onClick={Next}>Siguiente <div className="loading"></div></button>
            </div>
        </>
    )
}
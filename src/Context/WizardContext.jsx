import { createContext, useContext, useEffect, useState } from "react";
import $ from "jquery"
import { AuthContext } from "./AuthContext";
import { InfoCompany } from "../Functions/Global";

export const WizardContext = createContext()



export const WizardProvider = (params) => {

    const [position, setPosition] = useState(0);
    const { Auth, UserInfo } = useContext(AuthContext)
    const [wizard, setWizard] = useState({ "type": "", "company": "", loading: true, process: {} });

    function AwaitButton(target, type) {
        switch (type) {
            case 'active':
                $(target).addClass("await")
                break;

            case 'remove':
                $(target).removeClass("await")
                break;
        }
    }

    function Selector(ev, fn) {
        ev.stopPropagation()
        let action = $(ev.target)

        action.parents(".selector").find(".active").removeClass("active")
        action.addClass("active")

        fn(ev.target.value)
    }


    function SelectorItem(ev, fn) {
        ev.stopPropagation()
        let action = $(ev.target)

        action.parents(".items-result").find(".active").removeClass("active")
        action.addClass("active")
        fn($(ev.target).attr("value"))
    }

    function Prev() {
        setPosition(position - 1)
    }

    useEffect(() => {
        if (Auth) {
            (async function () {

                if (UserInfo.company_default) {
                    let companyInfo = await InfoCompany(UserInfo.company_default);
                    setWizard({ ...wizard, loading: false, company: companyInfo })
                } else {
                    setWizard({ ...wizard, loading: false })

                }
            }())
        }
    }, [Auth])

    useEffect(() => {
        setWizard(wizard => ({ ...wizard, tutorial_wizard: UserInfo.tutorial_wizard }))
    }, [UserInfo])

    return <WizardContext.Provider value={{ Prev, wizard, SelectorItem, AwaitButton, Selector, setWizard, position, setPosition }}  {...params}></WizardContext.Provider>
}
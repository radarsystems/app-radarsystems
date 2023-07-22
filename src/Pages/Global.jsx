import HeaderLeft from "../Components/HeaderLeft";
import { HeaderTop } from "../Components/HeaderTop";
import "../Styles/css/Home.css"

export default function Global({ Element }) {

    return (
        <>
            <div className="app">
                <HeaderLeft />
                <HeaderTop />


                <div className="page">
                    <Element />
                </div>
            </div>
        </>
    )
}
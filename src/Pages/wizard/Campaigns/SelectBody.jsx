import BottomAction from "../../../Components/Wizard/BottomActions";

export default function SelectBody() {

    function Next() {

    }

    return (
        <>
            <div className="option">
                <div className="left">

                </div>

                <div className="right">
                    <div className="info">
                        <p className="title">Hola</p>
                        <span className="desc">hola</span>
                    </div>
                    <BottomAction Next={Next} />
                </div>


            </div>
        </>
    )
}
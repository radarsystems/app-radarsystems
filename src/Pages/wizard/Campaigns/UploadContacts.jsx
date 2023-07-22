import BottomAction from "../../../Components/Wizard/BottomActions";

export default function UploadContacts() {

    function Next() {

    }
    return (
        <>
            <div className="option">
                <div className="left"></div>
                <div className="right">
                    <div className="info">
                        <p className="title">Subir contactos</p>
                        <span className="desc">Sube tus contactos a la lista.</span>
                    </div>

                    <div>

                    </div>

                    <BottomAction Next={Next} />
                </div>
            </div>
        </>
    )
}
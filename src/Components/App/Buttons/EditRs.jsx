import { useEffect } from "react"
import { toast } from "react-hot-toast"

export default function EditRs({ editor, buttons, setButtons, setEditor }) {

    function setNewValue(ev) {
        let value = ev.target.value


        setButtons((prevData) => {
            let newData = { ...prevData }
            newData.rs[editor.key].url = value
            return newData
        })
    }

    function deleteRs(ev) {
        setButtons((prevData) => {

            const newData = { ...prevData };

            newData.rs = newData.rs.filter((element, id) => id !== Number(editor.key));

            setEditor({ type: "", key: "" })
            return newData;
        })
    }

    return (<>
        <div className="option">
            <div className="top">
                <p>Enlace</p>
                <input id="title-edit" onChange={setNewValue} type="text" value={buttons?.rs[editor.key]?.url} placeholder="https://image.com/jfop2.jpg" />
            </div>
        </div>


        <div>
            <button className="delete" onClick={deleteRs}>Eliminar</button>
        </div>
    </>)
}
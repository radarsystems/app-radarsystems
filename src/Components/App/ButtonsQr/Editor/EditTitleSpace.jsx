import { useEffect } from "react"
import $ from "jquery"

export default function EditTitleSpace({ editor, buttons, setButtons }) {


    function changeTitle(ev) {
        setButtons((prevData) => {
            let newData = { ...prevData }
            newData.elements[editor.key].title = ev.target.value
            return newData
        })
    }

    useEffect(() => {
        if (buttons.elements[editor.key].title !== undefined) {
            $("#title-edit").val(buttons.elements[editor.key].title)
        }

 
    }, [editor])

    return (
        <>
            <div className="option">
                <div className="top">
                    <p>Titulo de espacio: #{editor.key + 1}</p>
                    <input onChange={changeTitle} id="title-edit" type="text" placeholder="Ej: Mis redes sociales" />
                </div>
            </div>
        </>
    )
}
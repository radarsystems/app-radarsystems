import { useEffect } from "react"

export default function EditDesc({ page, value, setJson, keyid }) {
    function setDesc(ev) {
        let value = ev.target.value
        setJson(prevData => {
            const update = [...prevData]
            update[page].quests[keyid].desc = value
            return update
        })
    }

    useEffect(() => {
        if (value?.desc) {
            document.querySelector("#title-edit").value = value.desc
        }
    }, [])

    return (<>
        <div className="option">
            <div className="top">
                <p>Descripcion de pregunta</p>

                <input id="title-edit" onChange={setDesc} type="text" placeholder="Ej: Tu nombre es importante por que..." />
            </div>
        </div>
    </>)
}
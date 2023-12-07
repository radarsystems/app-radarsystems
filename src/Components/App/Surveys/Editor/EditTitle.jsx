import { useEffect } from "react"

export default function EditTitle({ value, page, setJson, keyid }) {
    function setTitle(ev) {
        let value = ev.target.value
        setJson(prevData => {
            const update = [...prevData]
            update[page].quests[keyid].title = value
            update[page].quests[keyid].response = 0
            return update
        })
    }

    useEffect(() => {
        if (value?.title) {
            document.querySelector("#title-edit").value = value.title
        }
    }, [])

    return (<>
        <div className="option">
            <div className="top">
                <p>Titulo de pregunta</p>

                <input id="title-edit" onChange={setTitle} type="text" placeholder="Ej: Como te llamas?" />
            </div>
        </div>
    </>)
}
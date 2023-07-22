import { useEffect } from "react"

export default function EditTitleQuest({ quest_key, page, value, setJson, keyid }) {


    function setTitle(ev) {
        ev.stopPropagation()
        let value = ev.target.value

        setJson(prevData => {
            let update = [...prevData];

            update[page].quests[keyid].questions[quest_key].title = value

            return update
        })
    }

    useEffect(() => {
        console.log(value)
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
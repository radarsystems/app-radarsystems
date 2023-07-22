import { useEffect } from "react";
import { IoColorWandOutline, IoImageOutline, IoTrashOutline } from "react-icons/io5";
import $ from "jquery"

export default function Question({ header, value, keyid, setModalImage, page, setEdit, setJson }) {

    function Edit(type, key, ev) {
        SetEditActive(ev)
        setEdit({ type, key, page })
    }

    function SetEditActive(ev) {
        let father = $(ev.target).parents(".question")
        $(".question.active").removeClass("active")
        father.addClass("active")
    }

    function setType(ev) {
        let value = ev.target.value

        setJson(prevData => {
            let update = [...prevData]
            update[page].quests[keyid].type = value
            return update
        })
    }

    function addQuestion(ev) {
        SetEditActive(ev)
        ev.stopPropagation();
        setEdit({})

        let click = true
        setJson(prevData => {
            const update = [...prevData]; // Copia del arreglo prevData

            if (click) {
                update[page].quests[keyid].questions.push({})
                click = false
            }

            return update; // Retorno del nuevo estado
        });
    }

    function deleteQuest(ev, key) {
        ev.stopPropagation()
        let click = true;


        setJson(prevData => {
            let updatedData = [...prevData];

            if (click) {
                if (updatedData[page]?.quests[keyid]) {
                    let newValue = []

                    updatedData[page].quests[keyid].questions.forEach((_, index) => {
                        if (index !== key) {
                            newValue.push(_)
                        } else {
                            click = false
                        }
                    })

                    updatedData[page].quests[keyid].questions = newValue

                }
            }



            return updatedData;
        });


    }

    function deleteQuestion(ev) {
        ev.stopPropagation()

        let click = true


        setJson(prevData => {
            let update = [...prevData]

            let newValue = []
            update[page].quests.forEach((element, key) => {
                if (key !== keyid) {
                    newValue.push(element)
                }
            })

            if (click) {
                update[page].quests = newValue
                click = false
            }




            return update

        })
    }



    $(document).on("click", ".options button", function (ev) {
        ev.stopImmediatePropagation()
        $(".edit-active").removeClass("edit-active")
        $(this).parents(".options").parents(".quest").addClass("edit-active")
    })

    $(document).on("click", ".top p, .top span", function (ev) {
        ev.stopImmediatePropagation()
        $(".edit-active").removeClass("edit-active")
        $(this).addClass("edit-active")
    })

    return (<>
        <div className="question edit" colorBox={header.colorBox} style={{ borderRadius: header.borderRadius + "px" }}>
            <button className="delete-question" onClick={(ev) => { deleteQuestion(ev); setEdit({}); }}><IoTrashOutline /></button>
            <div className="top">
                <p className="title" onClick={(ev) => { Edit('title', keyid, ev) }}>{value?.title ? value.title : 'Elige un titulo...'}</p>
                <span onClick={(ev) => { Edit('desc', keyid, ev) }}>{value?.desc ? value.desc : 'Elige una descripcion... (opcional)'}</span>
            </div>

            {value?.img ? <img className="img-quest" src={value.img} /> : ''}

            <div className="select-types">
                <button onClick={addQuestion} className="add-quest">Agregar pregunta</button>
                <button onClick={(ev) => { setModalImage(true); setEdit({ key: keyid, type: "add-image", page }) }}><IoImageOutline /></button>
                <select onChange={setType}>
                    <option value="input">Respuesta corta</option>
                    <option value="input-large">Respuesta larga</option>
                    <option value="radio">Opcion multiple</option>
                    <option value="check">Casillas de verificacion</option>
                </select>
            </div >


            {value?.questions?.map((element, key) => (
                <div className="quest" key={key}>
                    {value.type == "input" ?
                        <>
                            <input type="text" disabled placeholder={`${element.title ? element.title : 'Elige una descripcion'}`} />

                            <div className="options">
                                <button onClick={(ev) => { deleteQuest(ev, key) }}><IoTrashOutline /></button>
                                <button onClick={(ev) => { setEdit({ key: keyid, type: "title-quest", quest_key: key, page }) }}><IoColorWandOutline /></button>
                            </div>
                        </>
                        : ''}

                    {/* CHECK RADIO 1*/}
                    {value.type == "radio" ?
                        <div className="radio">
                            <input type="radio" name={keyid} /> <span>{element.title ? element.title : 'Elige una descripcion...'}</span>
                            <div className="options">
                                <button onClick={(ev) => { deleteQuest(ev, key) }}><IoTrashOutline /></button>
                                <button onClick={(ev) => { setEdit({ key: keyid, type: "title-quest", quest_key: key, page }) }}><IoColorWandOutline /></button>
                            </div>
                        </div>
                        : ''}
                    {/*CHECK MULTIPLE*/}
                    {value.type == "check" ?
                        <div className="radio">
                            <input type="checkbox" name={keyid} /> <span>{element.title ? element.title : 'Elige una descripcion...'}</span>
                            <div className="options">
                                <button onClick={(ev) => { deleteQuest(ev, key) }}><IoTrashOutline /></button>
                                <button onClick={(ev) => { setEdit({ key: keyid, type: "title-quest", quest_key: key, page }) }}><IoColorWandOutline /></button>
                            </div>
                        </div>
                        : ''}

                    {/*CHECK LARGE RESPONSE*/}
                    {value.type == "input-large" ?
                        <>
                            <textarea type="checkbox" name={keyid} placeholder={element.title} style={{ width: "100%" }}></textarea>
                            <div className="options">
                                <button onClick={(ev) => { deleteQuest(ev, key) }}><IoTrashOutline /></button>
                                <button onClick={(ev) => { setEdit({ key: keyid, type: "title-quest", quest_key: key, page }) }}><IoColorWandOutline /></button>
                            </div>
                        </>


                        : ''}

                </div>
            ))
            }

        </div >
    </>)

}
import { useState } from "react"
import { IoArrowBackOutline } from "react-icons/io5"

export default function ModalProgrammingCampaign({ campaign, setFormProgamming }) {

    const [Case, setCase] = useState("default")

    function selectCase(ev) {
        let value = ev.target.value
        setCase(value)
    }

    function ReturnHome() {
        setCase('default')
    }

    function HtmlReturn() {
        return (
            <>
                <div className="return-top">
                    <button onClick={ReturnHome}><IoArrowBackOutline /></button>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="top">
                <p>Programar campaña</p>
            </div>

            <div className="data">

                {Case == "default" ?
                    <>
                        <div className="select-buttons">
                            <button onClick={selectCase} value="date">Fecha especifica</button>
                            <button onClick={selectCase} value="daysname">Dias especificos</button>
                            <button onClick={selectCase} value="daysnumber">Recordatorios</button>
                        </div>
                    </>
                    : ''}


                {Case == "date" ?
                    <>
                        <HtmlReturn />

                        <div className="form-input">
                            <input type="date" name="date" onChange={setFormProgamming} />
                        </div>

                        <div className="form-input flex">
                            <input type="text" placeholder="hora" name="hh" onChange={setFormProgamming} />
                            <input type="text" placeholder="minuto" name="ii" onChange={setFormProgamming} />

                            <select name="x" id="">
                                <option value="pm">p.m.</option>
                                <option value="am">a.m.</option>
                            </select>
                        </div>
                    </>
                    : ""}

            </div>

        </>
    )
}
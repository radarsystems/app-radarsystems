import { useEffect, useState } from "react"
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

    useEffect(() => {
        switch (Case) {
            case 'daysname':
                setFormProgamming({ target: { value: "bucle", name: "p_type" } })
                break;
        }
    }, [Case])

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
                            <button onClick={selectCase} value="fidelizacion">Fidelizacion</button>

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

                            <select name="ampm" id="">
                                <option value="pm">p.m.</option>
                                <option value="am">a.m.</option>
                            </select>
                        </div>
                    </>
                    : ""}

                {Case == "daysname" ?
                    <>
                        <HtmlReturn />

                        <div className="form-input">
                            <label htmlFor="">Que dia de la semana quieres que se envie</label>
                            <select name="dd" onChange={setFormProgamming} id="">
                                <option value="Sun">Domingo</option>
                                <option value="Mon">Lunes</option>
                                <option value="Tues">Martes</option>
                                <option value="Wed">Miércoles</option>
                                <option value="Thurs">Jueves</option>
                                <option value="Fri">Viernes</option>
                                <option value="Sat">Sábado</option>
                            </select>
                        </div>

                        <div className="form-input">
                            <button>Cada 1 mes</button>
                            <br />
                            <button>Cada 2 meses</button>
                            <br />
                            <button>Cada 3 meses</button>


                        </div>

                        <div className="form-input">
                            <label htmlFor="">Cuando expira</label>
                            <input type="date" onChange={setFormProgamming} name="timeExpire" />
                        </div>
                    </>
                    : ""}

                {Case == "daysnumber" ?
                    <>
                        <HtmlReturn />

                        <div className="form-input">
                            <label htmlFor="">Que dia quieres que se envie (Esto enviara el numero elegio cada mes, es decir ejemplo: 01 es igual a los 01 de cada mes)</label>
                            <select name="dd" onChange={setFormProgamming}>
                                {Array.from({ length: 31 }, (_, index) => (
                                    <option key={index + 1} value={String(index + 1).padStart(2, '0')}>
                                        {String(index + 1).padStart(2, '0')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-input">
                            <label htmlFor="">Cuando expira (Si no pones fecha es indefinido)</label>
                            <input type="date" onChange={setFormProgamming} name="timeExpire" />
                        </div>
                    </>
                    : ""}

                {Case == "fidelizacion" ?
                    <>
                        <HtmlReturn />

                        <div className="form-input">
                            <label htmlFor="">Que campo validador quieres utilizar (estas campañas funcionan de forma que verifican si en el campo validador elegido esta una fecha en caso de ser asi se enviara un correo al usuario, con los parametros configurados)</label>
                            <select name="dd" onChange={setFormProgamming}>
                                <option value="">Selecciona el campo</option>
                                <option value="">Birthday</option>
                                <option value="">Extra 1</option>
                                <option value="">Extra 2</option>
                                <option value="">Extra 3</option>
                                <option value="">Extra 4</option>
                                <option value="">Extra 5</option>

                            </select>
                        </div>

                        <div className="form-input">
                            <label htmlFor="">Cuando expira (Si no pones fecha es indefinido)</label>
                            <input type="date" onChange={setFormProgamming} name="timeExpire" />
                        </div>
                    </>
                    : ""}

            </div>

        </>
    )
}
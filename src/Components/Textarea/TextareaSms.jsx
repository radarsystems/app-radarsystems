import { IoEyeOutline, IoHelpCircleOutline, IoTrash } from "react-icons/io5";
import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from "react";

export default function TextareaSms({ value, defaultValue, onChange, onSave, Send = true, Preview = true }) {
    const textareaRef = useRef(null);
    const [text, setText] = useState('');
    const [captureValue, setCaptureValue] = useState(true)
    const [textCount, setCount] = useState(0)

    const handleButtonClick = (value) => {
        // Obtener la referencia al textarea
        const textarea = textareaRef.current;

        // Verificar si hay un texto seleccionado
        const selectedText = window.getSelection().toString();

        // Obtener el índice de la selección dentro del contenido del textarea
        const selectionStart = textarea.selectionStart;

        // Obtener el contenido antes y después de la selección
        const textBeforeSelection = text.substring(0, selectionStart);
        const textAfterSelection = text.substring(selectionStart);

        // Construir el nuevo contenido con el valor del botón insertado en la selección
        const newText = textBeforeSelection + value + selectedText + textAfterSelection;

        // Actualizar el contenido del textarea
        setText(newText);

        // Enfocar el textarea
        textarea.focus();
    };

    useEffect(() => {
        onChange(text)
        setCount(text.length)
    }, [text])

    useEffect(() => {
        if (value) {
            if (captureValue) {
                setCaptureValue(false)
                setText(value)
            }
        }
    }, [value])

    return (
        <>
            <div className="textarea-sms">
                <div className="options">
                    <button onClick={() => handleButtonClick('$name')}>Nombre</button>
                    <button onClick={() => handleButtonClick('$lastname')}>Apellido</button>
                    <button onClick={() => handleButtonClick('$dni')}>Dni</button>
                    <button onClick={() => handleButtonClick('$code')}>Codigo</button>
                    <button onClick={() => handleButtonClick('$city')}>Ciudad</button>
                    <button onClick={() => handleButtonClick('$country')}>Pais</button>
                    <button onClick={() => handleButtonClick('$birthday')}>Nacimiento</button>
                    <button onClick={() => handleButtonClick('$address')}>Direccion</button>
                    <button onClick={() => handleButtonClick('$occupation')}>Ocupacion</button>
                    <button onClick={() => handleButtonClick('$gender')}>Sexo</button>
                    <button onClick={() => handleButtonClick('$phone')}>Telefono</button>
                    <button onClick={() => handleButtonClick('$email')}>Correo Electronico</button>
                    <button onClick={() => handleButtonClick('$1')}>Extra (1)</button>
                    <button onClick={() => handleButtonClick('$2')}>Extra (2)</button>
                    <button onClick={() => handleButtonClick('$3')}>Extra (3)</button>
                    <button onClick={() => handleButtonClick('$4')}>Extra (4)</button>
                    <button onClick={() => handleButtonClick('$5')}>Extra (5)</button>
                    <button onClick={() => handleButtonClick('$6')}>Extra (6)</button>
                    <button onClick={() => handleButtonClick('$7')}>Extra (7)</button>

                    <div className="count">
                        <i>166/{textCount}</i>
                    </div>
                </div>
                <textarea ref={textareaRef} className="text" value={value} defaultValue={defaultValue} onChange={(e) => setText(e.target.value)}></textarea>

                <div className="bottom-actions">
                    <button><IoTrash /> Borrar</button>

                    {Preview ? <button ><IoEyeOutline /> Previsualizar SMS</button> : ""}

                    {Send ? <button className="preview" onClick={onSave}>Enviar Campaña</button> : ""}
                    <button className="preview" onClick={onSave}>Guardar </button>
                </div>
            </div>
        </>
    );
}

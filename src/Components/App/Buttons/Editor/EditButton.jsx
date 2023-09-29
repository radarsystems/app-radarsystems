export default function EditButtonButtons({ editor, buttons, setButtons }) {

    function changeForm(ev) {
        const { name, value } = ev.target;

        setButtons((prevData) => {
            let realValue = { ...prevData }

            realValue.buttons[editor.key][name] = value

            return realValue;
        });
    }

    return (
        <>
            <div className="option">
                <div className="top">
                    <p>Nombre de boton</p>
                    <input onChange={changeForm} value={buttons.buttons[editor.key].name ? buttons.buttons[editor.key].name : ""} name="name" id="title-edit" type="text" placeholder="Ej: Mi tienda virtual" />
                </div>
                <br />
                <div className="top">
                    <p>Enlace</p>
                    <input onChange={changeForm} value={buttons.buttons[editor.key].url ? buttons.buttons[editor.key].url : ""} name="url" id="title-edit" type="text" placeholder="https://example.com" />
                </div>
            </div>
        </>
    )
}
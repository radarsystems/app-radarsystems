import ColorPickerBasic from "../../ColorPicker/ColorPickerBasic"

export default function EditorLeftButtonsQr({ setButtons }) {

    function changeTheme(ev) {
        let value = ev.target.value

        let name = ev.target.name

        if (name == "background") {
            if (value.indexOf("http") >= 0) {
                value = `url(${value})`
            }
        }

        setButtons((prevData) => {
            let newData = { ...prevData }

            newData.header[ev.target.name] = value
            return newData
        })
    }

    function setColor(color) {
        setButtons(prevData => {
            let newData = { ...prevData }

            newData.header.background = color;

            return newData
        })
    }

    return (
        <>
            <div className="title-top">
                <p>Personalizar botonera</p>
                <span>Personaliza tu botonera, cambiando imagenes, fondo, texto, botones, enlaces.</span>
            </div>

            <br />
            <div className="option">
                <p className="title">Elige el fondo</p>
                <input type="text" defaultValue={"#fff"} onChange={changeTheme} name="background" />

                <hr />
                <p className="title">Colores</p>
                <ColorPickerBasic onClick={setColor} />
                <br />

            </div>

            <div className="option">
                <p className="title">Blur</p>
                <input type="range" onChange={changeTheme} defaultValue={0.0} step={"0.1"} max={"10"} name="blur" />
            </div>

            <div className="option">
                <p className="title">Brillo</p>
                <input type="range" onChange={changeTheme} defaultValue={1} step={"0.1"} max={"1"} name="brightness" />
            </div>

            <div className="option">
                <p className="title">Border radius</p>
                <input type="range" onChange={changeTheme} defaultValue={1} step={"0.1"} max={"50"} name="radius" />
            </div>

            <div className="option">
                <p className="title">Fondo</p>

                <div className="flex-colors">
                    <button name="colorBox" onClick={changeTheme} value="ligth">Modo Claro</button>
                    <button name="colorBox" onClick={changeTheme} value="dark">Modo Oscuro</button>
                </div>
            </div>
        </>
    )
}
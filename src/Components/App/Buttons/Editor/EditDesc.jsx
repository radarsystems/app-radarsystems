export default function EditDescButtons({ setButtons, buttons }) {

    function changeDesc(ev) {
        setButtons((prevData) => {
            let newData = { ...prevData }

            newData.header.desc = ev.target.value

            return newData
        })
    }

    return (
        <>
            <div className="option">
                <div className="top">
                    <p>Descripcion</p>
                    <input onChange={changeDesc} id="title-edit" type="text" placeholder="Ej: Mis redes sociales" value={buttons?.header?.desc} />
                </div>
            </div>
        </>
    )
}
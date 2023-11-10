export default function EditTitleButtons({ setButtons, buttons }) {

    function changeTitle(ev) {

        setButtons((prevData) => {
            let newData = { ...prevData }

            newData.header.title = ev.target.value

            return newData
        })
    }

    return (
        <>
            <div className="option">
                <div className="top">
                    <p>Titulo</p>
                    <input onChange={changeTitle} id="title-edit" type="text" placeholder="Ej: Mis redes sociales" value={buttons?.header?.title} />
                </div>
            </div>
        </>
    )
}
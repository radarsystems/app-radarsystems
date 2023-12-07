export default function NotFoundItems({ name, buttonName, addNew = false, callback }) {

    return (
        <>
            <div className="nofound-items">
                <img src="/img/icons/notfound.png" alt="" />
                <p>No hay {name == undefined ? 'items' : name}  disponibles</p>
                <br />

                {addNew ?
                    <button onClick={(ev) => { callback() }}>Crear {buttonName}</button>
                    : ""}
            </div>
        </>
    )
}
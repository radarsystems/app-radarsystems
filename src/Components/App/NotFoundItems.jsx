export default function NotFoundItems({ name }) {


    return (
        <>
            <div className="nofound-items">
                <img src="/img/icons/notfound.png" alt="" />
                <p>No hay {name == undefined ? 'items' : name}  disponibles</p>
            </div>
        </>
    )
}
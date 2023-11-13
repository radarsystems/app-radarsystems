import toast from "react-hot-toast";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function MenuViewLists({ functions }) {

    let { setSelectMultiple, selects, resetSelection, selectMultiple } = functions;

    const Navigator = useNavigate()

    function uploadMultiple() {
        if (selects.length) {

            Navigator("/contacts/upload/" + JSON.stringify(selects))

        } else {
            toast.error("No has seleccionado ninguna lista")
        }
    }



    return (
        <>
            <div className="menu-top gl">
                {selectMultiple ?
                    <>
                        <button >Seleccionando ({selects?.length})</button>
                        <button onClick={uploadMultiple}>Subir Contactos</button>
                        <button onClick={resetSelection}>Cancelar</button>
                    </>
                    :
                    <>
                        <button onClick={(ev) => { setSelectMultiple(true) }}>Seleccionar Multiple</button>
                        <button>Listas Email</button>
                        <button>Listas Mensajeria</button>
                        <button>Listas Whatsapp</button>
                    </>


                }


                <div className="search">
                    <i><IoSearch /></i>
                    <input type="text" placeholder="Buscar..." />
                </div>
            </div>
        </>
    )
}
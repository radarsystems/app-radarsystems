import { Icon } from "@iconify/react";
import { toast } from "react-hot-toast"

export default function InputValueDomain({ value, Transparent = false }) {

    function HandleCopyElement(ev) {
        let value = ev.target.dataset.value

        if (value) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(value)
                    .then(() => {
                        toast.success("Has copiado correctamente")
                    })
                    .catch((err) => {
                        toast.error("Error al copiar el texto")
                    })
            } else {
                toast.error("Error Al copiar")
            }
        }
    }

    return (
        <>
            <div className="input-config" style={{ background: Transparent ? "transparent" : "" }}>
                <span>{value}</span>
                <button onClick={HandleCopyElement} data-value={value}><Icon icon="material-symbols:copy-all-outline" /></button>
            </div >
        </>
    )
}
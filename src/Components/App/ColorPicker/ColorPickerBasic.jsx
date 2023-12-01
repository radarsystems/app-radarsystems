export default function ColorPickerBasic({ onClick }) {

    let colors = [
        { color: "#FFDDC1" }, // Melocotón
        { color: "#FFA07A" }, // Salmón Claro
        { color: "#FFB6C1" }, // Rosa Claro
        { color: "#87CEEB" }, // Azul Cielo
        { color: "#B0C4DE" }, // Azul Acero Claro
        { color: "#ADD8E6" }, // Azul Claro
        { color: "#FFE4E1" }, // Rosa Claro
        { color: "#F0FFF0" }, // Menta
        { color: "#F5F5DC" }, // Beige
        { color: "#F0E68C" }, // Amarillo Claro
        { color: "#E0FFFF" }, // Azul Claro
        { color: "#FAFAD2" }, // Amarillo Pálido
        { color: "#FFEBCD" }, // Almendra
        { color: "#E6E6FA" }, // Lavanda
        { color: "#F08080" }, // Coral Claro
        { color: "#FF6347" }, // Rojo Tomate
        { color: "#FFD700" }, // Dorado
        { color: "#FFA500" }, // Naranja
        { color: "#FF4500" }, // Anaranjado Rojizo
        { color: "#E9967A" }, // Salmón Oscuro
        { color: "#CD5C5C" }, // Rojo Indian
        { color: "#FF8C00" }, // Naranja Oscuro
        { color: "#FF69B4" }, // Rosa Chicle
        { color: "#FF1493" }, // Rosa Intenso
        { color: "#DB7093" }, // Rosa Pálido
        { color: "#800000" }, // Marrón
        { color: "#A52A2A" }, // Marrón Oscuro
        { color: "#D2691E" }, // Chocolate
        { color: "#8B4513" }, // Marrón Siena
        { color: "#8B0000" }, // Rojo Oscuro
        { color: "#800080" }, // Púrpura Oscuro
        { color: "#000" },
        { color: "#fff" }
        // Puedes continuar añadiendo más colores aquí según lo que necesites
    ];


    return (<>

        <div className="colorPicker-basic">
            {colors.map((element, key) => (
                <div className="color" style={{ background: element.color }} data-value={element.color} onClick={(ev) => { onClick(ev.target.dataset.value) }} >
                </div>
            ))}
        </div>
    </>)
}
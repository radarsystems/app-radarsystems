import axios from "axios"
import { API_URL } from "../../../ExportUrl"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { GetParams } from "../../../Functions/Global"
import toast from "react-hot-toast"

export default function CheckOutCheck() {

    const params = useParams()
    const [voucherDetail, setVoucher] = useState("")

    function checkOrder() {
        const controlParam = GetParams("control");
        if (controlParam) {
            axios.get(`http://localhost:8000/api/payment/check?control=${controlParam}`, {
                headers: {
                    'Content-Type': 'application/json', // Esto es para el tipo de contenido que estás enviando
                    'Accept': 'application/xml', // Esto indica que esperas recibir XML
                },
            })
                .then((response) => {
                    // Aquí deberías recibir el XML
                    const xmlString = response.data;

                    // Crear un nuevo objeto DOMParser
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(xmlString, "application/xml");

                    // Extraer el contenido del elemento <voucher>
                    const voucherElement = xmlDoc.getElementsByTagName("voucher")[0];

                    if (voucherElement) {
                        // Obtener el contenido de <voucher>
                        const voucherContent = voucherElement.textContent.trim();
                        console.log(voucherContent); // Imprimir el contenido de <voucher>

                        // Guardar en una variable
                        const voucher = voucherContent;
                        setVoucher(voucher)

                        // Hacer algo con la variable voucher
                    } else {
                        console.error("Elemento <voucher> no encontrado.");
                    }
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        }
    }




    useEffect(() => {
        checkOrder()
    }, [])

    return (
        <>

            <div className="checkout">

                <div className="facture box">

                    <img className="logo" src="/img/icons/logo-l1.png" alt="" />
                    <hr />
                    <div className="info">
                        <p>Factura</p>
                    </div>

                    <br />

                    <pre>{voucherDetail}</pre>

                </div>

            </div>


        </>
    )
}
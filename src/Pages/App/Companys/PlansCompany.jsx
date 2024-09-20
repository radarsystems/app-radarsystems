import CompanyMenuTop from "../../../Components/App/Companys/MenuTop";
import axios from "axios"
import { API_URL, PAYMENT_URL } from "../../../ExportUrl";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import PlansOffer from "../../../Components/App/Companys/PlansOffer";

export default function PlansCompany() {

    const { UserInfo } = useContext(AuthContext)
    const [plans, setPlans] = useState([])
    const [loading, setLoading] = useState(false)
    const [resumen, setResumen] = useState({})

    function getPlans() {
        let formData = new FormData()

        formData.append("id_company", UserInfo?.company?.id_company)

        axios.post(API_URL + "/api/get/plans", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setPlans(data)
            })
    }

    function getResumen() {
        let formData = new FormData()
        formData.append("id_company", UserInfo?.company?.id_company)
        axios.post(API_URL + "/api/get/my/resumen", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setResumen(data)
            })
    }

    function GoPlan(id_plan) {
        axios.get(API_URL + "/api/payment/control", { withCredentials: true })
            .then((response) => { return response.request.responseText })

            //1726634276598289548
            .then((data) => {

                if (data) {
                    window.location.href = "https://paytest.megasoft.com.ve/action/paymentgatewayuniversal-data?control=" + data
                }
            })
    }

    useEffect(() => {
        getPlans()
        getResumen()
    }, [])

    return (
        <>
            <div className="page-info">
                <div className="">
                    <p className="title">Planes</p>
                    <span>Observa todos los planes disponibles para disfrutar de nuestros servicios</span>
                </div>
            </div>

            <CompanyMenuTop />

            <div className="row">
                <div className="col-md-12">
                    <div className="box stat box-padding">
                        <div className="top">
                            <p className="title">Resumen</p>
                            <span>Observa cuanto te queda disponible este mes en tu plan adquirido</span>
                        </div>

                        <div className="row">
                            <div className="col-md-4">
                                <div className="box resumen-plans box-padding">
                                    <p>Emails</p>
                                    <span>{resumen?.emails_quantity}</span>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="box resumen-plans box-padding">
                                    <p>Mensajes</p>
                                    <span>{resumen?.sms_quantity}</span>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="box resumen-plans box-padding">
                                    <p>Contactos</p>
                                    <span>{resumen?.contacts_quantity}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="row">
                {plans.map((element, key) => (
                    <div className="col-md-3" key={key}>
                        <PlansOffer data={element} onClick={GoPlan} />
                    </div>
                ))}
            </div>
        </>
    )
}
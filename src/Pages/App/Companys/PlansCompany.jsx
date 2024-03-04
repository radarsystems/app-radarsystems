import CompanyMenuTop from "../../../Components/App/Companys/MenuTop";
import axios from "axios"
import { API_URL } from "../../../ExportUrl";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import PlansOffer from "../../../Components/App/Companys/PlansOffer";

export default function PlansCompany() {

    const { UserInfo } = useContext(AuthContext)
    const [plans, setPlans] = useState([])
    const [loading, setLoading] = useState(false)

    function getPlans() {
        let formData = new FormData()

        formData.append("id_company", UserInfo?.company?.id_company)

        axios.post(API_URL + "/api/get/plans", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setPlans(data)
            })
    }

    useEffect(() => {
        getPlans()
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
                {plans.map((element, key) => (
                    <div className="col-md-3" key={key}>
                        <PlansOffer data={element} />
                    </div>
                ))}
            </div>
        </>
    )
}
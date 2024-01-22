import { useContext, useEffect, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { useParams } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../../../ExportUrl";
import { AuthContext } from "../../../Context/AuthContext";
import InputValueDomain from "../../../Components/Inputs/InputValueDomain";
import { Icon } from "@iconify/react";
import LoadingCircleApp from "../../../Components/App/LoadingCircle";
import { toast } from "react-hot-toast"

export default function DomainWatch() {

    const params = useParams()
    const { UserInfo } = useContext(AuthContext)
    const [domain, setDomain] = useState({})
    const [valid, setValid] = useState(false)
    const [pendingButton, setPendingButton] = useState(false)
    const [loading, setLoading] = useState(true)

    function verifyEmail() {
        setPendingButton(true)
        let formData = new FormData()
        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("id_domain", params.id)
        axios.post(API_URL + "/api/get/domaindns", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setPendingButton(false)


                setDomain(prevData => {
                    let newData = { ...prevData }

                    newData.spf = data.spf
                    newData.dmarc = data.dmarc
                    newData.dkim = data.dkim

                    return newData
                })

                if (data.spf && data.dkim && data.dmarc) {
                    setValid(true)
                    toast.success("Tu dominio se ha verificado completamente")

                } else {
                    toast.info("test")
                }
            })
    }

    function getDomain() {
        setLoading(true)
        let formData = new FormData()
        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("id_domain", params.id)

        axios.post(API_URL + "/api/get/domain", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {

                setLoading(false)

                setDomain(data)

                if (data.spf && data.cname && data.dkim && data.mx) {
                    setValid(true)
                } else {
                    setValid(false)
                }
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })
    }

    useEffect(() => {
        getDomain()
    }, [])

    return (
        <>
            <div className="page-info">
                <div className="">
                    <p className="title">Dominio: {params.id}</p>
                </div>

                <div className="right">
                    <button onClick={verifyEmail} className={`go-wizard ${pendingButton ? 'await' : null}`}><Icon icon="material-symbols-light:pending-actions-rounded" /> Verificar Dominio <div className="loading"></div></button>
                </div>
            </div>


            {loading ? <div className="loading-box"><LoadingCircleApp /></div> :

                <div className="row">
                    <div className="col-md-12">
                        <div className="box box-padding stat domain">
                            <div className="top">
                                <p>Sending records</p>
                                <span>TXT records (known as SPF & DKIM) are required to send and receive email with Mailgun.</span>
                            </div>

                            {/* SPF CONFIG */}
                            <div className="space-config">
                                <p className="title">SPF</p>
                                <span className="register-type">Tipo: TXT</span>

                                <table>
                                    <tr>
                                        <td>Status</td>
                                        <td>Hostname</td>
                                        <td>Valor</td>
                                    </tr>
                                    <tr>
                                        <td>{domain?.spf ? <span className="success">Verificado</span> : <span className="error">Pendiente</span>}</td>
                                        <td>
                                            <InputValueDomain Transparent={true} value={domain.domain} />
                                        </td>
                                        <td><InputValueDomain value={"v=spf1 include:_spf.radarmailer1.me ~all"} /></td>
                                    </tr>
                                </table>
                            </div>

                            {/* DKIM CONFIG */}
                            <div className="space-config">
                                <p className="title">DKIM</p>
                                <span className="register-type">Tipo: CNAME</span>


                                <table>
                                    <tr>
                                        <td>Status</td>
                                        <td>Hostname</td>
                                        <td>Valor</td>
                                    </tr>
                                    <tr>
                                        <td>{domain?.dkim ? <span className="success">Verificado</span> : <span className="error">Pendiente</span>}</td>
                                        <td>
                                            <InputValueDomain Transparent={true} value={(`radar._domainkey.` + domain.domain)} />
                                        </td>
                                        <td><InputValueDomain value={"dkim.email.radarmailer1.me"} /></td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="box box-padding stat domain">

                            {/* DKIM CONFIG */}
                            <div className="space-config">
                                <p className="title">DMARC</p>
                                <span className="register-type">Tipo: TXT</span>

                                <table>
                                    <tr>
                                        <td>Status</td>
                                        <td>Hostname</td>
                                        <td>Valor</td>
                                    </tr>
                                    <tr>
                                        <td>{domain?.dmarc ? <span className="success">Verificado</span> : <span className="error">Pendiente</span>}</td>
                                        <td>
                                            <InputValueDomain Transparent={true} value={(`_dmarc`)} />
                                        </td>
                                        <td><InputValueDomain value={`v=DMARC1; p=quarantine; sp=quarantine; rua=mailto:postmarter@${domain.domain}; Ruf=mailto:postmaster@${domain.domain}; pct=100; adkim=r; fo=1; ri=43200`} /></td>
                                    </tr>
                                </table>
                            </div>

                            {/* DKIM CONFIG */}
                            <div className="space-config">
                                <p className="title">DMARC</p>
                                <span className="register-type">Tipo: CNAME</span>

                                <table>
                                    <tr>
                                        <td>Status</td>
                                        <td>Hostname</td>
                                        <td>Valor</td>
                                    </tr>
                                    <tr>
                                        <td>{domain?.dmarc ? <span className="success">Verificado</span> : <span className="error">Pendiente</span>}</td>
                                        <td>
                                            <InputValueDomain Transparent={true} value={(`radar.${domain.domain}`)} />
                                        </td>
                                        <td><InputValueDomain value={`bounce.email.radarmailer1.me`} /></td>
                                    </tr>
                                </table>
                            </div>


                        </div>
                    </div>
                </div>
            }





        </>
    )
}
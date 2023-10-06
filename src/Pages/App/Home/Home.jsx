import { useNavigate } from "react-router-dom"

export default function Home() {

    const Navigator = useNavigate()

    return (
        <>
            <div className="page-info">
                <div className="">
                    <p className="title">Mi Home</p>
                    <span>Bienvenido a RadarSystems aca podras ver todas tus estadisticas y estados de tu cuenta</span>
                </div>
            </div>

            <div className="body-stat">
                <div className="row">
                    <div className="col-md-3">
                        <div className="box stat box-padding">
                            <div className="top">
                                <p>Correos Enviados</p>
                            </div>

                            <div className="resp-number">
                                <p>1</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="box stat box-padding">
                            <div className="top">
                                <p>SMS Enviados</p>
                            </div>

                            <div className="resp-number">
                                <p>12</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="box stat box-padding">
                            <div className="top">
                                <p>Campaigns Email</p>
                            </div>

                            <div className="resp-number">
                                <p>13</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="box stat box-padding">
                            <div className="top">
                                <p>Campaigns Sms</p>
                            </div>

                            <div className="resp-number">
                                <p>1</p>
                            </div>
                        </div>
                    </div>
                    

                    <div className="col-md-6">
                        <div className="box stat box-padding">
                            <div className="top">
                                <p>Top's Campaigns SMS</p>
                                <span>Ve las campanas mas demandadas</span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="box stat box-padding">
                            <div className="top">
                                <p>Top's Campaigns SMS</p>
                                <span>Ve las campanas mas demandadas</span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
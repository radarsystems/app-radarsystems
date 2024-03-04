import { Icon } from "@iconify/react";
import { formatNumber } from "../../../Functions/Global";

export default function PlansOffer({ data }) {

    return (
        <>
            <div className="box box-padding plans">
                <div className="info">
                    <p>{String(data.name).replace(/\s/g, "\n")}</p>
                    <span>{data.desc_text}</span>
                </div>

                <div className="price">
                    {data.before_price &&
                        <div className="before-price">
                            <span>${Number(data.before_price).toFixed(2)}</span>
                        </div>
                    }

                    <div className="fix">
                        <span className="symbol">$</span>
                        <span className="price-number">{Number(data.price).toFixed(2)}</span>
                        <span className="time">/ Month</span>
                    </div>
                </div>

                <button className="start">Comenzar Ahora!</button>

                <div className="offers">
                    <p>El plan incluye:</p>


                    <div className="include">
                        {data.marketing_auto ?
                            <span className="check">
                                <Icon icon="material-symbols:check-circle-outline" />
                            </span>
                            :
                            <span className="no">
                                <Icon icon="ph:x-circle" />
                            </span>
                        }

                        <span className="title">IA (Inteligencia Artificial)</span>
                    </div>

                    <div className="include">

                        <span className="check">
                            <Icon icon="material-symbols:check-circle-outline" />
                        </span>
                        <span className="title">Envios de Correos ({formatNumber(Number(data.email_quantity))})</span>
                    </div>

                    <div className="include">

                        <span className="check">
                            <Icon icon="material-symbols:check-circle-outline" />
                        </span>
                        <span className="title">Envios de Sms ({formatNumber(Number(data.sms_quantity))}) </span>
                    </div>


                    <div className="include">
                        {data.marketing_auto ?
                            <span className="check">
                                <Icon icon="material-symbols:check-circle-outline" />
                            </span>
                            :
                            <span className="no">
                                <Icon icon="ph:x-circle" />
                            </span>
                        }

                        <span className="title">Marketing Automatizado </span>
                    </div>

                    <div className="include">
                        {data.marketing_auto ?
                            <span className="check">
                                <Icon icon="material-symbols:check-circle-outline" />
                            </span>
                            :
                            <span className="no">
                                <Icon icon="ph:x-circle" />
                            </span>
                        }

                        <span className="title">Programacion de Campaña</span>
                    </div>

                    <div className="include">
                        {data.marketing_auto ?
                            <span className="check">
                                <Icon icon="material-symbols:check-circle-outline" />
                            </span>
                            :
                            <span className="no">
                                <Icon icon="ph:x-circle" />
                            </span>
                        }

                        <span className="title">WorkFlow</span>
                    </div>

                    <div className="include">
                        {data.marketing_auto ?
                            <span className="check">
                                <Icon icon="material-symbols:check-circle-outline" />
                            </span>
                            :
                            <span className="no">
                                <Icon icon="ph:x-circle" />
                            </span>
                        }

                        <span className="title">Encuestas</span>
                    </div>

                    <div className="include">
                        {data.marketing_auto ?
                            <span className="check">
                                <Icon icon="material-symbols:check-circle-outline" />
                            </span>
                            :
                            <span className="no">
                                <Icon icon="ph:x-circle" />
                            </span>
                        }

                        <span className="title">Encuestas Avanzadas</span>
                    </div>


                    <div className="include">
                        {data.marketing_auto ?
                            <span className="check">
                                <Icon icon="material-symbols:check-circle-outline" />
                            </span>
                            :
                            <span className="no">
                                <Icon icon="ph:x-circle" />
                            </span>
                        }

                        <span className="title">Formularios</span>
                    </div>

                    <div className="include">
                        {data.marketing_auto ?
                            <span className="check">
                                <Icon icon="material-symbols:check-circle-outline" />
                            </span>
                            :
                            <span className="no">
                                <Icon icon="ph:x-circle" />
                            </span>
                        }

                        <span className="title">Modulo de Citas</span>
                    </div>

                    <div className="include">
                        {data.marketing_auto ?
                            <span className="check">
                                <Icon icon="material-symbols:check-circle-outline" />
                            </span>
                            :
                            <span className="no">
                                <Icon icon="ph:x-circle" />
                            </span>
                        }

                        <span className="title">Pasarelas de Pagos</span>
                    </div>

                    <div className="include">
                        {data.marketing_auto ?
                            <span className="check">
                                <Icon icon="material-symbols:check-circle-outline" />
                            </span>
                            :
                            <span className="no">
                                <Icon icon="ph:x-circle" />
                            </span>
                        }

                        <span className="title">BlackList</span>
                    </div>

                    <div className="include">
                        {data.marketing_auto ?
                            <span className="check">
                                <Icon icon="material-symbols:check-circle-outline" />
                            </span>
                            :
                            <span className="no">
                                <Icon icon="ph:x-circle" />
                            </span>
                        }

                        <span className="title">Verificacion Datos</span>
                    </div>

                    <div className="include">
                        {data.marketing_auto ?
                            <span className="check">
                                <Icon icon="material-symbols:check-circle-outline" />
                            </span>
                            :
                            <span className="no">
                                <Icon icon="ph:x-circle" />
                            </span>
                        }

                        <span className="title">Informe Metricas</span>
                    </div>





                    <div className="include">
                        {data.marketing_auto ?
                            <span className="check">
                                <Icon icon="material-symbols:check-circle-outline" />
                            </span>
                            :
                            <span className="no">
                                <Icon icon="ph:x-circle" />
                            </span>
                        }

                        <span className="title">Segmentacion </span>
                    </div>

                    <div className="include">
                        {data.marketing_auto ?
                            <span className="check">
                                <Icon icon="material-symbols:check-circle-outline" />
                            </span>
                            :
                            <span className="no">
                                <Icon icon="ph:x-circle" />
                            </span>
                        }

                        <span className="title">Plantillas</span>
                    </div>




                    <div className="include">
                        {data.marketing_auto ?
                            <span className="check">
                                <Icon icon="material-symbols:check-circle-outline" />
                            </span>
                            :
                            <span className="no">
                                <Icon icon="ph:x-circle" />
                            </span>
                        }

                        <span className="title">Segmentacion Premium</span>
                    </div>

                    <div className="include">
                        {data.landing_page ?
                            <span className="check">
                                <Icon icon="material-symbols:check-circle-outline" />
                            </span>
                            :
                            <span className="no">
                                <Icon icon="ph:x-circle" />
                            </span>
                        }

                        <span className="title">Paginas / Ecommerce </span>
                    </div>

                    <div className="include">
                        {data.auto_response ?
                            <span className="check">
                                <Icon icon="material-symbols:check-circle-outline" />
                            </span>
                            :
                            <span className="no">
                                <Icon icon="ph:x-circle" />
                            </span>
                        }
                        <span className="title">Auto Responder</span>
                    </div>


                    <div className="include">
                        {data.stats_shortlink ?
                            <span className="check">
                                <Icon icon="material-symbols:check-circle-outline" />
                            </span>
                            :
                            <span className="no">
                                <Icon icon="ph:x-circle" />
                            </span>
                        }
                        <span className="title">Acortador de Enlaces</span>
                    </div>

                    <div className="include">
                        {data.stats_shortlink ?
                            <span className="check">
                                <Icon icon="material-symbols:check-circle-outline" />
                            </span>
                            :
                            <span className="no">
                                <Icon icon="ph:x-circle" />
                            </span>
                        }
                        <span className="title">Estadisticas Enlaces</span>
                    </div>


                    <div className="include">
                        {data.personalize_shortlink ?
                            <span className="check">
                                <Icon icon="material-symbols:check-circle-outline" />
                            </span>
                            :
                            <span className="no">
                                <Icon icon="ph:x-circle" />
                            </span>
                        }
                        <span className="title">Personalizar Enlaces</span>
                    </div>

                    <div className="include">
                        {data.buttons_qr ?
                            <span className="check">
                                <Icon icon="material-symbols:check-circle-outline" />
                            </span>
                            :
                            <span className="no">
                                <Icon icon="ph:x-circle" />
                            </span>
                        }
                        <span className="title">Botonera QR</span>
                    </div>

                    <div className="include">
                        {data.buttons_url ?
                            <span className="check">
                                <Icon icon="material-symbols:check-circle-outline" />
                            </span>
                            :
                            <span className="no">
                                <Icon icon="ph:x-circle" />
                            </span>
                        }
                        <span className="title">Botonera Enlaces</span>
                    </div>

                    <div className="include">
                        {data.gallery_qr ?
                            <span className="check">
                                <Icon icon="material-symbols:check-circle-outline" />
                            </span>
                            :
                            <span className="no">
                                <Icon icon="ph:x-circle" />
                            </span>
                        }
                        <span className="title">Galeria QR</span>
                    </div>

                    <div className="include">
                        <span className="check">
                            <Icon icon="material-symbols:check-circle-outline" />
                        </span>

                        <b>
                            <span className="title">Contactos ({formatNumber(data.contacts_quantity)})</span>
                        </b>
                    </div>


                    <div className="include">
                        <span className="check">
                            <Icon icon="material-symbols:check-circle-outline" />
                        </span>

                        <span className="title">Verificador Correos ({(data.verified_emails)})</span>
                    </div>

                </div>
            </div>
        </>
    )
}
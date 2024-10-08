export default function SearchsBasic({ newFormCampaign }) {

    return (
        <>
            <div className="menu-top">
                <ul>

                </ul>

                <div className="right">
                    <div className="form-search">

                        <div className="form-input">
                            <input onChange={newFormCampaign} name="name" type="text" placeholder="Buscar por campañas..." />
                        </div>

                        <div className="form-input">
                            <select onChange={newFormCampaign} name="type" id="">
                                <option value="em">Email Marketing</option>
                                <option value="em-mt">Email Transaccional</option>
                                <option value="sms">Sms Marketing</option>
                                <option value="sms-mt">Sms Transaccional</option>
                            </select>
                        </div>

                        <div className="form-input">
                            <input type="date" onChange={newFormCampaign} />
                        </div>


                    </div>
                </div>
            </div>
        </>
    )
}
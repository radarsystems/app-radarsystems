export default function FormAddContact() {

    return (
        <>
            <div className="form">
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-input">
                            <label>Nombre</label>
                            <input type="text" name="name" placeholder="Ej: Pablito" />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-input">
                            <label>Apellido</label>
                            <input type="text" name="lastname" placeholder="Ej: Montana" />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-input">
                            <label>Correo</label>
                            <input type="text" name="email" placeholder="Ej: pablitomontana@gmail.com" />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-input">
                            <label>Telefono</label>
                            <input type="text" name="phone" placeholder="Ej: +58412000000" />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-input">
                            <label>Documento Identidad</label>
                            <input type="text" name="dni" placeholder="Ej: 29000000" />
                        </div>
                    </div>


                    <div className="col-md-6">
                        <div className="form-input">
                            <label>Sexo</label>
                            <select name="sex" id="">
                                <option value="">Seleccionar Sexo</option>
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                                <option value="O">Otros</option>
                            </select>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label>Pais</label>
                        <div className="form-input">
                            <input type="text" name="country" placeholder="Ej: Venezuela" />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label>Estado</label>
                        <div className="form-input">
                            <input type="text" name="state" placeholder="Ej: Miranda" />
                        </div>
                    </div>


                    <div className="col-md-6">
                        <label>Ciudad</label>
                        <div className="form-input">
                            <input type="text" name="city" placeholder="Ej: Miranda" />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label>Direccion</label>
                        <div className="form-input">
                            <input type="text" name="direction" placeholder="Ej: Miranda" />
                        </div>
                    </div>


                    <div className="col-md-6">
                        <label>Cumpleaños</label>
                        <div className="form-input">
                            <input type="date" name="birthday" placeholder="Ej: Miranda" />
                        </div>
                    </div>


                    <div className="col-md-6">
                        <label>Ocupacion</label>
                        <div className="form-input">
                            <input type="text" name="occupation" placeholder="Ej: Abogado" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
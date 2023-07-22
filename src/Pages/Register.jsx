import axios from "axios";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_URL } from "../ExportUrl";
import $ from "jquery"
import { toast } from "react-hot-toast";

export default function Register() {

    const [register, setRegister] = useState({ user: "", email: "", password: "", rpassword: "" });

    function setForm(ev) {
        ev.stopPropagation()

        let name = ev.target.name;
        let value = ev.target.value;


        setRegister({ ...register, [name]: value })
    }


    function GoRegister(ev) {
        ev.stopPropagation()
        ev.preventDefault()

        $(ev.target).addClass("await");

        axios.post(API_URL + "/api/auth/register", register, { withCredentials: true }).then((response) => { return response.data }).then((data) => {
            if (data.msg) {
                toast.error(data.msg)
            }

            
            $(ev.target).removeClass("await");
        }).catch((err) => {
            $(ev.target).removeClass('await')
        })
    }

    return (<>
        <div className="row auth">
            <div className="col-auth-left">
                <div className="logo">
                    <img src="img/icons/logo-l1.png" alt="" />
                </div>
                <div className="align">
                    <span className="title-welcome">Bienvenido.<br /> Registrate ahora!.</span>

                    <span className="text-register">¿Opps ya tienes una cuenta?, <Link to="/">Ingresar</Link></span>
                    <form className="form" onChange={setForm}>
                        <div className="form-input">
                            <label>Usuario</label>
                            <input type="text" name="user" />
                        </div>

                        <div className="form-input">
                            <label>Correo</label>
                            <input type="text" name="email" />
                        </div>
                        <div className="form-input">
                            <label>Contraseña
                            </label>
                            <input type="password" name="password" />
                        </div>

                        <div className="form-input">
                            <label>Repite Contraseña

                            </label>
                            <input type="password" name="rpassword" />
                        </div>

                        <span></span>
                        <button className="sign" onClick={GoRegister}>REGISTRARSE<div className="loading"></div></button>
                    </form>
                </div>

            </div>
            <div className="col-auth-right right">

                <div className="align">

                    <div className="carousel">
                        <div className="item">
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestiae perspiciatis nulla commodi accusamus. Reprehenderit, earum quibusdam laboriosam aliquam dolore ullam doloremque ratione possimus ex neque minus velit iste suscipit odit!</p>
                            <img src={"img/auth/People-welcome.png"} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </>)
}


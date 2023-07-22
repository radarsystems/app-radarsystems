import { Link, useNavigate } from "react-router-dom";
import $ from "jquery"
import { API_URL } from "../ExportUrl";
import axios from "axios"
import { useState } from "react";
import { toast } from "react-hot-toast";

export function Auth() {

    let Navigator = useNavigate()

    const [LoginForm, setLoginForm] = useState({ user: "", password: "" })

    function sign(ev) {
        ev.stopPropagation()
        ev.preventDefault()

        $(ev.target).addClass("await")

        if (LoginForm.password && LoginForm.user) {
            axios.post(API_URL + "/api/auth/login", LoginForm, { withCredentials: true }).then((response) => { return response.data }).then((data) => {
                if (data.status) {
                    Navigator("/home")
                }

                if (data.msg) {
                    toast.error(data.msg)
                }

                $(ev.target).removeClass('await')
            }).catch((err) => {
                toast.error(String(err))
                $(ev.target).removeClass('await')
            })
        } else {
            $(ev.target).removeClass('await')
        }

    }


    function setAuth(ev) {
        setLoginForm({ ...LoginForm, [ev.target.name]: ev.target.value })
    }

    return (<>
        <div className="row auth">
            <div className="col-auth-left">

                <div className="logo">
                    <img src="img/icons/logo-l1.png" alt="" />
                </div>

                <div className="align">
                    <span className="title-welcome">Bienvenido de nuevo. <br /> Inicia ahora.</span>

                    <span className="text-register">¿Aun no tienes cuenta?, <Link to="/register">Registrate ahora</Link></span>
                    <form className="form">
                        <div className="form-input">
                            <label>Usuario</label>
                            <input type="text" name="user" onChange={setAuth} />
                        </div>
                        <div className="form-input">
                            <label>Password

                                <Link className="forgot">¿Olvidó?</Link>
                            </label>
                            <input type="password" name="password" onChange={setAuth} />
                        </div>

                        <span></span>
                        <button className="sign" onClick={sign}>INICIAR SESION <div className="loading"></div></button>
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
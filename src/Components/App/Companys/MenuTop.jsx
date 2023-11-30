import { Link } from "react-router-dom";

export default function CompanyMenuTop() {

    return (<>
        <div className="menu-top">
            <ul>
                <li>
                    <Link to="/companys">Cuentas</Link>
                </li>

                <li>
                    <Link to="/companys/roles">Roles</Link>
                </li>

                <li>
                    <Link to="/companys/users">Perfiles</Link>
                </li>



            </ul>

            <div className="right">
                <div className="form-search">
                    <input type="text" placeholder="Buscar empresa..." />
                </div>
            </div>
        </div>
    </>)
}
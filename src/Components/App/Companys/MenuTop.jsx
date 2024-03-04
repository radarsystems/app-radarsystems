import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../Context/AuthContext";

export default function CompanyMenuTop() {

    const { UserInfo } = useContext(AuthContext)

    return (<>
        <div className="menu-top">
            <ul>
                <li>
                    <Link to="/companys">Cuentas</Link>
                </li>

                {UserInfo?.company?.id_company &&
                    <li>
                        <Link to="/companys/plans">Planes</Link>
                    </li>
                }

                <li>
                    <Link to="/companys/roles">Roles</Link>
                </li>

                <li>
                    <Link to="/companys/users">Perfiles</Link>
                </li>



            </ul>

            <div className="right">
                <div className="form-search">
                    <input type="text" placeholder="Buscar cuenta..." />
                </div>
            </div>
        </div>
    </>)
}
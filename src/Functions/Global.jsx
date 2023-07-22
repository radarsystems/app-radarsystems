import axios from "axios";
import { API_URL } from "../ExportUrl";
import $ from "jquery"
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";


export async function InfoCompany(id) {
    let data = await axios.get(API_URL + "/api/get/company?id_company=" + id, { withCredentials: true }).then((response) => { return response.data })
    return data
}

export async function MyCompanys() {
    return await axios.post(API_URL + "/api/get/companys", {}, { withCredentials: true }).then((response) => { return response.data })
}

export function GetCookie(cookie) {
    let cookies = document.cookie
    cookies = cookies.split(";")
    let response = undefined;

    cookies.forEach((value, index) => {
        if (value.indexOf(`${cookie}=`) >= 0) {
            let newValue = value.replace(`${cookie}=`, '')
            response = newValue
        }
    })


    return response
}


export function addWait(target) {
    $(target).addClass("await")
}

export function removeAwait(target) {
    $(target).removeClass("await")
}


export function randomId(length = 15) {
    return Math.random().toString(36).substring(2, length + 2);
}

export function AnalizeFileCsv(ev, setPercent) {
    return new Promise((resolve, reject) => {
        try {
            let file = ev.target.files[0];
            let response = { file: "", analize: "" };
            let fileReader = new FileReader();

            fileReader.onload = async function (ev) {
                let analizeStatus = true;
                let contacts = ev.currentTarget.result.split('\n');

                let headers = contacts[0].split(',');
                let headersApprove = false;

                // ANALIZAR LOS HEADERS DEL ARCHIVO CSV O TXT QUE SE INTENTA SUBIR
                headers.forEach(name => {
                    if (name == "email" || name == "phone") {
                        // SI CONTIENE UNO DE ESTOS HEADERS, SIGNIFICA QUE PODRÍA SER UN ARCHIVO TOTALMENTE VÁLIDO PARA SUBIR
                        headersApprove = true;
                    }
                });

                if (headersApprove) {
                    // TODO BIEN, SIGNIFICA AHORA DEBEMOS ANALIZAR LOS CONTACTOS PARA VER SI CUMPLEN CON LOS CAMPOS CORRECTOS.

                    const ObserverContacts = async () => {
                        for (var i = 1; i < contacts.length; i++) {


                            // EMPEZAMOS DESDE EL 1 PORQUE EL 0 ES EL ENCABEZADO
                            // CONTAMOS LOS ENCABEZADOS Y CONTAMOS LA INFORMACIÓN DE LOS CONTACTOS, Y SI EN TODOS LOS CONTACTOS ES CORRECTO TODO, SIGNIFICA QUE ESTE ARCHIVO ES VÁLIDO
                            // NO DEBERÍA PRESENTAR NINGÚN TIPO DE PROBLEMAS.
                            let countHeaders = headers.length;
                            let countResults = contacts[i].split(',').length;

                            if (countHeaders !== countResults) {
                                analizeStatus = false;
                            }

                            let percent = ((i + 1) / contacts.length * 100)

                            if (percent % 5 === 0) {

                                await new Promise(resolve => setTimeout(() => {
                                    setPercent(percent)
                                    resolve()
                                }, 0))
                            }

                        }


                        if (analizeStatus) {
                            response.analize = "good";
                            response.file = file
                            resolve(response);
                        } else {
                            response.analize = "bad";
                            reject(response);
                        }
                    }

                    await ObserverContacts()


                } else {
                    response.analize = "bad";
                    reject(response);
                }

            };

            fileReader.readAsText(file);
        } catch (err) {
            response.analize = "bad";
            reject(response);
        }
    });
}

export function PreviewTemplate(folder, image) {
    return `${API_URL}/api/get/imgtemplate?img=${image}&folder=${folder}`
}

export function Time(timestamp) {
    // Multiplica el timestamp por 1000 para convertirlo a milisegundos
    const date = new Date(timestamp * 1000);

    // Obtiene los componentes de la fecha
    const dia = date.getDate();
    const mes = date.getMonth() + 1; // Los meses van de 0 a 11, por eso se suma 1
    const anio = date.getFullYear();

    // Formatea la fecha como "d/m/Y"
    const fechaFormateada = `${dia}/${mes}/${anio}`;

    return fechaFormateada;
}


export function ConvertImageToBase64(element) {
    const image = element


    // Crea un elemento canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Establece las dimensiones del canvas según el tamaño de la imagen
    canvas.width = image.width;
    canvas.height = image.height;

    // Dibuja la imagen en el canvas
    ctx.drawImage(image, 0, 0);

    // Obtiene la representación base64 de la imagen
    const base64Image = canvas.toDataURL('image/png');
    return base64Image
}

export function LoadFlagCountry(code) {
    if (!code) {
        code = "undefined";
    } else {
        code = String(code).toLowerCase()
    }

    if (code == "undefined") {
        return window.location.origin + "/img/icons/countrys/" + code + ".png";

    } else {
        return window.location.origin + "/img/icons/countrys/" + code + ".svg";

    }
}

export function LoadNameCountry(code) {
    let realName;

    switch (code) {
        case 've':
            realName = "Venezuela"
            break;
        case 'ca':
            realName = "Canada"
            break;
        default:
            realName = "Undefined"
            break;
    }

    return realName;
}

export function LoadLogoSystems(name) {
    if (name !== undefined) {
        name = String(name).toLowerCase()
    }



    if (name.indexOf("mac") >= 0 || name.indexOf("apple") >= 0) {
        name = "apple";
    }

    if (name.indexOf("windows") >= 0) {
        name = "windows";
    }

    if (name.indexOf("linux") >= 0) {
        name = "linux"
    }

    if (name.indexOf("android") >= 0) {
        name = "android"
    }

    if (name !== "windows" && name !== "apple" && name !== "android" && name !== "linux") {
        name = "undefined";
    }

    return "/img/icons/systems/" + name + ".png"
}
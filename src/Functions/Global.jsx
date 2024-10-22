import axios from "axios";
import { API_URL } from "../ExportUrl";
import $ from "jquery"
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

export function HistoryBack() {
    return window.history.back()
}

export const downloadFile = (url, name) => {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = name + '.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


export function unescapeHTML(escapedString) {
    const doc = new DOMParser().parseFromString(escapedString, "text/html");
    return doc.documentElement.textContent;
}

export function formatNumber(number) {
    // Si el número es menor a 1000, no es necesario formatearlo
    if (number < 1000) {
        return number.toString();
    }

    // Si el número es mayor o igual a 1000
    const suffixes = ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
    const suffixNum = Math.floor(('' + number).length / 3);
    let shortValue = parseFloat((suffixNum !== 0 ? (number / Math.pow(1000, suffixNum)) : number).toPrecision(2));
    // Si shortValue es entero, le agregamos .0 para indicar el decimal
    if (shortValue % 1 === 0) {
        shortValue = shortValue.toFixed(1);
    }
    return shortValue + suffixes[suffixNum];
}

export function ConvertCampaignTypeToList(CampaignType) {

    let response = undefined;
    switch (CampaignType) {
        case 'sms':
            response = "sms"
            break;

        case 'em':
        case 'em-mt':
            response = "em"
            break;
    }

    return response
}

export async function InfoCompany(id) {
    let data = await axios.get(API_URL + "/api/get/company?id_company=" + id, { withCredentials: true }).then((response) => { return response.data })
    return data
}

export async function MyCompanys() {
    return await axios.post(API_URL + "/api/get/companys", {}, { withCredentials: true }).then((response) => { return response.data })
}

export function existsStringInPath(substring) {
    const currentPath = window.location.pathname;
    return currentPath.includes(substring);
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

export function GetParams(name) {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has(name)) {
        return urlParams.get(name);
    }
    return null; // Si el parámetro no está presente en la URL
}


export function SetCookie(cookieName, cookieValue, expire = false) {
    var expirationDate = new Date();

    if (expire) {
        expirationDate.setTime(expirationDate.getTime() - 1);
    } else {
        expirationDate.setDate(expirationDate.getDate() + 10);
    }

    var cookie = cookieName + "=" + encodeURIComponent(cookieValue) + "; expires=" + expirationDate.toUTCString() + "; path=/";

    document.cookie = cookie;
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

export function AnalizeImage(file) {
    let response = false

    if (file.type.indexOf("image") >= 0) {
        response = true
    }

    return response
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

                // Identificar los campos esenciales que deben estar presentes en todas las filas
                const essentialFields = ["email"];

                // Verificar que los campos esenciales estén presentes en el encabezado
                headersApprove = essentialFields.every(field => headers.includes(field));

                if (headersApprove) {
                    // Analizar los contactos
                    const ObserverContacts = async () => {
                        for (var i = 1; i < contacts.length; i++) {
                            // Empezamos desde el 1 porque el 0 es el encabezado
                            let columns = contacts[i].split(',');

                            // Verificar que la cantidad de columnas sea la misma que la cantidad de encabezados
                            if (columns.length !== headers.length) {
                                analizeStatus = false;
                                break;
                            }

                            // Verificar si hay una fila vacía o con campos vacíos
                            if (contacts[i].trim() === "" || columns.some(column => column.trim() === "")) {
                                analizeStatus = false;
                                break;
                            }

                            let percent = ((i + 1) / contacts.length * 100)

                            if (percent % 5 === 0) {
                                await new Promise(resolve => setTimeout(() => {
                                    setPercent(percent)
                                    resolve()
                                }, 0))
                            }
                        }


                        response.analize = "good";
                        response.file = file
                        resolve(response);
                    }

                    await ObserverContacts();
                } else {
                    response.analize = "good";
                    response.file = file
                    resolve(response);
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

export function CampaignType(type) {

    let response = "default";
    switch (type) {
        case 'em':
            response = "Email Marketing"
            break;
        case 'em-mt':
            response = "Email Transaccional"
            break;
        case 'sms':
            response = "Sms Marketing"
            break;

        case 'sms-mt':
            response = "Sms Transaccional"
            break;
    }

    return response;
}

export function Time(timestamp, type = undefined) {
    // Multiplica el timestamp por 1000 para convertirlo a milisegundos
    const date = new Date(timestamp * 1000);

    // Obtiene los componentes de la fecha
    const dia = date.getDate();
    const mes = date.getMonth() + 1; // Los meses van de 0 a 11, por eso se suma 1
    const anio = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();

    // Formatea la fecha como "d/m/Y"

    switch (type) {
        case 'full':
            var fechaFormateada = `${dia}/${mes}/${anio} ${hour}:${minute}`;
            break;

        default:
            var fechaFormateada = `${dia}/${mes}/${anio}`;
            break;
    }

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

    if (code) {
        code = String(code).toLocaleLowerCase()
    }

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

export function LoadIconApp(code) {

    if (code == "") {
        code = "default"
    }
    return "/img/icons/apps/" + code + ".png"
}

export function LoadPreviewQr(qr) {
    return API_URL + "/api/get/previewqr?url=" + qr
}

export function getRealAppName(value) {
    const appNames = {
        'fb': 'Facebook',
        'in': 'Instagram',
        'x': 'X (Twitter)',
        'email': 'Correo',
        'sms': 'Sms',
        'tik': 'Tiktok',
        'linkd': 'Linkedin',
        'yt': 'Youtube',
        'tele': 'Telegram',
        'ws': 'Whatsapp',
        'others': 'Otros',
    };

    return appNames[value] || '';
}

export function validateDomain(dominio) {
    // Expresión regular para validar un dominio simple
    const regexDominio = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (regexDominio.test(dominio)) {
        return true;
    } else {
        return false;
    }
}

export function LoadImageProfile(UserInfo) {

    let url;

    if (UserInfo?.company?.photo) {
        url = API_URL + "/api/get/photoprofile?hash=" + UserInfo?.company?.photo
    } else {
        url = "img/icons/default_profile.png";
    }
    return url;
}

export function formatNumberZero(numero) {
    if (numero >= 1 && numero <= 9) {
        return "0" + numero;
    } else {
        return numero.toString(); // Convertir a cadena si es mayor o igual a 10
    }
}

export function limitText(text, limit) {
    if (text.length > limit) {
        return text.substring(0, limit) + '...';
    } else {
        return text;
    }
}


export function getDevice() {
    const userAgent = navigator.userAgent;

    if (userAgent.match(/Android/i)) {
        return 'Android';
    } else if (userAgent.match(/iPhone|iPad|iPod/i)) {
        return 'iPhone';
    } else {
        return 'Desktop';
    }
}
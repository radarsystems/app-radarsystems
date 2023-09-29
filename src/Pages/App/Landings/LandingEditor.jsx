import axios from "axios";
import "../../../Styles/css/Home.css"
import grapesjs from "grapesjs"
import "grapesjs/dist/css/grapes.min.css"
import { useContext, useEffect } from "react";
import { useRef } from "react";
import { API_URL } from "../../../ExportUrl";
import { AuthContext } from "../../../Context/AuthContext";
import basic from "grapesjs-blocks-basic"
import forms from "grapesjs-plugin-forms"
import webpage from "grapesjs-preset-webpage"
import { useState } from "react";
import ModalSmall from "../../../Components/App/ModalSmall";
import { GetCookie } from "../../../Functions/Global";
import { toast } from "react-hot-toast";
import $ from "jquery"
import html2canvas from "html2canvas";

import exportGs from "grapesjs-plugin-export"
import { useNavigate } from "react-router-dom";

export default function LandingEditor() {
    const editorRef = useRef(null);
    let { UserInfo } = useContext(AuthContext)

    const [visible, setVisible] = useState(false)

    const Navigate = useNavigate();

    useEffect(() => {
        const editor = grapesjs.init({
            container: editorRef.current,
            plugins: [basic, forms, webpage, exportGs],

            // Configura GrapesJS según tus necesidades
        });
        editor.Storage.destroy()

        editor.Panels.addButton('options', {
            id: "return",
            label: 'Volver',
            command: async function () {
                Navigate("/landings")
            },
        });

        editor.Panels.addButton('options', {
            id: 'save-html-button',
            className: 'save-html-button-class',
            label: 'Guardar',
            command: async function () {
                // Obtén el HTML generado por GrapesJS
                const html = editor.getHtml();
                const css = editor.getCss();
                const json = await editor.store('export').then((response) => {
                    return JSON.stringify(response)
                })



                // Aquí puedes realizar acciones con el HTML, como guardarlo en un archivo o enviarlo a un servidor
                let formData = new FormData()
                let name = $("input[name='name']").val();

                formData.append("id_company", $("#id_company").val())
                formData.append("html", html)
                formData.append("name", name)
                formData.append("css", css)
                formData.append("json", json)


                if (Number($("#id_edit").val()) >= 1) {
                    formData.append("id", $("#id_edit").val());
                }


                if (name.length) {
                    axios.post(API_URL + "/api/upload/landing", formData, { withCredentials: true })
                        .then((response) => { return response.data })
                        .then((data) => {

                            if (data.status) {
                                toast.success("Guardado con exito")
                                if (data.id_create) {
                                    $("#id_edit").val(data.id_create)
                                }
                            }

                        })
                } else {
                    toast.error("Opps no has elegido un titulo");
                    setVisible(true)
                }

            },
        });

        editor.Panels.addButton('options', {
            id: "gallery",
            label: 'Galeria',
            command: async function () {

            },
        });



        // Puedes agregar bloques o configuraciones adicionales aquí

        return () => {
            // Destruye GrapesJS cuando el componente se desmonta para evitar fugas de memoria
            editor.destroy();
        };
    }, []);

    function assignTitle() {
        let value = $("input[name='name']").val();

        if (value) {
            setVisible(false)
        } else {
            toast.error("Opps no has asignado un titulo")
        }
    }



    return (
        <>
            <body theme={'ligth'}>
                <ModalSmall visible={visible} callback={setVisible} close={setVisible} onClick={assignTitle}>
                    <div className="top">
                        <p>Elegir titulo</p>
                        <span>elige un titulo para esta plantilla</span>
                    </div>

                    <br />

                    <div className="form-input">
                        <input name="name" type="text" placeholder="Titulo" />
                    </div>
                </ModalSmall>

                <input type="number" id="id_edit" hidden />
                <input type="number" id="id_company" value={UserInfo?.company?.id_company} hidden />
                <div ref={editorRef}></div>
            </body>
        </>

    );
}
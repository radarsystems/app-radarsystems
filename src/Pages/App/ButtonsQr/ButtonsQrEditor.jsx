import { useState } from "react"
import EditorLeftButtonsQr from "../../../Components/App/ButtonsQr/Editor/EditorLeft";
import EditorRightButtonsQr from "../../../Components/App/ButtonsQr/Editor/EditorRight";
import BodyButtonsQr from "../../../Components/App/ButtonsQr/Editor/Body";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import WizardButtonsQr from "../../../Components/App/ButtonsQr/WizardButtonsQr";

export default function ButtonsQrEditor() {
    const [buttons, setButtons] = useState({ header: { titlegl: "", title: "", desc: "", img: "", background: "" }, elements: [] });
    const [editor, setEditor] = useState({ key: "", type: "" })
    const params = useParams()
    const [type, setType] = useState(undefined)
    const [wizardVisible, setWizardVisible] = useState(false)

    useEffect(() => {
        switch (type) {
            case 'personal':
                setButtons({ header: { titlegl: "", title: "", desc: "", img: "", background: "" }, elements: [] })
                break;

            case 'company':
                setButtons({ header: { titlegl: "", title: "", desc: "", img: "", background: "" }, elements: [{ title: "Business Card", qrs: [] }, { title: "Redes Sociales", qrs: [] }, { title: "Presentaciones", qrs: [] }] })
                break;
        }


    }, [type])

    useEffect(() => {
        if (!params.id) {
            setWizardVisible(true)
        }
    }, [])


    return (
        <>
            <WizardButtonsQr Visible={wizardVisible} Callback={setWizardVisible} setType={setType} TypeSelect={type} />

            <div className="editor-surveys">
                <div className="rows">
                    <div className="left">
                        <EditorLeftButtonsQr editor={editor} setEditor={setEditor} buttons={buttons} setButtons={setButtons} />
                    </div>
                    <div className="center complete" style={{ background: buttons?.header?.background }}>
                        <BodyButtonsQr editor={editor} setEditor={setEditor} buttons={buttons} setButtons={setButtons} />
                    </div>

                    {/*
                    <div className="right">
                        <div className="type-editor">
                            <EditorRightButtonsQr editor={editor} setEditor={setEditor} buttons={buttons} setButtons={setButtons} />
                        </div>
                    </div>
    */}
                </div>
            </div>
        </>
    )
}
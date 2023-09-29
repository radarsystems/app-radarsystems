import { useState } from "react"
import EditorLeftButtonsQr from "../../../Components/App/ButtonsQr/Editor/EditorLeft";
import EditorRightButtonsQr from "../../../Components/App/ButtonsQr/Editor/EditorRight";
import BodyButtonsQr from "../../../Components/App/ButtonsQr/Editor/Body";

export default function ButtonsQrEditor() {

    const [buttons, setButtons] = useState({ header: { titlegl: "", title: "", desc: "", img: "", background: "" }, elements: [] });
    const [editor, setEditor] = useState({ key: "", type: "" })

    return (
        <>
            <div className="editor-surveys">
                <div className="rows">
                    <div className="left">
                        <EditorLeftButtonsQr editor={editor} setEditor={setEditor} buttons={buttons} setButtons={setButtons} />
                    </div>
                    <div className="center" style={{ background: buttons?.header?.background }}>
                        <BodyButtonsQr editor={editor} setEditor={setEditor} buttons={buttons} setButtons={setButtons} />
                    </div>
                    <div className="right">
                        <div className="type-editor">
                            <EditorRightButtonsQr editor={editor} setEditor={setEditor} buttons={buttons} setButtons={setButtons} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
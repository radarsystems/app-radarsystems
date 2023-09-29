import { useState } from "react"
import EditorLeftButtons from "../../../Components/App/Buttons/Editor/EditorLeft"
import BodyButtonsEditor from "../../../Components/App/Buttons/Editor/Body"
import EditorRigthButtons from "../../../Components/App/Buttons/Editor/EditorRight"

export default function ButtonsEditor() {

    const [loading, setLoading] = useState(true)
    const [buttons, setButtons] = useState({ header: { title: "", desc: "", img: "", background: "" }, buttons: [], rs: [] })
    const [editor, setEditor] = useState({});

    return (<>
        <div className="editor-surveys">
            <div className="rows">
                <div className="left">
                    <EditorLeftButtons editor={editor} setButtons={setButtons} buttons={buttons} />
                </div>
                <div className="center" style={{ background: buttons?.header?.background }}>
                    <BodyButtonsEditor editor={editor} setEditor={setEditor} buttons={buttons} setButtons={setButtons} />
                </div>
                <div className="right">
                    <div className="type-editor">
                        <EditorRigthButtons editor={editor} buttons={buttons} setButtons={setButtons} setEditor={setEditor} />
                    </div>
                </div>
            </div>
        </div>
    </>)
}
import EditDescButtons from "../../Buttons/Editor/EditDesc";
import EditLogoButtons from "../../Buttons/Editor/EditLogo";
import EditTitleButtons from "../../Buttons/Editor/EditTitle";
import EditTitleSpace from "./EditTitleSpace";

export default function EditorRightButtonsQr({ editor, buttons, setButtons }) {

    return (
        <>
            {editor.type == "title" ?
                <EditTitleButtons editor={editor} buttons={buttons} setButtons={setButtons} />
                : ''}

            {editor.type == "desc" ?
                <EditDescButtons editor={editor} buttons={buttons} setButtons={setButtons} />
                : ''}

            {editor.type == "logo" ?
                <EditLogoButtons editor={editor} buttons={buttons} setButtons={setButtons} />
                : ''}

            {editor.type == "titlespace" ?
                <EditTitleSpace editor={editor} buttons={buttons} setButtons={setButtons} />
                : ''}
        </>
    )
}
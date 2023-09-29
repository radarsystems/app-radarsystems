import EditRs from "../EditRs";
import EditButtonButtons from "./EditButton";
import EditDescButtons from "./EditDesc";
import EditLogoButtons from "./EditLogo";
import EditTitleButtons from "./EditTitle";

export default function EditorRigthButtons({ editor, buttons, setButtons, setEditor }) {

    return (
        <>
            {editor.type == "button" ?
                <EditButtonButtons editor={editor} buttons={buttons} setButtons={setButtons} />
                : ''}

            {editor.type == "title" ?
                <EditTitleButtons editor={editor} buttons={buttons} setButtons={setButtons} />
                : ''}

            {editor.type == "desc" ?
                <EditDescButtons editor={editor} buttons={buttons} setButtons={setButtons} />
                : ''}

            {editor.type == "logo" ?
                <EditLogoButtons editor={editor} buttons={buttons} setButtons={setButtons} />
                : ''}


            {editor.type == "rs" ?
                <EditRs editor={editor} buttons={buttons} setButtons={setButtons} setEditor={setEditor} />
                : ''}
        </>
    )
}
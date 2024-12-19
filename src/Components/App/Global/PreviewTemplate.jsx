import { Icon } from "@iconify/react/dist/iconify.js"

export default function PreviewTemplateHtml({ visible = false, close, htmlPreview }) {


    return (

        <>
            {visible && <>
                <div className="preview-html">
                    <div className="controls">
                        <div className="left">
                            <button className="btn-action" onClick={(ev) => { close(false) }}><Icon icon="icon-park-outline:return" /></button>
                        </div>

                        <p className="title">Previsualizar HTML</p>
                    </div>
                    <div className="body" dangerouslySetInnerHTML={{ __html: htmlPreview }}></div>
                </div>
            </>}
        </>

    )
}
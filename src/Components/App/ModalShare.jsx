export default function ModalShare() {

    return (
        <>
            <div className="modal-share">
                <div className="body">
                    <div className="bk">
                        <div className="top">
                            <p>Compartir desde Radarsystems</p>
                        </div>

                        <div className="buttons">

                            <button>Compartir en Snapchat</button>
                            <button>Compartir en Facebook</button>
                            <button>Compartir en Tiktok</button>
                            <button>Compartir en Linkedln</button>
                            <button>Compartir en Whatsapp</button>
                            <button>Compartir en Messenger</button>


                        </div>

                        <div className="url">
                            <span>{window.location.href}</span>
                        </div>

                        <div className="register">
                            <p>Create your own Linktree</p>
                            <span>The only link in bio trusted by 35M+ people.</span>

                            <div className="actions">
                                <button>Sign up free</button>
                                <button>Find out more</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
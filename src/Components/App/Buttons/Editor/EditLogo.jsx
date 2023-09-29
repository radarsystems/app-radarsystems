export default function EditLogoButtons({ setButtons, buttons }) {

    function changeImg(ev) {
        let value = ev.target.value

        setButtons((prevData) => {
            let newData = { ...prevData }
            newData.header.logo = value
            return newData
        })

    }

    return (
        <>
            <div className="option">
                <div className="top">
                    <p>Logo</p>
                    <input onChange={changeImg} id="title-edit" type="text" placeholder="https://image.com/jfop2.jpg" />
                </div>
            </div>
        </>
    )
}
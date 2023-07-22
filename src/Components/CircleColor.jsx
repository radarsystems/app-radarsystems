import $ from "jquery"

export default function CircleColor({ color, fn }) {

    function Active(ev) {
        ev.stopPropagation()
        let target = $(ev.target)
        let parent = target.parents(".colors");

        target.parents(".colors").find(".active").removeClass("active");
        target.addClass("active");

        parent.find("button").css({ opacity: "0.5" })
        target.css({ opacity: "1" })
    }

    return (<>
        <button className="option-color" style={{ background: color }} value={color} onClick={(ev) => { fn(ev.target.value), Active(ev) }}></button >
    </>)
}
import $ from "jquery"


$(document).on("click", ".settings-account .case .info button", function (ev) {
    ev.preventDefault()
    ev.stopImmediatePropagation()

    let divCase = $(this).parents(".case");
    $(".settings-account .case.active").removeClass("active")
    divCase.addClass("active")
})

export function JconfigSucces() {
    $(".settings-account .case.active").removeClass("active")
}
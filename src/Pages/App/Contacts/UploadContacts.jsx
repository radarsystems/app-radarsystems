import { useContext, useEffect, useState } from "react";
import WizardContactsList from "../../../Components/App/Contacts/WizardContacts";
import WizardUploadContacts from "../../../Components/App/Contacts/WizardUploadContacts";

export default function UploadContacts() {

    return (
        <>
            <WizardUploadContacts Visible={true} />

        </>
    )
}
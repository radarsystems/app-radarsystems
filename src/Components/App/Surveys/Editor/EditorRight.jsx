import { useState } from "react";
import EditTitle from "./EditTitle";
import { useEffect } from "react";
import EditDesc from "./EditDesc";
import EditTitleQuest from "./EditTitleQuest";

export default function EditorRight({ edit, json, setJson }) {

    return (<>
        {edit.type == "title" ? <EditTitle page={edit.page} key={edit.key} value={json[edit.key]} setJson={setJson} keyid={edit.key} /> : ''}
        {edit.type == "desc" ? <EditDesc page={edit.page} key={edit.key} value={json[edit.key]} setJson={setJson} keyid={edit.key} /> : ''}
        {edit.type == "title-quest" ? <EditTitleQuest page={edit.page} quest_key={edit.quest_key} key={edit.key} value={json[edit.page].quests[edit.key]?.questions[edit.quest_key]} setJson={setJson} keyid={edit.key} /> : ''}

    </>)
}
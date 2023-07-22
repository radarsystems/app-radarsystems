import React, { useEffect, useState } from "react";
import { randomId } from "../Functions/Global";

export default function SelectTypeCompany({ name, id, valueDefault, onChange }) {
  const [idSelect, setSelectId] = useState(randomId())

  useEffect(() => {
    if (valueDefault) {
      document.querySelector(`.select-${idSelect}`).value = valueDefault
    }
  }, []);

  function handleChange(event) {
    if (onChange) {
      onChange(event);
    }
  }

  return (
    <select name={name} id={id} onChange={handleChange} className={`select-${idSelect}`}>
      <option value="def" selected disabled>Seleccionar</option>
      <option value="md">Marketing Digital</option>
      <option value="tec">Tecnología</option>
      <option value="tele">Telecomunicaciones</option>
      <option value="soft">Software</option>
    </select>
  );
}

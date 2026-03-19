import React from 'react';
import { SELECT_OPTIONS, STAFF_SELECT_FIELDS, FORM_TO_LOCK } from './constants';

const FormField = ({ tableName, col, value, onChange, staffList, isError }) => {
  const { Field, Type } = col;
  const inputId = `${tableName}_${Field}`;
  const isLocked = FORM_TO_LOCK.includes(Field);
  const isStaff = STAFF_SELECT_FIELDS.includes(Field);
  const options = SELECT_OPTIONS[Field];

let inputType = "text";
const t = Type?.toUpperCase() || "";

if (t.includes("DATETIME") || t.includes("TIMESTAMP")) {
  inputType = "datetime-local";
} else if (t.includes("DATE")) {
  inputType = "date";
} else if (t.includes("TIME")) {
  inputType = "time";
} else if (t.includes("INT") || t.includes("FLOAT") || t.includes("DECIMAL")) {
  inputType = "number";
}

  const props = {
    id: inputId,
    value: value || "",
    onChange: (e) => onChange(tableName, Field, e.target.value),
    className: isError ? "input-error" : "",
    disabled: isLocked,
    required: !isLocked
  };

  return (
    <div className="formChild">
      <label>{Field}</label>
      {isStaff ? (
        <select {...props}>
          <option value="">-- Pilih Petugas --</option>
          {staffList.map(s => <option key={s.id} value={s.id}>{s.Nama}</option>)}
        </select>
      ) : options ? (
        <select {...props}>
          <option value="">-- Pilih {Field} --</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input {...props} type={inputType} step="any" />
      )}
    </div>
  );
};

export default FormField;
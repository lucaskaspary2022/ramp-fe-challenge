import classNames from "classnames"
import { useRef } from "react"
import { InputCheckboxComponent } from "./types"
import { check } from "prettier"

export const InputCheckbox: InputCheckboxComponent = ({ id, checked = false, disabled, onChange }) => {
  const { current: inputId } = useRef(`RampInputCheckbox-${id}`)

  return (
    <div className="RampInputCheckbox--container" data-testid={inputId}>
      <label
        htmlFor={inputId}
        className={classNames("RampInputCheckbox--label", {
          "RampInputCheckbox--label-checked": checked,
          "RampInputCheckbox--label-disabled": disabled,
        })}
      />
      <input
        id={inputId}
        type="checkbox"
        className="RampInputCheckbox--input"
        checked={checked}
        disabled={disabled}
        onChange={(event) => {
          // console.log("Event: ", event.target.value)

          onChange(!checked)
        }}
        // onChange={handleChange}
      />
    </div>
  )
}

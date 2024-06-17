import { PickerProvider, PickerProviderProps } from "./picker-provider"
import { PickerSelector } from "./picker-selector"
import { usePickerField } from "./usePickerField"

const ButtonOption = ({
  children,
  isSelected,
  name,
  selectOption,
  value,
}) => (
  <button
    aria-pressed={isSelected}
    name={name}
    onClick={selectOption}
    type="button"
    value={value}
  >
    {children}
  </button>
)

const InputOption = ({
  children,
  isSelected,
  name,
  optionType,
  selectOption,
  value,
}) => (
  <label>
    <input
      checked={isSelected}
      name={name}
      onClick={selectOption}
      type={optionType}
      value={value}
    />

    {children}
  </label>
)

const InputButtonOption = ({
  children,
  isSelected?,
  name?,
  optionType?,
  selectOption?,
}) => (
  <input
    aria-pressed={isSelected}
    name={name}
    onClick={selectOption}
    type="button"
    value={children}
  />
)

const InputRoleOption = ({
  children,
  isSelected,
  optionType,
  selectOption,
}) => (
  <span
    aria-checked={isSelected}
    aria-label={children}
    onClick={selectOption}
    role={optionType}
    tabIndex="0"
  >
    {children}
  </span>
)

const SelectOption = ({
  children,
  isSelected,
  selectOption,
}) => (
  <span
    aria-label={children}
    aria-selected={isSelected}
    onClick={selectOption}
    role="option"
    tabIndex="0"
  >
    {children}
  </span>
)

const SelectOptionList = ({
  children,
}) => (
  <div
    aria-orientation="vertical"
    data-vertical
    role="listbox"
  >
    {children}
  </div>
)

const SwitchOption = ({
  children,
  isSelected,
  selectOption,
}) => (
  <label>
    <div>
      {children}
    </div>

    <button
      aria-checked={isSelected}
      onClick={selectOption}
      role="switch"
      tabIndex="0"
    >
      <span>Off</span>
      <span>On</span>
    </button>
  </label>
)

export const Picker: PickerProviderProps = {
    render: () => {
      const {
        onChange,
        value,
      } = (
        usePickerField(
          ''
        )
      )
  
      return (
        <PickerProvider
          onChange={onChange}
          value={value}
        >
          <fieldset data-vertical>
            <PickerSelector
              value="first"
            >
              <InputButtonOption>
                First
              </InputButtonOption>
            </PickerSelector>
  
            <PickerSelector
              value="second"
            >
              <InputButtonOption>
                Second
              </InputButtonOption>
            </PickerSelector>
  
            <PickerSelector
              value="third"
            >
              <InputButtonOption>
                Third
              </InputButtonOption>
            </PickerSelector>
          </fieldset>
        </PickerProvider>
      )
    }
}

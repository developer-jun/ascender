import { FieldValidation } from "@/types/common";

let validations: FieldValidation[] = [];
const validationRules = [{
    rules: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    name: "email",
    type: "regex",
    message: "Please enter a valid email address.",
  },{
    rules: /^.+$/,
    name: "required",
    type: "regex",
    message: " is required",
  },{
    rules: null,
    name: "length",
    type: "method",
    message: "Minimum length is not met.",
  }];

type ValidationProps = {
  label: string,
  value: string,
  type?: 'regex' | 'method',
  rules?: RegExp | null,
}
const validate = ({label, value}: ValidationProps) => {
  const validationResult = validationRules.find((rule) => rule.name === label);
  if(validationResult) {
    if(!validationResult.rules.test(value)) {
      return {field: label, message: validationResult.message};
    }
  }

}
  

if(itemData.name === '') {
    validations.push({field: 'name', message: 'Tag Name cannot be empty!'});
  }


import OptionGroups from "./ui/optionGroups";
import { Provider, optionData } from "@/admin/contexts/option";

export default function OptionPage() {
  return (
    <Provider initialValue={optionData}>
      <section className="contents">
        <h1>Product Options</h1>      
        <OptionGroups />
      </section>
    </Provider>
  )
}

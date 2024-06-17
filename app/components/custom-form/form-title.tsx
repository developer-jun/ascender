//import { useCategoryForm } from "@/app/admin/contexts/categoryFormcontext";

import { memo, ReactNode, HTMLProps, HTMLAttributes } from "react";

interface CommonHTMLProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}
const FormTitle: React.FC<CommonHTMLProps> = ({ children, ...restProps }) => (
  <h2 {...restProps}>{children}</h2>
);

export default memo(FormTitle);
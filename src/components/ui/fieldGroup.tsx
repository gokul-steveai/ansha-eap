import { ReactNode } from "react";

type FieldGroup = {
    label?: string;
    children: ReactNode;
}
const FieldGroup = ({label,children}:FieldGroup) => {
    return (
        <div className="border-1 rounded-lg border-gray-200 border-solid">
            <div className="rounded-t-lg border-b border-gray-200 py-2 px-4 bg-primary/5">
                <span className="uppercase text-sm tracking-wide text-primary font-[600]">{label}</span>
            </div>
            <div className="p-8 space-y-8">
                {children}
            </div>
        </div>
    );
}

export default FieldGroup;
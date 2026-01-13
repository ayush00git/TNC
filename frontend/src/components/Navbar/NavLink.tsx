import type { ReactNode } from "react";
import { Link } from "react-router-dom";
interface NavbarLinkProps {
    to: string;
    label: string;
    icon?: React.ReactNode;
}
export default function NavLink({ to, label, icon }: NavbarLinkProps) {

    return (
    <Link to={to} className= "flex items-center gap-2 p-2">
        {icon}
        {label}
    </Link>
)
}
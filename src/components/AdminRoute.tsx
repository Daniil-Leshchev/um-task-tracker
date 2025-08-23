import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function AdminRoute({ children }: { children: JSX.Element }) {
    const auth = useContext(AuthContext)!;
    const user = auth?.user;

    if (!auth.loading && !user) {
        return <Navigate to="/login" replace />;
    }

    if (!auth.loading && !user.is_admin) {
        return <Navigate to="/tasktracker" replace />;
    }

    return children;
}
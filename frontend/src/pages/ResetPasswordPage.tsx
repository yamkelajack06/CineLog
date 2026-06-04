import { useLocation } from "react-router-dom";
import AuthCard from "../components/auth/AuthCard";
import ResetPasswordForm from "../components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
    const location = useLocation();
    const initialEmail = location.state?.email ?? "";

    return (
        <AuthCard>
            <ResetPasswordForm initialEmail={initialEmail} />
        </AuthCard>
    );
}

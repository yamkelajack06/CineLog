import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Trash2, LogOut, ChevronRight, AlertTriangle } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { useAuthContext } from "../context/AuthContext";
import { useAccount } from "../hooks/useAccount";
import HomeNav from "../components/home/HomeNav";
import HomeFooter from "../components/home/HomeFooter";
import Feedback from "../components/auth/Feedback";
import styles from "../styles/profile.module.css";

// which section is currently expanded
type ActiveSection = "username" | "email" | "password" | "delete" | null;

export default function Profile() {
    const { theme, toggleTheme } = useTheme();
    const { user, logout, login: updateStoredUser } = useAuthContext();
    const navigate = useNavigate();

    const [activeSection, setActiveSection] = useState<ActiveSection>(null);

    // form field state
    const [username, setUsername] = useState(user?.username ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [deletePassword, setDeletePassword] = useState("");
    const [localError, setLocalError] = useState<string | null>(null);

    const { loading, error, success, updateUsername, updateEmail, updatePassword, deleteAccount } = useAccount(user?.id ?? "");

    // toggle section open/closed, reset local error on switch
    const toggleSection = (section: ActiveSection) => {
        setActiveSection((prev) => (prev === section ? null : section));
        setLocalError(null);
    };

    // handle username update
    async function handleUsernameSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLocalError(null);

        if (!username.trim()) {
            setLocalError("Username cannot be empty.");
            return;
        }

        const ok = await updateUsername(username.trim());

        // update the stored user in context so the nav reflects the new name
        if (ok && user) {
            updateStoredUser({ ...user, username: username.trim() });
            setActiveSection(null);
        }
    }

    // handle email update
    async function handleEmailSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLocalError(null);

        if (!email.trim()) {
            setLocalError("Email cannot be empty.");
            return;
        }

        const ok = await updateEmail(email.trim());

        if (ok && user) {
            // email changed means status resets to unverified — log out so user re-verifies
            updateStoredUser({ ...user, email: email.trim(), status: "unverified" });
            setActiveSection(null);
        }
    }

    // handle password update
    async function handlePasswordSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLocalError(null);

        if (newPassword.length < 8) {
            setLocalError("New password must be at least 8 characters.");
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setLocalError("Passwords do not match.");
            return;
        }

        const ok = await updatePassword(currentPassword, newPassword);

        if (ok) {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
            setActiveSection(null);
        }
    }

    // handle account deletion — logs out and redirects on success
    async function handleDeleteSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLocalError(null);

        const ok = await deleteAccount(deletePassword);

        if (ok) {
            logout();
            navigate("/", { replace: true });
        }
    }

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };

    // redirect to login if not authenticated
    if (!user) {
        navigate("/login", { replace: true });
        return null;
    }

    const displayError = localError ?? error;

    return (
        <div className={styles.page}>
            <div className={styles.pageContent}>
                <HomeNav theme={theme} toggleTheme={toggleTheme} />

                <main className={styles.main}>
                    <div className={styles.pageHeader}>
                        <h1 className={styles.pageTitle}>Account</h1>
                        <p className={styles.pageSubtitle}>Manage your profile and account settings.</p>
                    </div>

                    {/* profile summary */}
                    <div className={styles.profileCard}>
                        <div className={styles.avatar}>
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className={styles.profileInfo}>
                            <p className={styles.profileName}>{user.username}</p>
                            <p className={styles.profileEmail}>{user.email}</p>
                            <span className={`${styles.statusBadge} ${user.status === "verified" ? styles.statusVerified : styles.statusUnverified}`}>
                                {user.status}
                            </span>
                        </div>
                        <button className={styles.logoutBtn} onClick={handleLogout}>
                            <LogOut size={15} />
                            Sign out
                        </button>
                    </div>

                    {/* settings sections */}
                    <div className={styles.sections}>

                        {/* username */}
                        <div className={styles.section}>
                            <button className={styles.sectionHeader} onClick={() => toggleSection("username")}>
                                <div className={styles.sectionIcon}><User size={16} /></div>
                                <div className={styles.sectionMeta}>
                                    <span className={styles.sectionLabel}>Username</span>
                                    <span className={styles.sectionValue}>{user.username}</span>
                                </div>
                                <ChevronRight size={16} className={`${styles.chevron} ${activeSection === "username" ? styles.chevronOpen : ""}`} />
                            </button>

                            {activeSection === "username" && (
                                <div className={styles.sectionBody}>
                                    {displayError && activeSection === "username" && <Feedback message={displayError} type="error" />}
                                    {success && activeSection === "username" && <Feedback message={success} type="success" />}

                                    <form onSubmit={handleUsernameSubmit} noValidate>
                                        <div className={styles.field}>
                                            <label className={styles.label} htmlFor="username">New username</label>
                                            <input
                                                id="username"
                                                className={styles.input}
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                autoComplete="username"
                                                autoFocus
                                            />
                                        </div>
                                        <div className={styles.formActions}>
                                            <button className={styles.cancelBtn} type="button" onClick={() => toggleSection(null)}>Cancel</button>
                                            <button className={styles.saveBtn} type="submit" disabled={loading}>
                                                {loading && <span className={styles.spinner} />}
                                                Save
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>

                        {/* email */}
                        <div className={styles.section}>
                            <button className={styles.sectionHeader} onClick={() => toggleSection("email")}>
                                <div className={styles.sectionIcon}><Mail size={16} /></div>
                                <div className={styles.sectionMeta}>
                                    <span className={styles.sectionLabel}>Email</span>
                                    <span className={styles.sectionValue}>{user.email}</span>
                                </div>
                                <ChevronRight size={16} className={`${styles.chevron} ${activeSection === "email" ? styles.chevronOpen : ""}`} />
                            </button>

                            {activeSection === "email" && (
                                <div className={styles.sectionBody}>
                                    <p className={styles.sectionNote}>
                                        Changing your email will set your account back to unverified. You'll need to verify the new address.
                                    </p>

                                    {displayError && activeSection === "email" && <Feedback message={displayError} type="error" />}
                                    {success && activeSection === "email" && <Feedback message={success} type="success" />}

                                    <form onSubmit={handleEmailSubmit} noValidate>
                                        <div className={styles.field}>
                                            <label className={styles.label} htmlFor="email">New email</label>
                                            <input
                                                id="email"
                                                className={styles.input}
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                autoComplete="email"
                                                autoFocus
                                            />
                                        </div>
                                        <div className={styles.formActions}>
                                            <button className={styles.cancelBtn} type="button" onClick={() => toggleSection(null)}>Cancel</button>
                                            <button className={styles.saveBtn} type="submit" disabled={loading}>
                                                {loading && <span className={styles.spinner} />}
                                                Save
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>

                        {/* password */}
                        <div className={styles.section}>
                            <button className={styles.sectionHeader} onClick={() => toggleSection("password")}>
                                <div className={styles.sectionIcon}><Lock size={16} /></div>
                                <div className={styles.sectionMeta}>
                                    <span className={styles.sectionLabel}>Password</span>
                                    <span className={styles.sectionValue}>••••••••</span>
                                </div>
                                <ChevronRight size={16} className={`${styles.chevron} ${activeSection === "password" ? styles.chevronOpen : ""}`} />
                            </button>

                            {activeSection === "password" && (
                                <div className={styles.sectionBody}>
                                    {displayError && activeSection === "password" && <Feedback message={displayError} type="error" />}
                                    {success && activeSection === "password" && <Feedback message={success} type="success" />}

                                    <form onSubmit={handlePasswordSubmit} noValidate>
                                        <div className={styles.field}>
                                            <label className={styles.label} htmlFor="current-password">Current password</label>
                                            <input
                                                id="current-password"
                                                className={styles.input}
                                                type="password"
                                                placeholder="••••••••"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                autoComplete="current-password"
                                                autoFocus
                                            />
                                        </div>
                                        <div className={styles.field}>
                                            <label className={styles.label} htmlFor="new-password">New password</label>
                                            <input
                                                id="new-password"
                                                className={styles.input}
                                                type="password"
                                                placeholder="Min. 8 characters"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                autoComplete="new-password"
                                            />
                                        </div>
                                        <div className={styles.field}>
                                            <label className={styles.label} htmlFor="confirm-new-password">Confirm new password</label>
                                            <input
                                                id="confirm-new-password"
                                                className={styles.input}
                                                type="password"
                                                placeholder="Repeat new password"
                                                value={confirmNewPassword}
                                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                                autoComplete="new-password"
                                            />
                                        </div>
                                        <div className={styles.formActions}>
                                            <button className={styles.cancelBtn} type="button" onClick={() => toggleSection(null)}>Cancel</button>
                                            <button className={styles.saveBtn} type="submit" disabled={loading}>
                                                {loading && <span className={styles.spinner} />}
                                                Save
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>

                        {/* delete account — separated visually as a danger zone */}
                        <div className={`${styles.section} ${styles.sectionDanger}`}>
                            <button className={styles.sectionHeader} onClick={() => toggleSection("delete")}>
                                <div className={`${styles.sectionIcon} ${styles.sectionIconDanger}`}><Trash2 size={16} /></div>
                                <div className={styles.sectionMeta}>
                                    <span className={`${styles.sectionLabel} ${styles.sectionLabelDanger}`}>Delete account</span>
                                    <span className={styles.sectionValue}>Permanently remove your account and all data</span>
                                </div>
                                <ChevronRight size={16} className={`${styles.chevron} ${activeSection === "delete" ? styles.chevronOpen : ""}`} />
                            </button>

                            {activeSection === "delete" && (
                                <div className={styles.sectionBody}>
                                    <div className={styles.dangerWarning}>
                                        <AlertTriangle size={16} />
                                        <p>This will permanently delete your account, watchlist, and all watch logs. This cannot be undone.</p>
                                    </div>

                                    {displayError && activeSection === "delete" && <Feedback message={displayError} type="error" />}

                                    <form onSubmit={handleDeleteSubmit} noValidate>
                                        <div className={styles.field}>
                                            <label className={styles.label} htmlFor="delete-password">Confirm your password</label>
                                            <input
                                                id="delete-password"
                                                className={styles.input}
                                                type="password"
                                                placeholder="••••••••"
                                                value={deletePassword}
                                                onChange={(e) => setDeletePassword(e.target.value)}
                                                autoComplete="current-password"
                                                autoFocus
                                            />
                                        </div>
                                        <div className={styles.formActions}>
                                            <button className={styles.cancelBtn} type="button" onClick={() => toggleSection(null)}>Cancel</button>
                                            <button className={styles.deleteBtn} type="submit" disabled={loading || !deletePassword}>
                                                {loading && <span className={styles.spinner} />}
                                                Delete account
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                <HomeFooter />
            </div>
        </div>
    );
}
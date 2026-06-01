import styles from "../../styles/auth.module.css";

interface Props {
    message: string;
    type: "error" | "success";
}

export default function Feedback({ message, type }: Props) {
    return (
        <div className={`${styles.feedback} ${type === "error" ? styles.feedbackError : styles.feedbackSuccess}`}>
            {message}
        </div>
    );
}
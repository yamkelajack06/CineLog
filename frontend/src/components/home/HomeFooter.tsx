import styles from "../../styles/home.module.css";

export default function HomeFooter() {
    return (
        <footer className={styles.footer}>
            <span>© {new Date().getFullYear()} CineLog</span>
            <div className={styles.footerLinks}>
                <a href="#" className={styles.footerLink}>Privacy</a>
                <a href="#" className={styles.footerLink}>Terms</a>
                <a href="#" className={styles.footerLink}>Support</a>
            </div>
        </footer>
    );
}

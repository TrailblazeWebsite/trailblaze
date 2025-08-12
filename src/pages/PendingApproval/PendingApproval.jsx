import styles from "./PendingApproval.module.css";
import LogoutButton from "../../components/LogoutButton";

function PendingApproval() {

    return (
        <div>
            <img src={"https://res.cloudinary.com/dgfycfxe1/image/upload/v1754420389/trailblaze_red_logo2_xlecjf.png"} alt="Logo" className={styles["responsive-img"]}/>
            <h1>Thanks for signing up to trailblaze, your account hasnt been approved yet!</h1>
            <LogoutButton />
        </div>

    );
}

export default PendingApproval;
import React from "react";
import styles from "./About.module.css";

function About() {
    return (
        <div className={styles.container}>
            {/* Video */}
            <div className={styles.videoContainer}>
                <video autoPlay loop muted playsInline>
                    <source
                        src="https://res.cloudinary.com/dgfycfxe1/video/upload/v1756836720/videoplayback_mws7op.mp4"
                        type="video/mp4"
                    />
                </video>
            </div>

            <div className={styles.content}>
                {/* Top row: Trailblaze full width */}
                <div className={`${styles.section} ${styles.topRow}`}>
                    <div className={styles.imgWrapper}>
                        <img
                            src="https://res.cloudinary.com/dgfycfxe1/image/upload/v1754151712/cld-sample-2.jpg"
                            alt="Trailblaze"
                            className={styles.image}
                        />
                    </div>
                    <div className={styles.textBlock}>
                        <h1>Trailblaze</h1>
                        <p>
                            Trailblaze is a modern web app designed to connect people with places, categories, and
                            communities in an engaging way. It features role-based access (applicants, users, trailblazers,
                            vanguards, and admins), allowing smooth management of users and applications. With a clean
                            dashboard for admins and an inviting front-facing experience, Trailblaze blends exploration with
                            simplicity—making it easy to discover, apply, and connect.
                        </p>
                    </div>
                </div>

                {/* Bottom row: About + Image + Contact */}
                <div className={`${styles.section} ${styles.bottomRow}`}>
                    <div className={styles.textBlock}>
                        <h1>About us</h1>
                        <p>
                            Trailblaze is an app dedicated to connecting people with extraordinary places, offering
                            intuitive navigation and rich experiences. Our platform encourages exploration and fosters community engagement.
                        </p>
                    </div>
                    <div className={styles.imgWrapper}>
                        <img
                            src="https://res.cloudinary.com/dgfycfxe1/image/upload/v1754151712/cld-sample-2.jpg"
                            alt="About us"
                            className={styles.image}
                        />
                    </div>
                    <div className={styles.contactItems}>
                        <a
                            href="https://www.instagram.com/trailblaze_global/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Instagram
                        </a>
                        <a href="mailto:trailblaze@outlook.de">Email</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;

import Navbar from "../../components/Navbar/Navbar.jsx";
import styles from "./About.module.css"
import React from "react";
import {Link} from "react-router-dom";


function About() {
    return (
        <div className={styles.container}>
            <div className={styles.videoContainer}>
                <video autoPlay loop muted playsInline>
                    <source
                        src="https://res.cloudinary.com/dgfycfxe1/video/upload/v1756836720/videoplayback_mws7op.mp4"
                        type="video/mp4"
                    />
                </video>
            </div>

            <div className={styles.content}>
                <div className={styles.section}>
                    <div className={styles.imgWrapper}>
                        <img
                            src="https://res.cloudinary.com/dgfycfxe1/image/upload/v1754151712/cld-sample-2.jpg"
                            alt="Trailblaze"
                            className={styles.image}
                        />
                    </div>
                    <div className={styles.textBlock}>
                        <h1>Trailblaze</h1>
                        Trailblaze is a modern web app designed to connect people with places, categories, and
                        communities in an engaging way. It features role-based access (applicants, users, trailblazers,
                        vanguards, and admins), allowing smooth management of users and applications. With a clean
                        dashboard for admins and an inviting front-facing experience, Trailblaze blends exploration with
                        simplicity—making it easy to discover, apply, and connect.
                    </div>
                </div>

                <div className={styles.section}>
                    <div className={styles.imgWrapper}>
                        <img
                            src="https://res.cloudinary.com/dgfycfxe1/image/upload/v1754151712/cld-sample-2.jpg"
                            alt="About us"
                            className={styles.image}
                        />
                    </div>
                    <div className={styles.textBlock}>
                        <h1>About us</h1>
                        Tailblaze is an app
                    </div>
                </div>
            </div>

            <div className={styles.contact}>
                <h1>Contact us</h1>
                <div className={styles.contactItems}>
                    <div className={styles.contactItems}>
                        <a
                            href="https://www.instagram.com/trailblaze_global/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Instagram
                        </a>
                        <a href="mailto:trailblaze@outlook.de">
                            Email
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About
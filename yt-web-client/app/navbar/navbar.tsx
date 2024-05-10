'use client';
import Image from "next/image";
import Link from "next/link";
import styles from "./navbar.module.css";
import styles_button from "./sign-in.module.css";
import SignIn from "./sign-in";
import { onAuthStateChangedHelper } from "../utilities/firebase/firebase";
import { useEffect, useState, Fragment } from "react";
import { User } from "firebase/auth";
import Upload from "./upload";
//closure
export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    useEffect(() => {
        const unsubscribe = onAuthStateChangedHelper((user) => {
            setUser(user);
            setIsLoading(false); // Set loading to false once authentication check is complete
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);
    if (isLoading) {
        return (
            <nav className={styles.nav}>
                <Link href="/" >
                    <Image width={90} height={20}
                        src="/youtube-logo.svg" alt="YoutTube Logo" />
                </Link>
                <Fragment>
                    {
                        <button className={styles_button.loading} >
                            Sign In
                        </button>
                    }
                </Fragment>

            </nav>
        )
    }
    return (

        <nav className={styles.nav}>
            <div>
                <Link href="/" >
                    <Image width={90} height={20} src="/youtube-logo.svg" alt="YouTube Logo" />
                </Link>
            </div>
            <div className={styles.buttonContainer}>
                {user && (
                    <Link href="/upload">
                        <button className={styles.uploadButton}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        </button>
                    </Link>
                )}
                <SignIn user={user} />
            </div>
        </nav>
    );
}
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
            <Link href="/" >
                <Image width={90} height={20}
                    src="/youtube-logo.svg" alt="YoutTube Logo" />
            </Link>
            {
                
                user && <Fragment>
                    <Link href="/upload" >
                    <button>upload</button>
                    </Link>
                </Fragment>
                //<Upload />
            }
            <SignIn user={user} />
        </nav>
    );
}
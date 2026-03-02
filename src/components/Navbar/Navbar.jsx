import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

import Home from "../../assets/Home";
import Scan from "../../assets/Scan";
import History from "../../assets/History";
import Batches from "../../assets/Batches";

import styles from "./Navbar.module.css";

const navItems = [
    { to: "/", label: "Home", icon: <Home /> },
    { to: "/scan", label: "Scan", icon: <Scan /> },
    { to: "/history", label: "History", icon: <History /> },
    { to: "/batches", label: "Batches", icon: <Batches /> },
];

const Navbar = () => {
    const indicatorRef = useRef(null);
    const linkRefs = useRef([]);
    const location = useLocation();

    useEffect(() => {
        const activeItem = linkRefs.current.find((el) =>
            el?.classList.contains(styles.active)
        );
        const indicator = indicatorRef.current;

        if (activeItem && indicator) {
            const indicatorWidth = 32; // 60% width
            const offset = (activeItem.offsetWidth - indicatorWidth) / 2 - 5; // shift to the right

            indicator.style.width = indicatorWidth + "px";
            indicator.style.transform = `translateX(${activeItem.offsetLeft + offset}px)`;
        }
    }, [location.pathname]);

    return (
        <nav>
            <div className={styles.wrap}>
                <div className={styles.wrapInner}>
                    {navItems.map((item, i) => (
                        <NavLink
                            ref={(el) => (linkRefs.current[i] = el)}
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `${styles.item} ${isActive ? styles.active : ""}`
                            }
                        >
                            <div className={styles.icon}>{item.icon}</div>
                            <div className={styles.name}>{item.label}</div>
                        </NavLink>
                    ))}

                    <div ref={indicatorRef} className={styles.indicator}></div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
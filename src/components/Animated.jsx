import { useEffect, useRef, useState } from "react";

/**
 * <Animated as="div" variant="fade-up" delay={120}>...</Animated>
 * variant: "fade-up" | "fade-in" | "scale-in"
 */
export default function Animated({
                                     as: Tag = "div",
                                     variant = "fade-up",
                                     delay = 0,
                                     className = "",
                                     children,
                                     ...rest
                                 }) {
    const ref = useRef(null);
    const [inview, setInview] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInview(true);
                    io.disconnect();
                }
            },
            { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <Tag
            ref={ref}
            className={`reveal ${inview ? "inview" : ""} ${className}`}
            data-anim={variant}
            style={{ "--delay": `${delay}ms` }}
            {...rest}
        >
            {children}
        </Tag>
    );
}

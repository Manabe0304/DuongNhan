import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            {/* Navbar */}
            <nav style={styles.navbar}>
                <h2>SkinAI</h2>

                <div>
                    <button
                        style={styles.loginBtn}
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>

                    <button
                        style={styles.registerBtn}
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <section style={styles.hero}>
                <h1>AI Skin Analysis & Recommendation</h1>

                <p>
                    Upload your skin image, analyze conditions,
                    receive product recommendations and connect
                    with doctors.
                </p>

                <button
                    style={styles.startBtn}
                    onClick={() => navigate("/login")}
                >
                    Analyze Now
                </button>
            </section>

            {/* Features */}
            <section style={styles.features}>
                <div style={styles.card}>
                    <h3>Skin Analysis</h3>
                    <p>Detect acne, oil and skin condition.</p>
                </div>

                <div style={styles.card}>
                    <h3>Product Recommendation</h3>
                    <p>Suggest suitable skincare products.</p>
                </div>

                <div style={styles.card}>
                    <h3>Doctor Booking</h3>
                    <p>Connect with dermatologist.</p>
                </div>
            </section>

            <footer style={styles.footer}>
                © 2026 SkinAI
            </footer>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        fontFamily: "Arial",
        background: "#f8fafc"
    },

    navbar: {
        display: "flex",
        justifyContent: "space-between",
        padding: "20px 50px",
        background: "white"
    },

    hero: {
        textAlign: "center",
        padding: "120px 20px"
    },

    startBtn: {
        padding: "12px 24px",
        borderRadius: "8px",
        border: "none",
        background: "#2563eb",
        color: "white",
        cursor: "pointer"
    },

    loginBtn: {
        marginRight: "10px"
    },

    registerBtn: {},

    features: {
        display: "flex",
        gap: "20px",
        justifyContent: "center",
        padding: "40px"
    },

    card: {
        width: "250px",
        background: "white",
        padding: "20px",
        borderRadius: "10px"
    },

    footer: {
        textAlign: "center",
        padding: "30px"
    }
};
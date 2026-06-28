

export default function HomePage() {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background: "#ffffff",
            }}
        >
            <h1>Welcome To SkinAI</h1>

            <p>
                AI Skin Analysis & Recommendation
            </p>

            <button>
                Login
            </button>
        </div>
    );
}
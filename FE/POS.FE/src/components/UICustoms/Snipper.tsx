type SpinnerProps = {
    size?: "sm" | "md" | "lg";
};

export default function Spinner({ size = "md" }: SpinnerProps) {
    const sizes = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-10 h-10" };

    return (
        <div
            className={`${sizes[size]} border-4 border-t-current border-gray-400 rounded-full animate-spin`}
            style={{ color: "var(--text-color)" }}
        ></div>
    );
}
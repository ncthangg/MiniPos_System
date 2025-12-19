import theme from "../styles/theme";

export const MainBoardLayout: React.FC<{
    left: React.ReactNode;
    right: React.ReactNode;
}> = ({ left, right }) => {
    return (
        <div
            className="flex flex-col overflow-hidden w-full h-full"
            style={{
                backgroundColor: theme.colors.surface.subtle,
                fontFamily: theme.fonts.family.base,
                height: "100%",
            }}
        >

            <main
                className="flex-1 overflow-hidden min-h-0 p-6"
                style={{ 
                    display: "grid", 
                    gridTemplateColumns: "3fr 1fr",
                    gap: theme.sizes.spacing.lg,
                    height: "100%"
                }}
            >
                <div 
                    className="min-w-0 overflow-hidden flex flex-col h-full"
                >
                    {left}
                </div>

                <div className="min-w-[260px] max-w-xs overflow-hidden flex flex-col h-full">
                    {right}
                </div>
            </main>

        </div>
    );
};

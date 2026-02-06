import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-8">
                <div>
                    <h1 className="text-4xl font-bold">🍽️ Cardápio Digital</h1>
                    <p className="text-muted-foreground mt-2">Faça login para acessar o painel</p>
                </div>
                <SignIn
                    appearance={{
                        elements: {
                            formButtonPrimary: "bg-primary text-primary-foreground border-2 border-black shadow-neo hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]",
                            card: "border-2 border-black shadow-neo-lg",
                        }
                    }}
                />
            </div>
        </div>
    );
}

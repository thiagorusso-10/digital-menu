import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-8">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">🍽️ Cardápio Digital</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Gerencie seu cardápio de forma simples e moderna.
          </p>
          <div className="flex flex-col gap-3">
            <Button asChild size="lg" className="w-full">
              <Link href="/admin">Acessar Painel Admin</Link>
            </Button>

          </div>
        </CardContent>
      </Card>
    </main>
  );
}

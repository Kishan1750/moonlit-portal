
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Navigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ui-components/ThemeToggle";
import { LogOut } from "lucide-react";

export default function Dashboard() {
  const { currentUser, logout, isLoading } = useAuth();

  // Show loading or redirect to login if not authenticated
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen w-full bg-background animate-fade-in">
      <header className="glass sticky top-0 z-10 backdrop-blur-lg border-b">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <h1 className="text-xl font-medium">App Dashboard</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground hidden sm:inline-block">
              {currentUser.email}
            </span>
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={logout} 
              className="ml-2"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="glass rounded-2xl p-8 mt-4 animate-slide-in">
          <h2 className="text-2xl font-medium mb-6">Welcome to Dashboard</h2>
          <p className="text-muted-foreground mb-4">
            You've successfully logged in. This is a placeholder dashboard that will be expanded with more features in the future.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[1, 2, 3].map((item) => (
              <div 
                key={item}
                className="glass p-6 rounded-xl hover:shadow-lg transition-all duration-300 border border-border/30"
              >
                <h3 className="text-lg font-medium mb-2">Dashboard Card {item}</h3>
                <p className="text-sm text-muted-foreground">
                  This is a placeholder card that will display actual content in the future.
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

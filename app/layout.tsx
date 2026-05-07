import Link from "next/link";
import type { Metadata } from "next";
import "./globals.css";
import { getCurrentProfile } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";

export const metadata: Metadata = {
  title: "Quiz Classroom",
  description: "Piattaforma quiz per studenti e docenti"
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();

  return (
    <html lang="it">
      <body>
        <div className="page-shell">
          <nav className="top-nav">
            <Link href="/" className="nav-link">Quiz Classroom</Link>
            <div className="top-nav-links">
              {profile ? (
                <>
                  <Link className="nav-link" href={profile.role === "admin" ? "/admin" : "/dashboard"}>
                    Home
                  </Link>
                  {profile.role === "student" ? <Link className="nav-link" href="/history">Storico</Link> : null}
                  {profile.role === "admin" ? (
                    <>
                      <Link className="nav-link" href="/admin/questions">Domande</Link>
                      <Link className="nav-link" href="/admin/upload">CSV</Link>
                      <Link className="nav-link" href="/admin/stats">Statistiche</Link>
                    </>
                  ) : null}
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link className="nav-link" href="/login">Login</Link>
                  <Link className="nav-link" href="/signup">Registrazione</Link>
                </>
              )}
            </div>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}

import '@rainbow-me/rainbowkit/styles.css';
import "./globals.css";
import { ContextProviders } from "./context";
import { headers } from 'next/headers'

export default async function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body>
                <ContextProviders cookies={(await headers()).get('cookie')}> 
                    {children}
                </ContextProviders>
            </body>
        </html>
    )
}

import './globals.css';

export const metadata = {
    title: 'PREDIABET Admin Panel',
    description: 'Prediabet uygulaması yönetim paneli',
};

export default function RootLayout({ children }) {
    return (
        <html lang="tr">
            <body>{children}</body>
        </html>
    );
}

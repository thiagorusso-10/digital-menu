import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Cardápio Digital'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: '#F97316', // Laranja do tema
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'white',
                        padding: '40px 60px',
                        borderRadius: '30px',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                    }}
                >
                    <h1 style={{ fontSize: 72, fontWeight: 'bold', color: '#F97316', margin: 0 }}>
                        Cardápio Digital
                    </h1>
                </div>
                <p style={{ color: 'white', fontSize: 32, marginTop: 30, fontWeight: 500 }}>
                    Gerencie seu cardápio de forma simples e moderna
                </p>
            </div>
        ),
        {
            ...size,
        }
    )
}

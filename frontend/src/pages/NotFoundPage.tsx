import { Link } from 'react-router-dom';

export function NotFoundPage() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center'
        }}>
            <h1>404</h1>
            <p>Page introuvable</p>
            <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
        </div>
    );
}

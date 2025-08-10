export default function NotFound() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            textAlign: 'center'
        }}>
            <div>
                <h1>404 - Страница не найдена</h1>
                <p>Извините(сь), запрашиваемая страница не существует</p>
            </div>
        </div>
    );
}
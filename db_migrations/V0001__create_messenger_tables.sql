CREATE TABLE IF NOT EXISTS servers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS channels (
    id SERIAL PRIMARY KEY,
    server_id INTEGER REFERENCES servers(id),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('text', 'voice', 'stream')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    avatar VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'online',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    channel_id INTEGER REFERENCES channels(id),
    user_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reactions (
    id SERIAL PRIMARY KEY,
    message_id INTEGER REFERENCES messages(id),
    user_id INTEGER REFERENCES users(id),
    emoji VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(message_id, user_id, emoji)
);

CREATE TABLE IF NOT EXISTS user_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    server_id INTEGER REFERENCES servers(id),
    role VARCHAR(50) NOT NULL,
    role_color VARCHAR(50),
    UNIQUE(user_id, server_id)
);

INSERT INTO servers (name, icon) VALUES 
    ('Главный сервер', '🎮'),
    ('Геймеры', '🔥'),
    ('Разработка', '💻'),
    ('Музыка', '🎵');

INSERT INTO channels (server_id, name, type) VALUES 
    (1, 'общий', 'text'),
    (1, 'мемы', 'text'),
    (1, 'Голосовой чат', 'voice'),
    (1, 'Стрим', 'stream'),
    (1, 'игры', 'text');

INSERT INTO users (username, avatar, status) VALUES 
    ('SpaceRanger', '🚀', 'online'),
    ('CyberNinja', '⚡', 'online'),
    ('PixelMaster', '🎨', 'idle'),
    ('CodeBot', '🤖', 'online'),
    ('ShadowKnight', '⚔️', 'offline');

INSERT INTO user_roles (user_id, server_id, role, role_color) VALUES 
    (1, 1, 'ADMIN', 'text-destructive'),
    (2, 1, 'MOD', 'text-primary'),
    (4, 1, 'BOT', 'text-accent');

INSERT INTO messages (channel_id, user_id, content) VALUES 
    (1, 1, 'Всем привет! Кто сегодня играет?'),
    (1, 2, 'Я в деле! Поднимаем сервер через 10 минут'),
    (1, 3, 'Закинул новые скины в файлы, проверьте!'),
    (1, 4, '🎉 Новый участник присоединился к серверу!');

INSERT INTO reactions (message_id, user_id, emoji) VALUES 
    (1, 2, '👋'),
    (1, 3, '👋'),
    (1, 4, '👋'),
    (1, 5, '👋'),
    (1, 1, '👋'),
    (1, 2, '🎮'),
    (1, 3, '🎮'),
    (1, 4, '🎮'),
    (2, 1, '🔥'),
    (2, 3, '🔥');
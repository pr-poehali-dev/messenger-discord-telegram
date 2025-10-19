'''
Business: API для работы с сообщениями мессенджера - получение и отправка сообщений
Args: event - dict с httpMethod, body, queryStringParameters
      context - объект с атрибутами request_id, function_name
Returns: HTTP response с сообщениями или статусом операции
'''
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database URL not configured'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(database_url)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        channel_id = params.get('channel_id', '1')
        
        cur.execute('''
            SELECT 
                m.id,
                m.content,
                m.created_at,
                u.username as author,
                u.avatar,
                ur.role,
                ur.role_color
            FROM messages m
            JOIN users u ON m.user_id = u.id
            LEFT JOIN user_roles ur ON u.id = ur.user_id AND ur.server_id = 1
            WHERE m.channel_id = %s
            ORDER BY m.created_at ASC
        ''', (channel_id,))
        
        messages = cur.fetchall()
        
        for msg in messages:
            msg['timestamp'] = msg['created_at'].strftime('%H:%M')
            del msg['created_at']
            
            cur.execute('''
                SELECT emoji, COUNT(*) as count
                FROM reactions
                WHERE message_id = %s
                GROUP BY emoji
            ''', (msg['id'],))
            
            reactions = cur.fetchall()
            msg['reactions'] = [{'emoji': r['emoji'], 'count': r['count']} for r in reactions]
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(messages),
            'isBase64Encoded': False
        }
    
    elif method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        content = body_data.get('content', '')
        channel_id = body_data.get('channel_id', 1)
        user_id = body_data.get('user_id', 1)
        
        if not content.strip():
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Message content is required'}),
                'isBase64Encoded': False
            }
        
        cur.execute('''
            INSERT INTO messages (channel_id, user_id, content)
            VALUES (%s, %s, %s)
            RETURNING id, content, created_at
        ''', (channel_id, user_id, content))
        
        new_message = cur.fetchone()
        
        cur.execute('''
            SELECT 
                u.username as author,
                u.avatar,
                ur.role,
                ur.role_color
            FROM users u
            LEFT JOIN user_roles ur ON u.id = ur.user_id AND ur.server_id = 1
            WHERE u.id = %s
        ''', (user_id,))
        
        user_data = cur.fetchone()
        
        conn.commit()
        cur.close()
        conn.close()
        
        result = {
            'id': new_message['id'],
            'content': new_message['content'],
            'timestamp': new_message['created_at'].strftime('%H:%M'),
            'author': user_data['author'],
            'avatar': user_data['avatar'],
            'role': user_data['role'],
            'role_color': user_data['role_color'],
            'reactions': []
        }
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(result),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }

"""
To test: python3 -m websockets ws://localhost:8081/
Then paste one of the following messages:
    * { "type": "login", "username": "walter" }
    * { "type": "disconnect" }
    * { "type": "chat", "text": "Hello world!", "username": "walter" }

"""

from dotenv import load_dotenv
import asyncio
import websockets
import json
import os

load_dotenv()

logged_in_users = dict()

PORT = os.environ.get('PORT') or os.environ.get('WS_PORT') or 8081


async def respond_to_message(websocket, message):
    try:
        data = json.loads(message)
    except:
        data = {
            'error': 'error decoding {0}'.format(message),
            'details': 'See instructions for list of valid message formats.'}
        return await websocket.send(json.dumps(data))

    broadcast_message = None
    if data['type'] == 'login':
        logged_in_users[websocket] = data['username']
        broadcast_message = {
            'type': 'login',
            'username': data['username'],
            'active_users': list(logged_in_users.values())
        }
    elif data['type'] == 'disconnect':
        username = logged_in_users[websocket]
        del logged_in_users[websocket]
        broadcast_message = {
            'type': 'disconnect',
            'username': username,
            'active_users': list(logged_in_users.values())
        }
    elif data['type'] == 'chat':
        broadcast_message = data
    else:
        print('Unrecognized message:', data)

    if broadcast_message:
        for sock in logged_in_users:
            await sock.send(json.dumps(broadcast_message))


async def broadcast_messages(websocket, path):
    try:
        async for message in websocket:
            await respond_to_message(websocket, message)
    except websockets.ConnectionClosed as e:
        print('A client just disconnected')
        print(e)
    finally:
        if logged_in_users.get(websocket):
            del logged_in_users[websocket]


async def main():
    async with websockets.serve(broadcast_messages, "", PORT):
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    print('Starting web socket server...')
    print('ws://localhost:{0}'.format(PORT))
    asyncio.run(main())

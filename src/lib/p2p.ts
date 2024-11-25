import Peer, { DataConnection } from 'peerjs';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';

let peer: Peer | null = null;
const connections = new Map<string, DataConnection>();

export const initializePeer = () => {
  const user = useAuthStore.getState().user;
  if (!user || peer) return;

  peer = new Peer(user.uid);

  peer.on('connection', (conn) => {
    console.log('接続を受信:', conn.peer);
    setupConnection(conn);
  });

  peer.on('error', (err) => {
    console.error('Peer エラー:', err);
  });
};

export const connectToPeer = (peerId: string) => {
  if (!peer) return;
  
  const conn = peer.connect(peerId);
  setupConnection(conn);
};

const setupConnection = (conn: DataConnection) => {
  connections.set(conn.peer, conn);

  conn.on('data', (data: any) => {
    const { type, payload } = data;
    const store = useStore.getState();

    switch (type) {
      case 'BOARD_UPDATE':
        store.updateBoardFromPeer(payload);
        break;
      case 'REQUEST_BOARD':
        if (store.currentBoard) {
          conn.send({
            type: 'BOARD_UPDATE',
            payload: store.currentBoard
          });
        }
        break;
    }
  });

  conn.on('close', () => {
    console.log('接続が閉じられました:', conn.peer);
    connections.delete(conn.peer);
  });

  // 初回接続時にボードデータを要求
  conn.send({
    type: 'REQUEST_BOARD'
  });
};

export const broadcastBoardUpdate = (boardData: any) => {
  connections.forEach(conn => {
    conn.send({
      type: 'BOARD_UPDATE',
      payload: boardData
    });
  });
};

export const disconnectPeer = () => {
  connections.forEach(conn => conn.close());
  connections.clear();
  if (peer) {
    peer.destroy();
    peer = null;
  }
};
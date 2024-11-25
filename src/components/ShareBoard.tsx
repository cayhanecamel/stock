import React, { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { connectToPeer } from '../lib/p2p';

interface Props {
  boardId: string;
}

export const ShareBoard: React.FC<Props> = ({ boardId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [peerId, setPeerId] = useState('');
  const [copied, setCopied] = useState(false);
  const { user } = useAuthStore();

  const handleShare = () => {
    if (peerId.trim()) {
      connectToPeer(peerId.trim());
      setIsOpen(false);
      setPeerId('');
    }
  };

  const handleCopyId = async () => {
    if (user) {
      await navigator.clipboard.writeText(user.uid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Share2 size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-medium mb-4">ボードを共有</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  あなたの共有ID
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={user?.uid || ''}
                    readOnly
                    className="flex-1 px-3 py-2 border rounded-md bg-gray-50"
                  />
                  <button
                    onClick={handleCopyId}
                    className="p-2 text-gray-600 hover:text-gray-800"
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  共有相手のID
                </label>
                <input
                  type="text"
                  value={peerId}
                  onChange={(e) => setPeerId(e.target.value)}
                  placeholder="共有相手のIDを入力"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleShare}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  共有
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
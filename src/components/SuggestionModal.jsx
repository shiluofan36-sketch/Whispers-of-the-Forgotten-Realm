import { useState } from 'react';

export default function SuggestionModal({ onClose, onSubmit }) {
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) {
      setError('内容不能为空');
      return;
    }
    try {
      await onSubmit(content.trim());
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-600 rounded-lg p-6 w-96">
        <h3 className="text-amber-400 text-center mb-4" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '11px' }}>
          意见箱
        </h3>

        {submitted ? (
          <div className="text-center">
            <p className="text-green-400 text-sm mb-4">感谢你的反馈！</p>
            <button onClick={onClose} className="px-4 py-2 bg-gray-700 text-gray-300 rounded text-sm hover:bg-gray-600 transition cursor-pointer">关闭</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              placeholder="写下你的建议或反馈..."
              maxLength={500}
              value={content}
              onChange={e => { setContent(e.target.value); setError(''); }}
              rows={4}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-gray-200 rounded text-sm focus:outline-none focus:border-amber-500 resize-none"
            />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="flex-1 py-2 bg-gray-700 text-gray-300 rounded text-sm hover:bg-gray-600 transition cursor-pointer">取消</button>
              <button type="submit" className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded text-sm font-bold transition cursor-pointer">提交</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

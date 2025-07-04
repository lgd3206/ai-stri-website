'use client';
import { useState } from 'react';

export default function SimpleTestPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTest = async (q) => {
    const testQuestion = q || question;
    if (!testQuestion.trim()) return;
    
    setLoading(true);
    setAnswer('');
    
    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: testQuestion })
      });
      
      const data = await response.json();
      if (data.success) {
        setAnswer(data.answer);
      } else {
        setAnswer('错误: ' + data.error);
      }
    } catch (error) {
      setAnswer('网络错误: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🤖 AI安全助手 - 测试版</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="请输入安全生产相关问题..."
          style={{ width: '70%', padding: '10px', fontSize: '16px' }}
        />
        <button
          onClick={() => handleTest()}
          disabled={loading}
          style={{ marginLeft: '10px', padding: '10px 20px', fontSize: '16px' }}
        >
          {loading ? '思考中...' : '提问'}
        </button>
      </div>

      {answer && (
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', marginBottom: '20px' }}>
          <strong>AI回答：</strong><br />
          {answer}
        </div>
      )}

      <div>
        <h3>快捷测试：</h3>
        <button onClick={() => handleTest('什么是安全生产法？')}>测试1</button>
        <button onClick={() => handleTest('如何进行风险评估？')}>测试2</button>
        <button onClick={() => handleTest('应急预案要包含哪些内容？')}>测试3</button>
      </div>
    </div>
  );
}
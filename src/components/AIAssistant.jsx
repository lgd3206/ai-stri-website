 'use client';
import { useState, useRef, useEffect } from 'react';
import styles from './AIAssistant.module.css';

const AIAssistant = () => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: '您好！我是安全技术研究院的AI助手。我可以为您解答各种安全生产相关问题，包括法规解读、风险评估、应急管理等。请告诉我您想了解什么？',
      timestamp: new Date(),
      relatedTopics: []
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    '什么是重大危险源？',
    '如何进行风险评估？',
    '应急预案要包含哪些内容？',
    '安全生产法的主要内容是什么？',
    '如何建立隐患排查制度？',
    '特种作业人员有哪些要求？'
  ];

  const handleSubmit = async (questionText = question) => {
    const trimmedQuestion = questionText.trim();
    
    if (!trimmedQuestion || loading) return;

    setError('');

    const userMessage = {
      type: 'user',
      content: trimmedQuestion,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);

    try {
      console.log('发送请求到 /api/ai-chat');
      
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: trimmedQuestion }),
      });

      console.log('收到响应，状态:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: 请求失败`);
      }

      const data = await response.json();
      console.log('响应数据:', data);

      if (data.success) {
        const aiMessage = {
          type: 'ai',
          content: data.answer,
          relatedTopics: data.relatedTopics || [],
          timestamp: new Date(),
          tokensUsed: data.tokensUsed,
          mode: data.mode
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || '未知错误');
      }

    } catch (error) {
      console.error('请求错误:', error);
      setError(error.message);
      
      const errorMessage = {
        type: 'ai',
        content: `抱歉，出现了错误：${error.message}。请检查网络连接或稍后再试。`,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const clearChat = () => {
    setMessages([{
      type: 'ai',
      content: '对话已清空。请问有什么新的安全问题需要咨询吗？',
      timestamp: new Date()
    }]);
    setError('');
  };

  return (
    <div className={styles.container}>
      {/* 头部 */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2>🤖 AI安全助手</h2>
          <p>专业的安全生产知识问答，为您提供准确的安全管理指导</p>
          <div className={styles.headerButtons}>
            <button onClick={clearChat} className={styles.clearButton}>
              🗑️ 清空对话
            </button>
            <div className={styles.statusBadge}>
              {messages.some(m => m.mode === 'demo') ? '🎭 演示模式' : '🤖 AI模式'}
            </div>
          </div>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className={styles.errorBanner}>
          ⚠️ {error}
        </div>
      )}

      {/* 快捷问题 */}
      <div className={styles.quickQuestions}>
        <h4>💡 常见问题（点击快速提问）：</h4>
        <div className={styles.questionButtons}>
          {quickQuestions.map((q, index) => (
            <button
              key={index}
              className={styles.quickButton}
              onClick={() => handleSubmit(q)}
              disabled={loading}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* 对话区域 */}
      <div className={styles.chatArea}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              message.type === 'user' ? styles.userMessage : styles.aiMessage
            } ${message.isError ? styles.errorMessage : ''}`}
          >
            <div className={styles.messageHeader}>
              <strong>
                {message.type === 'user' ? '👤 您' : '🤖 AI助手'}
              </strong>
              <span className={styles.timestamp}>
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
            
            <div className={styles.messageContent}>
              {message.content}
            </div>
            
            {message.relatedTopics && message.relatedTopics.length > 0 && (
              <div className={styles.relatedTopics}>
                <small>
                  📚 相关领域：{message.relatedTopics.join('、')}
                </small>
              </div>
            )}
            
            {message.tokensUsed && (
              <div className={styles.tokenInfo}>
                <small>
                  🔢 使用 {message.tokensUsed} tokens
                  {message.mode === 'demo' && ' (演示模式)'}
                </small>
              </div>
            )}
          </div>
        ))}
        
        {loading && (
          <div className={`${styles.message} ${styles.aiMessage}`}>
            <div className={styles.messageHeader}>
              <strong>🤖 AI助手</strong>
            </div>
            <div className={styles.messageContent}>
              <div className={styles.typing}>
                <span></span>
                <span></span>
                <span></span>
                正在思考中...
              </div>
            </div>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>

      {/* 输入区域 */}
      <div className={styles.inputArea}>
        <div className={styles.inputWrapper}>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="请输入您的安全生产相关问题...（按Enter发送，Shift+Enter换行）"
            className={styles.textarea}
            rows={2}
            disabled={loading}
            maxLength={500}
          />
          <div className={styles.inputFooter}>
            <span className={styles.charCount}>
              {question.length}/500
            </span>
            <button
              onClick={() => handleSubmit()}
              disabled={loading || !question.trim()}
              className={styles.submitButton}
            >
              {loading ? '🤔 思考中...' : '📤 发送'}
            </button>
          </div>
        </div>
      </div>

      {/* 使用提示 */}
      <div className={styles.footer}>
        <small>
          💡 提示：当前为演示模式，基于安全生产专业知识库提供回答。
          回答仅供参考，如需权威解释请咨询相关法规原文。
        </small>
      </div>
    </div>
  );
};

export default AIAssistant;

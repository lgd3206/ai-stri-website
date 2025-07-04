import AIAssistant from '../../components/AIAssistant';

export const metadata = {
  title: 'AI安全助手 - 智能安全生产问答 | 安全技术研究院',
  description: '专业的安全生产AI助手，为您提供准确的安全管理知识问答服务',
  keywords: 'AI安全助手,安全生产问答,智能安全管理,安全知识库',
};

export default function AIAssistantPage() {
  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      paddingTop: '20px',
      paddingBottom: '40px'
    }}>
      <AIAssistant />
    </div>
  );
}
import React, { useState } from 'react';
import { ClipboardDocumentIcon, CheckIcon, UserIcon } from '@heroicons/react/24/outline';
import { ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/solid';

interface MessageProps {
  content: string;
  timestamp: Date;
  isUser: boolean;
}

const Message: React.FC<MessageProps> = ({ content, timestamp, isUser }) => {
  const [copied, setCopied] = useState(false);
  
  const messageTime = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Format message content with Markdown-like syntax
  const formatContent = (text: string) => {
    // Process code blocks (```code```)
    text = text.replace(/```([\s\S]*?)```/g, '<pre class="bg-zinc-800 p-3 rounded-md overflow-x-auto text-sm font-mono my-2 border border-zinc-700">$1</pre>');
    
    // Process inline code (`code`)
    text = text.replace(/`([^`]+)`/g, '<code class="bg-zinc-800 px-1 rounded font-mono text-sm border-b border-zinc-700">$1</code>');
    
    // Process bold (**text**)
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Process italic (*text*)
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Process URLs
    text = text.replace(
      /(https?:\/\/[^\s]+)/g, 
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-green-500 hover:underline">$1</a>'
    );
    
    // Process paragraphs
    text = text.split('\n\n').map(para => `<p class="mb-2">${para}</p>`).join('');
    
    // Process lists
    text = text.replace(/^- (.*)/gm, '<li class="mb-1">$1</li>');
    text = text.replace(/<li[^>]*>.*?<\/li>/g, match => `<ul class="list-disc list-inside my-2 space-y-1">${match}</ul>`);
    
    return text;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 group animate-fadeIn`}>
      {!isUser && (
        <div className="flex-shrink-0 mr-3">
          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
            <ChatBubbleBottomCenterTextIcon className="h-4 w-4 text-white" />
          </div>
        </div>
      )}
      
      <div
        className={`relative rounded-lg px-4 py-3 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg ${
          isUser 
            ? 'bg-zinc-800 text-white'
            : 'bg-zinc-800 text-white'
        }`}
      >
        <div 
          className="prose prose-sm max-w-none prose-invert prose-p:text-white prose-headings:text-white"
          dangerouslySetInnerHTML={{ __html: formatContent(content) }}
        />
        
        <div className="flex items-center justify-between mt-2 text-xs">
          <span className="text-zinc-400">
            {messageTime}
          </span>
          
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-zinc-700"
            aria-label="Copy message"
          >
            {copied ? (
              <CheckIcon className="h-4 w-4 text-green-400" />
            ) : (
              <ClipboardDocumentIcon className="h-4 w-4 text-zinc-400" />
            )}
          </button>
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 ml-3">
          <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
            <UserIcon className="h-4 w-4 text-white" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
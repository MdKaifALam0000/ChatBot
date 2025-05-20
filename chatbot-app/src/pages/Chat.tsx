import React, { useRef, useEffect, useState } from 'react';
import Message from '../components/Message';
import ChatInput from '../components/ChatInput';
import ErrorAlert from '../components/ErrorAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import TypingIndicator from '../components/TypingIndicator';
import useChat from '../hooks/useChat';
import { SparklesIcon, PlusIcon, ArrowLeftIcon, FolderIcon, XMarkIcon, PencilIcon } from '@heroicons/react/24/outline';
import { ChatBubbleLeftRightIcon, DocumentTextIcon } from '@heroicons/react/24/solid';
import ThemeToggle from '../components/ThemeToggle';

const Chat: React.FC = () => {
  const { messages: chatMessages, isLoading, isTyping, error, sendMessage, clearMessages: resetChatMessages } = useChat();
  const [messages, setMessages] = useState<typeof chatMessages>([]);
  const [showError, setShowError] = useState<boolean>(!!error);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeChatName, setActiveChatName] = useState<string>("My Chat");
  const [activeTab, setActiveTab] = useState<string>("All");
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [newFolderName, setNewFolderName] = useState<string>("");
  const [isAddingFolder, setIsAddingFolder] = useState<boolean>(false);
  const [editingFolderId, setEditingFolderId] = useState<number | null>(null);
  const [editFolderName, setEditFolderName] = useState<string>("");
  
  // Folder management
  const [folders, setFolders] = useState([
    { id: 1, name: "Work chats", count: 7 },
    { id: 2, name: "Life chats", count: 5 },
    { id: 3, name: "Projects chats", count: 9 },
    { id: 4, name: "Clients chats", count: 4 }
  ]);
  
  // Define the chat type
  interface Chat {
    id: number;
    name: string;
    snippet: string;
    folderId: number | null;
  }
  
  const [recentChats, setRecentChats] = useState<Chat[]>([
    { id: 1, name: "Plan a 3-day trip", snippet: "A 3-day trip to Paris with cultural highlights", folderId: 2 },
    { id: 2, name: "Ideas for a customer loyalty program", snippet: "Create a tiered system for a customer loyalty...", folderId: 1 },
    { id: 3, name: "Help me pick", snippet: "Help me pick gift options for my fishing-loving...", folderId: 3 }
  ]);
  
  // Track the current chat
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [showFolderMenu, setShowFolderMenu] = useState<boolean>(false);
  
  // Update local messages when chatMessages changes
  useEffect(() => {
    if (chatMessages) {
      setMessages(chatMessages);
    }
  }, [chatMessages]);

  // Scroll to bottom when messages change or when typing animation is happening
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Show error when error state changes
  useEffect(() => {
    setShowError(!!error);
  }, [error]);

  // Handle adding a new folder
  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      const newFolder = {
        id: Date.now(),
        name: newFolderName.trim(),
        count: 0
      };
      setFolders([...folders, newFolder]);
      setNewFolderName("");
      setIsAddingFolder(false);
    }
  };

  // Handle editing a folder
  const startEditingFolder = (folder: typeof folders[0]) => {
    setEditingFolderId(folder.id);
    setEditFolderName(folder.name);
  };

  const saveEditedFolder = () => {
    if (editFolderName.trim() && editingFolderId !== null) {
      setFolders(folders.map(folder => 
        folder.id === editingFolderId 
          ? { ...folder, name: editFolderName.trim() } 
          : folder
      ));
      setEditingFolderId(null);
    }
  };

  // Handle deleting a folder
  const deleteFolder = (id: number) => {
    setFolders(folders.filter(folder => folder.id !== id));
  };

  // Toggle sidebar for responsive design
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Start a new chat
  const startNewChat = () => {
    setActiveChatName("New Chat");
    setMessages([]);
    resetChatMessages();
    setCurrentChatId(null);
    setSelectedFolderId(null);
  };
  
  // Save current chat to a folder
  const saveCurrentChat = () => {
    if (messages.length > 0) {
      // Create a snippet from the first user message
      const firstUserMessage = messages.find(msg => msg.isUser);
      const snippet = firstUserMessage ? 
        (firstUserMessage.content.length > 60 ? 
          firstUserMessage.content.substring(0, 60) + '...' : 
          firstUserMessage.content) : 
        'No content';
      
      const newChat = {
        id: currentChatId || Date.now(),
        name: activeChatName,
        snippet: snippet,
        folderId: selectedFolderId
      };
      
      if (currentChatId) {
        // Update existing chat
        setRecentChats(prev => 
          prev.map(chat => chat.id === currentChatId ? newChat : chat)
        );
      } else {
        // Add new chat
        setRecentChats(prev => [newChat, ...prev]);
        setCurrentChatId(newChat.id);
      }
      
      // Update folder counts
      if (selectedFolderId) {
        updateFolderCounts();
      }
      
      return true;
    }
    return false;
  };
  
  // Move current chat to a folder
  const moveToFolder = (folderId: number | null) => {
    setSelectedFolderId(folderId);
    setShowFolderMenu(false);
    
    if (currentChatId) {
      // Update existing chat's folder
      setRecentChats(prev => 
        prev.map(chat => 
          chat.id === currentChatId ? 
          { ...chat, folderId: folderId } : 
          chat
        )
      );
      
      // If this is a new chat, save it now
      if (!recentChats.some(chat => chat.id === currentChatId)) {
        saveCurrentChat();
      } else {
        // Update folder counts
        updateFolderCounts();
      }
    }
  };
  
  // Update folder counts based on chats
  const updateFolderCounts = () => {
    const counts = recentChats.reduce((acc, chat) => {
      if (chat.folderId) {
        acc[chat.folderId] = (acc[chat.folderId] || 0) + 1;
      }
      return acc;
    }, {} as Record<number, number>);
    
    setFolders(prev => 
      prev.map(folder => ({
        ...folder,
        count: counts[folder.id] || 0
      }))
    );
  };
  
  // Load a chat
  const loadChat = (chat: typeof recentChats[0]) => {
    setActiveChatName(chat.name);
    setCurrentChatId(chat.id);
    setSelectedFolderId(chat.folderId || null);
    // In a real app, you would load the chat messages from storage here
  };

  const tabs = ["All", "Text", "Image", "Video"];

  return (
    <div className="min-h-screen flex bg-black text-white overflow-hidden">
      {/* Mobile sidebar toggle */}
      {!showSidebar && (
        <button 
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 md:hidden bg-zinc-800 p-2 rounded-lg text-zinc-300 hover:bg-zinc-700"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Sidebar */}
      <div className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static z-40 w-[280px] bg-zinc-900 border-r border-zinc-800 flex flex-col h-screen transition-transform duration-300 ease-in-out`}>
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-green-500" />
            <span className="font-medium">My Chats</span>
          </div>
          <button 
            onClick={toggleSidebar}
            className="md:hidden p-1.5 rounded-lg hover:bg-zinc-800"
          >
            <XMarkIcon className="h-5 w-5 text-zinc-400" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1">
          <div className="relative mb-4">
            <input 
              type="text" 
              placeholder="Search chats" 
              className="w-full bg-zinc-800 border-0 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
            />
            <svg className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Folders */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-medium text-zinc-400">Folders</h3>
              <button 
                onClick={() => setIsAddingFolder(true)}
                className="p-1 rounded hover:bg-zinc-800"
                aria-label="Add folder"
              >
                <PlusIcon className="h-4 w-4 text-zinc-400" />
              </button>
            </div>
            
            {isAddingFolder && (
              <div className="mb-2 flex items-center">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder name"
                  className="flex-1 bg-zinc-800 border-0 rounded-l-lg py-1.5 px-2 text-sm text-white placeholder-zinc-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleAddFolder}
                  className="bg-green-600 hover:bg-green-500 text-white py-1.5 px-3 rounded-r-lg text-sm"
                >
                  Add
                </button>
              </div>
            )}
            
            <div className="space-y-1">
              {folders.map((folder) => (
                <div key={folder.id} className="group flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-zinc-800 text-left">
                  {editingFolderId === folder.id ? (
                    <div className="flex-1 flex items-center">
                      <input
                        type="text"
                        value={editFolderName}
                        onChange={(e) => setEditFolderName(e.target.value)}
                        className="flex-1 bg-zinc-800 border-0 rounded-lg py-1 px-2 text-sm text-white focus:ring-1 focus:ring-green-500 focus:outline-none"
                        autoFocus
                        onBlur={saveEditedFolder}
                        onKeyDown={(e) => e.key === 'Enter' && saveEditedFolder()}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center">
                        <FolderIcon className="h-4 w-4 text-zinc-400 mr-2" />
                        <span className="text-sm text-zinc-300">{folder.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-zinc-500 mr-2">{folder.count}</span>
                        <div className="opacity-0 group-hover:opacity-100 flex space-x-1 transition-opacity">
                          <button 
                            onClick={() => startEditingFolder(folder)}
                            className="p-1 rounded hover:bg-zinc-700"
                            aria-label="Edit folder"
                          >
                            <PencilIcon className="h-3.5 w-3.5 text-zinc-400" />
                          </button>
                          <button 
                            onClick={() => deleteFolder(folder.id)}
                            className="p-1 rounded hover:bg-zinc-700"
                            aria-label="Delete folder"
                          >
                            <XMarkIcon className="h-3.5 w-3.5 text-zinc-400" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Recent Chats */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-medium text-zinc-400">Recent Chats</h3>
            </div>
            
            {/* Unfiled Chats */}
            <div className="mb-4">
              <h4 className="text-xs font-medium text-zinc-500 mb-1 pl-2">Unfiled</h4>
              <div className="space-y-1">
                {recentChats
                  .filter(chat => !chat.folderId)
                  .map((chat) => (
                    <button 
                      key={chat.id} 
                      className={`flex flex-col w-full px-3 py-2 rounded-lg ${currentChatId === chat.id ? 'bg-zinc-800' : 'hover:bg-zinc-800'} text-left`}
                      onClick={() => loadChat(chat)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-300">{chat.name}</span>
                      </div>
                      <p className="text-xs text-zinc-500 truncate">{chat.snippet}</p>
                    </button>
                  ))}
              </div>
            </div>
            
            {/* Chats by Folder */}
            {folders.map(folder => {
              const folderChats = recentChats.filter(chat => chat.folderId === folder.id);
              if (folderChats.length === 0) return null;
              
              return (
                <div key={folder.id} className="mb-4">
                  <h4 className="text-xs font-medium text-zinc-500 mb-1 pl-2 flex items-center">
                    <FolderIcon className="h-3.5 w-3.5 mr-1 text-zinc-500" />
                    {folder.name}
                  </h4>
                  <div className="space-y-1">
                    {folderChats.map((chat) => (
                      <button 
                        key={chat.id} 
                        className={`flex flex-col w-full px-3 py-2 rounded-lg ${currentChatId === chat.id ? 'bg-zinc-800' : 'hover:bg-zinc-800'} text-left`}
                        onClick={() => loadChat(chat)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-zinc-300">{chat.name}</span>
                        </div>
                        <p className="text-xs text-zinc-500 truncate">{chat.snippet}</p>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* New Chat Button */}
        <div className="p-4 border-t border-zinc-800">
          <button 
            onClick={startNewChat}
            className="flex items-center justify-center w-full bg-green-600 hover:bg-green-500 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New chat
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative bg-zinc-900">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar}
              className="mr-2 p-1.5 rounded-lg hover:bg-zinc-800 md:hidden"
              aria-label="Toggle sidebar"
            >
              <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-sm font-medium flex items-center">
              {activeChatName}
              <span className="ml-2 text-xs px-2 py-0.5 bg-green-900 text-green-400 rounded-full">Gemini</span>
              
              {/* Folder Selection Button */}
              <div className="relative ml-2">
                <button 
                  onClick={() => setShowFolderMenu(!showFolderMenu)}
                  className="flex items-center text-xs bg-zinc-800 hover:bg-zinc-700 rounded-lg px-2 py-1 transition-colors"
                >
                  <FolderIcon className="h-3.5 w-3.5 mr-1" />
                  {selectedFolderId ? 
                    folders.find(f => f.id === selectedFolderId)?.name || 'Select Folder' : 
                    'Add to Folder'}
                </button>
                
                {/* Folder Selection Dropdown */}
                {showFolderMenu && (
                  <div className="absolute left-0 mt-1 w-48 bg-zinc-800 rounded-lg shadow-lg overflow-hidden z-50">
                    <div className="p-1">
                      {folders.map(folder => (
                        <button
                          key={folder.id}
                          onClick={() => moveToFolder(folder.id)}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md ${selectedFolderId === folder.id ? 'bg-green-900 text-green-400' : 'hover:bg-zinc-700'}`}
                        >
                          <div className="flex items-center">
                            <FolderIcon className="h-4 w-4 mr-2 text-zinc-400" />
                            {folder.name}
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-zinc-700 p-1">
                      <button
                        onClick={() => {
                          if (currentChatId) {
                            moveToFolder(0); // Use 0 or null to remove from folder
                            setSelectedFolderId(null);
                          }
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-700 rounded-md"
                        disabled={!currentChatId}
                      >
                        <div className="flex items-center">
                          <XMarkIcon className="h-4 w-4 mr-2" />
                          Remove from folder
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => saveCurrentChat()}
              className="hidden sm:flex items-center text-xs bg-zinc-800 hover:bg-zinc-700 rounded-lg px-3 py-1.5 transition-colors"
              disabled={messages.length === 0}
            >
              <svg className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save Chat
            </button>
            <button 
              onClick={startNewChat}
              className="hidden sm:flex items-center text-xs bg-zinc-800 hover:bg-zinc-700 rounded-lg px-3 py-1.5 transition-colors"
            >
              <PlusIcon className="h-3.5 w-3.5 mr-1" />
              New Chat
            </button>
            <ThemeToggle />
          </div>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto py-4 px-4 md:px-8">
          {showError && error && (
            <ErrorAlert 
              message={error} 
              onDismiss={() => setShowError(false)} 
            />
          )}
          
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="max-w-md px-4">
                <div className="flex justify-center mb-6">
                  <SparklesIcon className="h-12 w-12 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-4">How can I help you today?</h2>
                <p className="text-sm text-zinc-400 mb-8">
                  I'm powered by Google's Gemini AI model. Ask me anything and I'll do my best to assist you.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <div className="flex justify-center mb-2">
                      <DocumentTextIcon className="h-6 w-6 text-green-500" />
                    </div>
                    <h3 className="text-sm font-medium mb-1">Smart Prompts</h3>
                    <p className="text-xs text-zinc-500">Ask clear, specific questions for better results</p>
                  </div>
                  
                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <div className="flex justify-center mb-2">
                      <ChatBubbleLeftRightIcon className="h-6 w-6 text-green-500" />
                    </div>
                    <h3 className="text-sm font-medium mb-1">Organize Chats</h3>
                    <p className="text-xs text-zinc-500">Create folders to keep your conversations organized</p>
                  </div>
                  
                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <div className="flex justify-center mb-2">
                      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium mb-1">Multiple Languages</h3>
                    <p className="text-xs text-zinc-500">Communicate in your preferred language</p>
                  </div>
                </div>
                
                {/* Tabs */}
                <div className="flex justify-center flex-wrap gap-2 mb-6">
                  {tabs.map(tab => (
                    <button
                      key={tab}
                      className={`text-xs px-3 py-1.5 rounded-full ${activeTab === tab ? 'bg-zinc-800 text-green-500' : 'text-zinc-400 hover:bg-zinc-800/50'}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((message) => (
                <Message
                  key={message.id}
                  content={message.content}
                  timestamp={message.timestamp}
                  isUser={message.isUser}
                />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        {/* Input Area */}
        <div className="p-4 border-t border-zinc-800">
          <div className="max-w-3xl mx-auto relative">
            <div className="flex items-center bg-zinc-800 rounded-xl overflow-hidden">
              <button className="p-2 text-zinc-400 hover:text-zinc-300" aria-label="AI options">
                <SparklesIcon className="h-5 w-5" />
              </button>
              
              <ChatInput 
                onSendMessage={sendMessage} 
                disabled={isLoading || isTyping} 
              />
              
              <button 
                onClick={(e) => {
                  if (!isLoading && !isTyping) {
                    const form = e.currentTarget.closest('form');
                    if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                  }
                }}
                className={`p-2 rounded-full mx-1 ${isLoading || isTyping ? 'bg-zinc-700 text-zinc-500' : 'bg-green-600 text-white hover:bg-green-500'}`}
                disabled={isLoading || isTyping}
                aria-label="Send message"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <p className="text-xs text-center text-zinc-500 mt-2">
              Gemini may display inaccurate information. Verify important details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
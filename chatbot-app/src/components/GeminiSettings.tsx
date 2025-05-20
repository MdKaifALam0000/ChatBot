import React, { useState } from 'react';
import { useGemini, GeminiModelType } from '../context/GeminiContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { XMarkIcon, KeyIcon } from '@heroicons/react/24/outline';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
`;

const SettingsContainer = styled(motion.div)`
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  
  @media (prefers-color-scheme: dark) {
    background: #1f2937;
  }
`;

const SettingsHeader = styled.div`
  padding: 1.25rem 1.5rem;
  background: linear-gradient(to right, #0ea5e9, #3b82f6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Content = styled.div`
  padding: 1.5rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #4b5563;
  font-size: 0.875rem;
  font-weight: 500;
  
  @media (prefers-color-scheme: dark) {
    color: #d1d5db;
  }
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  padding-right: 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  @media (prefers-color-scheme: dark) {
    background: #374151;
    border-color: #4b5563;
    color: white;
    
    &:focus {
      border-color: #60a5fa;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
    }
    
    &::placeholder {
      color: #9ca3af;
    }
  }
`;

const ShowHideButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  
  &:hover {
    background: #f3f4f6;
  }
  
  @media (prefers-color-scheme: dark) {
    color: #d1d5db;
    
    &:hover {
      background: #4b5563;
    }
  }
`;

const Status = styled.div<{ isValid: boolean }>`
  margin-top: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: ${props => props.isValid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${props => props.isValid ? '#059669' : '#dc2626'};
  font-size: 0.875rem;
  
  @media (prefers-color-scheme: dark) {
    background: ${props => props.isValid ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
    color: ${props => props.isValid ? '#34d399' : '#ef4444'};
  }
`;

const HelpText = styled.p`
  margin-top: 0.75rem;
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
  
  @media (prefers-color-scheme: dark) {
    color: #9ca3af;
  }
`;

const Link = styled.a`
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
  
  @media (prefers-color-scheme: dark) {
    color: #60a5fa;
  }
`;

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #2563eb;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  @media (prefers-color-scheme: dark) {
    background: #374151;
    border-color: #4b5563;
    color: white;
    
    &:focus {
      border-color: #60a5fa;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
    }
  }
`;

const GeminiSettings: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { apiKey, setApiKey, isValidKey, isLoading, error, selectedModel, setSelectedModel } = useGemini();
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [localModel, setLocalModel] = useState<GeminiModelType>(selectedModel);

  const handleSave = () => {
    if (!localApiKey.trim()) {
      return;
    }
    setApiKey(localApiKey.trim());
    setSelectedModel(localModel);
  };

  const handleShowKey = () => {
    setShowKey(!showKey);
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalModel(e.target.value as GeminiModelType);
  };

  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <SettingsContainer
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        onClick={e => e.stopPropagation()}
      >
        <SettingsHeader>
          <Title>
            <KeyIcon className="h-5 w-5" />
            Gemini API Settings
          </Title>
          <CloseButton onClick={onClose}>
            <XMarkIcon className="h-5 w-5" />
          </CloseButton>
        </SettingsHeader>
        
        <Content>
          <InputGroup>
            <Label htmlFor="apiKey">Google Gemini API Key</Label>
            <InputWrapper>
              <Input
                id="apiKey"
                type={showKey ? "text" : "password"}
                value={localApiKey}
                onChange={e => setLocalApiKey(e.target.value)}
                placeholder="Enter your Gemini API key"
              />
              <ShowHideButton type="button" onClick={handleShowKey}>
                {showKey ? "Hide" : "Show"}
              </ShowHideButton>
            </InputWrapper>
            
            {isValidKey && (
              <Status isValid={true}>
                API key is valid
              </Status>
            )}
            
            {error && (
              <Status isValid={false}>
                {error}
              </Status>
            )}
            
            <HelpText>
              Get your API key from{" "}
              <Link href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                Google AI Studio
              </Link>
            </HelpText>
          </InputGroup>
          
          <InputGroup>
            <Label htmlFor="model">Gemini Model</Label>
            <Select
              id="model"
              value={localModel}
              onChange={handleModelChange}
            >
              <option value="gemini-2.0-flash">Gemini 2.0 Flash (Higher Throughput)</option>
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast Response)</option>
            </Select>
            <HelpText>
              Gemini 2.0 Flash allows more requests per minute and is ideal for high-throughput applications. Both models process each message independently without conversation history.
            </HelpText>
          </InputGroup>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </Content>
      </SettingsContainer>
    </ModalOverlay>
  );
};

export default GeminiSettings; 
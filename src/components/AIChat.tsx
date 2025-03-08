import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Mic, Download } from 'lucide-react';
import nlp from 'compromise';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

interface Message {
  text: string;
  isAI: boolean;
  timestamp: Date;
  insights?: any[];
}

interface AIChatProps {
  onClose: () => void;
}

export default function AIChat({ onClose }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm your AI assistant. You can ask me about business metrics, trends, or request specific analytics.",
      isAI: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const processQuery = async (query: string) => {
    // Process natural language query using compromise
    const doc = nlp(query);
    const topics = doc.topics().json();
    const verbs = doc.verbs().json();
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate mock insights based on query analysis
    const mockInsights = generateMockInsights(topics, verbs);

    return {
      response: `Based on your query about ${topics.map((t: any) => t.text).join(', ')}, here's what I found:`,
      insights: mockInsights,
    };
  };

  const generateMockInsights = (topics: any[], verbs: any[]) => {
    // Mock insight generation based on query components
    return [
      {
        type: 'trend',
        metric: 'Sales Growth',
        value: '+15%',
        prediction: 'Expected to increase by 22% next quarter',
      },
      {
        type: 'anomaly',
        metric: 'Customer Churn',
        value: '3.5%',
        alert: 'Above normal threshold of 2.8%',
      },
    ];
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      text: input,
      isAI: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Process the query
    const { response, insights } = await processQuery(input);

    const aiMessage: Message = {
      text: response,
      isAI: true,
      timestamp: new Date(),
      insights,
    };

    setMessages(prev => [...prev, aiMessage]);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks);
        // Here you would normally send this to a speech-to-text service
        // For now, we'll simulate it
        setInput('What are the current sales trends?');
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const exportChat = (format: 'pdf' | 'excel') => {
    if (format === 'pdf') {
      const doc = new jsPDF();
      let yPos = 20;

      messages.forEach((message) => {
        doc.setFontSize(10);
        doc.text(
          `${message.isAI ? 'AI' : 'User'} (${message.timestamp.toLocaleTimeString()}):`,
          20,
          yPos
        );
        yPos += 10;
        
        doc.setFontSize(12);
        doc.text(message.text, 20, yPos, { maxWidth: 170 });
        yPos += 20;

        if (message.insights) {
          message.insights.forEach((insight) => {
            doc.text(`${insight.type}: ${insight.metric} - ${insight.value}`, 30, yPos);
            yPos += 10;
          });
          yPos += 10;
        }
      });

      doc.save('ai-chat-export.pdf');
    } else {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(
        messages.map((m) => ({
          Type: m.isAI ? 'AI' : 'User',
          Timestamp: m.timestamp.toLocaleString(),
          Message: m.text,
          Insights: m.insights ? JSON.stringify(m.insights) : '',
        }))
      );
      XLSX.utils.book_append_sheet(wb, ws, 'Chat History');
      XLSX.writeFile(wb, 'ai-chat-export.xlsx');
    }
  };

  return (
    <div className="fixed bottom-20 right-6 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <h3 className="font-semibold dark:text-white">AI Business Assistant</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportChat('pdf')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            title="Export as PDF"
          >
            <Download className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>
      
      <div ref={chatRef} className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
          >
            <div className="max-w-[80%] space-y-2">
              <div
                className={`p-3 rounded-lg ${
                  message.isAI
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    : 'bg-blue-600 text-white'
                }`}
              >
                {message.text}
              </div>
              
              {message.insights && (
                <div className="space-y-2">
                  {message.insights.map((insight, i) => (
                    <div
                      key={i}
                      className="p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
                    >
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {insight.metric}: {insight.value}
                      </div>
                      {insight.prediction && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {insight.prediction}
                        </div>
                      )}
                      {insight.alert && (
                        <div className="text-xs text-red-500">
                          {insight.alert}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t dark:border-gray-700">
        <div className="flex items-center gap-2">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-2 rounded-lg ${
              isRecording
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            <Mic className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about business metrics, trends, or insights..."
            className="flex-1 p-2 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 dark:text-white"
          />
          <button
            onClick={handleSend}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
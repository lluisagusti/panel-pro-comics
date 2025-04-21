
import React from 'react';
import { ComicPanel as ComicPanelType, TextBubble, Caption } from '@/types';

interface ComicPanelProps {
  panel: ComicPanelType;
  onRegeneratePanel: () => void;
  onAddTextBubble: (style: 'speech' | 'thought') => void;
  onAddCaption: (position: 'top' | 'bottom') => void;
  onRemovePanel: () => void;
  onEditTextBubble: (id: string, text: string) => void;
  onMoveTextBubble: (id: string, position: { x: number; y: number }) => void;
  onRemoveTextBubble: (id: string) => void;
  onEditCaption: (id: string, text: string) => void;
  onRemoveCaption: (id: string) => void;
}

const TextBubbleComponent: React.FC<{ 
  bubble: TextBubble; 
  onEdit: (id: string, text: string) => void;
  onMove: (id: string, position: { x: number; y: number }) => void;
  onRemove: (id: string) => void;
}> = ({ bubble, onEdit, onMove, onRemove }) => {
  const [editing, setEditing] = React.useState(false);
  const [text, setText] = React.useState(bubble.text);
  const [dragging, setDragging] = React.useState(false);
  const [position, setPosition] = React.useState(bubble.position);
  
  const bubbleRef = React.useRef<HTMLDivElement>(null);
  
  const handleDragStart = (e: React.MouseEvent) => {
    setDragging(true);
    e.preventDefault();
  };
  
  const handleDragMove = (e: React.MouseEvent) => {
    if (!dragging || !bubbleRef.current) return;
    
    const container = bubbleRef.current.parentElement;
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const x = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    const y = ((e.clientY - containerRect.top) / containerRect.height) * 100;
    
    setPosition({ x, y });
  };
  
  const handleDragEnd = () => {
    setDragging(false);
    onMove(bubble.id, position);
  };
  
  React.useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleDragMove as any);
      document.addEventListener('mouseup', handleDragEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleDragMove as any);
        document.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [dragging]);
  
  const handleSave = () => {
    onEdit(bubble.id, text);
    setEditing(false);
  };
  
  const bubbleStyle = bubble.style === 'speech' 
    ? 'rounded-xl' 
    : 'rounded-full';
  
  return (
    <div 
      ref={bubbleRef}
      className={`absolute bg-comic-text-bubble p-3 shadow-md cursor-move z-10 ${bubbleStyle}`}
      style={{ 
        left: `${position.x}%`, 
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        maxWidth: '80%'
      }}
      onMouseDown={handleDragStart}
    >
      {editing ? (
        <div className="flex flex-col space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
            autoFocus
          />
          <div className="flex justify-end space-x-2">
            <button 
              onClick={() => setEditing(false)}
              className="px-2 py-1 text-sm bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-2 py-1 text-sm bg-primary text-white rounded"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-black">{bubble.text}</p>
          <div className="absolute top-0 right-0 opacity-0 hover:opacity-100 transition-opacity">
            <button 
              onClick={() => setEditing(true)}
              className="p-1 text-xs bg-gray-200 rounded-full"
            >
              Edit
            </button>
            <button 
              onClick={() => onRemove(bubble.id)}
              className="p-1 text-xs bg-red-500 text-white rounded-full ml-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const CaptionComponent: React.FC<{
  caption: Caption;
  onEdit: (id: string, text: string) => void;
  onRemove: (id: string) => void;
}> = ({ caption, onEdit, onRemove }) => {
  const [editing, setEditing] = React.useState(false);
  const [text, setText] = React.useState(caption.text);
  
  const handleSave = () => {
    onEdit(caption.id, text);
    setEditing(false);
  };
  
  const position = caption.position === 'top' ? 'top-0' : 'bottom-0';
  
  return (
    <div className={`absolute left-0 right-0 ${position} bg-comic-caption p-2 z-10`}>
      {editing ? (
        <div className="flex flex-col space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
            autoFocus
          />
          <div className="flex justify-end space-x-2">
            <button 
              onClick={() => setEditing(false)}
              className="px-2 py-1 text-sm bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-2 py-1 text-sm bg-primary text-white rounded"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <p className="text-black text-center italic">{caption.text}</p>
          <div className="absolute top-0 right-0 opacity-0 hover:opacity-100 transition-opacity">
            <button 
              onClick={() => setEditing(true)}
              className="p-1 text-xs bg-gray-200 rounded-full"
            >
              Edit
            </button>
            <button 
              onClick={() => onRemove(caption.id)}
              className="p-1 text-xs bg-red-500 text-white rounded-full ml-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ComicPanel: React.FC<ComicPanelProps> = ({
  panel,
  onRegeneratePanel,
  onAddTextBubble,
  onAddCaption,
  onRemovePanel,
  onEditTextBubble,
  onMoveTextBubble,
  onRemoveTextBubble,
  onEditCaption,
  onRemoveCaption
}) => {
  const [showControls, setShowControls] = React.useState(false);
  
  return (
    <div 
      className="relative border-2 border-black bg-comic-panel-bg aspect-square overflow-hidden"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <img 
        src={panel.imageUrl} 
        alt="Comic panel" 
        className="w-full h-full object-cover"
      />
      
      {panel.textBubbles.map((bubble) => (
        <TextBubbleComponent 
          key={bubble.id}
          bubble={bubble}
          onEdit={onEditTextBubble}
          onMove={onMoveTextBubble}
          onRemove={onRemoveTextBubble}
        />
      ))}
      
      {panel.captions.map((caption) => (
        <CaptionComponent 
          key={caption.id}
          caption={caption}
          onEdit={onEditCaption}
          onRemove={onRemoveCaption}
        />
      ))}
      
      {showControls && (
        <div className="absolute top-2 right-2 flex flex-col space-y-2 z-20">
          <div className="bg-white rounded-md shadow-md p-2 flex flex-col space-y-2">
            <button 
              onClick={onRegeneratePanel}
              className="p-1 text-xs bg-primary text-white rounded hover:bg-primary/90"
              title="Regenerate panel"
            >
              Regenerate
            </button>
            <button 
              onClick={() => onAddTextBubble('speech')}
              className="p-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-400"
              title="Add speech bubble"
            >
              Add Speech
            </button>
            <button 
              onClick={() => onAddTextBubble('thought')}
              className="p-1 text-xs bg-blue-300 text-white rounded hover:bg-blue-200"
              title="Add thought bubble"
            >
              Add Thought
            </button>
            <button 
              onClick={() => onAddCaption('top')}
              className="p-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-400"
              title="Add top caption"
            >
              Add Top Caption
            </button>
            <button 
              onClick={() => onAddCaption('bottom')}
              className="p-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-400"
              title="Add bottom caption"
            >
              Add Bottom Caption
            </button>
            <button 
              onClick={onRemovePanel}
              className="p-1 text-xs bg-red-500 text-white rounded hover:bg-red-400"
              title="Remove panel"
            >
              Remove Panel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComicPanel;

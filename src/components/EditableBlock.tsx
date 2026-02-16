import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

// Block types
export type BlockType = 
  | "text" 
  | "heading" 
  | "list" 
  | "skill-section" 
  | "image" 
  | "spacer"
  | "divider";

export type Block = {
  id: string;
  page_id: string;
  block_type: BlockType;
  content: Record<string, unknown>;
  sort_order: number;
  isEditing?: boolean;
  isPreview?: boolean;
};

// Auth context
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/status")
      .then((r) => r.json())
      .then((data) => {
        setIsAuthenticated(data.authenticated === true);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { isAuthenticated, loading };
}

// Editable text field with dotted border
export function EditableField({
  value,
  onChange,
  placeholder,
  className = "",
  multiline = false,
  isEditing,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
  isEditing: boolean;
}) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  if (!isEditing) {
    if (multiline) {
      return (
        <p className={`${className} whitespace-pre-wrap break-words`}>
          {value || placeholder}
        </p>
      );
    }
    return <span className={`${className} whitespace-pre-wrap break-words`}>{value || placeholder}</span>;
  }

  const baseStyle = "bg-transparent outline-none border-2 border-dashed border-[#714DD7]/50 hover:border-[#714DD7] focus:border-[#714DD7] rounded px-1 -mx-1 transition-colors";

  if (multiline) {
    return (
      <textarea
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={() => onChange(localValue)}
        placeholder={placeholder}
        className={`${baseStyle} ${className} resize-none`}
        rows={3}
      />
    );
  }

  return (
    <input
      type="text"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={() => onChange(localValue)}
      placeholder={placeholder}
      className={`${baseStyle} ${className}`}
    />
  );
}

// Block wrapper with controls
export function BlockWrapper({
  isEditing,
  onDelete,
  onMoveUp,
  onMoveDown,
  onInsertBefore,
  onInsertAfter,
  children,
}: {
  block: Block;
  isEditing: boolean;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onInsertBefore: (type: BlockType) => void;
  onInsertAfter: (type: BlockType) => void;
  children: React.ReactNode;
}) {
  const [showInsertMenu, setShowInsertMenu] = useState<"before" | "after" | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  if (!isEditing) {
    return <>{children}</>;
  }

  const blockTypes: { type: BlockType; label: string }[] = [
    { type: "text", label: "Text" },
    { type: "heading", label: "Heading" },
    { type: "list", label: "List" },
    { type: "skill-section", label: "Skill Section" },
    { type: "image", label: "Image" },
    { type: "spacer", label: "Spacer" },
    { type: "divider", label: "Divider" },
  ];

  return (
    <div
      ref={dragRef}
      className="relative group"
    >
      {/* Block controls */}
      <div className="absolute -left-12 top-0 bottom-0 flex flex-col justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Drag handle */}
        <div className="cursor-grab active:cursor-grabbing p-1 bg-[#2A2A2A] rounded text-[#878787] hover:text-white">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM14 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM14 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
          </svg>
        </div>
      </div>

      {/* Insert before button */}
      <button
        onClick={() => setShowInsertMenu(showInsertMenu === "before" ? null : "before")}
        className="absolute -top-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-0.5 bg-[#714DD7] text-white text-xs rounded hover:bg-[#6041BA]"
      >
        + insert
      </button>

      {/* Insert menu */}
      <AnimatePresence>
        {showInsertMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -top-3 left-1/2 -translate-x-1/2 mt-6 bg-[#1A1A1A] rounded-lg shadow-xl p-2 z-50 flex flex-wrap gap-1 min-w-[200px]"
          >
            {blockTypes.map((bt) => (
              <button
                key={bt.type}
                onClick={() => {
                  if (showInsertMenu === "before") {
                    onInsertBefore(bt.type);
                  } else {
                    onInsertAfter(bt.type);
                  }
                  setShowInsertMenu(null);
                }}
                className="px-2 py-1 text-xs text-[#878787] hover:text-white hover:bg-[#2A2A2A] rounded"
              >
                {bt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="border-2 border-dashed border-transparent group-hover:border-[#714DD7]/30 rounded-lg p-2 -m-2 transition-colors">
        {children}
      </div>

      {/* Insert after button */}
      <button
        onClick={() => setShowInsertMenu(showInsertMenu === "after" ? null : "after")}
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-0.5 bg-[#714DD7] text-white text-xs rounded hover:bg-[#6041BA]"
      >
        + insert
      </button>

      {/* Side controls */}
      <div className="absolute -right-12 top-0 bottom-0 flex flex-col justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onMoveUp}
          className="p-1 bg-[#2A2A2A] rounded text-[#878787] hover:text-white"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          onClick={onMoveDown}
          className="p-1 bg-[#2A2A2A] rounded text-[#878787] hover:text-white"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button
          onClick={onDelete}
          className="p-1 bg-[#FF4444]/20 rounded text-[#FF4444] hover:bg-[#FF4444] hover:text-white"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Text block
export function TextBlock({
  block,
  isEditing,
  onUpdate,
}: {
  block: Block;
  isEditing: boolean;
  onUpdate: (content: Record<string, unknown>) => void;
}) {
  const content = block.content as { text?: string };
  
  return (
    <EditableField
      value={content.text || ""}
      onChange={(text) => onUpdate({ ...content, text })}
      placeholder="Enter text..."
      className="text-[#878787] font-poppins text-[20px] xl:text-[24px] leading-relaxed w-full whitespace-pre-wrap break-words"
      multiline
      isEditing={isEditing}
    />
  );
}

// Heading block
export function HeadingBlock({
  block,
  isEditing,
  onUpdate,
}: {
  block: Block;
  isEditing: boolean;
  onUpdate: (content: Record<string, unknown>) => void;
}) {
  const content = block.content as { text?: string; level?: "h1" | "h2" | "h3" };
  const level = content.level || "h1";
  
  const sizeClass = {
    h1: "text-4xl",
    h2: "text-3xl",
    h3: "text-2xl",
  }[level];

  return (
    <div className="flex flex-col gap-[5px] w-full">
      <EditableField
        value={content.text || ""}
        onChange={(text) => onUpdate({ ...content, text })}
        placeholder="Enter heading..."
        className={`text-[#d3d3d3] font-poppins leading-tight ${sizeClass} w-full`}
        isEditing={isEditing}
      />
      <div className="w-full h-[2px] bg-[#444444] my-4" />
    </div>
  );
}

// List block
export function ListBlock({
  block,
  isEditing,
  onUpdate,
}: {
  block: Block;
  isEditing: boolean;
  onUpdate: (content: Record<string, unknown>) => void;
}) {
  const content = block.content as { items?: string[] };
  const items = content.items || [""];

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onUpdate({ ...content, items: newItems });
  };

  const addItem = () => {
    onUpdate({ ...content, items: [...items, ""] });
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onUpdate({ ...content, items: newItems });
  };

  return (
    <div className="flex flex-col gap-[20px]">
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          <span className="text-[#878787] mt-1">•</span>
          <EditableField
            value={item}
            onChange={(value) => updateItem(index, value)}
            placeholder="List item..."
            className="text-[#878787] font-poppins text-[24px] md:text-[32px] lg:text-[36px] flex-1"
            isEditing={isEditing}
          />
          {isEditing && items.length > 1 && (
            <button
              onClick={() => removeItem(index)}
              className="text-[#FF4444] hover:text-[#FF6666] text-sm"
            >
              ×
            </button>
          )}
        </div>
      ))}
      {isEditing && (
        <button
          onClick={addItem}
          className="text-[#714DD7] hover:text-[#9373E8] text-sm text-left"
        >
          + add item
        </button>
      )}
    </div>
  );
}

// Skill section block
export function SkillSectionBlock({
  block,
  isEditing,
  onUpdate,
}: {
  block: Block;
  isEditing: boolean;
  onUpdate: (content: Record<string, unknown>) => void;
}) {
  const content = block.content as {
    title?: string;
    description?: string;
    image?: string;
  };

  return (
    <div className="flex flex-col xl:flex-row items-start gap-[25px] w-full xl:w-[70%]">
      {content.image && (
        <img src={content.image} className="h-full max-h-[100px]" alt={content.title} />
      )}
      <div className="flex flex-col gap-[5px]">
        <EditableField
          value={content.title || ""}
          onChange={(title) => onUpdate({ ...content, title })}
          placeholder="Section title..."
          className="text-[36px] font-poppins leading-tight text-[#d3d3d3]"
          isEditing={isEditing}
        />
        <EditableField
          value={content.description || ""}
          onChange={(description) => onUpdate({ ...content, description })}
          placeholder="Section description..."
          className="text-[28px] font-poppins text-[#878787]"
          multiline
          isEditing={isEditing}
        />
      </div>
    </div>
  );
}

// Spacer block
export function SpacerBlock({ block }: { block: Block }) {
  const content = block.content as { height?: number };
  const height = content.height || 40;
  
  return <div style={{ height }} />;
}

// Divider block
export function DividerBlock() {
  return <div className="w-full h-[2px] bg-[#444444] my-4" />;
}

// Block renderer
export function BlockRenderer({
  block,
  isEditing,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onInsertBefore,
  onInsertAfter,
}: {
  block: Block;
  isEditing: boolean;
  onUpdate: (content: Record<string, unknown>) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onInsertBefore: (type: BlockType) => void;
  onInsertAfter: (type: BlockType) => void;
}) {
  const renderBlock = () => {
    switch (block.block_type) {
      case "text":
        return <TextBlock block={block} isEditing={isEditing} onUpdate={onUpdate} />;
      case "heading":
        return <HeadingBlock block={block} isEditing={isEditing} onUpdate={onUpdate} />;
      case "list":
        return <ListBlock block={block} isEditing={isEditing} onUpdate={onUpdate} />;
      case "skill-section":
        return <SkillSectionBlock block={block} isEditing={isEditing} onUpdate={onUpdate} />;
      case "spacer":
        return <SpacerBlock block={block} />;
      case "divider":
        return <DividerBlock />;
      default:
        return <div className="text-[#878787]">Unknown block type: {block.block_type}</div>;
    }
  };

  return (
    <BlockWrapper
      block={block}
      isEditing={isEditing}
      onDelete={onDelete}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onInsertBefore={onInsertBefore}
      onInsertAfter={onInsertAfter}
    >
      {renderBlock()}
    </BlockWrapper>
  );
}

// Blocks container with drag and drop
export function BlocksContainer({
  pageId,
  isEditing,
}: {
  pageId: string;
  isEditing: boolean;
}) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewChanges, setPreviewChanges] = useState<Block[]>([]);
  const [isPreview, setIsPreview] = useState(false);

  // Fetch blocks
  useEffect(() => {
    fetch(`/api/blocks?page=${pageId}`)
      .then((r) => r.json())
      .then((data) => {
        setBlocks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [pageId]);

  // Update block content
  const updateBlock = useCallback(async (blockId: string, content: Record<string, unknown>) => {
    // Optimistic update
    setBlocks(blocks.map(b => 
      b.id === blockId ? { ...b, content } : b
    ));

    // Also update preview
    setPreviewChanges(prev => {
      const existing = prev.findIndex(b => b.id === blockId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], content };
        return updated;
      }
      return [...prev, { ...blocks.find(b => b.id === blockId)!, content }];
    });

    // Save to server
    await fetch(`/api/blocks/${blockId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
  }, [blocks]);

  // Delete block
  const deleteBlock = useCallback(async (blockId: string) => {
    setBlocks(blocks.filter(b => b.id !== blockId));
    await fetch(`/api/blocks/${blockId}`, { method: "DELETE" });
  }, [blocks]);

  // Move block
  const moveBlock = useCallback(async (blockId: string, direction: "up" | "down") => {
    const index = blocks.findIndex(b => b.id === blockId);
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === blocks.length - 1) return;

    const newBlocks = [...blocks];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    setBlocks(newBlocks);

    await fetch(`/api/blocks/${blockId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ move_to: newIndex }),
    });
  }, [blocks]);

  // Insert block
  const insertBlock = useCallback(async (afterId: string | null, type: BlockType) => {
    const res = await fetch("/api/blocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page_id: pageId,
        block_type: type,
        after_id: afterId,
      }),
    });

    if (res.ok) {
      const newBlock = await res.json();
      if (afterId) {
        const index = blocks.findIndex(b => b.id === afterId);
        const newBlocks = [...blocks];
        newBlocks.splice(index + 1, 0, newBlock);
        setBlocks(newBlocks);
      } else {
        setBlocks([...blocks, newBlock]);
      }
    }
  }, [blocks, pageId]);

  if (loading) {
    return <div className="text-[#878787]">Loading...</div>;
  }

  // Preview mode shows what visitors would see
  const displayBlocks = isPreview && previewChanges.length > 0
    ? blocks.map(b => previewChanges.find(p => p.id === b.id) || b)
    : blocks;

  return (
    <div className="flex flex-col gap-[32px] w-full">
      {/* Preview toggle for editing mode */}
      {isEditing && (
        <div className="flex items-center gap-4 p-2 bg-[#1A1A1A] rounded-lg mb-4">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className={`px-4 py-1 rounded text-sm ${isPreview ? "bg-[#714DD7] text-white" : "bg-[#2A2A2A] text-[#878787]"}`}
          >
            {isPreview ? "✓ Preview Mode" : "Preview Mode"}
          </button>
          <span className="text-[#878787] text-sm">
            {isPreview ? "This is what visitors see (changes in your session)" : "Edit mode - click fields to edit"}
          </span>
        </div>
      )}

      {/* Blocks */}
      {displayBlocks.map((block, index) => (
        <BlockRenderer
          key={block.id}
          block={block}
          isEditing={isEditing && !isPreview}
          onUpdate={(content) => updateBlock(block.id, content)}
          onDelete={() => deleteBlock(block.id)}
          onMoveUp={() => moveBlock(block.id, "up")}
          onMoveDown={() => moveBlock(block.id, "down")}
          onInsertBefore={(type) => insertBlock(index > 0 ? blocks[index - 1].id : null, type)}
          onInsertAfter={(type) => insertBlock(block.id, type)}
        />
      ))}

      {/* Add first block */}
      {blocks.length === 0 && isEditing && (
        <button
          onClick={() => insertBlock(null, "text")}
          className="p-4 border-2 border-dashed border-[#714DD7]/50 rounded-lg text-[#714DD7] hover:border-[#714DD7] hover:bg-[#714DD7]/10 transition-colors"
        >
          + Add your first block
        </button>
      )}
    </div>
  );
}

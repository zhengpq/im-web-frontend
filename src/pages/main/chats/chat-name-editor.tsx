import React, { useRef, useState } from 'react';
import { GROUP_NAME_NOT_EMPTY_MESSAGE } from '@/const/message';

interface ChatNameEditorProps {
  value: string;
  editable: boolean;
  onConfirm?: (value: string) => void;
  className?: string;
}

const ChatNameEditor: React.FC<ChatNameEditorProps> = ({
  value,
  editable = true,
  onConfirm,
  className,
}) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [innerValue, setInnerValue] = useState(value);
  const [editing, setEditing] = useState(false);
  const handleEdit: React.MouseEventHandler = () => {
    setEditing(true);
    if (editorRef.current) {
      editorRef.current.focus();
      // 选中全部内容
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);

      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };
  const handleInput: React.FormEventHandler<HTMLDivElement> = () => {
    if (!editorRef.current) return;
    const textContent = editorRef.current.innerText;
    setInnerValue(textContent);
  };
  const handleBlur: React.FocusEventHandler<HTMLDivElement> = () => {
    setEditing(false);
    if (editorRef.current?.innerText === '') {
      editorRef.current.innerText = value;
      setInnerValue(value);
    }
    if (onConfirm) {
      onConfirm(innerValue);
    }
  };
  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    const { key } = event;
    if (key === 'Enter') {
      event.preventDefault();
      setEditing(false);
      editorRef.current?.blur();
    }
  };
  return (
    <div className={`relative w-fit pr-26 ${className}`} ref={bodyRef}>
      {editable && (
        <div className="relative">
          <div
            ref={editorRef}
            className="inline-block caret-primary px-4 hover:bg-tp-gray-100 cursor-pointer"
            tabIndex={1}
            onClick={handleEdit}
            contentEditable={editing}
            onBlur={handleBlur}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
          >
            {value}
          </div>
          {innerValue === '' && (
            <div className="text-red mt-4 font-normal text-xs absolute whitespace-nowrap left-0 top-full">
              {GROUP_NAME_NOT_EMPTY_MESSAGE}
            </div>
          )}
        </div>
      )}
      {!editable && <div>{value}</div>}
    </div>
  );
};

export default ChatNameEditor;

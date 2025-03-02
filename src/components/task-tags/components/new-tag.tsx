import { Input, InputRef, Tag } from "antd";
import { FC, useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

export const NewTag: FC<{ newTag: (tag: string) => void }> = ({ newTag }) => {
  const inputRef = useRef<InputRef>(null);
  const [showInput, setShowInput] = useState(false);
  const [tag, setTag] = useState("");
  const handleNewTag = () => {
    setShowInput(false);
    newTag(tag);
    setTag("");
  };

  useEffect(() => {
    if (showInput) inputRef.current?.focus();
  }, [showInput]);
  const handleInput = () => {
    setShowInput(true);
  };
  return showInput ? (
    <Input
      ref={inputRef}
      type="text"
      size="small"
      style={{ width: 78 }}
      onChange={(evt) => setTag(evt.currentTarget.value)}
      onPressEnter={handleNewTag}
    />
  ) : (
    <Tag onClick={handleInput}>
      <PlusOutlined /> New Tag
    </Tag>
  );
};

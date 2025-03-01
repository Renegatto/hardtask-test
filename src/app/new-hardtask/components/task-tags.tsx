import { Input, InputRef, Tag } from "antd";
import { FC, useEffect, useRef, useState } from "react";
import { PlusOutlined } from '@ant-design/icons';
import { useKey } from "../../hooks";

export const TaskTags: FC<{setValues: (tags: string[]) => void}> = ({setValues}) => {
  const {newKey} = useKey()
  const [tags, setTags] = useState<{tag: string, key: number}[]>([])
  const handleAddTag = (tag: string) => {
    newKey(key => {
      const updated = [...tags,{tag, key}]
      setTags(updated)
      setValues(updated.map(tag => tag.tag))
    })
  }
  const handleDeleteTag = (toRemove: number) => {
    const updated = tags.filter(({key}) => key !== toRemove)
    setTags(updated)
    setValues(updated.map(tag => tag.tag))
  }
  return <>
   {  tags.map(({tag,key}) =>
        <Tag
          key={key}
          closeIcon
          onClose={() => handleDeleteTag(key)}
        >{tag}
        </Tag>
      )
    }
    <NewTag newTag={handleAddTag}/>
  </>
}


const NewTag: FC<{newTag: (tag: string) => void}> = ({
  newTag,
}) => {
  const inputRef = useRef<InputRef>(null)
  const [showInput, setShowInput] = useState(false);
  const [tag, setTag] = useState('')
  const handleNewTag = () => {
    setShowInput(false)
    newTag(tag)
    setTag('')
  }
  useEffect(() => {
    if (showInput) inputRef.current?.focus();
  },[showInput])
  const handleInput = () => {
    setShowInput(true)
  }
  return showInput ? (
    <Input
      ref={inputRef}
      type="text"
      size="small"
      style={{ width: 78 }}
      onChange={evt => setTag(evt.currentTarget.value)}
      onPressEnter={handleNewTag}
    />
  ) : (
    <Tag onClick={handleInput}>
      <PlusOutlined /> New Tag
    </Tag>
  )
}
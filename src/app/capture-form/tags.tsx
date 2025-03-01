import { Input, InputRef, Tag } from "antd";
import { FC, useEffect, useRef, useState } from "react";
import { PlusOutlined } from '@ant-design/icons';

const useKey = (): {
  newKey: (withKey: (key: number) => void) => void
} => {
  const [i,setI] = useState(0)
  return {
    newKey: withKey => {
      setI(i + 1)
      withKey(i)
    } 
  }
}

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
   {  tags.map(({tag,key}) => {
        return <Tag key={key} closeIcon onClose={() => handleDeleteTag(key)}>{tag}</Tag>
      })
    }
    <NewTag newTag={handleAddTag}/>
  </>
}


const NewTag: FC<{newTag: (tag: any) => void}> = ({
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
      // value={inputValue}
      onChange={evt => setTag(evt.currentTarget.value)}
      // onBlur={handleInputConfirm}
      onPressEnter={handleNewTag}
    />
  ) : (
    <Tag onClick={handleInput}>
      <PlusOutlined /> New Tag
    </Tag>
  )
}
import { Flex, Tag, Typography } from "antd";
import { FC, useState } from "react";
import { useKey } from "../../hooks";
import { NewTag } from "./components/new-tag";

export const TaskTags: FC<{ setValues: (tags: string[]) => void }> = ({
  setValues,
}) => {
  const { Text } = Typography;
  const { newKey } = useKey();
  const [tags, setTags] = useState<{ tag: string; key: number }[]>([]);
  const handleAddTag = (tag: string) => {
    newKey((key) => {
      const updated = [...tags, { tag, key }];
      setTags(updated);
      setValues(updated.map((tag) => tag.tag));
    });
  };
  const handleDeleteTag = (toRemove: number) => {
    const updated = tags.filter(({ key }) => key !== toRemove);
    setTags(updated);
    setValues(updated.map((tag) => tag.tag));
  };
  return (
    <Flex
      wrap="wrap"
      gap={8}
      style={{
        maxWidth: 320,
        minHeight: 40,
      }}
      align="center"
    >
      {tags.map(({ tag, key }) => (
        <Tag key={key} closeIcon onClose={() => handleDeleteTag(key)}>
          <Text editable>{tag}</Text>
        </Tag>
      ))}
      <NewTag newTag={handleAddTag} />
    </Flex>
  );
};

"use client";
import {
  NewHardtask,
  submittedFormToTask,
} from "@/components/new-hardtask/new-hardtask";

import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { contentStyle, layoutStyle } from "./styles";
import { TaskForm } from "@/components/task-form/task-form";
import { publishTask } from "@/service/api/newhardtask";

export default function Home() {
  return (
    <Layout style={layoutStyle}>
      <Content style={contentStyle}>
        <NewHardtask
          publishTask={publishTask}
          TaskForm={(key, onSubmit, isTransition, token) => (
            <TaskForm
              key={key}
              isTransition={isTransition}
              onSubmit={(form) => onSubmit(submittedFormToTask(form))}
              token={token}
            />
          )}
        />
      </Content>
    </Layout>
  );
}

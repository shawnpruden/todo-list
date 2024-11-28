import EditNoteIcon from '@mui/icons-material/EditNote';
import { Button, Checkbox } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useState } from 'react';
import { z } from 'zod';
import TaskModal, { TaskModalConfig } from '../components/TaskModal';
import useAuth from '../hooks/useAuth';
import useTask from '../hooks/useTasks';
import { TaskSchema } from '../schemas';

export default function Dashboard() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskModalConfig, setTaskModalConfig] = useState<TaskModalConfig>(null);

  const { handleSignOut } = useAuth();

  const { tasks, addTask, editTask, deleteTask } = useTask();

  return (
    <>
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="bg-slate-50 p-12 rounded-md">
          <h1 className="text-center mb-12">To-do List</h1>

          <div className="flex gap-3 justify-end mb-3">
            <div
              className="flex justify-center items-center border border-solid border-blue-500 rounded-[4px] px-3 py-2 cursor-pointer hover:opacity-75 transition-all"
              onClick={() => {
                setTaskModalConfig({
                  label: '追加',
                  onConfirm: addTask,
                });
                setIsTaskModalOpen(true);
              }}
            >
              <p className="text-sm text-blue-500 font-semibold">タスク追加</p>
            </div>
          </div>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 640 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">状態</TableCell>
                  {['タイトル', '所属グループ', '本⽂', '期限', ''].map(
                    (text, index) => (
                      <TableCell key={index} align="left">
                        {text}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map(({ title, content, isCompleted, createdAt, id }) => (
                  <TableRow
                    key={createdAt}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="center">
                      <Checkbox
                        onClick={() => !isCompleted && deleteTask(id)}
                      />
                    </TableCell>
                    <TableCell align="left">{title}</TableCell>
                    <TableCell align="left">{'未設定'}</TableCell>
                    <TableCell align="left">{content}</TableCell>
                    <TableCell align="left">{'未設定'}</TableCell>
                    <TableCell align="left">
                      <div
                        className="cursor-pointer hover:opacity-75"
                        onClick={() => {
                          setTaskModalConfig({
                            initialValue: { title, content },
                            label: '編集',
                            onConfirm: (values: z.infer<typeof TaskSchema>) =>
                              editTask(values, id),
                          });
                          setIsTaskModalOpen(true);
                        }}
                      >
                        <EditNoteIcon />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div className="flex gap-3 justify-end mt-6">
            <Button variant="contained" color="error">
              退会
            </Button>
            <Button variant="outlined" color="error" onClick={handleSignOut}>
              ログアウト
            </Button>
          </div>
        </div>
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskModalConfig={taskModalConfig}
      />
    </>
  );
}

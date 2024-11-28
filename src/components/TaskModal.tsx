import { zodResolver } from '@hookform/resolvers/zod';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { TaskSchema } from '../schemas';
import useTask from '../hooks/useTasks';

export type TaskModalConfig = {
  label: '追加' | '編集';
  initialValue?: { title: string; content: string };
  onConfirm: (values: z.infer<typeof TaskSchema>) => Promise<void>;
} | null;

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  taskModalConfig: TaskModalConfig;
};

export default function TaskModal({
  isOpen,
  onClose,
  taskModalConfig,
}: ModalProps) {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof TaskSchema>>({
    resolver: zodResolver(TaskSchema),
    defaultValues: taskModalConfig?.initialValue || { title: '', content: '' },
  });

  const { isLoading } = useTask();

  useEffect(() => {
    if (taskModalConfig?.initialValue) {
      reset(taskModalConfig.initialValue);
    } else {
      reset({ title: '', content: '' });
    }
  }, [taskModalConfig, reset]);

  const handleClose = () => {
    reset({ title: '', content: '' });
    onClose();
  };

  const onSubmit: SubmitHandler<z.infer<typeof TaskSchema>> = async (
    values
  ) => {
    await taskModalConfig?.onConfirm(values);

    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <div className="p-8 w-[420px]">
        <h2 className="text-2xl mb-6">タスク{taskModalConfig?.label}</h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col gap-5">
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  type="text"
                  fullWidth
                  label="タイトル"
                  variant="outlined"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <TextField
                  type="text"
                  multiline
                  minRows={5}
                  fullWidth
                  label="本文"
                  variant="outlined"
                  error={!!errors.content}
                  helperText={errors.content?.message}
                  {...field}
                />
              )}
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outlined" onClick={handleClose}>
              戻る
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              autoFocus
            >
              続ける
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}

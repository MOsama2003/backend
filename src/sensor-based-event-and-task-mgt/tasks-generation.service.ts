import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DeviceTasks } from './entities/task.entity';
import { TaskSeverity, TaskStatus } from 'src/constants';

@Injectable()
export class SensorBasedTaskService {
  constructor(
    @InjectRepository(DeviceTasks)
    private readonly taskRepository: Repository<DeviceTasks>,
  ) {}

  async saveTasks(tasks: any[], deviceId: string): Promise<DeviceTasks[]> {
    const taskEntities = tasks.map((task) => ({
      ...task,
      taskStatus: TaskStatus.TODO,
      deviceId,
      createdAt: new Date(),
    }));

    return this.taskRepository.save(taskEntities);
  }

  async lastTwoEntries(deviceId: string) {
    const lastTwoEntries = await this.taskRepository.find({
      where: { deviceId },
      order: { id: 'DESC' },
      take: 2,
    });
    return lastTwoEntries;
  }

  async unCompleteTasks(deviceId: string) {
    const tasks = await this.taskRepository.find({
      where: {
        deviceId,
        taskStatus: In([TaskStatus.PENDING, TaskStatus.TODO]),
      },
    });
    return tasks;
  }

  async updateTasks(updatedTasks: any[], deviceId: string) {
    for (const task of updatedTasks) {
      const status = task.taskStatus
        ? this.mapTaskStatus(task.taskStatus)
        : undefined;
      const severity = task.taskSeverity
        ? this.mapTaskSeverity(task.taskSeverity)
        : undefined;

      const updateResult = await this.taskRepository.update(
        { id: task.id, deviceId },
        {
          ...(status && { taskStatus: status }),
          ...(severity && { taskSeverity: severity }),
          ...(task.taskDescription && {
            taskDescription: task.taskDescription,
          }),
          ...(task.notes && { notes: task.notes }),
        },
      );
    }
  }

  private mapTaskStatus(status: string): TaskStatus | undefined {
    const lowerCaseStatus = status.toLowerCase();
    return Object.values(TaskStatus).find(
      (enumValue) => enumValue.toLowerCase() === lowerCaseStatus,
    );
  }

  // Function to map taskSeverity case-insensitively
  private mapTaskSeverity(severity: string): TaskSeverity | undefined {
    const lowerCaseSeverity = severity.toLowerCase();
    return Object.values(TaskSeverity).find(
      (enumValue) => enumValue.toLowerCase() === lowerCaseSeverity,
    );
  }
}

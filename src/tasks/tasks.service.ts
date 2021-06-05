import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRespository: TasksRepository,
  ) {}

  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRespository.getTasks(filterDto);
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRespository.findOne(id);
    if (!found) throw new NotFoundException(`Task with ID "${id}" not found`);
    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRespository.createTask(createTaskDto);
  }

  async deleteTask(taskId: string): Promise<void> {
    const result = await this.tasksRespository.delete(taskId);
    if (result.affected === 0)
      //because delete returns number of rows deleted {raw: [], affected: }
      throw new NotFoundException(`Task with ID "${taskId}" not found`);
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;

    await this.tasksRespository.save(task);

    return task;
  }
}

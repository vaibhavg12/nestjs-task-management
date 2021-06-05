import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title: title,
      description: description,
      status: TaskStatus.OPEN,
    });
    await this.save(task);
    return task;
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const query = this.createQueryBuilder('task');
    const { status, search } = filterDto;

    if (status) {
      query.andWhere('task.status = :statusFilter', { statusFilter: status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:searchFilter) OR LOWER(task.description) LIKE LOWER(:searchFilter)',
        { searchFilter: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }

  // getTaksWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   let tasks = this.getAllTasks();

  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }

  //   if (search) {
  //     tasks = tasks.filter((task): boolean => {
  //       if (
  //         task.title.toLowerCase().includes(search) ||
  //         task.description.toLowerCase().includes(search)
  //       ) {
  //         return true;
  //       }
  //       return false;
  //     });
  //   }

  //   return tasks;
  // }
}

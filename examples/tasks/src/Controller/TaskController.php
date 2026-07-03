<?php

namespace App\Controller;

use Exception;
use App\Entity\Task;
use Koncerto\KoncertoResponse;
use Koncerto\KoncertoAnnotation as K;
use Koncerto\KoncertoImpulsusController;

class TaskController extends KoncertoImpulsusController
{
    /**
     * @see K::liveProp() {"name": "tasks"}
     * @var Task[]
     **/
    private $tasks;

    /**
     * @see K::liveProp() {"name": "id"}
     * @var ?int
     **/
    private $id;

    /**
     * @see K::liveProp() {"name": "description"}
     * @var string
     **/
    private $description;

    public function postMount($data = array())
    {
        $this->tasks = $this->getEntityManager()->findAll(Task::class);

        foreach ($this->tasks as $task) {
            $done = 'task-' . $task->id . '-done';
            if (array_key_exists($done, $data)) {
                $task->done = filter_var($data[$done], FILTER_VALIDATE_BOOL);
            }
        }

        $hasId = array_key_exists('id', $data) && is_numeric($data['id']);
        $this->id = $hasId ? intval($data['id']) : null;

        $hasDescription = array_key_exists('description', $data) && is_string($data['description']);
        $this->description = $hasDescription ? $data['description'] : '';
    }

    /**
     * @see K::liveAction() {"name": "toggle"}
     */
    public function toggle()
    {
        $param = intval($this->getRequest()->get('_param'));
        $task = new Task();

        foreach ($this->tasks as $task) {
            if ($param === $task->id) {
                $task->done = !$task->done;
                $task = $this->getEntityManager()->persist(Task::class, $task);
                break;
            }
        }

        return $this->json(array('task-' . $param . '-done' => (int)$task->done));
    }

    /**
     * @see K::liveAction() {"name": "remove"}
     */
    public function remove()
    {
        $param = intval($this->getRequest()->get('_param'));

        $this->getEntityManager()->remove(Task::class, $param);

        return $this->json(array('task-' . $param . '-removed' => true));
    }

    /**
     * @see K::liveAction() {"name": "save"}
     */
    public function save()
    {
        $param = intval($this->getRequest()->get('_param'));
        if (empty($this->getRequest()->get('_param')) && null === $this->id) {
            $task = new Task();
        } else {
            $id = null !== $this->id ? $this->id : $param;
            $task = $this->getEntityManager()->find(Task::class, $id);
        }
        $task->description = $this->description;

        $task = $this->getEntityManager()->persist(Task::class, $task);

        return $this->json($task);
    }

    /**
     * @see K::route() {"name": "/tasks/"}
     * @return KoncertoResponse
     */
    public function index()
    {
        $tasks = $this->getEntityManager()->findAll(Task::class);

        return $this->render('templates/tasks.tbs.html', array('tasks' => $tasks));
    }

    /**
     * @see K::route() {"name": "/task/view/"}
     * @return KoncertoResponse
     */
    public function view()
    {
        $taskId = $this->getRequest()->get('id');

        if (null === $taskId) {
            throw new \Exception('Task ID is required');
        }

        $task = $this->getEntityManager()->find(Task::class, $taskId);
        if ($task === null) {
            throw new \Exception('Task not found');
        }

        return $this->render('templates/task_view.tbs.html', array('task' => $task));
    }

    /**
     * @see K::route() {"name": "/task/edit/"}
     * @return KoncertoResponse
     */
    public function edit()
    {
        $taskId = $this->getRequest()->get('id');

        if (null === $taskId) {
            throw new Exception('Task ID is required');
        }

        $task = $this->getEntityManager()->find(Task::class, $taskId);

        if ($task === null) {
            throw new \Exception('Task not found');
        }

        return $this->render('templates/task_edit.tbs.html', array('task' => $task));
    }

    /**
     * @see K::route() {"name": "/task/new/"}
     * @return KoncertoResponse
     */
    public function new()
    {
        $task = new Task();

        return $this->render('templates/task_edit.tbs.html', array('task' => $task));
    }
}

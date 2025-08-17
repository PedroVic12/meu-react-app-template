import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:collection/collection.dart'; // For firstWhereOrNull

/// Represents a single to-do task.
class Task {
  final String id;
  String description;
  bool isCompleted;

  Task({
    required this.id,
    required this.description,
    this.isCompleted = false,
  });
}

/// Manages the list of tasks and provides state changes to listeners.
class TaskListData extends ChangeNotifier {
  final List<Task> _tasks = <Task>[];

  /// Provides an unmodifiable view of the current tasks.
  List<Task> get tasks => List<Task>.unmodifiable(_tasks);

  /// Adds a new task to the list.
  /// Notifies listeners if the description is not empty.
  void addTask(String description) {
    if (description.trim().isEmpty) {
      return;
    }
    final Task newTask = Task(
      id: DateTime.now().millisecondsSinceEpoch.toString(), // Simple unique ID
      description: description.trim(),
    );
    _tasks.add(newTask);
    notifyListeners();
  }

  /// Removes a task from the list by its ID.
  /// Notifies listeners if a task was removed.
  void removeTask(String id) {
    final int initialLength = _tasks.length;
    _tasks.removeWhere((Task task) => task.id == id);
    if (_tasks.length != initialLength) {
      notifyListeners();
    }
  }

  /// Toggles the completion status of a task by its ID.
  /// Notifies listeners if the task's status changed.
  void toggleTaskCompletion(String id) {
    final Task? task = _tasks.firstWhereOrNull((Task task) => task.id == id);
    if (task != null) {
      task.isCompleted = !task.isCompleted;
      notifyListeners();
    }
  }
}

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider<TaskListData>(
      create: (BuildContext context) => TaskListData(),
      builder: (BuildContext context, Widget? child) {
        return MaterialApp(
          title: 'Task Manager',
          theme: ThemeData(
            primarySwatch: Colors.blue,
            visualDensity: VisualDensity.adaptivePlatformDensity,
          ),
          home: const ToDoScreen(),
        );
      },
    );
  }
}

/// The main screen displaying the list of tasks.
class ToDoScreen extends StatelessWidget {
  const ToDoScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Tasks'),
      ),
      body: Consumer<TaskListData>(
        builder: (BuildContext context, TaskListData taskListData, Widget? child) {
          if (taskListData.tasks.isEmpty) {
            return const Center(
              child: Text(
                'No tasks yet! Tap the + button to add one.',
                style: TextStyle(fontSize: 16.0, color: Colors.grey),
                textAlign: TextAlign.center,
              ),
            );
          }
          return ListView.builder(
            itemCount: taskListData.tasks.length,
            itemBuilder: (BuildContext context, int index) {
              final Task task = taskListData.tasks[index];
              return TaskItem(task: task);
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddTaskDialog(context),
        tooltip: 'Add new task',
        child: const Icon(Icons.add),
      ),
    );
  }

  /// Shows a dialog for adding a new task.
  void _showAddTaskDialog(BuildContext context) {
    showDialog<void>(
      context: context,
      builder: (BuildContext dialogContext) {
        return AddTaskDialog(
          onAddTask: (String description) {
            Provider.of<TaskListData>(context, listen: false).addTask(description);
          },
        );
      },
    );
  }
}

/// A widget to display a single task item.
class TaskItem extends StatelessWidget {
  final Task task;

  const TaskItem({super.key, required this.task});

  @override
  Widget build(BuildContext context) {
    final TaskListData taskListData = Provider.of<TaskListData>(context, listen: false);

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 4.0),
      elevation: 2.0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.0)),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
        leading: Checkbox(
          value: task.isCompleted,
          onChanged: (bool? value) {
            taskListData.toggleTaskCompletion(task.id);
          },
          activeColor: Colors.blue,
        ),
        title: Text(
          task.description,
          style: TextStyle(
            decoration: task.isCompleted ? TextDecoration.lineThrough : null,
            color: task.isCompleted ? Colors.grey[600] : Colors.black87,
            fontSize: 16.0,
          ),
        ),
        trailing: IconButton(
          icon: const Icon(Icons.delete, color: Colors.redAccent),
          onPressed: () {
            taskListData.removeTask(task.id);
          },
          tooltip: 'Delete task',
        ),
        onTap: () {
          taskListData.toggleTaskCompletion(task.id);
        },
      ),
    );
  }
}

/// A dialog widget for adding a new task description.
class AddTaskDialog extends StatefulWidget {
  final void Function(String description) onAddTask;

  const AddTaskDialog({super.key, required this.onAddTask});

  @override
  State<AddTaskDialog> createState() => _AddTaskDialogState();
}

class _AddTaskDialogState extends State<AddTaskDialog> {
  final TextEditingController _textController = TextEditingController();

  @override
  void dispose() {
    _textController.dispose();
    super.dispose();
  }

  void _submitTask() {
    final String description = _textController.text;
    if (description.trim().isNotEmpty) {
      widget.onAddTask(description);
      Navigator.of(context).pop();
    } else {
      // Optionally show a SnackBar or hint for empty input
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Task description cannot be empty.')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Add New Task'),
      content: TextField(
        controller: _textController,
        autofocus: true,
        decoration: const InputDecoration(
          hintText: 'Enter task description',
          border: OutlineInputBorder(),
        ),
        onSubmitted: (String value) {
          _submitTask();
        },
      ),
      actions: <Widget>[
        TextButton(
          child: const Text('Cancel'),
          onPressed: () {
            Navigator.of(context).pop();
          },
        ),
        ElevatedButton(
          onPressed: _submitTask,
          child: const Text('Add'),
        ),
      ],
    );
  }
}
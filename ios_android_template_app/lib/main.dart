import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

// DOMAIN LAYER - Entities
abstract class Entity {
  final String id;
  Entity({required this.id});
}

class Todo extends Entity {
  String title;
  bool isCompleted;

  Todo({
    required String id,
    required this.title,
    this.isCompleted = false,
  }) : super(id: id);

  Todo copyWith({String? title, bool? isCompleted}) {
    return Todo(
      id: id,
      title: title ?? this.title,
      isCompleted: isCompleted ?? this.isCompleted,
    );
  }
}

class Product extends Entity {
  String name;
  int quantity;

  Product({
    required String id,
    required this.name,
    this.quantity = 0,
  }) : super(id: id);

  Product copyWith({String? name, int? quantity}) {
    return Product(
      id: id,
      name: name ?? this.name,
      quantity: quantity ?? this.quantity,
    );
  }
}

// DOMAIN LAYER - Repository Interfaces (Dependency Inversion)
abstract class ITodoRepository {
  List<Todo> getAllTodos();
  void addTodo(Todo todo);
  void updateTodo(Todo todo);
  void deleteTodo(String id);
}

abstract class IProductRepository {
  List<Product> getAllProducts();
  void addProduct(Product product);
  void updateProduct(Product product);
  void deleteProduct(String id);
}

// APPLICATION LAYER - Use Cases (Single Responsibility)
class TodoUseCases {
  final ITodoRepository _repository;

  TodoUseCases(this._repository);

  List<Todo> getAllTodos() => _repository.getAllTodos();
  
  void addTodo(String title) {
    if (title.trim().isEmpty) return;
    final todo = Todo(
      id: DateTime.now().microsecondsSinceEpoch.toString(),
      title: title.trim(),
    );
    _repository.addTodo(todo);
  }

  void toggleTodoStatus(String id) {
    final todos = _repository.getAllTodos();
    final todo = todos.firstWhere((t) => t.id == id);
    final updatedTodo = todo.copyWith(isCompleted: !todo.isCompleted);
    _repository.updateTodo(updatedTodo);
  }

  void updateTodoTitle(String id, String newTitle) {
    if (newTitle.trim().isEmpty) return;
    final todos = _repository.getAllTodos();
    final todo = todos.firstWhere((t) => t.id == id);
    final updatedTodo = todo.copyWith(title: newTitle.trim());
    _repository.updateTodo(updatedTodo);
  }

  void deleteTodo(String id) {
    _repository.deleteTodo(id);
  }
}

class ProductUseCases {
  final IProductRepository _repository;

  ProductUseCases(this._repository);

  List<Product> getAllProducts() => _repository.getAllProducts();
  
  void addProduct(String name, int initialQuantity) {
    if (name.trim().isEmpty || initialQuantity < 0) return;
    final product = Product(
      id: DateTime.now().microsecondsSinceEpoch.toString(),
      name: name.trim(),
      quantity: initialQuantity,
    );
    _repository.addProduct(product);
  }

  void updateProductQuantity(String id, int change) {
    final products = _repository.getAllProducts();
    final product = products.firstWhere((p) => p.id == id);
    if (product.quantity + change >= 0) {
      final updatedProduct = product.copyWith(quantity: product.quantity + change);
      _repository.updateProduct(updatedProduct);
    }
  }

  void updateProductName(String id, String newName) {
    if (newName.trim().isEmpty) return;
    final products = _repository.getAllProducts();
    final product = products.firstWhere((p) => p.id == id);
    final updatedProduct = product.copyWith(name: newName.trim());
    _repository.updateProduct(updatedProduct);
  }

  void deleteProduct(String id) {
    _repository.deleteProduct(id);
  }
}

// INFRASTRUCTURE LAYER - Repository Implementations
class InMemoryTodoRepository implements ITodoRepository {
  final List<Todo> _todos = [];

  @override
  List<Todo> getAllTodos() => List.unmodifiable(_todos);

  @override
  void addTodo(Todo todo) {
    _todos.add(todo);
  }

  @override
  void updateTodo(Todo todo) {
    final index = _todos.indexWhere((t) => t.id == todo.id);
    if (index != -1) {
      _todos[index] = todo;
    }
  }

  @override
  void deleteTodo(String id) {
    _todos.removeWhere((t) => t.id == id);
  }
}

class InMemoryProductRepository implements IProductRepository {
  final List<Product> _products = [];

  @override
  List<Product> getAllProducts() => List.unmodifiable(_products);

  @override
  void addProduct(Product product) {
    _products.add(product);
  }

  @override
  void updateProduct(Product product) {
    final index = _products.indexWhere((p) => p.id == product.id);
    if (index != -1) {
      _products[index] = product;
    }
  }

  @override
  void deleteProduct(String id) {
    _products.removeWhere((p) => p.id == id);
  }
}

// PRESENTATION LAYER - ViewModels (MVVM Pattern)
class ThemeViewModel extends ChangeNotifier {
  ThemeMode _currentThemeMode = ThemeMode.system;

  ThemeMode get themeMode => _currentThemeMode;

  void toggleTheme() {
    _currentThemeMode =
        _currentThemeMode == ThemeMode.light ? ThemeMode.dark : ThemeMode.light;
    notifyListeners();
  }
}

class TodoViewModel extends ChangeNotifier {
  final TodoUseCases _todoUseCases;

  TodoViewModel(this._todoUseCases);

  List<Todo> get todos => _todoUseCases.getAllTodos();

  void addTodo(String title) {
    _todoUseCases.addTodo(title);
    notifyListeners();
  }

  void toggleTodoStatus(String id) {
    try {
      _todoUseCases.toggleTodoStatus(id);
      notifyListeners();
    } catch (e) {
      debugPrint('Todo with ID $id not found: $e');
    }
  }

  void updateTodoTitle(String id, String newTitle) {
    try {
      _todoUseCases.updateTodoTitle(id, newTitle);
      notifyListeners();
    } catch (e) {
      debugPrint('Todo with ID $id not found: $e');
    }
  }

  void deleteTodo(String id) {
    _todoUseCases.deleteTodo(id);
    notifyListeners();
  }

  // Dashboard metrics
  int get totalTodos => todos.length;
  int get completedTodos => todos.where((t) => t.isCompleted).length;
  int get pendingTodos => totalTodos - completedTodos;
}

class ProductViewModel extends ChangeNotifier {
  final ProductUseCases _productUseCases;

  ProductViewModel(this._productUseCases);

  List<Product> get products => _productUseCases.getAllProducts();

  void addProduct(String name, int initialQuantity) {
    _productUseCases.addProduct(name, initialQuantity);
    notifyListeners();
  }

  void updateProductQuantity(String id, int change) {
    try {
      _productUseCases.updateProductQuantity(id, change);
      notifyListeners();
    } catch (e) {
      debugPrint('Product with ID $id not found: $e');
    }
  }

  void updateProductName(String id, String newName) {
    try {
      _productUseCases.updateProductName(id, newName);
      notifyListeners();
    } catch (e) {
      debugPrint('Product with ID $id not found: $e');
    }
  }

  void deleteProduct(String id) {
    _productUseCases.deleteProduct(id);
    notifyListeners();
  }

  // Dashboard metrics
  int get totalProducts => products.length;
  int get totalQuantity => products.fold(0, (sum, p) => sum + p.quantity);
}

// PRESENTATION LAYER - Views
class TodoApp extends StatelessWidget {
  const TodoApp({super.key});

  @override
  Widget build(BuildContext context) {
    // Dependency Injection Container
    final todoRepository = InMemoryTodoRepository();
    final productRepository = InMemoryProductRepository();
    final todoUseCases = TodoUseCases(todoRepository);
    final productUseCases = ProductUseCases(productRepository);

    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ThemeViewModel()),
        ChangeNotifierProvider(create: (_) => TodoViewModel(todoUseCases)),
        ChangeNotifierProvider(create: (_) => ProductViewModel(productUseCases)),
      ],
      child: Consumer<ThemeViewModel>(
        builder: (context, themeViewModel, child) {
          return MaterialApp(
            title: 'MVVM Todo App',
            theme: ThemeData.light(useMaterial3: true),
            darkTheme: ThemeData.dark(useMaterial3: true),
            themeMode: themeViewModel.themeMode,
            home: const MainNavigationScreen(),
          );
        },
      ),
    );
  }
}

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _selectedIndex = 0;

  final List<String> _pageTitles = [
    'Dashboard',
    'Todo List',
    'Stock Control',
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
    Navigator.of(context).pop();
  }

  void _showAddTodoDialog(BuildContext context) {
    showDialog<void>(
      context: context,
      builder: (dialogContext) => AddTodoDialog(
        onAdd: (title) {
          context.read<TodoViewModel>().addTodo(title);
          Navigator.of(dialogContext).pop();
        },
      ),
    );
  }

  void _showAddProductDialog(BuildContext context) {
    showDialog<void>(
      context: context,
      builder: (dialogContext) => AddProductDialog(
        onAdd: (name, quantity) {
          context.read<ProductViewModel>().addProduct(name, quantity);
          Navigator.of(dialogContext).pop();
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_pageTitles[_selectedIndex]),
        actions: [
          Consumer<ThemeViewModel>(
            builder: (context, themeViewModel, child) {
              return IconButton(
                icon: Icon(themeViewModel.themeMode == ThemeMode.dark
                    ? Icons.light_mode
                    : Icons.dark_mode),
                onPressed: themeViewModel.toggleTheme,
              );
            },
          ),
        ],
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            DrawerHeader(
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primary,
              ),
              child: const Text(
                'Menu',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                ),
              ),
            ),
            ListTile(
              leading: const Icon(Icons.dashboard),
              title: const Text('Dashboard'),
              selected: _selectedIndex == 0,
              onTap: () => _onItemTapped(0),
            ),
            ListTile(
              leading: const Icon(Icons.check_box),
              title: const Text('Todo List'),
              selected: _selectedIndex == 1,
              onTap: () => _onItemTapped(1),
            ),
            ListTile(
              leading: const Icon(Icons.storage),
              title: const Text('Stock Control'),
              selected: _selectedIndex == 2,
              onTap: () => _onItemTapped(2),
            ),
          ],
        ),
      ),
      body: IndexedStack(
        index: _selectedIndex,
        children: const [
          DashboardScreen(),
          TodoListScreen(),
          StockControlScreen(),
        ],
      ),
      floatingActionButton: _selectedIndex == 1
          ? FloatingActionButton(
              onPressed: () => _showAddTodoDialog(context),
              child: const Icon(Icons.add),
            )
          : _selectedIndex == 2
              ? FloatingActionButton(
                  onPressed: () => _showAddProductDialog(context),
                  child: const Icon(Icons.add),
                )
              : null,
    );
  }
}

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Welcome to your Dashboard!',
            style: Theme.of(context).textTheme.headlineMedium,
          ),
          const SizedBox(height: 24),
          Consumer<TodoViewModel>(
            builder: (context, todoViewModel, child) {
              return Card(
                elevation: 4,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Todo Summary', style: Theme.of(context).textTheme.titleLarge),
                      const SizedBox(height: 8),
                      Text('Total Tasks: ${todoViewModel.totalTodos}'),
                      Text('Completed Tasks: ${todoViewModel.completedTodos}'),
                      Text('Pending Tasks: ${todoViewModel.pendingTodos}'),
                    ],
                  ),
                ),
              );
            },
          ),
          const SizedBox(height: 16),
          Consumer<ProductViewModel>(
            builder: (context, productViewModel, child) {
              return Card(
                elevation: 4,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Stock Summary', style: Theme.of(context).textTheme.titleLarge),
                      const SizedBox(height: 8),
                      Text('Total Products: ${productViewModel.totalProducts}'),
                      Text('Total Items in Stock: ${productViewModel.totalQuantity}'),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}

class TodoListScreen extends StatelessWidget {
  const TodoListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<TodoViewModel>(
      builder: (context, todoViewModel, child) {
        if (todoViewModel.todos.isEmpty) {
          return const Center(
            child: Text('No tasks yet! Add a new one.'),
          );
        }
        return ListView.builder(
          itemCount: todoViewModel.todos.length,
          itemBuilder: (context, index) {
            final todo = todoViewModel.todos[index];
            return TodoItemWidget(todo: todo);
          },
        );
      },
    );
  }
}

class StockControlScreen extends StatelessWidget {
  const StockControlScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<ProductViewModel>(
      builder: (context, productViewModel, child) {
        if (productViewModel.products.isEmpty) {
          return const Center(
            child: Text('No products yet! Add a new one.'),
          );
        }
        return ListView.builder(
          itemCount: productViewModel.products.length,
          itemBuilder: (context, index) {
            final product = productViewModel.products[index];
            return ProductItemWidget(product: product);
          },
        );
      },
    );
  }
}

class TodoItemWidget extends StatelessWidget {
  final Todo todo;

  const TodoItemWidget({super.key, required this.todo});

  @override
  Widget build(BuildContext context) {
    return Dismissible(
      key: ValueKey(todo.id),
      direction: DismissDirection.endToStart,
      background: Container(
        color: Colors.red,
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.symmetric(horizontal: 20.0),
        child: const Icon(Icons.delete, color: Colors.white),
      ),
      onDismissed: (direction) {
        context.read<TodoViewModel>().deleteTodo(todo.id);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('"${todo.title}" dismissed')),
        );
      },
      child: Card(
        margin: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 4.0),
        child: ListTile(
          leading: Checkbox(
            value: todo.isCompleted,
            onChanged: (newValue) {
              if (newValue != null) {
                context.read<TodoViewModel>().toggleTodoStatus(todo.id);
              }
            },
          ),
          title: Text(
            todo.title,
            style: TextStyle(
              decoration: todo.isCompleted 
                  ? TextDecoration.lineThrough 
                  : TextDecoration.none,
              color: todo.isCompleted ? Colors.grey : null,
            ),
          ),
          onTap: () => _showEditTodoDialog(context, todo),
        ),
      ),
    );
  }

  void _showEditTodoDialog(BuildContext context, Todo todo) {
    showDialog<void>(
      context: context,
      builder: (dialogContext) => EditTodoDialog(
        todo: todo,
        onEdit: (newTitle) {
          context.read<TodoViewModel>().updateTodoTitle(todo.id, newTitle);
          Navigator.of(dialogContext).pop();
        },
      ),
    );
  }
}

class ProductItemWidget extends StatelessWidget {
  final Product product;

  const ProductItemWidget({super.key, required this.product});

  @override
  Widget build(BuildContext context) {
    return Dismissible(
      key: ValueKey(product.id),
      direction: DismissDirection.endToStart,
      background: Container(
        color: Colors.red,
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.symmetric(horizontal: 20.0),
        child: const Icon(Icons.delete, color: Colors.white),
      ),
      onDismissed: (direction) {
        context.read<ProductViewModel>().deleteProduct(product.id);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Product "${product.name}" removed')),
        );
      },
      child: Card(
        margin: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 4.0),
        child: ListTile(
          title: Text(product.name),
          subtitle: Text('Quantity: ${product.quantity}'),
          trailing: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              IconButton(
                icon: const Icon(Icons.remove_circle_outline),
                onPressed: () => _showUpdateQuantityDialog(context, product, false),
              ),
              IconButton(
                icon: const Icon(Icons.add_circle_outline),
                onPressed: () => _showUpdateQuantityDialog(context, product, true),
              ),
            ],
          ),
          onTap: () => _showEditProductDialog(context, product),
        ),
      ),
    );
  }

  void _showEditProductDialog(BuildContext context, Product product) {
    showDialog<void>(
      context: context,
      builder: (dialogContext) => EditProductDialog(
        product: product,
        onEdit: (newName) {
          context.read<ProductViewModel>().updateProductName(product.id, newName);
          Navigator.of(dialogContext).pop();
        },
      ),
    );
  }

  void _showUpdateQuantityDialog(BuildContext context, Product product, bool isInput) {
    showDialog<void>(
      context: context,
      builder: (dialogContext) => UpdateProductQuantityDialog(
        product: product,
        isInput: isInput,
        onUpdate: (quantityChange) {
          context.read<ProductViewModel>().updateProductQuantity(
            product.id, 
            quantityChange,
          );
          Navigator.of(dialogContext).pop();
        },
      ),
    );
  }
}

// Dialog Widgets
class AddTodoDialog extends StatefulWidget {
  final ValueChanged<String> onAdd;

  const AddTodoDialog({super.key, required this.onAdd});

  @override
  State<AddTodoDialog> createState() => _AddTodoDialogState();
}

class _AddTodoDialogState extends State<AddTodoDialog> {
  late final TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Add New Task'),
      content: TextField(
        controller: _controller,
        autofocus: true,
        decoration: const InputDecoration(
          hintText: 'Enter task title',
          border: OutlineInputBorder(),
        ),
        onSubmitted: widget.onAdd,
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Cancel'),
        ),
        TextButton(
          onPressed: () => widget.onAdd(_controller.text),
          child: const Text('Add'),
        ),
      ],
    );
  }
}

class EditTodoDialog extends StatefulWidget {
  final Todo todo;
  final ValueChanged<String> onEdit;

  const EditTodoDialog({super.key, required this.todo, required this.onEdit});

  @override
  State<EditTodoDialog> createState() => _EditTodoDialogState();
}

class _EditTodoDialogState extends State<EditTodoDialog> {
  late final TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.todo.title);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Edit Task'),
      content: TextField(
        controller: _controller,
        autofocus: true,
        decoration: const InputDecoration(
          hintText: 'Enter new task title',
          border: OutlineInputBorder(),
        ),
        onSubmitted: widget.onEdit,
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Cancel'),
        ),
        TextButton(
          onPressed: () => widget.onEdit(_controller.text),
          child: const Text('Save'),
        ),
      ],
    );
  }
}

class AddProductDialog extends StatefulWidget {
  final void Function(String name, int quantity) onAdd;

  const AddProductDialog({super.key, required this.onAdd});

  @override
  State<AddProductDialog> createState() => _AddProductDialogState();
}

class _AddProductDialogState extends State<AddProductDialog> {
  late final TextEditingController _nameController;
  late final TextEditingController _quantityController;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController();
    _quantityController = TextEditingController(text: '0');
  }

  @override
  void dispose() {
    _nameController.dispose();
    _quantityController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Add New Product'),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _nameController,
              autofocus: true,
              decoration: const InputDecoration(
                hintText: 'Enter product name',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _quantityController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                hintText: 'Enter initial quantity',
                border: OutlineInputBorder(),
              ),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Cancel'),
        ),
        TextButton(
          onPressed: () {
            final name = _nameController.text;
            final quantity = int.tryParse(_quantityController.text) ?? 0;
            widget.onAdd(name, quantity);
          },
          child: const Text('Add'),
        ),
      ],
    );
  }
}

class EditProductDialog extends StatefulWidget {
  final Product product;
  final ValueChanged<String> onEdit;

  const EditProductDialog({super.key, required this.product, required this.onEdit});

  @override
  State<EditProductDialog> createState() => _EditProductDialogState();
}

class _EditProductDialogState extends State<EditProductDialog> {
  late final TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.product.name);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Edit Product Name'),
      content: TextField(
        controller: _controller,
        autofocus: true,
        decoration: const InputDecoration(
          hintText: 'Enter new product name',
          border: OutlineInputBorder(),
        ),
        onSubmitted: widget.onEdit,
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Cancel'),
        ),
        TextButton(
          onPressed: () => widget.onEdit(_controller.text),
          child: const Text('Save'),
        ),
      ],
    );
  }
}

class UpdateProductQuantityDialog extends StatefulWidget {
  final Product product;
  final bool isInput;
  final ValueChanged<int> onUpdate;

  const UpdateProductQuantityDialog({
    super.key,
    required this.product,
    required this.isInput,
    required this.onUpdate,
  });

  @override
  State<UpdateProductQuantityDialog> createState() => _UpdateProductQuantityDialogState();
}

class _UpdateProductQuantityDialogState extends State<UpdateProductQuantityDialog> {
  late final TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: '1');
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(widget.isInput ? 'Add Quantity' : 'Subtract Quantity'),
      content: TextField(
        controller: _controller,
        keyboardType: TextInputType.number,
        decoration: InputDecoration(
          hintText: 'Enter quantity to ${widget.isInput ? 'add' : 'subtract'}',
          border: const OutlineInputBorder(),
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Cancel'),
        ),
        TextButton(
          onPressed: () {
            final change = int.tryParse(_controller.text) ?? 0;
            if (change > 0) {
              widget.onUpdate(widget.isInput ? change : -change);
            } else {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Please enter a positive quantity.')),
              );
            }
          },
          child: Text(widget.isInput ? 'Add' : 'Subtract'),
        ),
      ],
    );
  }
}

void main() {
  runApp(const TodoApp());
}
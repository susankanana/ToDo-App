document.addEventListener('DOMContentLoaded', function() {
  const todoList = document.querySelector('.todoitems');
  const input = document.querySelector('.input input[type="text"]');
  const itemsLeft = document.querySelector('footer span');
  const filterButtons = document.querySelectorAll('.filters button');
  const clearCompleted = document.querySelector('.clear');
  const themeToggle = document.querySelector('.theme-toggle');

  // Theme toggle
  let isDarkMode = localStorage.getItem('darkMode') === 'true';

  function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
    themeToggle.src = isDarkMode ? 'images/icon-sun.svg' : 'images/icon-moon.svg';
  }

  // Initialize theme
  if (isDarkMode) {
    document.body.classList.add('dark');
    themeToggle.src = 'images/icon-sun.svg';
  }

  themeToggle.addEventListener('click', toggleTheme);

  // Update items count
  function updateItemsCount() {
    const activeItems = document.querySelectorAll('.todoitems li:not(.completed)').length;
    itemsLeft.textContent = `${activeItems} items left`;
  }

  // Function to create a new todo item
  function createNewTodoItem(text) {
    const li = document.createElement('li');
    li.innerHTML = `
      <input type="checkbox">
      <span>${text}</span>
      <button class="delete-button"></button>
    `;

    const checkbox = li.querySelector('input');
    checkbox.addEventListener('change', function() {
      li.classList.toggle('completed');
      updateItemsCount();
    });

    const deleteButton = li.querySelector('.delete-button');
    deleteButton.addEventListener('click', function() {
      li.remove();
      updateItemsCount();
    });

    li.setAttribute('draggable', true);
    setupDragAndDrop(li);

    return li;
  }

  // Add new todo
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && input.value.trim()) {
      const newTodo = createNewTodoItem(input.value.trim());
      todoList.appendChild(newTodo);
      input.value = '';
      updateItemsCount();
    }
  });

  // Handle existing todo checkboxes and add delete buttons
  document.querySelectorAll('.todoitems li').forEach(item => {
    const checkbox = item.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', function() {
      item.classList.toggle('completed');
      updateItemsCount();
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', function() {
      item.remove();
      updateItemsCount();
    });
    item.appendChild(deleteButton);

    item.setAttribute('draggable', true);
    setupDragAndDrop(item);
  });

  // Filter todos
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      const filter = this.textContent.toLowerCase();
      document.querySelectorAll('.todoitems li').forEach(item => {
        if (filter === 'all') {
          item.style.display = '';
        } else if (filter === 'active') {
          item.style.display = item.classList.contains('completed') ? 'none' : '';
        } else if (filter === 'completed') {
          item.style.display = item.classList.contains('completed') ? '' : 'none';
        }
      });
    });
  });

  // Clear completed
  clearCompleted.addEventListener('click', function() {
    document.querySelectorAll('.todoitems li.completed').forEach(item => {
      item.remove();
    });
    updateItemsCount();
  });

  // Initialize items count
  updateItemsCount();

  // Drag and drop functionality
  function setupDragAndDrop(item) {
    item.addEventListener('dragstart', function() {
      this.classList.add('dragging');
    });

    item.addEventListener('dragend', function() {
      this.classList.remove('dragging');
    });

    item.addEventListener('dragover', function(e) {
      e.preventDefault();
      const draggingItem = document.querySelector('.dragging');
      const siblings = [...todoList.querySelectorAll('li:not(.dragging)')];
      const nextSibling = siblings.find(sibling => {
        const rect = sibling.getBoundingClientRect();
        return e.clientY <= rect.top + rect.height / 2;
      });

      if (nextSibling) {
        todoList.insertBefore(draggingItem, nextSibling);
      } else {
        todoList.appendChild(draggingItem);
      }
    });
  }

  // Setup drag and drop for existing items (already called)
  document.querySelectorAll('.todoitems li').forEach(item => {
   item.setAttribute('draggable', true);
     setupDragAndDrop(item);
  });
});
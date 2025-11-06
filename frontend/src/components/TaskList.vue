<template>
  <div>
    <h2 class="mb-4 text-center">Task List</h2>

    <!-- Loading Spinner -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="tasks.length === 0" class="text-center text-muted py-5">
      <i class="bi bi-list-task fs-1"></i>
      <p class="mt-2">No tasks yet. Add a task above!</p>
    </div>

    <!-- Task List -->
    <transition-group name="fade" tag="ul" class="list-group">
      <li
        v-for="task in tasks"
        :key="task.id"
        class="list-group-item d-flex justify-content-between align-items-center shadow-sm mb-2 task-item flex-column flex-md-row gap-2 gap-md-0"
      >
        <div>
          <h5 class="mb-1">{{ task.title }}</h5>
          <p class="mb-1 text-muted">{{ task.description }}</p>
          <small>
            Assigned to:
            <strong>{{ task.User?.username || task.username || "Unknown" }}</strong>
          </small>
        </div>
        <div class="task-actions d-flex gap-2 mt-2 mt-md-0">
          <span
            class="badge"
            :class="task.completed ? 'bg-success' : 'bg-warning text-dark'"
          >
            {{ task.completed ? 'Completed' : 'Pending' }}
          </span>
          <button
            class="btn btn-sm btn-outline-success"
            @click="toggleComplete(task)"
          >
            Toggle
          </button>
          <button
            class="btn btn-sm btn-outline-danger"
            @click="deleteTask(task.id)"
          >
            Delete
          </button>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script>
import api from "../api";

export default {
  data() {
    return {
      tasks: [],
      loading: true,
    };
  },
  methods: {
    async fetchTasks() {
      this.loading = true;
      try {
        const res = await api.get("/tasks");
        // Ensure each task has a clean structure
        this.tasks = res.data.map(task => ({
          ...task,
          User: task.User || null, // ensure safe access
        }));
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        this.loading = false;
      }
    },
    async toggleComplete(task) {
      try {
        await api.put(`/tasks/${task.id}`, { completed: !task.completed });
        this.fetchTasks();
      } catch (error) {
        console.error("Error toggling task:", error);
      }
    },
    async deleteTask(id) {
      try {
        await api.delete(`/tasks/${id}`);
        this.fetchTasks();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    },
  },
  mounted() {
    this.fetchTasks();
  },
};
</script>

<style scoped>
.task-item {
  border-radius: 12px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.task-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.task-actions button {
  min-width: 65px;
}

.badge {
  font-size: 0.85rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

@media (max-width: 576px) {
  .task-actions {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>

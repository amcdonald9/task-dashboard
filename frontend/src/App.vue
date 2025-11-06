<template>
  <div class="container py-5">

    <!-- Header -->
    <header class="text-center mb-5">
      <h1 class="display-5 fw-bold text-gradient mb-2">Task Management Dashboard</h1>
      <p class="lead text-muted">Organize users, assign tasks, and track progress — all in one place.</p>
      <hr class="divider mx-auto" />
    </header>

    <!-- Forms Section -->
    <section class="row g-4 mb-5">

      <!-- User Form -->
      <div class="col-lg-6 col-md-12">
        <div class="card form-card shadow-sm h-100 border-0">
          <div class="card-header bg-primary text-white fw-semibold d-flex align-items-center">
            <i class="bi bi-person-plus me-2"></i> Create User
          </div>
          <div class="card-body">
            <UserForm 
              @user-created="handleUserChange" 
              @user-deleted="handleUserChange" 
            />
          </div>
        </div>
      </div>

      <!-- Task Form -->
      <div class="col-lg-6 col-md-12">
        <div class="card form-card shadow-sm h-100 border-0">
          <div class="card-header bg-success text-white fw-semibold d-flex align-items-center">
            <i class="bi bi-clipboard-plus me-2"></i> Create Task
          </div>
          <div class="card-body">
            <TaskForm 
              :refreshTrigger="userRefreshTrigger" 
              @task-created="refreshTasks" 
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Task List -->
    <section>
      <div class="card shadow-sm border-0 mb-5">
        <div class="card-header bg-info text-white fw-semibold d-flex align-items-center">
          <i class="bi bi-list-task me-2"></i> Tasks
        </div>
        <div class="card-body">
          <TaskList ref="taskList" />
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="text-center text-muted pt-3">
      <small>&copy; 2025 Task Dashboard | Built with <span class="fw-semibold text-primary">Vue.js</span> &amp; <span class="fw-semibold text-success">Bootstrap 5</span></small>
    </footer>

  </div>
</template>

<script>
import UserForm from "./components/UserForm.vue";
import TaskForm from "./components/TaskForm.vue";
import TaskList from "./components/TaskList.vue";

export default {
  components: {
    UserForm,
    TaskForm,
    TaskList,
  },
  data() {
    return {
      userRefreshTrigger: false, // triggers TaskForm to reload users
    };
  },
  methods: {
    refreshTasks() {
      if (this.$refs.taskList) {
        this.$refs.taskList.fetchTasks();
      }
    },
    handleUserChange() {
      // Toggle the trigger to force TaskForm to refresh users
      this.userRefreshTrigger = !this.userRefreshTrigger;
    },
  },
  mounted() {
    this.refreshTasks();
  },
};
</script>

<style scoped>
/* Font and spacing */
.container {
  max-width: 1100px;
}

/* Gradient Title */
.text-gradient {
  background: linear-gradient(90deg, #007bff, #28a745);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Divider under header */
.divider {
  width: 70px;
  height: 3px;
  background: linear-gradient(90deg, #007bff, #28a745);
  border: none;
  border-radius: 3px;
  margin-top: 1rem;
}

/* Card base styling */
.card {
  border-radius: 12px;
  transition: all 0.25s ease;
  background-color: #ffffff;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

/* Header visual consistency */
.card-header {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
}

/* Icons and layout */
.bi {
  font-size: 1.1rem;
  vertical-align: -0.1rem;
}

/* Responsive tweaks */
@media (max-width: 768px) {
  .card {
    margin-bottom: 1.5rem;
  }

  .display-5 {
    font-size: 2rem;
  }
}

/* Footer styling */
footer {
  font-size: 0.9rem;
  color: #6c757d;
}

/* Smooth section fade-in */
section,
header {
  animation: fadeIn 0.6s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>


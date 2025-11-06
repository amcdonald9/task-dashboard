<template>
  <div>
    <h5 class="mb-3">Create New Task</h5>

    <!-- Success / Error Alerts -->
    <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
      {{ successMessage }}
      <button type="button" class="btn-close" @click="successMessage = ''" aria-label="Close"></button>
    </div>
    <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
      {{ errorMessage }}
      <button type="button" class="btn-close" @click="errorMessage = ''" aria-label="Close"></button>
    </div>

    <!-- Task Form -->
    <form @submit.prevent="createTask" class="d-flex flex-column gap-3">

      <div class="form-floating">
        <input v-model="title" type="text" class="form-control" id="taskTitle" placeholder="Task Title" required />
        <label for="taskTitle">Task Title</label>
      </div>

      <div class="form-floating">
        <textarea v-model="description" class="form-control" placeholder="Task Description" id="taskDescription" rows="3" required></textarea>
        <label for="taskDescription">Task Description</label>
      </div>

      <div class="form-floating">
        <select v-model="userId" class="form-select" id="userSelect" required>
          <option disabled value="">{{ usersLoading ? "Loading users..." : "Select a user" }}</option>
          <option v-for="user in users" :key="user.id" :value="user.id">{{ user.username }}</option>
        </select>
        <label for="userSelect">Assign to User</label>
      </div>

      <button type="submit" class="btn btn-success w-100 mt-2" :disabled="usersLoading || loading">
        <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Add Task
      </button>

    </form>
  </div>
</template>

<script>
import api from "../api";

export default {
  props: ["refreshTrigger"],
  data() {
    return {
      title: "",
      description: "",
      userId: "",
      users: [],
      usersLoading: true,
      loading: false,
      successMessage: "",
      errorMessage: "",
    };
  },
  methods: {
    async fetchUsers() {
      this.usersLoading = true;
      try {
        const res = await api.get("/users");
        this.users = res.data;
      } catch (error) {
        console.error("Error fetching users:", error);
        this.errorMessage = "Unable to load users. Check console for details.";
      } finally {
        this.usersLoading = false;
      }
    },
    async createTask() {
      this.successMessage = "";
      this.errorMessage = "";
      this.loading = true;

      if (!this.userId) {
        this.errorMessage = "Please select a user for this task.";
        this.loading = false;
        return;
      }

      try {
        const res = await api.post("/tasks", {
          title: this.title,
          description: this.description,
          userId: this.userId,
        });

        this.successMessage = `Task "${res.data.title}" created successfully!`;

        this.title = "";
        this.description = "";
        this.userId = "";

        this.$emit("task-created");
      } catch (error) {
        console.error("Error creating task:", error);
        this.errorMessage = "Failed to create task. Check console for details.";
      } finally {
        this.loading = false;
        setTimeout(() => {
          this.successMessage = "";
          this.errorMessage = "";
        }, 4000);
      }
    },
  },
  mounted() {
    this.fetchUsers();
  },
  watch: {
    refreshTrigger(newVal) {
      if (newVal) this.fetchUsers();
    },
  },
};
</script>

<style scoped>
.form-control,
.form-select,
textarea {
  border-radius: 0.5rem;
  transition: box-shadow 0.2s ease;
}
.form-control:focus,
.form-select:focus,
textarea:focus {
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}
.btn-success {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.btn-success:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.alert {
  border-radius: 0.5rem;
}
</style>

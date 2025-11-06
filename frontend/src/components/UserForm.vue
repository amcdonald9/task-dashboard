<template>
  <div>
    <!-- Success / Error Alerts -->
    <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
      {{ successMessage }}
      <button type="button" class="btn-close" @click="successMessage = ''" aria-label="Close"></button>
    </div>
    <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
      {{ errorMessage }}
      <button type="button" class="btn-close" @click="errorMessage = ''" aria-label="Close"></button>
    </div>

    <!-- User Form -->
    <form @submit.prevent="createUser" class="d-flex flex-column gap-3 mb-4">
      <div class="form-floating">
        <input v-model="username" type="text" class="form-control" id="username" placeholder="Username" required />
        <label for="username">Username</label>
      </div>

      <div class="form-floating">
        <input v-model="email" type="email" class="form-control" id="email" placeholder="Email" required />
        <label for="email">Email</label>
      </div>

      <div class="form-floating">
        <input v-model="password" type="password" class="form-control" id="password" placeholder="Password" required />
        <label for="password">Password</label>
      </div>

      <button type="submit" class="btn btn-primary w-100 mt-2" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Add User
      </button>
    </form>

    <!-- User List -->
    <h5 class="mb-2">Users</h5>
    <ul v-if="users.length > 0" class="list-group">
      <li
        v-for="user in users"
        :key="user.id"
        class="list-group-item d-flex justify-content-between align-items-center shadow-sm mb-2"
      >
        <span>{{ user.username }} ({{ user.email }})</span>
        <button class="btn btn-sm btn-outline-danger" @click="deleteUser(user.id)">
          Delete
        </button>
      </li>
    </ul>
    <p v-else class="text-muted">No users yet. Add one above!</p>
  </div>
</template>

<script>
import api from "../api";

export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      users: [],
      loading: false,
      successMessage: "",
      errorMessage: "",
    };
  },
  methods: {
    async fetchUsers() {
      try {
        const res = await api.get("/users");
        this.users = res.data;
      } catch (error) {
        console.error("Error fetching users:", error);
        this.errorMessage = "Unable to load users. Check console for details.";
      }
    },
    async createUser() {
      this.loading = true;
      this.successMessage = "";
      this.errorMessage = "";

      try {
        const res = await api.post("/users", {
          username: this.username,
          email: this.email,
          password: this.password,
        });

        this.successMessage = `User "${res.data.username}" created successfully!`;

        // Reset form fields
        this.username = "";
        this.email = "";
        this.password = "";

        // Refresh users list
        this.fetchUsers();

        // Emit events
        this.$emit("user-created");
        this.$emit("refresh-trigger", true);

      } catch (error) {
        console.error(error);
        this.errorMessage = "Error creating user. Check console for details.";
      } finally {
        this.loading = false;
        setTimeout(() => {
          this.successMessage = "";
          this.errorMessage = "";
        }, 4000);
      }
    },
    async deleteUser(userId) {
      if (!confirm("Are you sure you want to delete this user?")) return;

      try {
        await api.delete(`/users/${userId}`);
        this.successMessage = "User deleted successfully!";

        // Refresh users list
        this.fetchUsers();

        // Emit user-deleted event
        this.$emit("user-deleted");

        // Optional: emit refresh-trigger too
        this.$emit("refresh-trigger", true);

      } catch (error) {
        console.error(error);
        this.errorMessage = "Failed to delete user. Check console for details.";
      } finally {
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
};
</script>

<style scoped>
.form-floating input {
  border-radius: 0.5rem;
  transition: box-shadow 0.2s ease;
}
.form-floating input:focus {
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

button.btn {
  align-self: flex-start;
  border-radius: 0.5rem;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
button.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.list-group-item {
  border-radius: 0.5rem;
}

.alert {
  border-radius: 0.5rem;
}
</style>

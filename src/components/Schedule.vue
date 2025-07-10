<template>
  <div class="schedule">
    <h1>📅 Jadwal Kuliah</h1>
    <table>
      <thead>
        <tr>
          <th>Hari</th>
          <th>Jam</th>
          <th>Mata Kuliah</th>
          <th>Dosen</th>
          <th>Ruangan</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in schedule" :key="item.id">
          <td>{{ item.day }}</td>
          <td>{{ item.time }}</td>
          <td>{{ item.subject }}</td>
          <td>{{ item.lecturer }}</td>
          <td>{{ item.room }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const schedule = ref([
  { id: 1, day: 'Senin', time: '08:00 - 10:00', subject: 'Struktur Data', lecturer: 'Prof. Sarah Johnson', room: 'R101' },
  { id: 2, day: 'Selasa', time: '10:00 - 12:00', subject: 'Basis Data', lecturer: 'Dr. Agus Susanto', room: 'R202' },
  { id: 3, day: 'Rabu', time: '13:00 - 15:00', subject: 'Pemrograman Dasar', lecturer: 'Dr. Bambang Wijaya', room: 'R105' }
])
</script>

<style scoped>
.schedule {
  max-width: 900px;
  margin: auto;
  padding: 2rem;
}

.schedule h1 {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

th, td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
}

th {
  background-color: #f3f4f6;
  color: #374151;
  font-weight: 600;
}

tbody tr:hover {
  background-color: #f9fafb;
}
</style>

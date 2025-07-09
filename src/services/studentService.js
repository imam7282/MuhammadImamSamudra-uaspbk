import api from './api'

export const studentService = {
  // Get all students
  async getAll() {
    try {
      const response = await api.get('/students')
      return response.data
    } catch (error) {
      console.error('Error fetching students:', error)
      throw error
    }
  },

  // Get student by ID
  async getById(id) {
    try {
      const response = await api.get(`/students/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching student:', error)
      throw error
    }
  },

  // Create new student
  async create(studentData) {
    try {
      const response = await api.post('/students', {
        ...studentData,
        status: 'Active',
        enrolledCourses: 0
      })
      return response.data
    } catch (error) {
      console.error('Error creating student:', error)
      throw error
    }
  },

  // Update student
  async update(id, studentData) {
    try {
      const response = await api.put(`/students/${id}`, studentData)
      return response.data
    } catch (error) {
      console.error('Error updating student:', error)
      throw error
    }
  },

  // Delete student
  async delete(id) {
    try {
      await api.delete(`/students/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting student:', error)
      throw error
    }
  },

  // Search students
  async search(query) {
    try {
      const response = await api.get(`/students?q=${encodeURIComponent(query)}`)
      return response.data
    } catch (error) {
      console.error('Error searching students:', error)
      throw error
    }
  },

  // Filter students by major
  async filterByMajor(major) {
    try {
      const response = await api.get(`/students?major=${encodeURIComponent(major)}`)
      return response.data
    } catch (error) {
      console.error('Error filtering students:', error)
      throw error
    }
  }
}
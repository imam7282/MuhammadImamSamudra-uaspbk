import api from './api'

export const courseService = {
  // Get all courses
  async getAll() {
    try {
      const response = await api.get('/courses')
      return response.data
    } catch (error) {
      console.error('Error fetching courses:', error)
      throw error
    }
  },

  // Get course by ID
  async getById(id) {
    try {
      const response = await api.get(`/courses/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching course:', error)
      throw error
    }
  },

  // Create new course
  async create(courseData) {
    try {
      const response = await api.post('/courses', {
        ...courseData,
        enrolled: 0,
        status: 'Active'
      })
      return response.data
    } catch (error) {
      console.error('Error creating course:', error)
      throw error
    }
  },

  // Update course
  async update(id, courseData) {
    try {
      const response = await api.put(`/courses/${id}`, courseData)
      return response.data
    } catch (error) {
      console.error('Error updating course:', error)
      throw error
    }
  },

  // Delete course
  async delete(id) {
    try {
      await api.delete(`/courses/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting course:', error)
      throw error
    }
  },

  // Search courses
  async search(query) {
    try {
      const response = await api.get(`/courses?q=${encodeURIComponent(query)}`)
      return response.data
    } catch (error) {
      console.error('Error searching courses:', error)
      throw error
    }
  },

  // Filter courses by semester
  async filterBySemester(semester) {
    try {
      const response = await api.get(`/courses?semester=${encodeURIComponent(semester)}`)
      return response.data
    } catch (error) {
      console.error('Error filtering courses:', error)
      throw error
    }
  },

  // Get course statistics
  async getStatistics() {
    try {
      const response = await api.get('/courses')
      const courses = response.data
      
      return {
        total: courses.length,
        totalEnrolled: courses.reduce((sum, course) => sum + course.enrolled, 0),
        averageEnrollment: courses.length > 0 
          ? (courses.reduce((sum, course) => sum + course.enrolled, 0) / courses.length).toFixed(1)
          : 0
      }
    } catch (error) {
      console.error('Error fetching course statistics:', error)
      throw error
    }
  }
}
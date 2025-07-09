import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { courseService } from '../services/courseService'

export const useCoursesStore = defineStore('courses', () => {
  const courses = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  // Fetch all courses from API
  const fetchCourses = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await courseService.getAll()
      courses.value = data
    } catch (err) {
      error.value = 'Failed to fetch courses'
      console.error('Error fetching courses:', err)
    } finally {
      loading.value = false
    }
  }
  
  // Add new course
  const addCourse = async (courseData) => {
    loading.value = true
    error.value = null
    try {
      const newCourse = await courseService.create(courseData)
      courses.value.push(newCourse)
      return newCourse
    } catch (err) {
      error.value = 'Failed to add course'
      console.error('Error adding course:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Update course
  const updateCourse = async (id, updatedData) => {
    loading.value = true
    error.value = null
    try {
      const updatedCourse = await courseService.update(id, updatedData)
      const index = courses.value.findIndex(c => c.id === id)
      if (index !== -1) {
        courses.value[index] = updatedCourse
      }
      return updatedCourse
    } catch (err) {
      error.value = 'Failed to update course'
      console.error('Error updating course:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Delete course
  const deleteCourse = async (id) => {
    loading.value = true
    error.value = null
    try {
      await courseService.delete(id)
      const index = courses.value.findIndex(c => c.id === id)
      if (index !== -1) {
        courses.value.splice(index, 1)
      }
    } catch (err) {
      error.value = 'Failed to delete course'
      console.error('Error deleting course:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Get course by ID
  const getCourseById = (id) => {
    return courses.value.find(c => c.id === id)
  }
  
  // Search courses
  const searchCourses = async (query) => {
    if (!query.trim()) {
      await fetchCourses()
      return
    }
    
    loading.value = true
    error.value = null
    try {
      const data = await courseService.search(query)
      courses.value = data
    } catch (err) {
      error.value = 'Failed to search courses'
      console.error('Error searching courses:', err)
    } finally {
      loading.value = false
    }
  }
  
  // Filter courses by semester
  const filterBySemester = async (semester) => {
    if (!semester) {
      await fetchCourses()
      return
    }
    
    loading.value = true
    error.value = null
    try {
      const data = await courseService.filterBySemester(semester)
      courses.value = data
    } catch (err) {
      error.value = 'Failed to filter courses'
      console.error('Error filtering courses:', err)
    } finally {
      loading.value = false
    }
  }
  
  // Computed properties
  const totalCourses = computed(() => courses.value.length)
  const totalEnrolled = computed(() => {
    return courses.value.reduce((sum, course) => sum + course.enrolled, 0)
  })
  
  return {
    courses,
    loading,
    error,
    fetchCourses,
    addCourse,
    updateCourse,
    deleteCourse,
    getCourseById,
    searchCourses,
    filterBySemester,
    totalCourses,
    totalEnrolled
  }
})
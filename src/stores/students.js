import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { studentService } from '../services/studentService'

export const useStudentsStore = defineStore('students', () => {
  const students = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  // Fetch all students from API
  const fetchStudents = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await studentService.getAll()
      students.value = data
    } catch (err) {
      error.value = 'Failed to fetch students'
      console.error('Error fetching students:', err)
    } finally {
      loading.value = false
    }
  }
  
  // Add new student
  const addStudent = async (studentData) => {
    loading.value = true
    error.value = null
    try {
      const newStudent = await studentService.create(studentData)
      students.value.push(newStudent)
      return newStudent
    } catch (err) {
      error.value = 'Failed to add student'
      console.error('Error adding student:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Update student
  const updateStudent = async (id, updatedData) => {
    loading.value = true
    error.value = null
    try {
      const updatedStudent = await studentService.update(id, updatedData)
      const index = students.value.findIndex(s => s.id === id)
      if (index !== -1) {
        students.value[index] = updatedStudent
      }
      return updatedStudent
    } catch (err) {
      error.value = 'Failed to update student'
      console.error('Error updating student:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Delete student
  const deleteStudent = async (id) => {
    loading.value = true
    error.value = null
    try {
      await studentService.delete(id)
      const index = students.value.findIndex(s => s.id === id)
      if (index !== -1) {
        students.value.splice(index, 1)
      }
    } catch (err) {
      error.value = 'Failed to delete student'
      console.error('Error deleting student:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Get student by ID
  const getStudentById = (id) => {
    return students.value.find(s => s.id === id)
  }
  
  // Search students
  const searchStudents = async (query) => {
    if (!query.trim()) {
      await fetchStudents()
      return
    }
    
    loading.value = true
    error.value = null
    try {
      const data = await studentService.search(query)
      students.value = data
    } catch (err) {
      error.value = 'Failed to search students'
      console.error('Error searching students:', err)
    } finally {
      loading.value = false
    }
  }
  
  // Filter students by major
  const filterByMajor = async (major) => {
    if (!major) {
      await fetchStudents()
      return
    }
    
    loading.value = true
    error.value = null
    try {
      const data = await studentService.filterByMajor(major)
      students.value = data
    } catch (err) {
      error.value = 'Failed to filter students'
      console.error('Error filtering students:', err)
    } finally {
      loading.value = false
    }
  }
  
  // Computed properties
  const totalStudents = computed(() => students.value.length)
  const averageGPA = computed(() => {
    if (students.value.length === 0) return 0
    const sum = students.value.reduce((acc, student) => acc + student.gpa, 0)
    return (sum / students.value.length).toFixed(2)
  })
  
  return {
    students,
    loading,
    error,
    fetchStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
    searchStudents,
    filterByMajor,
    totalStudents,
    averageGPA
  }
})
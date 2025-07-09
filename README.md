# Vue 3 + Vite

# Modern Student Management System

Sistem Manajemen Mahasiswa modern yang dibangun dengan Vue 3, Vite, dan RESTful API.

## Fitur Utama

- ✅ **Dashboard Analytics** - Statistik dan grafik real-time
- ✅ **Manajemen Mahasiswa** - CRUD operations dengan API
- ✅ **Manajemen Mata Kuliah** - CRUD operations dengan API
- ✅ **Authentication System** - Login/logout functionality
- ✅ **Responsive Design** - Mobile-friendly interface
- ✅ **RESTful API Integration** - Full API consumption
- ✅ **State Management** - Pinia store dengan API integration
- ✅ **Search & Filter** - Real-time search dan filtering
- ✅ **Loading States** - User feedback untuk API calls
- ✅ **Error Handling** - Comprehensive error management

## Tech Stack

- **Frontend**: Vue 3, Vite, Pinia
- **UI**: Custom CSS dengan modern design
- **Icons**: Lucide Vue Next
- **Charts**: Chart.js
- **HTTP Client**: Axios
- **Mock API**: JSON Server
- **Routing**: Vue Router

## Installation & Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server dengan API**
   ```bash
   npm run dev:full
   ```
   
   Atau jalankan secara terpisah:
   ```bash
   # Terminal 1 - API Server
   npm run api
   
   # Terminal 2 - Frontend
   npm run dev
   ```

3. **Access aplikasi**
   - Frontend: http://localhost:5173
   - API Server: http://localhost:3001
   - API Documentation: http://localhost:3001 (JSON Server interface)

## API Endpoints

### Students
- `GET /students` - Get all students
- `GET /students/:id` - Get student by ID
- `POST /students` - Create new student
- `PUT /students/:id` - Update student
- `DELETE /students/:id` - Delete student
- `GET /students?q=search` - Search students
- `GET /students?major=filter` - Filter by major

### Courses
- `GET /courses` - Get all courses
- `GET /courses/:id` - Get course by ID
- `POST /courses` - Create new course
- `PUT /courses/:id` - Update course
- `DELETE /courses/:id` - Delete course
- `GET /courses?q=search` - Search courses
- `GET /courses?semester=filter` - Filter by semester

## Login Credentials

**Demo Account:**
- Username: `admin`
- Password: `admin`

## Project Structure

```
src/
├── components/          # Vue components
│   ├── Dashboard.vue    # Dashboard dengan charts
│   ├── Students.vue     # Student management
│   ├── Courses.vue      # Course management
│   ├── Login.vue        # Authentication
│   └── ...
├── services/            # API services
│   ├── api.js          # Axios configuration
│   ├── studentService.js # Student API calls
│   └── courseService.js  # Course API calls
├── stores/              # Pinia stores
│   ├── auth.js         # Authentication store
│   ├── students.js     # Students store dengan API
│   └── courses.js      # Courses store dengan API
└── style.css           # Global styles
```

## Features Implementation

### 1. RESTful API Integration
- Axios untuk HTTP requests
- Service layer untuk API calls
- Error handling dan loading states
- Request/response interceptors

### 2. State Management
- Pinia stores dengan API integration
- Reactive data dengan Vue 3 Composition API
- Computed properties untuk derived state

### 3. Search & Filter
- Real-time search dengan API
- Filter berdasarkan kategori
- Debounced search untuk performance

### 4. User Experience
- Loading spinners saat API calls
- Error messages dengan retry functionality
- Responsive design untuk mobile
- Smooth animations dan transitions

## Build & Deploy

```bash
# Build untuk production
npm run build

# Preview production build
npm run preview
```

## Development Notes

- API menggunakan JSON Server sebagai mock backend
- Data disimpan di `db.json`
- Hot reload untuk development
- TypeScript support ready (tinggal rename .js ke .ts)
- PWA ready (tinggal tambah service worker)
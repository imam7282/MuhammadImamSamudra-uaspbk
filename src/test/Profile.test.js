import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Profile from '@/views/Profile.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

vi.mock('@/stores/auth', () => {
  return {
    useAuthStore: vi.fn()
  }
})

describe('Profile.vue', () => {
  let wrapper

  const mockUser = {
    name: 'Admin Satu',
    username: 'admin123',
    email: 'admin@example.com',
    role: 'Administrator'
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    useAuthStore.mockReturnValue({
      currentUser: mockUser,
      user: mockUser
    })
    wrapper = mount(Profile)
  })

  it('menampilkan nama pengguna di avatar dan form', () => {
    expect(wrapper.text()).toContain('Admin Satu')
    expect(wrapper.find('input[type="text"]').element.value).toBe('Admin Satu')
  })

  it('reset form kembali ke nilai semula', async () => {
    await wrapper.find('input[type="text"]').setValue('Nama Baru')
    await wrapper.find('button.btn-secondary').trigger('click')
    expect(wrapper.find('input[type="text"]').element.value).toBe('Admin Satu')
  })

  it('tidak menyimpan profil jika password konfirmasi tidak cocok', async () => {
    window.alert = vi.fn()

    await wrapper.find('input[type="password"]:nth-of-type(1)').setValue('lama123')
    await wrapper.find('input[type="password"]:nth-of-type(2)').setValue('baru123')
    await wrapper.find('input[type="password"]:nth-of-type(3)').setValue('beda123')
    await wrapper.find('form').trigger('submit.prevent')

    expect(window.alert).toHaveBeenCalledWith('Password baru dan konfirmasi password tidak cocok!')
  })

  it('menyimpan pengaturan ketika tombol disimpan diklik', async () => {
    window.alert = vi.fn()
    await wrapper.find('.settings-actions button').trigger('click')
    expect(window.alert).toHaveBeenCalledWith('Pengaturan berhasil disimpan!')
  })
})

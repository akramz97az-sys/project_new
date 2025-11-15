<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button default-href="/tabs/tab1"></ion-back-button>
          </ion-buttons>
          <ion-title>Edit Profil</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content :fullscreen="true" class="ion-padding">
        <ion-spinner v-if="loading" name="dots"></ion-spinner>
  
        <div v-else-if="!error">
          <ion-input label="Username" label-placement="floating" fill="outline" 
                     v-model="user.username" class="ion-margin-top"></ion-input>
          <ion-input label="Email" label-placement="floating" fill="outline" 
                     v-model="user.email" type="email" class="ion-margin-top"></ion-input>
          <ion-input label="Password Baru (Kosongkan jika tidak diubah)" label-placement="floating" fill="outline" 
                     v-model="newPassword" type="password" class="ion-margin-top"></ion-input>
  
          <ion-button expand="block" @click="handleUpdate" color="primary" class="ion-margin-top">
            Update Data
          </ion-button>
          
          <ion-item lines="none" class="ion-margin-top">
              <ion-label>Hapus Akun</ion-label>
              <ion-button @click="handleDelete" color="danger" slot="end">
                Delete
              </ion-button>
          </ion-item>
          
          <p v-if="message" :class="isSuccess ? 'success-message' : 'error-message'">{{ message }}</p>
        </div>
        
        <p v-else class="error-message ion-text-center">{{ error }}</p>
  
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import api from '@/axios-config';
  import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
    IonInput, IonButton, IonSpinner, IonBackButton, IonButtons, 
    alertController, IonItem, IonLabel
  } from '@ionic/vue';
  
  const router = useRouter();
  const route = useRoute();
  const loading = ref(true);
  const error = ref('');
  const message = ref('');
  const isSuccess = ref(false);
  const newPassword = ref('');
  const user = ref({ id: '', username: '', email: '' });
  
  const ENDPOINT = '/users';
  const userIdToEdit = route.params.id as string;
  const currentLoggedInUserId = localStorage.getItem('userId');
  
  
  // --- CRUD: READ ---
  const fetchUserData = async () => {
      loading.value = true;
      if (!userIdToEdit) {
          error.value = 'ID Pengguna yang akan diedit tidak ditemukan.';
          loading.value = false;
          return;
      }
      try {
          const response = await api.get(`${ENDPOINT}/${userIdToEdit}`); // api.get
          user.value = response.data.user;
          user.value.id = userIdToEdit;
      } catch (err: any) {
          error.value = 'Gagal memuat data profil.';
      } finally {
          loading.value = false;
      }
  };
  
  // --- CRUD: UPDATE ---
  const handleUpdate = async () => {
      message.value = '';
      
      const updateData: any = {
          username: user.value.username,
          email: user.value.email,
      };
  
      if (newPassword.value) {
          updateData.newPassword = newPassword.value;
      }
  
      try {
          await api.put(`${ENDPOINT}/${userIdToEdit}`, updateData); // api.put
          
          isSuccess.value = true;
          message.value = 'Profil berhasil diperbarui!';
          newPassword.value = ''; 
  
          if (userIdToEdit === currentLoggedInUserId) {
               localStorage.setItem('userName', user.value.username);
          }
  
      } catch (err: any) {
          isSuccess.value = false;
          message.value = err.response?.data?.message || 'Gagal memperbarui data.';
      }
  };
  
  // --- CRUD: DELETE ---
  const handleDelete = async () => {
      const alert = await alertController.create({
          header: 'Konfirmasi Hapus',
          message: 'Apakah Anda yakin ingin menghapus akun ini?',
          buttons: [
              { text: 'Batal', role: 'cancel' },
              {
                  text: 'Hapus',
                  handler: async () => {
                      try {
                          await api.delete(`${ENDPOINT}/${userIdToEdit}`); // api.delete
                          
                          if (userIdToEdit === currentLoggedInUserId) {
                              localStorage.removeItem('userToken');
                              localStorage.removeItem('userId'); 
                              router.push('/login');
                              return;
                          }
                          
                          router.push('/tabs/tab1'); 
                          
                      } catch (err: any) {
                          alertController.create({
                              header: 'Error',
                              message: err.response?.data?.message || 'Gagal menghapus akun.',
                              buttons: ['OK']
                          }).then(a => a.present());
                      }
                  },
              },
          ],
      });
      await alert.present();
  };
  
  onMounted(() => {
      fetchUserData();
  });
  </script>
  
  <style scoped>
  .success-message { color: green; font-weight: bold; text-align: center; }
  .error-message { color: red; font-weight: bold; text-align: center; }
  </style>
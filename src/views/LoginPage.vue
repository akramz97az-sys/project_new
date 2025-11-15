<template>
    <ion-page>
      <ion-header><ion-toolbar><ion-title>Masuk Akun</ion-title></ion-toolbar></ion-header>
      <ion-content :fullscreen="true" class="ion-padding">
        <ion-input label="Email" label-placement="floating" fill="outline" type="email" v-model="email" required class="ion-margin-top"></ion-input>
        <ion-input label="Password" label-placement="floating" fill="outline" type="password" v-model="password" required class="ion-margin-top"></ion-input>
  
        <ion-button expand="block" @click="handleLogin" :disabled="loading" class="ion-margin-top">
          <ion-spinner v-if="loading" name="dots"></ion-spinner>
          <span v-else>Masuk</span>
        </ion-button>
  
        <p v-if="message" :class="isSuccess ? 'success-message' : 'error-message'">{{ message }}</p>
  
        <ion-text color="medium" class="ion-text-center ion-margin-top d-block">
          Belum punya akun? <router-link to="/register">Daftar di sini</router-link>
        </ion-text>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios'; // Gunakan axios biasa di sini karena ini adalah public endpoint (tidak perlu token)
  import { useRouter } from 'vue-router';
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonSpinner, IonText } from '@ionic/vue';
  
  const router = useRouter();
  const email = ref('');
  const password = ref('');
  const loading = ref(false);
  const message = ref('');
  const isSuccess = ref(false);
  const API_URL = 'http://localhost:3000/api/login'; 
  
  const handleLogin = async () => {
    loading.value = true;
    message.value = '';
  
    try {
      const response = await axios.post(API_URL, { email: email.value, password: password.value });
      
      // Simpan TOKEN ASLI dari server
      localStorage.setItem('userToken', response.data.token); 
      localStorage.setItem('userId', response.data.user.id); 
      localStorage.setItem('userName', response.data.user.username);
      
      isSuccess.value = true;
      message.value = response.data.message;
      
      setTimeout(() => { router.push('/tabs/tab1'); }, 500); 
  
    } catch (error) {
      isSuccess.value = false;
      message.value = error.response?.data?.message || 'Koneksi atau kredensial salah.';
    } finally {
      loading.value = false;
    }
  };
  </script>
  <style scoped>
  .success-message { color: green; font-weight: bold; text-align: center; }
  .error-message { color: red; font-weight: bold; text-align: center; }
  .d-block { display: block; }
  </style>
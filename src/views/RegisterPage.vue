<template>
    <ion-page>
      <ion-header><ion-toolbar><ion-title>Daftar Akun Baru</ion-title></ion-toolbar></ion-header>
      <ion-content :fullscreen="true" class="ion-padding">
        <ion-input label="Username" label-placement="floating" fill="outline" v-model="username" required class="ion-margin-top"></ion-input>
        <ion-input label="Email" label-placement="floating" fill="outline" type="email" v-model="email" required class="ion-margin-top"></ion-input>
        <ion-input label="Password" label-placement="floating" fill="outline" type="password" v-model="password" required class="ion-margin-top"></ion-input>
  
        <ion-button expand="block" @click="handleRegister" :disabled="loading" class="ion-margin-top">
          <ion-spinner v-if="loading" name="dots"></ion-spinner>
          <span v-else>Daftar Sekarang</span>
        </ion-button>
  
        <p v-if="message" :class="isSuccess ? 'success-message' : 'error-message'">{{ message }}</p>
      
        <ion-text color="medium" class="ion-text-center ion-margin-top d-block">
          Sudah punya akun? <router-link to="/login">Masuk di sini</router-link>
        </ion-text>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios'; 
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonSpinner, IonText } from '@ionic/vue';
  
  const username = ref('');
  const email = ref('');
  const password = ref('');
  const loading = ref(false);
  const message = ref('');
  const isSuccess = ref(false);
  const API_URL = 'http://localhost:3000/api/register';
  
  const handleRegister = async () => {
    loading.value = true;
    message.value = '';
  
    try {
      const response = await axios.post(API_URL, { username: username.value, email: email.value, password: password.value });
      
      isSuccess.value = true;
      message.value = response.data.message + '. Silakan masuk.';
      username.value = '';
      email.value = '';
      password.value = '';
  
    } catch (error) {
      isSuccess.value = false;
      message.value = error.response?.data?.message || 'Koneksi ke server gagal.';
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
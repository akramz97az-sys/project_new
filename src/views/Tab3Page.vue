<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Profil Saya & Logout</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      
      <ion-card v-if="user.id && !loading">
        <ion-card-header>
          <ion-card-title>Data Akun Anda</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p><strong>ID:</strong> {{ user.id }}</p>
          <p><strong>Username:</strong> {{ user.username }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>

          <ion-button :router-link="`/edit-profile/${user.id}`" expand="block" fill="clear" color="medium" class="ion-margin-top">
            Edit Profil Saya
          </ion-button>
        </ion-card-content>
      </ion-card>

      <ion-spinner v-if="loading" name="dots"></ion-spinner>
      <p v-if="error" class="error-message">Gagal memuat data: {{ error }}</p>
      
      <ion-button 
        expand="block" 
        color="danger" 
        @click="handleLogout" 
        class="ion-margin-top"
        :disabled="loading"
      >
        Logout
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSpinner
} from '@ionic/vue';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import api from '@/axios-config';
const ENDPOINT = '/users'; 

const router = useRouter();
const loading = ref(true);
const error = ref('');
const user = ref({ id: null, username: '', email: '' });

const fetchUserData = async () => {
  loading.value = true;
  error.value = '';
  
  const userId = localStorage.getItem('userId'); 
  if (!userId) {
    error.value = 'ID Pengguna tidak ditemukan.';
    handleLogout();
    return;
  }

  try {
    const response = await api.get(`${ENDPOINT}/${userId}`); // Menggunakan api.get
    user.value = response.data.user; 
    
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Gagal mengambil data dari server.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
    fetchUserData();
});

const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userId'); 
    localStorage.removeItem('userName'); 
    router.push('/login'); 
};
</script>

<style scoped>
.error-message { color: red; text-align: center; }
</style>
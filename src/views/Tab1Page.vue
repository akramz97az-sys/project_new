<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Daftar Pengguna (CRUD)</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-spinner v-if="loading" name="dots" class="ion-text-center ion-padding"></ion-spinner>
      
      <p v-if="error" class="error-message ion-padding ion-text-center">{{ error }}</p>

      <ion-list v-else-if="users.length > 0">
        <ion-item-sliding v-for="user in users" :key="user.id">
          
          <ion-item lines="full">
            <ion-label>
              <h2>{{ user.username }} <ion-badge color="success" v-if="user.id == currentUserId">Anda</ion-badge></h2>
              <p>{{ user.email }}</p>
            </ion-label>
          </ion-item>
          
          <ion-item-options side="end">
            
            <ion-item-option color="primary" @click="editUser(user.id)">
              <ion-icon slot="icon-only" :icon="createOutline"></ion-icon>
            </ion-item-option>
            
            <ion-item-option color="danger" @click="confirmDelete(user.id, user.username)">
              <ion-icon slot="icon-only" :icon="trashOutline"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <div v-else-if="!loading" class="ion-padding ion-text-center">
        <p>Tidak ada pengguna yang ditemukan.</p>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/axios-config';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonList, IonItem, IonLabel, IonSpinner, IonRefresher, 
  IonRefresherContent, IonItemSliding, IonItemOptions, 
  IonItemOption, IonIcon, IonBadge, alertController
} from '@ionic/vue';
import { createOutline, trashOutline } from 'ionicons/icons';

const router = useRouter();
const users = ref<any[]>([]);
const loading = ref(true);
const error = ref('');
// Tidak perlu API_URL karena sudah ada di axios-config, hanya perlu endpoint-nya:
const ENDPOINT = '/users'; 
const currentUserId = localStorage.getItem('userId');


// --- CRUD: READ ALL ---
const fetchAllUsers = async () => {
  loading.value = true;
  error.value = '';
  try {
    const response = await api.get(ENDPOINT); // Menggunakan api.get
    users.value = response.data.users;
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Gagal mengambil data dari server.';
  } finally {
    loading.value = false;
  }
};

// --- CRUD: UPDATE (Redirect) ---
const editUser = (id: number) => {
    router.push(`/edit-profile/${id}`); 
};

// --- CRUD: DELETE ---
const deleteUser = async (id: number) => {
    try {
        await api.delete(`${ENDPOINT}/${id}`); // Menggunakan api.delete
        users.value = users.value.filter(u => u.id !== id);

        if (id.toString() === currentUserId) {
             alertController.create({
                header: 'Berhasil',
                message: 'Akun Anda telah dihapus. Anda akan di-logout.',
                buttons: ['OK']
            }).then(a => a.present());
            localStorage.removeItem('userToken');
            localStorage.removeItem('userId'); 
            router.push('/login'); 
            return;
        }

    } catch (err: any) {
        alertController.create({
            header: 'Error',
            message: err.response?.data?.message || 'Gagal menghapus pengguna.',
            buttons: ['OK']
        }).then(a => a.present());
    }
};

const confirmDelete = async (id: number, username: string) => {
    const alert = await alertController.create({
        header: 'Hapus Pengguna',
        message: `Yakin ingin menghapus pengguna: ${username} (ID: ${id})?`,
        buttons: [
            { text: 'Batal', role: 'cancel' },
            { text: 'Hapus', handler: () => deleteUser(id), cssClass: 'danger' },
        ],
    });
    await alert.present();
};

const handleRefresh = (event: CustomEvent) => {
    fetchAllUsers().finally(() => {
        (event.target as HTMLIonRefresherElement).complete();
    });
};

onMounted(() => {
    fetchAllUsers();
});
</script>

<style scoped>
.error-message {
  color: red;
}
</style>
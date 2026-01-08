<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
      
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-blue-900">Hesap Oluştur</h2>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm space-y-4">
          
          <div>
            <label class="sr-only">İsim Soyisim</label>
            <input v-model="name" type="text" required class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm" placeholder="İsim Soyisim" />
          </div>

          <div>
            <label class="sr-only">Email Adresi</label>
            <input v-model="email" type="email" required class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm" placeholder="Email adresi" />
          </div>

          <div>
            <label class="sr-only">Şifre</label>
            <input v-model="password" type="password" required class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm" placeholder="Şifre (En az 4 karakter)" />
          </div>
        </div>

        <div>
          <button type="submit" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-800 focus:outline-none transition duration-300">
            {{ loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol' }}
          </button>
        </div>
      </form>
      
      <div class="text-center mt-4">
        <p class="text-sm text-gray-600">
          Zaten hesabınız var mı? 
          <RouterLink to="/login" class="font-medium text-blue-900 hover:text-blue-700">
            Giriş Yap
          </RouterLink>
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);

const handleRegister = async () => {
  loading.value = true;
  try {
    console.log("Kayıt isteği gönderiliyor...", email.value);

    // API'ye kullanıcı oluşturma isteği
    const response = await fetch('https://api.escuelajs.co/api/v1/users/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value,
       
      })
    });

    const data = await response.json();

   
    if (!response.ok) {
      console.error("Kayıt Hatası Detayı:", data);
      
      let errorMessage = "Kayıt başarısız!";
      if (data.message) errorMessage += `\nSebep: ${data.message}`;
      else if (Array.isArray(data.message)) errorMessage += `\nSebep: ${data.message.join(', ')}`;
      
      alert(errorMessage);
      loading.value = false;
      return; 
    }

    // KAYIT BAŞARILIYSA
    alert("✅ Kayıt Başarılı! Şimdi giriş sayfasına yönlendiriliyorsunuz.");
    router.push('/login');

  } catch (error) {
    console.error("Bağlantı Hatası:", error);
    alert("Bir hata oluştu. İnternet bağlantınızı kontrol edin.");
  } finally {
    loading.value = false;
  }
};
</script>
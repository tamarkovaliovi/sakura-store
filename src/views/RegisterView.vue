<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-blue-900">Hesap Oluştur</h2>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label class="sr-only">İsim Soyisim</label>
            <input
              v-model="name"
              type="text"
              required
              class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
              placeholder="İsim Soyisim"
            />
          </div>

          <div>
            <label class="sr-only">Email Adresi</label>
            <input
              v-model="email"
              type="email"
              required
              class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
              placeholder="Email adresi"
            />
          </div>

          <div>
            <label class="sr-only">Şifre</label>
            <input
              v-model="password"
              type="password"
              required
              class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-900 focus:border-blue-900 sm:text-sm"
              placeholder="Şifre (En az 4 karakter)"
            />
          </div>
        </div>

        <div>
          <CustomButton mode="register-submit" />
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import CustomButton from "@/components/CustomButton.vue";

const router = useRouter();
const name = ref("");
const email = ref("");
const password = ref("");
const loading = ref(false);

const handleRegister = async () => {
  loading.value = true;

  // Otomatik avatar oluştur (İsim baş harflerinden resim yapar)
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name.value
  )}&background=0D47A1&color=fff`;

  try {
    const response = await fetch("https://api.escuelajs.co/api/v1/users/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value,
        avatar: defaultAvatar,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Kayıt Hatası:", data);
      let errorMessage = "Kayıt başarısız!";
      if (data.message) {
        // Hata mesajı dizi ise stringe çevir
        errorMessage += `\nSebep: ${
          Array.isArray(data.message) ? data.message.join(", ") : data.message
        }`;
      }
      alert(errorMessage);
      return;
    }

    alert("✅ Kayıt Başarılı! Giriş yapabilirsiniz.");
    router.push("/login");
  } catch (error) {
    console.error("Bağlantı Hatası:", error);
    alert("Bir hata oluştu. İnternet bağlantınızı kontrol edin.");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <main>
    <router-link class="nav-link" to="/">
      <img src=".././assets/acdh-ch-logo96.png" alt="acdh-logo">
    </router-link>
    <p class="title">MMP - Medieval Manuscripts</p>
  </main>
</template>

<script>
export default {
  name: "Header"
}
</script>

<style scoped>
main {
  background: #f1f1f1;
  margin-top: 0;
  padding-top: 1rem;
  padding-bottom: 1rem;
  padding-left: 2rem;
  width: 100%;
  display: flex;
  margin-bottom: 1rem;
  border-bottom: 5px solid #254aa5;
  border-top: 5px solid #254aa5;
}

.title {
  text-align: center;
  font-size: 4rem;
  margin: auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

@media screen and (max-width: 600px) {
  .title {
    text-align: center;
    font-size: 2rem;
    margin: auto;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  }
}
</style>

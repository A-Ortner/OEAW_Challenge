<template>
  <main>
    <button id="back">
      <router-link class="nav-link" to="/">BACK</router-link>
    </button>
    <p v-if="this.error">{{ this.errorMsg }}</p>
    <div v-if="!this.error">
      <h2 id="Stelle">
        <small>Stelle:</small>
        {{ this.passage.display_label }}
      </h2>

      <br><br>
      <ul id="ul_basic_info"><p id="basicinfo"> Basic Information</p>
        <li class="basic_keywords" v-for="keyword in this.keywords" :key="keyword.legacy_id">{{
            keyword.stichwort
          }}
        </li>
      </ul>
      <table>
        <tr>
          <th>has_spatial_coverage</th>
          <td>null</td>
        </tr>
        <tr>
          <th>Legacy ID</th>
          <td>{{ this.passage.legacy_id }}</td>
        </tr>
        <tr>
          <th>Text</th>
          <td>{{ this.passage.text.title }}</td>
        </tr>
        <tr>
          <th>Zusammenfassung</th>
          <td>{{ this.passage.summary }}</td>
        </tr>
        <tr>
          <th>Zitat</th>
          <td>{{ this.passage.zitat }}</td>
        </tr>

        <tr>
          <th>Zitat Stelle</th>
          <td>{{ this.passage.zitat_stelle }}</td>
        </tr>

        <tr>
          <th>Übersetzung</th>
          <td>{{ this.passage.translation }}</td>
        </tr>

        <tr>
          <th>Kommentar</th>
          <td>{{ this.passage.kommentar }}</td>
        </tr>

        <tr>
          <th>automatically created label</th>
          <td>{{ this.passage.display_label }}</td>
        </tr>

        <tr>
          <th>Stichwort</th>
          <td>
            <li v-for="keyword in this.keywords" :key="keyword.legacy_id">{{ keyword.stichwort }}</li>
          </td>
        </tr>

      </table>

    </div>
  </main>
</template>

<script>
import * as OEAWService from "@/services/OEAWService";

const DEFAULT_ERROR_MESSAGE = "Could not load the passage.";

export default {
  name: "Details",
  data() {
    return {
      error: false,
      passage: null,
      errorMsg: "",
      id: this.$route.params.id,
      keywords: []
    };
  }, mounted() {
    OEAWService.getPassageById(this.id).then(passage => {
      console.log(passage);
      this.passage = passage;
      this.keywords = passage.key_word;
      console.log(this.keywords);
    }).catch(e => {
      console.log(e);
      this.errorMsg = DEFAULT_ERROR_MESSAGE;
      this.error = true;
    })
  },
  computed: {},
  methods: {
    getKeywords() {
      console.log("getKeywords()");
      console.log(this.passage.key_word);
      if (this.passage) {
        return this.passage.key_word.map(x => x.stichwort).toString();
      }
      return "";
    }
  }
}
</script>

<style scoped>
#back {
  display: flex;
  align-self: flex-start;
  margin-bottom: 1rem;
  margin-left: 1rem;
  padding: 0.2rem;
  padding-left: 1rem;
  padding-right: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.3rem 0.1rem -0.2rem rgba(0, 0, 0, .2), 0 0.2rem 0.2rem 0 rgba(0, 0, 0, .14), 0 0.1rem 0.5rem 0 rgba(0, 0, 0, .12);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 1rem;
}

#basicinfo {
  font-size: 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

#Stelle {
  background: lightgray;
  margin: 0;
  padding: 3rem;
  width: 100%;

}

#ul_basic_info {
  text-align: left;
  margin: 0;
  margin-bottom: 1rem;
}

.basic_keywords {
  margin-left: 2rem;
}

table, th, td {
  border-top: 0.05rem solid #545050;
  border-bottom: 0.05rem solid #545050;
  border-collapse: collapse;
}

table {
  margin-left: 2rem;
  margin-right: 2rem;
}

td, th {
  padding: 1rem;
  text-align: left;
}
</style>

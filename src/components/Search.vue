<template>
  <main>
    <h2 id="welcome">{{ welcomeMessage }}</h2>
    <form role="search" class="search-form" @submit.prevent="search()">
      <input
          id="input-search"
          class="search"
          type="search"
          v-model.trim="query"
          placeholder="Search the collection"
          aria-labelledby="search-button"
      />
      <input
          id="input-limit"
          class="search"
          type="number"
          v-model.trim="limit"
          placeholder="enter limit"
          aria-labelledby="search-button"
      />
      <button class="search" v-on:click="search()" type="submit" id="search-button">Search</button>
    </form>

    <h3 id="search-message">{{ searchMessage }}</h3>
    <section v-if="showTable" class="texts">
      <table>
        <tr>
          <th>Title</th>
          <th>Label</th>
          <th>Associated Keywords</th>
          <th>Date of Creation</th>
          <th>Authors</th>
        </tr>
        <tr v-for="passage in passages" :key="passage.legacy_id" :passage="passage">
          <td>
            <router-link class="nav-link" :to="'details/' +getPassageId(passage)">{{ passage.text.title }}</router-link>
          </td>
          <!--          <td><button v-if="passage" :onclick=this.openNewWindow(JSON.stringify(this.getPassageId(passage))) class="linkDetails">{{passage.text.title}}</button> </td>-->
          <td> {{ getLabel(passage) }}</td>
          <td>
            {{ getKeywords(passage) }}
          </td>
          <td>{{ getFullDate(passage) }}</td>
          <td>{{ getAuthor(passage) }}</td>
        </tr>
      </table>
    </section>
  </main>
</template>

<script>
import * as OEAWService from "@/services/OEAWService";

const WELCOME_MESSAGE = "Search our collection of medieval manuscipts here!"
const DEFAULT_MESSAGE = "Nothing to search for - yet.";

export default {
  name: "Search",

  data() {
    return {
      query: "",
      limit: null,
      showTable: false,
      searchMessage: DEFAULT_MESSAGE,
      welcomeMessage: WELCOME_MESSAGE,
      passages: [],
      passageElements: [],
      next: "",
      previous: ""
    };
  }
  , computed: {},
  methods: {
    search() {
      this.showTable = false;
      this.passages = [];

      if (this.query) {
        this.searchMessage = `Searching for “${this.query}”`;
      } else {
        this.searchMessage = DEFAULT_MESSAGE;
      }
      this.validateLimit();
      OEAWService.getPassages(this.query, this.limit).then(passages => {
        console.log("called service");
        this.passages = passages.results;


        this.next = passages.next;
        this.previous = passages.previous;
        console.log(this.passages);
        if (this.passages.length > 0) {
          this.showTable = true;
        }
        if (this.query) {
          const s = this.passages.length == 1 ? "" : "s";
          this.searchMessage = `Found passage${s} for “${this.query}”`;
        }
      });
    },
    validateLimit(){
      if(this.limit == null){
        this.limit = 20;
      }
    },
    getLabel(passage) {
      if (passage != null) {
        return passage.display_label;
      }
      return "";
    },
    getKeywords(passage) {
      if (passage) {
        return passage.key_word.map(x => " " + x.stichwort).toString();
      }
      return "";
    },
    getFullDate(passage) {
      return passage.text.start_date + " to " + passage.text.end_date;
    },
    getAuthor(passage) {
      console.log("getAuthor()");
      console.log(passage);
      OEAWService.getAuthor(passage.text.autor[0]).then(author => {
        console.log(author);
        console.log(author.name);
        return author.name;
      });
    },
    getPassageId(passage) {
      let url = passage.url;
      let slashBeforeIdIdx = url.substring(0, url.length - 1).lastIndexOf('/');
      let id = url.substring(slashBeforeIdIdx + 1, url.length);
      return id;
    },
    openNewWindow(passage) {
      console.log("openNewWindow()");
      let obj = JSON.parse(decodeURIComponent(passage))
      if (obj) {
        console.log(obj)
        console.log(window.location.href + 'details/' + obj);
        window.open(window.location.href + 'details/' + obj);
      }
    }
  }
}


</script>

<style scoped>
main{
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 1.1rem;
}
.search {
  display: inline-flex;
  align-items: center;
  margin: auto;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.3rem 0.1rem -0.2rem rgba(0,0,0,.2),0 0.2rem 0.2rem 0 rgba(0,0,0,.14),0 0.1rem 0.5rem 0 rgba(0,0,0,.12);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 1.1rem;
}

#welcome{
  padding-top: 1rem;
  padding-bottom: 2rem;
}

#search-message{
  padding-top: 0rem;
  padding-bottom: 1rem;
}

form{
  margin-left: 2rem;
  margin-right: 2rem;
}

#input-search {
  width: 70%;
}

table, th, td {
  border: 0.1rem solid #545050;
  border-collapse: collapse;
}
table {
  margin-left: 2rem;
  margin-right: 2rem;
  box-shadow: 0 0.3rem 0.1rem -0.2rem rgba(0,0,0,.2),0 0.2rem 0.2rem 0 rgba(0,0,0,.14),0 0.1rem 0.5rem 0 rgba(0,0,0,.12);
}
td, th{
  padding: 1rem;
}

th {
  height: 4rem;
  width: max-content;
}

table tr:nth-child(even){
  background: white;
}

table tr:nth-child(even):hover{
  background: #f1f1f1;
}

table tr:nth-child(odd){
  background: gainsboro;
}
table tr:nth-child(odd):hover{
  background: #f1f1f1;
}

table tr:first-child{
  background: #c0f4f8;
}
table tr:first-child:hover{
  background: #c0f4f8;
}

</style>

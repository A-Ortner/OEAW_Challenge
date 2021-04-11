<template>
  <main>
    <h2 id="welcome-message">{{ welcomeMessage }}</h2>
    <form role="search" class="search-form"> <!-- @submit.prevent="search()"-->
      <input
          id="input-search"
          class="search"
          type="search"
          v-model.trim="query"
          placeholder="Search the Collection"
          aria-labelledby="search-button"
      />
      <input
          id="input-limit"
          class="search"
          type="number"
          v-model="limit"
          placeholder="Entries per Page"
          aria-labelledby="search-button"
      />
      <button class="search" v-on:click="search()" id="search-button">SEARCH</button> <!--type="submit"-->
    </form>

    <h3 id="error-message" v-if="error">{{ errorMsg }}</h3>
    <h3 id="search-message" v-else>{{ searchMessage }}</h3>
    <section id="wrapper" v-if="showTable" class="texts">
      <table>
        <tr>
          <th>Title</th>
          <th>Label</th>
          <th>Associated Keywords</th>
          <th>Date of Creation</th>
          <th>Authors</th>
        </tr>
        <tr v-for="fullpassage in passageElements" :key="fullpassage.passage.legacy_id" :fullpassage="fullpassage">
          <td>
            <button v-on:click="openNewWindow(fullpassage.passage)"
                    class="linkDetails"> {{ fullpassage.passage.text.title }}
            </button>
          </td>
          <td> {{ getLabel(fullpassage.passage) }}</td>
          <td>
            {{ getKeywords(fullpassage.passage) }}
          </td>
          <td>{{ getFullDate(fullpassage.passage) }}</td>
          <td>{{ fullpassage.author.name }}</td>
        </tr>
      </table>
      <div class="pagination_buttons">
        <button v-if="currentPage>1" id="previous" v-on:click="loadPage(0)"> &lt; PREVIOUS</button>
        <p id="page">page {{this.currentPage}} of {{Math.round(this.numberPassages/this.limit)}}</p>
        <button id="next" v-on:click="loadPage(1)">NEXT &gt;</button>
      </div>
    </section>
  </main>
</template>

<script>
import * as OEAWService from "@/services/OEAWService";

const WELCOME_MESSAGE = "Search our Collection of Medieval Manuscipts here!"
const DEFAULT_MESSAGE = "Nothing to search for - yet.";

export default {
  name: "Search",

  data() {
    return {
      query: "",
      apiQuery: "",
      limit: null,
      apiLimit: null,
      showTable: false,
      searchMessage: DEFAULT_MESSAGE,
      welcomeMessage: WELCOME_MESSAGE,
      numberPassages: 0,
      passages: [],
      passageElements: [],
      next: "",
      previous: "",
      currentPage: 1,
      error: false,
      errorMsg: ""
    };
  }, computed: {},
  methods: {
    search() {
      console.log("search()");
      this.showTable = false;
      this.error = false;
      this.passages = [];
      this.passageElements = [];
      this.currentPage = 1;

      if (this.query) {
        this.searchMessage = `Searching for “${this.query}”`;
      } else {
        this.searchMessage = DEFAULT_MESSAGE;
      }

      if (this.validateZitat() === 1) {
        this.error = true;
        return;
      }
      if (this.validateLimit() === 1) {
        this.error = true;
        return;
      }
      this.formQuery();

      OEAWService.getPassages(this.apiQuery, this.apiLimit).then(passages => {
        console.log(passages);
        this.passages = passages.results;
        this.next = passages.next;
        this.previous = passages.previous;
        this.numberPassages = passages.count;
        this.passages.forEach(x => {

          OEAWService.getAuthor(x.text.autor[0]).then(author => {
            this.passageElements.push(
                {
                  passage: x,
                  author: author
                });
          }).catch(e => {
            //author can be not set, so here only an error is logged
            console.log(e);
          });

        });

        if (this.passages.length > 0) {
          this.showTable = true;
          if (this.query) {
            const s = this.passages.length == 1 ? "" : "s";
            this.searchMessage = `Found ${this.numberPassages} passage${s} for “${this.query}”`;
          }
        } else {
          console.log(this.passages.length);
          this.searchMessage = "No passages found for \"" + this.query + "\"";
        }

      }).catch(e => {
        console.log(e);
        this.errorMsg = "Could not fetch data from server.";
        this.error = true;
      });
    },
    loadPage(direction) {
      console.log("loadPage()", direction);
      //reset table
      this.showTable = false;
      this.passages = [];
      this.passageElements = [];

      //next
      if(direction === 1){
        OEAWService.getPage(this.next).then(passages => {
          this.passages = passages.results;
          this.next = passages.next;
          this.previous = passages.previous;
          this.passages.forEach(x => {

            OEAWService.getAuthor(x.text.autor[0]).then(author => {
              this.passageElements.push(
                  {
                    passage: x,
                    author: author
                  });
              }).catch(e => {
              console.log(e);
            });

          });
          this.currentPage += 1;
          this.showTable = true;
        }).catch(e => {
          console.log(e);
          this.errorMsg = "Could not fetch data from server.";
          this.error = true;
        });
      }

      //previous
      if(direction === 0){
        OEAWService.getPage(this.next).then(passages => {
          this.passages = passages.results;
          this.next = passages.next;
          this.previous = passages.previous;
          this.passages.forEach(x => {

            OEAWService.getAuthor(x.text.autor[0]).then(author => {
              this.passageElements.push(
                  {
                    passage: x,
                    author: author
                  })
              }).catch(e => {
              console.log(e);
            });

          });
          this.currentPage -= 1;
          this.showTable = true;
        }).catch(e => {
          console.log(e);
          this.errorMsg = "Could not fetch data from server.";
          this.error = true;
        });
      }

    },
    validateLimit() {
      if (this.limit === null || this.limit === ""){
        return;
      }
      if (this.limit <= 0) {
        this.errorMsg = "Please enter a limit that is greater than zero.";
        return 1;
      }
      if (this.limit >= 100) {
        //for performance, the limit is restricted to 100
        this.errorMsg = "Please enter a limit that is less than 100.";
        return 1;
      }

    },
    validateZitat() {
      if (this.query === null || this.query === "") {
        this.errorMsg = "Please enter at least one character to search for.";
        return 1;
      }
      if (this.query.length > 512) {
        this.errorMsg = "Please do not enter more than 512 characters."
        return 1;
      }
    },
    formQuery() {
      //zitat
      if (this.query.includes(" ")) {
        this.apiQuery = this.query.replace(/\s/g, "&");
      } else {
        this.apiQuery = this.query;
      }

      //limit
      if (this.limit === null || this.limit === "") {
        this.apiLimit = 20;
      } else {
        this.apiLimit = this.limit;
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
      if (passage.text.start_date != null && passage.text.start_date !== "") {
        return passage.text.start_date + " to " + passage.text.end_date;
      }
      return "";

    },
    getAuthor(passage) {
      console.log("getAuthor()");
      OEAWService.getAuthor(passage.text.autor[0]).then(author => {
        return author.name;
      }).catch(e => {
        console.log(e);
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
      const id = this.getPassageId(passage);
      if (id) {
        window.open(window.location.href + 'details/' + id);
      }
    }
  }
}


</script>

<style scoped>
main {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 1.1rem;
}

.search {
  display: inline-flex;
  align-items: center;
  margin-left: 0.5rem;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.3rem 0.1rem -0.2rem rgba(0, 0, 0, .2), 0 0.2rem 0.2rem 0 rgba(0, 0, 0, .14), 0 0.1rem 0.5rem 0 rgba(0, 0, 0, .12);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 1.1rem;
}

#welcome-message {
  padding-top: 1rem;
  padding-bottom: 2rem;
}

#search-message {
  padding-top: 0rem;
  padding-bottom: 1rem;
}

#error-message {
  color: red;
  width: fit-content;
  background: #d9d9d9;
  border-radius: 0.5rem;
  display: inline-flex;
  position: center;
  padding: 1rem;
  border: red;
  box-shadow: 0 0.3rem 0.1rem -0.2rem rgba(0, 0, 0, .2), 0 0.2rem 0.2rem 0 rgba(0, 0, 0, .14), 0 0.1rem 0.5rem 0 rgba(0, 0, 0, .12);
  border: 0.1rem solid;
}

form {
  padding: 0;
  margin-left: 2rem;
  margin-right: 2rem;
}

#input-search {
  width: 70%;
  min-width: 2rem;
}

#input-limit {
  width: 10%;
}

table, th, td {
  border: 0.1rem solid #545050;
  border-collapse: collapse;
}

table {
  margin-left: 5rem;
  margin-right: 5rem;
  box-shadow: 0 0.3rem 0.1rem -0.2rem rgba(0, 0, 0, .2), 0 0.2rem 0.2rem 0 rgba(0, 0, 0, .14), 0 0.1rem 0.5rem 0 rgba(0, 0, 0, .12);
}

#wrapper {
  width: 100%;
  overflow: auto
}

td, th {
  padding: 1rem;
}

th {
  height: 4rem;
  width: max-content;
}

table tr:nth-child(even) {
  background: white;
}

table tr:nth-child(even):hover {
  background: #f1f1f1;
}

table tr:nth-child(odd) {
  background: gainsboro;
}

table tr:nth-child(odd):hover {
  background: #f1f1f1;
}

table tr:first-child {
  background: #c0f4f8;
}

table tr:first-child:hover {
  background: #c0f4f8;
}

.linkDetails {
  border: none;
  color: blue;
  font-size: inherit;
  background: inherit;
}

.linkDetails:hover {
  text-decoration: underline;

}

.pagination_buttons {
  display: inline-flex;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

#page {
  padding-left: 3rem;
  padding-right: 3rem;
  font-size: 0.8rem;
  align-self: center;
}

#previous, #next {
  display: inline-flex;
  margin: auto;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.3rem 0.1rem -0.2rem rgba(0, 0, 0, .2), 0 0.2rem 0.2rem 0 rgba(0, 0, 0, .14), 0 0.1rem 0.5rem 0 rgba(0, 0, 0, .12);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 1rem;
}

#next {
  align-self: flex-end;
}

#previous {
  align-self: flex-start;
}

@media screen and (max-width: 900px) {
  table, th, td {
    font-size: 0.9rem;
  }

  th, td {
    padding: 0.3rem;
  }

  th {
    height: 3rem;
    width: max-content;
  }
}

@media screen and (max-width: 600px) {
  .search {
    display: inline-flex;
    align-items: center;
    margin: auto;
    margin-bottom: 1rem;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 0.3rem 0.1rem -0.2rem rgba(0, 0, 0, .2), 0 0.2rem 0.2rem 0 rgba(0, 0, 0, .14), 0 0.1rem 0.5rem 0 rgba(0, 0, 0, .12);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    font-size: 0.9rem;
  }

  #welcome-message {
    padding-top: 1rem;
    padding-bottom: 2rem;
    font-size: 1.5rem;
  }

  table, th, td {
    font-size: 0.8rem;
  }

  th, td {
    padding: 0;
  }

  th {
    height: 2rem;
    width: max-content;
  }

}

/* For tablets: */
</style>

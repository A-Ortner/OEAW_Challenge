<template>
  <main>
    <h2 id="welcome-message">{{ welcomeMessage }}</h2>
    <form role="search" class="search-form"> <!-- @submit.prevent="search()"-->
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
          placeholder="entries per page"
          aria-labelledby="search-button"
      />
      <button class="search" v-on:click="search()" id="search-button">Search</button> <!--type="submit"-->
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
          <!--          <td>
                      <router-link class="nav-link" :to="'details/' +getPassageId(fullpassage.passage)">
                        {{ fullpassage.passage.text.title }}
                      </router-link>
                    </td>-->
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
        <button id="previous" v-on:click="loadPreviousPage()">previous</button>
        <button id="next" v-on:click="loadNextPage()">next</button>
      </div>
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
      previous: "",
      error: false,
      errorMsg: ""
    };
  }
  , computed: {},
  methods: {
    search() {
      this.showTable = false;
      this.error = false;
      this.passages = [];
      this.passageElements = [];

      if (this.query) {
        this.searchMessage = `Searching for “${this.query}”`;
      } else {
        this.searchMessage = DEFAULT_MESSAGE;
      }

      if (this.validateLimit() === 1) {
        this.error = true;
        return;
      }
      if (this.validateZitat() === 1) {
        this.error = true;
        return;
      }
      OEAWService.getPassages(this.query, this.limit).then(passages => {
        console.log("called service");
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
          });

        });
        console.log("passage elements:");
        console.log(this.passageElements);

        if (this.passages.length > 0) {
          this.showTable = true;
        }
        if (this.query) {
          const s = this.passages.length == 1 ? "" : "s";
          this.searchMessage = `Found passage${s} for “${this.query}”`;
        }
      });
    },
    loadNextPage() {
      //reset table
      this.showTable = false;
      this.passages = [];
      this.passageElements = [];

      //
      OEAWService.getPage(this.next).then(passages => {
        console.log("called service");
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
          });

        });
        console.log("passage elements:");

        console.log(this.passageElements);
        this.showTable = true;
      });
    },
    loadPreviousPage() {
      //reset table
      this.showTable = false;
      this.passages = [];
      this.passageElements = [];

      //
      OEAWService.getPage(this.next).then(passages => {
        console.log("called service");
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
          });

        });
        console.log("passage elements:");

        console.log(this.passageElements);
        this.showTable = true;
      });
    },
    validateLimit() {
      if (this.limit === null) {
        this.limit = 20;
      }
      if (this.limit <= 0) {
        this.errorMsg = "Please enter a limit that is greater than zero.";
        return 1;
      }
    },
    validateZitat() {
      if (this.query === null || this.query === "") {
        this.errorMsg = "Please enter at least one letter to search for.";
        return 1;
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
      const id = this.getPassageId(passage);
      if (id) {
        console.log(id)
        console.log(window.location.href);
        console.log(window.location.href + 'details/' + id);
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
  display: flex;
  margin-top: 2rem;
}

#previous, #next {
  display: inline-flex;
  margin: auto;
  margin-bottom: 1rem;
  padding: 0.2rem;
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

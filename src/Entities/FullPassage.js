export class FullPassage {
    passage;
    author;

    constructor(passage, author) {
        this.passage = passage;
        this.author = author;
    }

    getFullPassage() {
        return [this.passage, this.author].json();
    }

    getAuthor() {
        return this.author;
    }

    getPassage() {
        return this.passage;
    }
}

<template>
  <div class="container">
  	<!-- Table of Content -->
    <div class="row">
      <div class="col-sm-10">
        <h1>Books</h1>
        <hr><br><br>
        <b-alert :show="dismissCountDown"
        				 :message="message"
								 dismissible
								 fade
								 variant="success"
								 @dismissed="dismissCountDown=0"
								 @dismiss-count-down="countDownChanged">
					{{ message }}
				</b-alert>
        <button type="button" class="btn btn-success btn-sm" v-b-modal.book-modal>Add Book</button>
        <br><br>
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Author</th>
              <th scope="col">Read?</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in books">
              <td>{{ book.title }}</td>
              <td>{{ book.author }}</td>
              <td>
                <span v-if="book.read">Yes</span>
                <span v-else>No</span>
              </td>
              <td>
                <button type="button"
                				class="btn btn-warning btn-sm"
                				v-b-modal.book-update-modal
                				@click="editBook(book)"> 
                	Update
              	</button>
                <button type="button"
                				class="btn btn-danger btn-sm"
                				v-b-modal.book-delete-modal
                				@click="removeBook(book)">
                	Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <h3 class="text-center alert alert-info" v-if="books.length === 0">No Books Found!</h3>
      </div>
    </div>

    <!-- Modal for Add Book -->
    <b-modal ref="addBookModal"
             id="book-modal"
             title="Add a new book"
             hide-footer>
      <b-form @submit="onSubmit" @reset="onReset" class="w-100">
      <b-form-group id="form-title-group"
                    label="Title:"
                    label-for="form-title-input">
          <b-form-input id="form-title-input"
                        type="text"
                        v-model="addBookForm.title"
                        required
                        placeholder="Enter title">
          </b-form-input>
        </b-form-group>
        <b-form-group id="form-author-group"
                      label="Author:"
                      label-for="form-author-input">
            <b-form-input id="form-author-input"
                          type="text"
                          v-model="addBookForm.author"
                          required
                          placeholder="Enter author">
            </b-form-input>
          </b-form-group>
        <b-form-group id="form-read-group">
          <b-form-checkbox-group v-model="addBookForm.read" id="form-checks">
            <b-form-checkbox value="true">Read?</b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>
        <b-btn type="submit" variant="primary" class="m-1">
					Submit
				</b-btn>
        <b-button type="reset" variant="danger">Cancel</b-button>
      </b-form>
    </b-modal>
    <!-- End of Modal -->


    <!-- Modal for Edit Book -->
    <b-modal ref="editBookModal"
    				 id="book-update-modal"
    				 title="Update"
    				 hide-footer>

    	<b-form @submit="onSubmitUpdate" @reset="onResetUpdate" class="w-100">
    			<b-form-group id="form-title-edit-group"
    										label="Title:"
    										label-for="form-title-edit-input">
    					<b-form-input id="form-title-edit-input"
    												type="text"
    												v-model="editForm.title"
    												required
    												placeholder="Enter title">
    					</b-form-input>
    			</b-form-group>

    			<b-form-group id="form-author-edit-group"
    										label="Author:"
    										label-for="form-author-edit-input">
    					<b-form-input id="form-author-edit-input"
    												type="text"
    												v-model="editForm.author"
    												required
    												placeholder="Enter author">
    					</b-form-input>
    			</b-form-group>

    			<b-form-group id="form-read-group">
          <b-form-checkbox-group v-model="editForm.read" id="form-checks">
            <b-form-checkbox value="true">Read?</b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>

    			<b-button type="submit" variant="warning">Update</b-button>
    			<b-button type="reset" variant="danger">Cancel</b-button>
    	</b-form>
    </b-modal>
    <!-- End of Modal -->


    <!-- Modal for Delete Book  -->
    <b-modal ref="deleteBookModal"
    				 id="book-delete-modal"
    				 title="Delete"
    				 hide-footer>

    	<b-form @submit="onSubmitDelete" @reset="onResetDelete" class="w-100">
    			<b-form-group id="form-confirmation-delete-group"
    										label="Confirmation: Are you sure you want to delete this book?"
    										label-for="form-confirmation-delete-input">
    			</b-form-group>

    			<b-button type="submit" variant="danger">Delete</b-button>
    			<b-button type="reset" variant="default">Cancel</b-button>
    	</b-form>
    </b-modal>
    <!-- End of Modal -->
  </div>
</template>

<script>
import axios from 'axios';
import Alert from './Alert';

const base_url = 'http://localhost:5000/books'

export default {
  data() {
    return {
    	API_URL: base_url,
      books: [],
      addBookForm: {
        title: '',
        author: '',
        read: [],
      },
      message: '',
      book_id: '',
      showMessage: false,
      dismissSecs: 3,
      dismissCountDown: 0,
      editForm: {
      	id: '',
      	titile: '',
      	author: '',
      	read: [],
      },
    };
  },
  components: {
    alert: Alert,
  },
  methods: {
  	countDownChanged (dismissCountDown) {
			this.dismissCountDown = dismissCountDown;
		},
    getBooks() {
      const path = this.API_URL;
      axios.get(path)
        .then((res) => {
          this.books = res.data.books;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
        });
    },
		editBook(book) {
			this.editForm = book;
		},
		removeBook(book) {
			this.book_id = book.id;
		},
    addBook(payload) {
      const path = this.API_URL;
      axios.post(path, payload)
        .then(() => {
          this.getBooks();
          this.message = 'Book added!';
          this.showMessage = true;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          this.getBooks();
        });
    },
    updatedBook(payload, bookID) {
    	const path = this.API_URL + `/${bookID}`;
    	axios.put(path, payload)
    		.then (() => {
    			this.getBooks();
    			this.message = 'Book updated!';
    			this.showMessage = true;
    		})
    		.catch((error) => {
    			console.error(error);
    			this.getBooks();
    		})
    },
    deleteBook(bookID) {
    	const path = this.API_URL + `/${bookID}`;
    	axios.delete(path)
    		.then(() => {
    			this.getBooks();
		    	this.message = 'Book deleted!';
		    	this.showMessage = true;
    		})
    		.catch((error) => {
    			console.error(error);
    			this.getBooks();
    		})
    },
    initForm() {
      this.addBookForm.title = '';
      this.addBookForm.author = '';
      this.addBookForm.read = [];
      this.editForm.id = '';
      this.editForm.title = '';
      this.editForm.author = '';
      this.editForm.read = [];
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.$refs.addBookModal.hide();
      this.message = 'Book added!';
      this.dismissCountDown = this.dismissSecs;
      let read = false;
      if (this.addBookForm.read[0]) read = true;
      const payload = {
        title: this.addBookForm.title,
        author: this.addBookForm.author,
        read, // property shorthand
      };
      this.addBook(payload);
      this.initForm();
    },
    onSubmitUpdate(evt) {
    	evt.preventDefault();
    	this.$refs.editBookModal.hide();
    	this.message = 'Book updated!';
    	this.dismissCountDown = this.dismissSecs;
    	let read = false;
    	if (this.editForm.read[0]) read = true;
    	const payload = {
    		title: this.editForm.title,
    		author: this.editForm.author,
    		read,
    	};
    	this.updateBook(payload, this.editForm.id);
    },
    onSubmitDelete(evt) {
    	var book_id = this.book_id;
    	this.$refs.deleteBookModal.hide();
    	this.message = 'Book deleted!';
    	this.dismissCountDown = this.dismissSecs;
    	this.deleteBook(book_id);
    },
    onReset(evt) {
      evt.preventDefault();
      this.$refs.addBookModal.hide();
      this.initForm();
    },
    onResetUpdate(evt){
    	evt.preventDefault();
    	this.$refs.editBookModal.hide();
    	this.initForm();
    	this.getBooks();
    },
    onResetDelete(evt){
    	evt.preventDefault();
    	this.$refs.deleteBookModal.hide();
    	this.initForm();
    	this.getBooks();
    },
  },
  created() {
    this.getBooks();
  },
};
</script>
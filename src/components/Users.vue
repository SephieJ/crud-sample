<template>
  <div class="container">
  	<!-- Table of Content -->
    <div class="row">
      <div class="col-sm-10">
        <h1>Users List</h1>
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
        <button type="button" class="btn btn-success btn-sm" v-b-modal.book-modal>Add User</button>
        <br><br>
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Username</th>
              <th scope="col">Status</th>
              <th scope="col">Previous Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users">
              <td>{{ user.id }}</td>
              <td>{{ user.user_name }}</td>
              <td>{{ user.status }}</td>
              <td>$ {{ user.prev_status }}</td>
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
                <router-link :to="`/order/${book.id}`"
                						 class="btn btn-primary btn-sm">
                	Purchase
                </router-link>
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
                        v-model="addUserForm.title"
                        required
                        placeholder="Enter title">
          </b-form-input>
        </b-form-group>

        <b-form-group id="form-author-group"
                      label="Author:"
                      label-for="form-author-input">
          <b-form-input id="form-author-input"
                        type="text"
                        v-model="addUserForm.author"
                        required
                        placeholder="Enter author">
          </b-form-input>
        </b-form-group>

        <b-form-group id="form-price-group"
        							label="Purchase Price"
        							label-for="form-price-input">

        	<b-form-input id="form-price-input"
        								type="number"
        								v-model="addUserForm.price"
        								required
        								placeholder="Enter price">
        	</b-form-input>
        </b-form-group>

        <b-form-group id="form-read-group">
          <b-form-checkbox-group v-model="addUserForm.read" id="form-checks">
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

    			<b-form-group id="form-price-group"
        							label="Purchase Price"
        							label-for="form-price-input">

	        	<b-form-input id="form-price-input"
	        								type="number"
	        								v-model="editForm.price"
	        								required
	        								placeholder="Enter price">
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

const base_url = 'http://localhost:5000/users'

export default {
  data() {
    return {
    	API_URL: base_url,
      users: [],
      addUserForm: {
        user_name: '',
        status: '',
      },
      message: '',
      user_id: '',
      showMessage: false,
      dismissSecs: 3,
      dismissCountDown: 0,
      editForm: {
      	user_name: '',
        status: '',
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
    getUsers() {
      const path = this.API_URL;
      axios.get(path)
        .then((res) => {
          this.users = res.data.users;
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
    addUser(payload) {
      const path = this.API_URL;
      axios.post(path, payload)
        .then(() => {
          this.getUsers();
          this.message = 'User added!';
          this.showMessage = true;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          this.getUsers();
        });
    },
    updatedBook(payload, bookID) {
    	const path = this.API_URL + `/${bookID}`;
    	axios.put(path, payload)
    		.then (() => {
    			this.getUsers();
    			this.message = 'User updated!';
    			this.showMessage = true;
    		})
    		.catch((error) => {
    			console.error(error);
    			this.getUsers();
    		})
    },
    deleteBook(bookID) {
    	const path = this.API_URL + `/${bookID}`;
    	axios.delete(path)
    		.then(() => {
    			this.getUsers();
		    	this.message = 'User deleted!';
		    	this.showMessage = true;
    		})
    		.catch((error) => {
    			console.error(error);
    			this.getUsers();
    		})
    },
    initForm() {
      this.addUserForm.title = '';
      this.addUserForm.author = '';
      this.addUserForm.read = [];
      this.addUserForm.price = ';'
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
      if (this.addUserForm.read[0]) read = true;
      const payload = {
        title: this.addUserForm.title,
        author: this.addUserForm.author,
        read, // property shorthand
        price: this.addUserForm.price,
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
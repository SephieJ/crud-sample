<template>
  <div class="container">
  	<!-- Table of Content -->
    <div class="row">
      <div class="col-sm-10">
        <h1>Users List Table</h1>
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
        <button type="button" class="btn btn-success btn-sm" v-b-modal.user-modal>Add User</button>
        <br><br>
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Username</th>
              <th scope="col">Status</th>
              <th scope="col">Previous Status</th>
              <th scope="col">Created Date</th>
              <th scope="col">Updated Date</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users">
              <td>{{ user.id }}</td>
              <td>{{ user.user_name }}</td>
              <td>{{ user.status }}</td>
              <td>
                <span v-if="user.prev_status">{{ user.prev_status }}</span>
                <span v-else>N.A.</span>
              </td>
              <td>{{ user.created_date }}</td>
              <td>
                <span v-if="user.updated_date">{{ user.updated_date }}</span>
                <span v-else>N.A.</span>
              </td>
              <td>
                <button type="button"
                				class="btn btn-warning btn-sm"
                				v-b-modal.user-update-modal
                				@click="editUser(user)"> 
                	<i class="far fa-edit"></i>
              	</button>
                <button type="button"
                				class="btn btn-danger btn-sm"
                				v-b-modal.user-delete-modal
                				@click="removeUser(user)">
                	<i class="fas fa-trash-alt"></i>
                </button>
                <!-- <router-link :to="`/order/${book.id}`"
                						 class="btn btn-primary btn-sm">
                	Purchase
                </router-link> -->
              </td>
            </tr>
          </tbody>
        </table>
        <h3 class="text-center alert alert-info" v-if="users.length === 0">No Users Found!</h3>
      </div>
    </div>

    <!-- Modal for Add Book -->
    <b-modal ref="addUserModal"
             id="user-modal"
             title="Add a new user"
             hide-footer>
      <b-form @submit="onSubmit" @reset="onReset" class="w-100">
      <b-form-group id="form-user_name-group"
                    label="Username:"
                    label-for="form-user_name-input">
          <b-form-input id="form-user_name-input"
                        type="text"
                        v-model="addUserForm.user_name"
                        required
                        placeholder="Enter Username">
          </b-form-input>
        </b-form-group>

        <b-form-group id="form-status-group"
                      label="Status:"
                      label-for="form-status-input">
          <b-form-select id="form-status-input" 
                         v-model="selected" 
                         :options="options" 
                         class="mb-3"
                         required>
          </b-form-select>
        </b-form-group>

        <b-btn type="submit" variant="primary" class="m-1">
					Submit
				</b-btn>
        <b-button type="reset" variant="danger">Cancel</b-button>
      </b-form>
    </b-modal>
    <!-- End of Modal -->


    <!-- Modal for Edit Book -->
    <b-modal ref="editUserModal"
    				 id="user-update-modal"
    				 title="Update User Info"
    				 hide-footer>
    	<b-form @submit="onSubmitUpdate" @reset="onResetUpdate" class="w-100">

    			<b-form-group id="form-user_name-edit-group"
    										label="Username:"
    										label-for="form-user_name-edit-input">
    					<b-form-input id="form-user_name-edit-input"
    												type="text"
    												v-model="editForm.user_name"
    												required
    												placeholder="Enter Username">
    					</b-form-input>
    			</b-form-group>

    			<b-form-group id="form-status-group"
                      label="Status:"
                      label-for="form-status-input">
          <b-form-select id="form-status-input" 
                         v-model="selected" 
                         :options="options" 
                         class="mb-3"
                         required>
          </b-form-select>
        </b-form-group>

    			<b-button type="submit" variant="warning">Update</b-button>
    			<b-button type="reset" variant="danger">Cancel</b-button>

    	</b-form>
    </b-modal>
    <!-- End of Modal -->


    <!-- Modal for Delete Book  -->
    <b-modal ref="deleteUserModal"
    				 id="user-delete-modal"
    				 title="Delete"
    				 hide-footer>

    	<b-form @submit="onSubmitDelete" @reset="onResetDelete" class="w-100">
    			<b-form-group id="form-confirmation-delete-group"
    										label="Confirmation: Are you sure you want to delete this user?"
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
const api_add_user = 'http://localhost:5000/add'
const single_api_user = 'http://localhost:5000/user'

export default {
  data() {
    return {
    	API_URL: base_url,
      ADD_API_URL: api_add_user,
      API_USER: single_api_user,
      users: [],
      addUserForm: {
        user_name: '',
        status: '',
      },
      selected: null,
      options: [
        { value: null, text: 'Select Status' },
        { value: 'Admin', text: 'Admin' },
        { value: 'Regular', text: 'Regular' },
        { value: 'Probationary', text: 'Probationary' },
        { value: 'Contractual', text: 'Contractual'}
      ],
      message: '',
      user_id: '',
      showMessage: false,
      dismissSecs: 3,
      dismissCountDown: 0,
      editForm: {
        id: '',
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
		editUser(user) {
			this.editForm = user;
      this.selected = user.status;
		},
		removeUser(user) {
			this.user_id = user.id;
		},
    addUser(payload) {
      const path = this.ADD_API_URL;
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
    updateUser(payload, userID) {
    	const path = this.API_USER + `/${userID}/edit`;
    	axios.put(path, payload)
    		.then (() => {
    			this.getUsers();
    			this.message = 'User successfully updated!';
    			this.showMessage = true;
    		})
    		.catch((error) => {
    			console.error(error);
    			this.getUsers();
    		});
    },
    deleteUser(userID) {
      const path = this.API_USER + `/${userID}/delete`;
      axios.post(path)
        .then(() => {
          this.getBooks();
          this.message = 'User successfully deleted!';
          this.showMessage = true;
        })
        .catch((error) => {
          console.error(error);
          this.getBooks();
        });
    },
    initForm() {
      this.addUserForm.user_name = '';
      this.selected = '';
      this.editForm.id = '';
      this.editForm.user_name = '';
      this.selected = '';
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.$refs.addUserModal.hide();
      this.message = 'User added!';
      this.dismissCountDown = this.dismissSecs;
      // let read = false;
      // if (this.addUserForm.read[0]) read = true;
      const payload = {
        user_name: this.addUserForm.user_name,
        status: this.selected,
      };
      console.log(payload);
      this.addUser(payload);
      this.initForm();
    },
    onSubmitUpdate(evt) {
    	evt.preventDefault();
    	this.$refs.editUserModal.hide();
    	this.message = 'User info updated!';
    	this.dismissCountDown = this.dismissSecs;
    	const payload = {
    		user_name: this.editForm.user_name,
    		status: this.selected
    	};
      console.log(payload);
    	this.updateUser(payload, this.editForm.id);
    },
    onSubmitDelete(evt) {
      var user_id = this.user_id;
      this.$refs.deleteUserModal.hide();
      this.message = 'User successfully deleted!';
      this.dismissCountDown = this.dismissSecs;
      this.deleteUser(user_id);
    },
    onReset(evt) {
      evt.preventDefault();
      this.$refs.addUserModal.hide();
      this.initForm();
    },
    onResetUpdate(evt){
    	evt.preventDefault();
    	this.$refs.editUserModal.hide();
    	this.initForm();
    	this.getUsers();
    },
    onResetDelete(evt){
    	evt.preventDefault();
    	this.$refs.deleteUserModal.hide();
    	this.initForm();
    	this.getUsers();
    },
  },
  created() {
    this.getUsers();
  },
};
</script>
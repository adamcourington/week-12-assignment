// Users
class User {
  constructor(firstName, lastName, title, hireDate) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.title = title;
    this.hireDate = hireDate;
  }
}

class UserService {
  static url = 'https://63c49db2f0028bf85faa7c4d.mockapi.io/users';

  static getAllUsers() {
    return $.get(this.url);
  }

  static getUser(id) {
    return $.get(`${this.url}/${id}`);
  }

  static createUser(user) {
    return $.post(this.url, user);
  }

  static updateUser(id, firstName, lastName, title, hireDate) {
    const data = { firstName, lastName, title, hireDate };
    console.log('User from update User', data);
    return $.ajax({
      url: `${this.url}/${id}`,
      dataType: 'json',
      data: JSON.stringify(data),
      contentType: 'application/json',
      type: 'PUT',
    });
  }

  static deleteUser(id) {
    return $.ajax({
      url: `${this.url}/${id}`,
      type: 'DELETE',
    });
  }
}

class DOMManager {
  static users;

  static getAllUsers() {
    UserService.getAllUsers().then((users) => this.render(users));
  }

  static createUser(firstName, lastName, title, hireDate) {
    UserService.createUser(new User(firstName, lastName, title, hireDate))
      .then(() => UserService.getAllUsers())
      .then((users) => this.render(users));
  }

  static updateUser(id, firstName, lastName, title, hireDate) {
    UserService.updateUser(id, firstName, lastName, title, hireDate)
      .then(() => UserService.getAllUsers())
      .then((users) => this.render(users));
  }

  static deleteUser(id) {
    UserService.deleteUser(id).then(() =>
      UserService.getAllUsers().then((users) => this.render(users))
    );
  }

  static render(users) {
    this.users = users;
    $('#users').empty();
    for (let user of users) {
      $('#users').prepend(`
        <div class="col-sm-6 col-lg-4" style="margin-top: 15px;">
          <div class="card">
            <img
              src="${user.avatar}"
              class="card-img-top"
              alt="user avatar"
              style="
                width: 200px;
                height: 200px;
                border: 1 px solid black;
                text-align: center;
              "
            />
            <div class="card-body">
              <h5 class="card-title">${user.firstName}</h5>
              <h5 class="card-title">${user.lastName}</h5>
              <p class="card-text">${user.title}</p>
              <p class="card-text">${user.hireDate}</p>
            </div>
          </div>
        
          <div class="col-sm">
          <div class="row">
            <div class="col-sm">
              <input
                type="text"
                id="${user.id}-update-user-first-name"
                class="form-control"
                placeholder="First Name"
                required
              />
            </div>
            <div class="col-sm">
              <input
                type="text"
                id="${user.id}-update-user-last-name"
                class="form-control"
                placeholder="Last Name"
                required
              />
            </div>
            </div>
            <div class="row">
            <div class="col-sm">
              <input
                type="text"
                id="${user.id}-update-user-title"
                class="form-control"
                placeholder="Title"
                required
              />
            </div>
            <div class="col-sm">
              <input
                type="date"
                id="${user.id}-update-user-hire-date"
                class="form-control"
                placeholder="Hire Date"
                required
              />
            </div>
            <button id="#${user.id}-update-user" class="btn btn-primary form-control" onclick="updateUser('${user.id}')">
              Update User
            </button>
            <button
              id="delete-user"
              class="btn btn-danger form-control"
              onclick="DOMManager.deleteUser('${user.id}')"
            >
              Delete User
            </button>
          </div>
        </div>
        </div>
        <br />
        `);
    }
  }
}

//create new user
$('#add-new-user').click(() => {
  DOMManager.createUser(
    $('#new-user-first-name').val(),
    $('#new-user-last-name').val(),
    $('#new-user-title').val(),
    $('#new-user-hire-date').val()
  );
  $('#new-user-first-name').val('');
  $('#new-user-last-name').val('');
  $('#new-user-title').val('');
  $('#new-user-hire-date').val('');
});

//update user
function updateUser(id) {
  const firstName = $(`#${id}-update-user-first-name`).val();
  const lastName = $(`#${id}-update-user-last-name`).val();
  const title = $(`#${id}-update-user-title`).val();
  const hireDate = $(`#${id}-update-user-hire-date`).val();

  // console.log({
  //   id,
  //   name,
  //   title,
  // });

  DOMManager.updateUser(id, firstName, lastName, title, hireDate);
}

//get all users on first render
DOMManager.getAllUsers();

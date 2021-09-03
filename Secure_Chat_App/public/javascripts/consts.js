// const users = document.querySelectorAll('.users');
const middleHeader = $('.middle-header-container').children();
const middleMain = $('.middle-msg-container').children()[0];
const middleFooter = $('.middle-bottom-container');
const current_user_id = $('.current_user').attr('id');
const online_user_container = $('.online-user-container');

const MSG_LOADER = `
    <div class="d-flex justify-content-center">
      <div class="spinner-grow" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>`;

const SENT_MSG = (txt) => {
  return `
    <div class="msg-sent">
      ${txt}
    </div>`;
};

const RECIVED_MSG = (txt) => {
  return `
    <div class="msg-recived">
      ${txt}
    </div>`;
};

const USER_ELEMENT = (user) => {
  return `
    <div class="users">
      <img 
        class="user-img img-fluid" 
        src="${user.profile_pic_url}" 
        alt="profile"
      >

      <div class="user-details" id="${user._id}">
        <div class="user-name">
          ${user.firstname} ${user.lastname}
        </div>
        <div class="user-msg-last">
          this is last msg..
        </div>
        <span class="online-dot"></span>
      </div>
    </div>`;
};

const SPINNER = `
    <div class="spinner">
        <div class="d-flex justify-content-center">
            <div class="spinner-border text-success" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    </div>`;

const INFO = (txt) => {
  return `
    <div class="spinner">
        <div class="d-flex justify-content-center">
            <div class="alert alert-dark" role="alert">
                ${txt} <a href="/" class="alert-link"> HOME</a>
            </div>    
        </div>
    </div>`;
};

const get_data = async (url = '') => {
  try {
    response = await fetch(url);
    return response.json();
  } catch (err) {
    return err;
  }
};

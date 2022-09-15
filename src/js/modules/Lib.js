var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
var re1 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{5,20}$/;
var currentEmail = "email@gmail.com";
var currentPrice = 0;

export function Lib() {
  function controlDropwdown() {
    var selectedList = document.querySelectorAll(
      "[data-form-dropdown-selected]"
    );
    selectedList.forEach(function (selected) {
      var dropdown = selected.closest("[data-form-dropdown]");
      var optionsContainer = dropdown.querySelector(
        "[data-form-dropdown-container]"
      );
      var formSelectedWrapper = dropdown.querySelector("[data-form-wrapper]");
      var optionsList = dropdown.querySelectorAll(
        "[data-form-dropdown-option]"
      );
      var selectedIndex = -1;
      optionsList.forEach(function (option, index) {
        option.addEventListener("click", function () {
          selectedIndex = index;
          console.log(option.querySelector("label").innerHTML);
          selected.innerHTML = option.querySelector("label").innerHTML;
          optionsContainer.classList.remove("active");
          formSelectedWrapper.classList.remove("active");

          selected.classList.add("active");
        });
      });
      selected.addEventListener("click", function () {
        optionsContainer.classList.toggle("active");
        formSelectedWrapper.classList.toggle("active");
        selected.classList.remove("active");
      });
      window.addEventListener("click", function (e) {
        var path = e.path || (e.composedPath && e.composedPath());
        if (path.includes(selected)) return;

        if (optionsContainer.classList.contains("active")) {
          optionsContainer.classList.remove("active");
        }
        if (formSelectedWrapper.classList.contains("active")) {
          formSelectedWrapper.classList.remove("active");
        }

        if (selectedIndex !== -1) {
          selected.classList.add("active");
        }
      });
    });
  }

  function validForm(form, funcSend) {
    let isAllValid = true;
    const submitBtn = form.querySelector(".pop-up-cart__form-btn");
    const inputsAuth = form.querySelectorAll('.pop-up-auth__field');
    const inputCheckbox = form.querySelector(".pop-up-auth__checkbox .custom-check");

    inputsAuth.forEach(function(el) {
      const input = el.querySelector('.pop-up-auth__input');
      if (input) {
        let isInvalid = checkInputOfAuthForm(input);
        if (isInvalid) {
          el.classList.add('invalid');
          isAllValid = false;
        }
        else el.classList.remove('invalid');
      }
    }) 
    if (inputCheckbox) 
      if (!inputCheckbox.checked)
        isAllValid = false;
    if (!isAllValid) submitBtn.setAttribute("disabled", "disabled");
    else {
      // запрос на сервер: вход/регистрация
      funcSend();
    }
  }

  function checkInputs() {
    const input = document.querySelector('.profile-info__input[valid]');
    const form = document.querySelector('.profile-info__form');
    const formLogIn = document.querySelector('#popupauth .pop-up__auth-form');
    const formSignIn = document.querySelector('#popupsignin .pop-up__auth-form');
    const inputsAuth = document.querySelectorAll('.pop-up-auth__field');
    const inputWrapper = document.querySelector('.profile-info__form>div');
    const btnEditChanged = document.querySelector('.profile-info__btn-edit-email');
    const btnEdit = document.querySelector('.profile-edit__btn-change-email');
    const edit = document.querySelector('.profile-info__edit');
    
    if (input && form && inputWrapper && btnEditChanged && btnEdit && edit) {
      input.addEventListener("input", function(e) {
        if (e.target.value) {
          btnEditChanged.removeAttribute("disabled");
        } else {
          btnEditChanged.setAttribute("disabled", "disabled");
        }
        inputWrapper.classList.remove("invalid");
      });
      // изменение email в профиле
      form.addEventListener("submit", function(e) {
        e.preventDefault();
        if (re.test(input.value)) {
          btnEditChanged.removeAttribute("disabled");
          inputWrapper.classList.remove("invalid");
          // Здесь отправка формы на сервер; window.location = 'xxxx';
          checkProfileEmail(input.value);
          edit.classList.add("visible");
          form.classList.remove("visible");
        } else {
          btnEditChanged.setAttribute("disabled", "disabled");
          inputWrapper.classList.add("invalid");  
        }
      });
      btnEdit.addEventListener('click', () => {
        form.classList.add("visible");
        edit.classList.remove("visible");
      });
    }
    if (formLogIn && formSignIn && inputsAuth) {
      const submitBtnSignIn = formSignIn.querySelector('button[type=submit].pop-up-cart__form-btn');
      const submitBtnLoginIn = formLogIn.querySelector('button[type=submit].pop-up-cart__form-btn');
      const inputCheckbox = formSignIn.querySelector(".pop-up-auth__checkbox .custom-check");

      inputsAuth.forEach(function(el) {
        const input = el.querySelector('.pop-up-auth__input');
        if (input) {
          input.addEventListener("input", function(e) {
            el.classList.remove('invalid');
            submitBtnSignIn.removeAttribute("disabled");
            submitBtnLoginIn.removeAttribute("disabled");
          })
        }
      });  

      formLogIn.addEventListener('submit', function(e) {
        e.preventDefault();
        validForm(formLogIn, function login() {
          // вход в систему
        });
      });
      formSignIn.addEventListener('submit', function(e) {
        e.preventDefault();
        validForm(formSignIn, function signin() {
          // регисрация
        });
      });
      inputCheckbox.addEventListener('change', function() {
        inputsAuth.forEach(function(el) {
          const input = el.querySelector('.pop-up-auth__input');
          if (input) {
            el.classList.remove('invalid');
            submitBtnSignIn.removeAttribute("disabled");
          }
        });

      });
      }
  }

  function checkInputOfAuthForm(input) {
    let isInvalid = false;
    switch (input.name) {
      case "username":
        if (!input.value || input.value?.length < 5 || input.value?.length > 20)
          isInvalid = true;
      break;
      case "password":
        if (!input.value || !re1.test(input.value))
          isInvalid = true;
      break;
      case "email":
        if (!re.test(input.value))
          isInvalid = true;
      break;          
      case "police":
        if (!input.checked)
          isInvalid = true;
      break;          
    }
    return isInvalid;
  }

  function checkProfileEmail(email) {
    const input = document.querySelector('.profile-info__input[valid]');
    const text = document.querySelector('.profile-edit__text');

    if (email && text && input) {
      text.innerText = email;
      input.value = email;
    }
  }
  function checkHistory() {
    const carts = document.querySelectorAll('.history .cart');
    const emptyText = document.querySelector('.history__carts-empty');
    if (carts && emptyText)
      if (carts.length === 0)
        emptyText.style.display = "flex";
  }
  function clearTabs (tabs) {
    tabs.forEach(el => {
      el.classList.remove("active");
    })
  }
  function tabs () {
    const pageWrapper = document.querySelector('.page__wrapper');
    const tabs = document.querySelectorAll('.profile .tab');
    const profileInfo = document.querySelector('.profile__info');
    const pages = document.querySelectorAll('.page-area__wrapper');
    tabs.forEach(function (el, index) {
      el.addEventListener('click', function(e) {
        clearTabs(tabs);
        if (index === 1) {
          profileInfo.classList.add('hide');
          pageWrapper.classList.add('show-history');
        }
        else {
          profileInfo.classList.remove('hide');
          pageWrapper.classList.remove('show-history');
        }
        this.classList.add('active');
        pages.forEach(function(el, i) {
          if (index !== i) el.classList.add('hide');
          else el.classList.remove('hide');
        })
      })
    })
  }

  function controlDropwdownProfileBtn() {
    var profileBtn = document.querySelector('[drop-down-btn]');
    var profileContent = document.querySelector('[drop-down-content]');

    if (profileBtn && profileContent) {
      profileBtn.addEventListener('click', function () {
        profileBtn.classList.toggle('active');
        profileContent.classList.toggle('active');
      })
    }

  }

  function checkTtable() {
    const tableEmptyText = document.querySelector('.replenishment__empty');
    const rows = document.querySelectorAll('.replenishment__table tr');
    if (rows && tableEmptyText)
      if (rows?.length < 2)
        tableEmptyText.style.display = "flex";

  }

  function checkInputNumber() {
    const btnMinus = document.querySelector('.number-minus');
    const btnPlus = document.querySelector('.number-plus');

    btnMinus.addEventListener('click', function(e) {
      this.nextElementSibling.stepDown();
    })
    btnPlus.addEventListener('click', function(e) {
      this.previousElementSibling.stepUp();
    })
  }

  function checkPrice(price) {
    const btn = document.querySelector('.pop-up-cart__form-empty-balance');
    const groupBtn = document.querySelector('.pop-up-cart__form-replenished-balance');
    if (price > 0) {
      btn.style.display = "none";
      groupBtn.style.display = "block";
    } else {
      groupBtn.style.display = "none";
      btn.style.display = "block";
    }
  }

  function changePopUp() {
    const inputsAuth = document.querySelectorAll('.pop-up-auth__field');
    const popBtnsClose = document.querySelectorAll(".pop-up__btn-close");
    popBtnsClose.forEach(function(element) {
      element.addEventListener("click", function(e) {
        inputsAuth.forEach(function(el) {
          const input = el.querySelector('.pop-up-auth__input');
          const inputCheckbox = document.querySelector("#popupsignin .pop-up-auth__checkbox .custom-check");

          if (input) {
              input.value = "";
              el.classList.remove('invalid');
          }
          if (inputCheckbox) {
            inputCheckbox.checked = false;
          }
        });
      })  
    })
  }
  function changePassword() {
    const block = document.querySelector('.password');
    if (block) {
      const input = block.querySelector("input[type=password]");
      const btn = block.querySelector(".btn-visibility");
      if (input && btn) {
        btn.addEventListener('click', function(e) {
          if (input.type === "password") {
            input.type = "text";
            btn.classList.add("visible");
          } else {
            input.type = "password";
            btn.classList.remove("visible");
          }
        });
      }
    }
  }

  function changeCheckboxSideBar() {
    const items = document.querySelectorAll(".sidebar-rarities__item");
    if (items)
      items.forEach(function(el) {
        el.addEventListener("click", function() {
          const input = el.querySelectorAll("input[type=checkbox]");
          if (input) {
            if (input.checked) items[i].classList.add("checked");
            else items[i].classList.remove("checked");
            }
        })
      })
  }
  controlDropwdown();
  controlDropwdownProfileBtn();
  checkInputs();
  checkProfileEmail(currentEmail);
  checkHistory();
  tabs();
  checkTtable();
  checkInputNumber();
  checkPrice(currentPrice);
  changePopUp();
  changePassword();
  changeCheckboxSideBar();
}

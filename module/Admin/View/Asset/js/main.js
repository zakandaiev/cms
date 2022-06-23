"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

// UTILS
function fadeOut(element) {
  var soft = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  if (!element) {
    return false;
  }

  element.style.opacity = 1;

  (function fade() {
    if ((element.style.opacity -= 0.1) < 0) {
      if (soft) {
        element.style.display = "none";
      } else {
        element.remove();
      }

      if (callback instanceof String && window[callback]) {
        window[callback]();
      } else if (callback instanceof Function) {
        callback();
      }
    } else {
      requestAnimationFrame(fade);
    }
  })();
}

function smoothScroll(element) {
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth'
    });
  }
}

document.querySelectorAll('table').forEach(function (table) {
  if (!table.parentElement.classList.contains('table-responsive')) {
    table.outerHTML = '<div class="table-responsive">' + table.outerHTML + '</div>';
  }
});
document.querySelectorAll('a').forEach(function (anchor) {
  if (anchor.hasAttribute('target') && anchor.getAttribute('target') === '_blank') {
    anchor.setAttribute('rel', 'noopener noreferrer nofollow');
  }

  if (!anchor.hasAttribute('data-bs-toggle')) {
    anchor.addEventListener('click', function (event) {
      if (!event.currentTarget.hasAttribute('href')) {
        return;
      }

      var anchor_href = event.currentTarget.getAttribute('href');

      if (anchor_href.charAt(0) === '#' || anchor_href.charAt(0) === '/' && anchor_href.charAt(1) === '#') {
        if (!event.currentTarget.hash) {
          return;
        }

        var scroll_to_node = document.querySelector(event.currentTarget.hash);

        if (scroll_to_node) {
          event.preventDefault();
          smoothScroll(scroll_to_node);
        }
      }
    });
  }
});
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});
document.querySelectorAll('.spinner-action').forEach(function (element) {
  if (SETTING.loader) {
    element.insertAdjacentHTML('beforeend', SETTING.loader);
  }
});

window.onload = function () {
  var images = document.querySelectorAll("img");
  images.forEach(function (image) {
    if (image.complete && typeof image.naturalWidth != "undefined" && image.naturalWidth <= 0) {
      image.src = SETTING.image_placeholder;
    }
  });
}; // CLASSES


var Form = /*#__PURE__*/function () {
  function Form(node) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Form);

    this.node = node;
    this.options = options;
    this.loader = options.loader ? options.loader : null;
    this.action = this.node.action;
    this.method = this.node.method ? this.node.method : 'POST';
    this.data_confirm = this.node.getAttribute('data-confirm');
    this.data_reset = this.node.hasAttribute('data-reset') ? true : false;
    this.data_class = this.node.getAttribute('data-class');
    this.data_redirect = this.node.getAttribute('data-redirect');
    this.data_message = this.node.getAttribute('data-message');

    if (this.action) {
      this.initialize();
    }
  }

  _createClass(Form, [{
    key: "initialize",
    value: function initialize() {
      var _this = this;

      if (this.loader) {
        this.node.insertAdjacentHTML('beforeend', this.loader);
      }

      this.node.addEventListener('submit', function (event) {
        event.preventDefault();

        if (!_this.confirmation()) {
          return false;
        }

        _this.disableForm();

        fetch(_this.action, {
          method: _this.method,
          body: _this.getFormData()
        }).then(function (response) {
          return response.json();
        }).then(function (data) {
          if (data.status === 'success') {
            var _this$data_message;

            _this.successRedirect(data);

            _this.successResetForm();

            SETTING.toast(data.status, (_this$data_message = _this.data_message) !== null && _this$data_message !== void 0 ? _this$data_message : data.message);
          } else {
            SETTING.toast(data.status, _this.data_message ? _this.data_message : data.message);
          }
        }).catch(function (error) {
          SETTING.toast('error', error);
        }).finally(function () {
          _this.enableForm();
        });
      });
    }
  }, {
    key: "confirmation",
    value: function confirmation() {
      var confirmation = true;

      if (this.data_confirm) {
        confirmation = confirm(this.data_confirm);
      }

      return confirmation;
    }
  }, {
    key: "getFormData",
    value: function getFormData() {
      var data = new FormData(this.node);

      if (this.options.data) {
        this.options.data.forEach(function (field) {
          if (field.key) {
            data.set(field.key, field.value ? field.value : null);
          }
        });
      }

      return data;
    }
  }, {
    key: "disableForm",
    value: function disableForm() {
      // DISABLE SELF
      this.node.setAttribute('disabled', 'disabled');
      this.node.classList.add('submit');
      this.node.querySelector('[type="submit"]').disabled = true; // ADD CLASS

      if (this.data_class) {
        this.node.classList.add(this.data_class);
      }

      return true;
    }
  }, {
    key: "enableForm",
    value: function enableForm() {
      // ENABLE SELF
      this.node.removeAttribute('disabled', 'disabled');
      this.node.classList.remove('submit');
      this.node.querySelector('[type="submit"]').disabled = false; // REMOVE CLASS

      if (this.data_class) {
        this.node.classList.remove(this.data_class);
      }

      return true;
    }
  }, {
    key: "successRedirect",
    value: function successRedirect(data) {
      if (this.data_redirect) {
        if (this.data_redirect === 'this') {
          document.location.reload();
        } else {
          window.location.href = decodeURI(this.data_redirect).replaceAll(/({\w+})/g, data === null || data === void 0 ? void 0 : data.message);
        }
      }

      return false;
    }
  }, {
    key: "successResetForm",
    value: function successResetForm() {
      if (this.data_reset) {
        this.node.reset();
        return true;
      }

      return false;
    }
  }]);

  return Form;
}();

document.querySelectorAll('form').forEach(function (element) {
  new Form(element, {
    loader: SETTING.loader,
    data: [{
      key: SETTING.csrf.key,
      value: SETTING.csrf.token
    }]
  });
});

var DataAction = /*#__PURE__*/function () {
  function DataAction(node) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, DataAction);

    this.node = node;
    this.options = options;
    this.data_action = this.node.getAttribute('data-action');
    this.data_method = this.node.hasAttribute('data-method') ? this.node.getAttribute('data-method') : 'POST';
    this.data_confirm = this.node.getAttribute('data-confirm');
    this.data_fields = this.node.getAttribute('data-fields');
    this.data_form = this.node.getAttribute('data-form');
    this.data_form_reset = this.node.getAttribute('data-form-reset');
    this.data_class = this.node.getAttribute('data-class');
    this.data_class_target = this.node.getAttribute('data-class-target');
    this.data_redirect = this.node.getAttribute('data-redirect');
    this.data_counter = this.node.getAttribute('data-counter');
    this.data_counter_plus = this.node.hasAttribute('data-counter-plus') ? true : false;
    this.data_delete = this.node.getAttribute('data-delete');
    this.data_message = this.node.getAttribute('data-message');

    if (this.data_action) {
      this.initialize();
    }
  }

  _createClass(DataAction, [{
    key: "initialize",
    value: function initialize() {
      var _this2 = this;

      this.node.addEventListener('click', function (event) {
        event.preventDefault();

        if (!_this2.confirmation()) {
          return false;
        }

        _this2.disableNodes();

        fetch(_this2.data_action, {
          method: _this2.data_method,
          body: _this2.getFormData()
        }).then(function (response) {
          return response.json();
        }).then(function (data) {
          if (data.status === 'success') {
            var _this2$data_message;

            _this2.successRedirect(data);

            _this2.successCounter();

            _this2.successResetTargetForm();

            _this2.successDeleteNodes();

            SETTING.toast(data.status, (_this2$data_message = _this2.data_message) !== null && _this2$data_message !== void 0 ? _this2$data_message : data.message);
          } else {
            SETTING.toast(data.status, _this2.data_message ? _this2.data_message : data.message);
          }
        }).catch(function (error) {
          SETTING.toast('error', error);
        }).finally(function () {
          _this2.enableNodes();
        });
      });
    }
  }, {
    key: "confirmation",
    value: function confirmation() {
      var confirmation = true;

      if (this.data_confirm) {
        confirmation = confirm(this.data_confirm);
      }

      return confirmation;
    }
  }, {
    key: "getFormData",
    value: function getFormData() {
      var data = new FormData();

      if (this.data_form) {
        data = new FormData(document.querySelector(this.data_form));
      }

      var options = [];

      if (this.data_fields) {
        options = options.concat(JSON.parse(this.data_fields));
      }

      if (this.options.data) {
        options = options.concat(this.options.data);
      }

      options.forEach(function (field) {
        if (field.key) {
          data.set(field.key, field.value ? field.value : null);
        }
      });
      return data;
    }
  }, {
    key: "disableNodes",
    value: function disableNodes() {
      var _this3 = this;

      // DISABLE SELF
      this.node.setAttribute('disabled', 'disabled');
      this.node.classList.add('submit'); // ADD CLASS TO TARGETS

      if (this.data_class && this.data_class_target) {
        document.querySelectorAll(this.data_class_target).forEach(function (target) {
          target.classList.add(_this3.data_class);
        });
      } else if (this.data_class) {
        this.node.classList.add(this.data_class);
      }

      return true;
    }
  }, {
    key: "enableNodes",
    value: function enableNodes() {
      var _this4 = this;

      // ENABLE SELF
      this.node.removeAttribute('disabled', 'disabled');
      this.node.classList.remove('submit'); // REMOVE CLASS FROM TARGETS

      if (this.data_class && this.data_class_target) {
        document.querySelectorAll(this.data_class_target).forEach(function (target) {
          target.classList.remove(_this4.data_class);
        });
      } else if (this.data_class) {
        this.node.classList.remove(this.data_class);
      }

      return true;
    }
  }, {
    key: "successRedirect",
    value: function successRedirect(data) {
      if (this.data_redirect) {
        if (this.data_redirect === 'this') {
          document.location.reload();
        } else {
          window.location.href = decodeURI(this.data_redirect).replaceAll(/({\w+})/g, data === null || data === void 0 ? void 0 : data.message);
        }
      }

      return false;
    }
  }, {
    key: "successCounter",
    value: function successCounter() {
      var _this5 = this;

      if (this.data_counter) {
        document.querySelectorAll(this.data_counter).forEach(function (target) {
          var target_value = parseInt(target.textContent);
          target.textContent = _this5.data_counter_plus ? target_value + 1 : target_value - 1;
        });
        return true;
      }

      return false;
    }
  }, {
    key: "successResetTargetForm",
    value: function successResetTargetForm() {
      if (this.data_form_reset) {
        document.querySelectorAll(this.data_form_reset).forEach(function (target) {
          target.reset();
        });
        return true;
      }

      return false;
    }
  }, {
    key: "successDeleteNodes",
    value: function successDeleteNodes() {
      if (!this.data_delete) {
        return false;
      }

      if (this.data_delete === 'this') {
        fadeOut(this.node);
        return true;
      }

      if (this.data_delete === 'trow') {
        var trow = this.node.closest('tr');

        if (trow) {
          fadeOut(trow);
        }

        return true;
      }

      document.querySelectorAll(this.data_delete).forEach(function (target) {
        fadeOut(target);
      });
      return true;
    }
  }]);

  return DataAction;
}();

document.querySelectorAll('[data-action]').forEach(function (element) {
  new DataAction(element, {
    data: [{
      key: SETTING.csrf.key,
      value: SETTING.csrf.token
    }]
  });
});

var DataBehabior = /*#__PURE__*/function () {
  function DataBehabior(node) {
    _classCallCheck(this, DataBehabior);

    this.node = node;
    this.data_behavior = this.node.getAttribute('data-behavior');
    this.data_hide = this.node.getAttribute('data-hide');
    this.data_show = this.node.getAttribute('data-show');
    this.data_target = this.node.getAttribute('data-target');

    if (this.data_behavior) {
      this.initialize();
    }
  }

  _createClass(DataBehabior, [{
    key: "initialize",
    value: function initialize() {
      var _this6 = this;

      // on node init
      if (this.data_behavior === 'visibility') {
        this.hideItems();
        this.showItems();
      } // on node change


      this.node.addEventListener('change', function (event) {
        if (_this6.data_behavior === 'visibility') {
          _this6.hideItems();

          _this6.showItems();
        }

        if (_this6.data_behavior === 'cyrToLat') {
          if (_this6.data_target) {
            _this6.data_target.split(',').forEach(function (target) {
              var target_item = document.querySelector('[name=' + target + ']');

              if (target_item) {
                target_item.value = cyrToLat(_this6.node.value);
              }
            });
          } else {
            _this6.node.value = cyrToLat(_this6.node.value);
          }
        }

        if (_this6.data_behavior === 'slug' || _this6.data_behavior === 'slug_') {
          if (_this6.data_target) {
            _this6.data_target.split(',').forEach(function (target) {
              var target_item = document.querySelector('[name=' + target + ']');

              if (target_item) {
                target_item.value = slug(_this6.node.value, _this6.data_behavior === 'slug_' ? '_' : null);
              }
            });
          } else {
            _this6.node.value = slug(_this6.node.value, _this6.data_behavior === 'slug_' ? '_' : null);
          }
        }
      });
    }
  }, {
    key: "hideItems",
    value: function hideItems() {
      var hide = this.data_hide;

      if (this.node.getAttribute('type') === 'checkbox' && !this.node.checked) {
        if (hide) {
          hide += ',' + this.data_show;
        } else {
          hide = this.data_show;
        }
      }

      if (this.node.getAttribute('type') === 'radio' && !this.node.checked) {
        hide = null;
      }

      if (hide) {
        hide.split(',').forEach(function (to_hide) {
          var item = form.querySelector('[name="' + to_hide + '"]');
          var parent = item.parentElement;

          if (parent.classList.contains('form-control')) {
            parent.classList.add('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      }

      return true;
    }
  }, {
    key: "showItems",
    value: function showItems() {
      var show = this.data_show;

      if (this.node.getAttribute('type') === 'checkbox' && !this.node.checked) {
        show = null;
      }

      if (this.node.getAttribute('type') === 'radio' && !this.node.checked) {
        show = null;
      }

      if (show) {
        show.split(',').forEach(function (to_show) {
          var item = form.querySelector('[name="' + to_show + '"]');
          var parent = item.parentElement;

          if (parent.classList.contains('form-control')) {
            parent.classList.remove('hidden');
          } else {
            item.classList.remove('hidden');
          }
        });
      }

      return true;
    }
  }]);

  return DataBehabior;
}();

document.querySelectorAll('[data-behavior]').forEach(function (element) {
  new DataBehabior(element);
});

var ForeignForm = /*#__PURE__*/function () {
  function ForeignForm(node) {
    _classCallCheck(this, ForeignForm);

    this.is_edit = false;
    this.active_row = null;
    this.uid = this.generateUid();
    this.initStore(node);
    this.initModal();
    this.initButtons();
    this.initTable();
    this.populateTable();
    this.updateStore();
    this.render();
  }

  _createClass(ForeignForm, [{
    key: "generateUid",
    value: function generateUid() {
      return 'ff-' + Math.random().toString(36).slice(2);
    }
  }, {
    key: "initStore",
    value: function initStore(node) {
      this.store = node;
      this.name = this.store.name;
      this.value = this.store.value;
      this.store.setAttribute('data-id', this.uid);
      this.store.setAttribute('type', 'hidden');
      this.store.classList.add('hidden');
      return true;
    }
  }, {
    key: "initModal",
    value: function initModal() {
      var _this7 = this;

      this.modal = this.store.nextElementSibling;
      this.inputs = this.modal.querySelectorAll('[name]');
      this.inputs.forEach(function (input) {
        input.name = input.name.replace('[]', '');
      });
      setTimeout(function () {
        _this7.inputs.forEach(function (input) {
          if (input.type === 'file') {
            _this7.initFileInput(input);
          }
        });
      }, 1000);
      this.modal.setAttribute('id', this.uid);
      var bs = new bootstrap.Modal(this.modal);
      this.modal.bs = bs;
      this.modal.addEventListener('hidden.bs.modal', function () {
        return _this7.buttonClick('cancel');
      });
      return true;
    }
  }, {
    key: "initFileInput",
    value: function initFileInput(input) {
      var _input$pond;

      input === null || input === void 0 ? void 0 : (_input$pond = input.pond) === null || _input$pond === void 0 ? void 0 : _input$pond.setOptions({
        instantUpload: true,
        allowRevert: true,
        server: {
          process: {
            url: '/upload/',
            ondata: function ondata(formData) {
              formData.set(SETTING.csrf.key, SETTING.csrf.token);
              return formData;
            }
          },
          revert: {
            url: '/upload/',
            ondata: function ondata(formData) {
              formData.set(SETTING.csrf.key, SETTING.csrf.token);
              return formData;
            }
          }
        }
      });
      return true;
    }
  }, {
    key: "initButtons",
    value: function initButtons() {
      var _this8 = this;

      this.submit = this.modal.querySelector('[type="submit"]');
      this.submit.addEventListener('click', function (event) {
        return _this8.buttonClick('submit', event);
      });
      this.add = document.createElement('span');
      this.add.setAttribute('data-bs-toggle', 'modal');
      this.add.setAttribute('data-bs-target', '#' + this.uid);
      this.add.classList.add('badge', 'bg-primary', 'cursor-pointer');
      this.add.innerHTML = SETTING.icon.add;
      this.add.addEventListener('click', function () {
        return _this8.buttonClick('add');
      });
      return true;
    }
  }, {
    key: "updateButtons",
    value: function updateButtons() {
      var add = this.submit.querySelector('.add');
      var edit = this.submit.querySelector('.edit');

      if (this.is_edit) {
        if (add) {
          add.style.display = 'none';
        }

        if (edit) {
          edit.style.display = 'initial';
        }
      } else {
        if (add) {
          add.style.display = 'initial';
        }

        if (edit) {
          edit.style.display = 'none';
        }
      }

      return true;
    }
  }, {
    key: "initTable",
    value: function initTable() {
      var _this9 = this;

      this.table = document.createElement('table');
      this.thead = document.createElement('thead');
      this.tbody = document.createElement('tbody');
      this.table.classList.add('table');
      this.table.classList.add('table-sm');
      this.table.classList.add('foreign-form__table');
      this.createThead();
      this.tbody.classList.add('sortable');
      this.tbody.setAttribute('data-handle', '.sortable__handle');

      this.tbody.onEnd = function () {
        return _this9.updateStore();
      };

      return true;
    }
  }, {
    key: "createThead",
    value: function createThead() {
      var trow = document.createElement('tr');
      this.inputs.forEach(function (input) {
        var tcol = document.createElement('th');
        tcol.innerText = input.getAttribute('data-label');
        trow.appendChild(tcol);
      });
      var tcol = document.createElement('th');
      tcol.classList.add('table-action');
      tcol.appendChild(this.add);
      trow.appendChild(tcol);
      this.thead.appendChild(trow);
      return true;
    }
  }, {
    key: "populateTable",
    value: function populateTable() {
      var _this10 = this;

      if (!this.value) {
        return false;
      }

      var values = JSON.parse(this.value);
      values.forEach(function (value) {
        _this10.active_row = _this10.createRow();

        _this10.updateRow(value);

        _this10.tbody.appendChild(_this10.active_row);
      });
      return true;
    }
  }, {
    key: "updateStore",
    value: function updateStore() {
      var data = [];
      this.tbody.querySelectorAll('tr').forEach(function (tr) {
        var obj = {};
        tr.querySelectorAll('td').forEach(function (td) {
          if (!td.hasAttribute('data-name')) {
            return false;
          }

          obj[td.getAttribute('data-name')] = td.getAttribute('data-value');
        });
        data.push(obj);
      });
      this.store.value = JSON.stringify(data);
      return true;
    }
  }, {
    key: "render",
    value: function render() {
      this.table.appendChild(this.thead);
      this.table.appendChild(this.tbody);
      this.store.before(this.table);
      return true;
    }
  }, {
    key: "createRow",
    value: function createRow() {
      var _this11 = this;

      var trow = document.createElement('tr');
      this.inputs.forEach(function (input) {
        var tcol = document.createElement('td');
        tcol.setAttribute('data-name', input.name);
        tcol.setAttribute('data-value', '');
        trow.appendChild(tcol);
      });
      var tcol = document.createElement('td');
      tcol.classList.add('table-action');
      var btn_sort = document.createElement('span');
      var btn_edit = document.createElement('span');
      var btn_delete = document.createElement('span');
      btn_sort.innerHTML = SETTING.icon.sort + ' ';
      btn_sort.classList.add('sortable__handle');
      btn_edit.innerHTML = SETTING.icon.edit + ' ';
      btn_delete.innerHTML = SETTING.icon.delete;
      btn_edit.addEventListener('click', function () {
        return _this11.buttonClick('edit', trow);
      });
      btn_delete.addEventListener('click', function () {
        return _this11.buttonClick('delete', trow);
      });
      tcol.append(btn_sort);
      tcol.append(btn_edit);
      tcol.append(btn_delete);
      trow.appendChild(tcol);
      return trow;
    }
  }, {
    key: "buttonClick",
    value: function buttonClick(type) {
      var _this12 = this;

      var mixed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      switch (type) {
        case 'add':
          {
            this.is_edit = false;
            this.resetInputs();
            this.updateButtons();
            return true;
          }

        case 'edit':
          {
            this.active_row = mixed;
            this.is_edit = true;
            this.resetInputs();
            this.updateButtons(true);
            this.populateInputs();
            this.modal.bs.show();
            return true;
          }

        case 'delete':
          {
            this.is_edit = false;
            fadeOut(mixed, false, function () {
              return _this12.updateStore();
            });
            return true;
          }

        case 'cancel':
          {
            this.is_edit = false;
            this.resetInputs();
            return true;
          }

        case 'submit':
          {
            mixed.preventDefault();

            if (!this.is_edit) {
              this.active_row = this.createRow();
            }

            var input_values = this.getInputsValue();

            if (!input_values) {
              return false;
            }

            this.updateRow(input_values);

            if (!this.is_edit) {
              this.tbody.appendChild(this.active_row);
            }

            this.updateStore();
            this.modal.bs.hide();
            return true;
          }
      }
    }
  }, {
    key: "updateRow",
    value: function updateRow(value) {
      var _this13 = this;

      if (!value) {
        return false;
      }

      this.inputs.forEach(function (input) {
        var tcol = _this13.active_row.querySelector("[data-name=\"".concat(input.name, "\"]"));

        if (!tcol) {
          return false;
        }

        _this13.setColValue(input, tcol, value[input.name]);
      });
      return true;
    }
  }, {
    key: "setColValue",
    value: function setColValue(input, tcol) {
      var _value2;

      var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var output = value;

      switch (input.type) {
        case 'file':
          {
            output = '';
            var files = [];

            if (input.pond) {
              input.pond.getFiles().forEach(function (file) {
                if ([6, 8].includes(file.status)) {
                  return false;
                }

                files.push(file.serverId);
              });
            }

            if (value && value[0] === '[') {
              files = files.concat(JSON.parse(value));
            }

            var gallery_uid = this.generateUid();
            files.forEach(function (file) {
              var file_name = file;
              var file_url = BASE_URL + '/' + file_name;
              var is_image = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(file_name === null || file_name === void 0 ? void 0 : file_name.split('.').pop().toLowerCase());

              if (is_image) {
                output += "<a href=\"".concat(file_url, "\" target=\"_blank\" data-fancybox=\"").concat(gallery_uid, "\">").concat(SETTING.icon.image, "</a>");
              } else {
                output += "<a href=\"".concat(file_url, "\" target=\"_blank\">").concat(SETTING.icon.file, "</a>");
              }

              output += ' ';
            });
            value = JSON.stringify(files);
            break;
          }

        case 'select-one':
          {
            var _input$slim$selected, _input$slim, _value;

            var selected = (_input$slim$selected = input === null || input === void 0 ? void 0 : (_input$slim = input.slim) === null || _input$slim === void 0 ? void 0 : _input$slim.selected()) !== null && _input$slim$selected !== void 0 ? _input$slim$selected : (_value = value) !== null && _value !== void 0 ? _value : '';
            var option = input.querySelector('option[value="' + selected + '"]');
            if (option) output = option.text;
            value = selected;
            break;
          }

        case 'select-multiple':
          {
            var _input$slim$selected2, _input$slim2, _JSON$parse;

            var _selected = (_input$slim$selected2 = input === null || input === void 0 ? void 0 : (_input$slim2 = input.slim) === null || _input$slim2 === void 0 ? void 0 : _input$slim2.selected()) !== null && _input$slim$selected2 !== void 0 ? _input$slim$selected2 : (_JSON$parse = JSON.parse(value)) !== null && _JSON$parse !== void 0 ? _JSON$parse : [];

            var svalues = [];

            _selected.forEach(function (sval) {
              var option = input.querySelector('option[value="' + sval + '"]');
              if (option) svalues.push(option.text);
            });

            output = svalues.join(', ');
            value = JSON.stringify(_selected);
            break;
          }

        case 'checkbox':
          {
            if (input.checked) {
              var _SETTING$icon$checkbo;

              output = (_SETTING$icon$checkbo = SETTING.icon.checkbox_true) !== null && _SETTING$icon$checkbo !== void 0 ? _SETTING$icon$checkbo : '+';
            } else {
              var _SETTING$icon$checkbo2;

              output = (_SETTING$icon$checkbo2 = SETTING.icon.checkbox_false) !== null && _SETTING$icon$checkbo2 !== void 0 ? _SETTING$icon$checkbo2 : '-';
            }

            value = input.checked;
            break;
          }

        case 'date':
          {
            var _Date;

            output = (_Date = new Date(value)) === null || _Date === void 0 ? void 0 : _Date.toLocaleDateString();
            break;
          }

        case 'datetime-local':
          {
            var _Date2;

            output = (_Date2 = new Date(value)) === null || _Date2 === void 0 ? void 0 : _Date2.toLocaleString();
            break;
          }
      }

      tcol.innerHTML = output;
      tcol.setAttribute('data-value', (_value2 = value) !== null && _value2 !== void 0 ? _value2 : '');
      return true;
    }
  }, {
    key: "resetInputs",
    value: function resetInputs() {
      var _this14 = this;

      this.inputs.forEach(function (input) {
        _this14.setInputValue(input, null);
      });
      return true;
    }
  }, {
    key: "populateInputs",
    value: function populateInputs() {
      var _this15 = this;

      this.active_row.querySelectorAll('[data-name]').forEach(function (tcol) {
        _this15.inputs.forEach(function (input) {
          if (input.name === tcol.getAttribute('data-name')) {
            _this15.setInputValue(input, tcol.getAttribute('data-value'));
          }
        });
      });
      return true;
    }
  }, {
    key: "setInputValue",
    value: function setInputValue(input) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      switch (input.type) {
        case 'file':
          {
            var files = [];

            if (value) {
              JSON.parse(value).forEach(function (file) {
                var file_obj = {
                  source: file,
                  options: {
                    type: 'local',
                    metadata: {}
                  }
                };

                if (pond_input_data.allowImagePreview(input)) {
                  file_obj.options.metadata.poster = BASE_URL + '/' + file;
                }

                files.push(file_obj);
              });
            }

            input.pond.setOptions({
              files: files
            });
            break;
          }

        case 'select-one':
        case 'select-multiple':
          {
            var _value3;

            input.selectedIndex = (_value3 = value) !== null && _value3 !== void 0 ? _value3 : 0;

            if (!input.hasAttribute('data-native')) {
              if (input.type === 'select-multiple') {
                var _value4;

                value = JSON.parse(value);
                value = (_value4 = value) !== null && _value4 !== void 0 ? _value4 : [];
              }

              input.slim.set(value);
            }

            break;
          }

        case 'checkbox':
          {
            if (value && value == 'true') {
              input.checked = true;
            } else {
              input.checked = false;
            }

            break;
          }

        case 'textarea':
          {
            if (input.classList.contains('wysiwyg')) {
              input.quill.root.innerHTML = value;
            } else {
              input.value = value;
            }

            break;
          }

        default:
          input.value = value;
      }

      return true;
    }
  }, {
    key: "getInputsValue",
    value: function getInputsValue() {
      var value = {};
      var is_valid = true;
      this.inputs.forEach(function (input) {
        var value_lengh = input.value.replace(/(<([^>]+)>)/gi, '').length;

        if (input.hasAttribute('data-required') && value_lengh <= 0) {
          var _SETTING$foreignForm$, _SETTING, _SETTING$foreignForm, _input$getAttribute;

          var sprintf = function sprintf(str) {
            for (var _len = arguments.length, argv = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              argv[_key - 1] = arguments[_key];
            }

            return !argv.length ? str : sprintf.apply(void 0, [str = str.replace(sprintf.token || "%", argv.shift())].concat(argv));
          };

          is_valid = false;
          var required_message = (_SETTING$foreignForm$ = (_SETTING = SETTING) === null || _SETTING === void 0 ? void 0 : (_SETTING$foreignForm = _SETTING.foreignForm) === null || _SETTING$foreignForm === void 0 ? void 0 : _SETTING$foreignForm.required_message) !== null && _SETTING$foreignForm$ !== void 0 ? _SETTING$foreignForm$ : '% is required';
          required_message = sprintf(required_message, (_input$getAttribute = input.getAttribute('data-label')) !== null && _input$getAttribute !== void 0 ? _input$getAttribute : input.name);
          SETTING.toast('error', required_message);
        }

        value[input.name] = input.value;
      });
      return is_valid ? value : is_valid;
    }
  }]);

  return ForeignForm;
}();

document.querySelectorAll('[class*="foreign-form"]').forEach(function (element) {
  if (element.classList.contains('foreign-form')) {
    new ForeignForm(element);
  }
}); // PLUGINS

var pond_input_data = {
  files: function files(input) {
    var files = [];

    if (!input.hasAttribute('data-value')) {
      return files;
    }

    var input_files = input.getAttribute('data-value');

    if (!input_files || input_files == '[]') {
      return files;
    }

    input_files = JSON.parse(input_files);
    input_files.forEach(function (file) {
      var file_obj = {
        source: file.value,
        options: {
          type: 'local',
          metadata: {}
        }
      };

      if (pond_input_data.allowImagePreview(input)) {
        file_obj.options.metadata.poster = file.poster;
      }

      files.push(file_obj);
    });
    return files;
  },
  allowImagePreview: function allowImagePreview(input) {
    return input.getAttribute('data-preview') == 'false' ? false : true;
  },
  maxTotalFileSize: function maxTotalFileSize(input) {
    return input.hasAttribute('data-max-total-size') ? input.getAttribute('data-max-total-size') : null;
  },
  maxFileSize: function maxFileSize(input) {
    return input.hasAttribute('data-max-size') ? input.getAttribute('data-max-size') : null;
  },
  maxFiles: function maxFiles(input) {
    return input.hasAttribute('data-max-files') ? parseInt(input.getAttribute('data-max-files')) : null;
  },
  styleItemPanelAspectRatio: function styleItemPanelAspectRatio(input) {
    return input.hasAttribute('data-aspect-ratio') ? parseInt(input.getAttribute('data-aspect-ratio')) : 0.5625;
  }
};
var file_inputs = document.querySelectorAll('input[type="file"]');

if (file_inputs) {
  file_inputs.forEach(function (input) {
    var pond = FilePond.create(input, {
      server: {
        load: '/'
      },
      storeAsFile: true,
      instantUpload: false,
      allowProcess: false,
      allowRevert: false,
      allowReorder: true,
      dropOnPage: true,
      dropOnElement: file_inputs.length == 1 ? false : true,
      files: pond_input_data.files(input),
      allowImagePreview: pond_input_data.allowImagePreview(input),
      maxTotalFileSize: pond_input_data.maxTotalFileSize(input),
      maxFileSize: pond_input_data.maxFileSize(input),
      maxFiles: pond_input_data.maxFiles(input),
      styleItemPanelAspectRatio: pond_input_data.styleItemPanelAspectRatio(input),
      credits: false
    });

    if (input.hasAttribute('data-placeholder')) {
      pond.setOptions({
        labelIdle: input.getAttribute('data-placeholder')
      });
    }

    input.pond = pond;
  });
}

document.querySelectorAll('textarea[class*="wysiwyg"]').forEach(function (textarea) {
  textarea.classList.add("hidden");
  var wysiwyg_node = document.createElement('div');
  var quill_node = document.createElement('div');
  quill_node.innerHTML = textarea.value;
  wysiwyg_node.classList.add('wysiwyg');
  wysiwyg_node.appendChild(quill_node);
  textarea.after(wysiwyg_node);
  var quill_icons = Quill.import('ui/icons');
  quill_icons['expand'] = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="maximize feather feather-maximize align-middle"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="minimize feather feather-minimize align-middle"><path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"/></svg>';
  var quill = new Quill(quill_node, {
    modules: {
      toolbar: {
        container: [[{
          header: [false, 3, 2]
        }], ['bold', 'italic', 'underline', 'strike'], [{
          'align': []
        }, {
          'list': 'ordered'
        }, {
          'list': 'bullet'
        }], [{
          'color': []
        }, {
          'background': []
        }], ['link', 'image', 'video', 'blockquote', 'code'], [{
          'indent': '-1'
        }, {
          'indent': '+1'
        }], [{
          'script': 'sub'
        }, {
          'script': 'super'
        }], ['clean'], ['expand']],
        handlers: {
          'image': function image(event) {
            uploadImage();
          },
          'expand': function expand(event) {
            var expand = wysiwyg_node.querySelector('.ql-expand');

            function maximize() {
              wysiwyg_node.classList.add('fullscreen');
              if (expand) expand.classList.add('active');
            }

            function minimize() {
              wysiwyg_node.classList.remove('fullscreen');
              if (expand) expand.classList.remove('active');
            }

            wysiwyg_node.classList.contains('fullscreen') ? minimize() : maximize();
          }
        }
      }
    },
    placeholder: textarea.placeholder,
    readOnly: textarea.disabled ? true : false,
    theme: 'snow'
  }); // POPULATE
  // quill.setContents(JSON.parse(textarea.value).ops);
  // UPDATE TEXTAREA VALUE

  quill.on('editor-change', function (event) {
    // textarea.value = JSON.stringify(quill.getContents());
    textarea.value = quill.root.innerHTML;
  }); // IMAGE UPLOAD

  var Image = Quill.import('formats/image');
  Image.className = 'image-fluid';
  Quill.register(Image, true);

  function uploadImage() {
    var input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = function () {
      var file = input.files[0];

      if (file) {
        var formData = new FormData();
        formData.append('file', file);
        quill.enable(false);
        fetch(BASE_URL + '/upload', {
          method: 'POST',
          body: formData
        }).then(function (response) {
          return response.json();
        }).then(function (data) {
          if (data.status === 'success') {
            var selection = quill.getSelection().index;
            var image_url = BASE_URL + '/' + data.message;
            quill.insertEmbed(selection, 'image', image_url);
            quill.setSelection(selection + 1);
          } else {
            SETTING.toast(data.status, data.message);
          }
        }).catch(function (error) {
          SETTING.toast('error', error);
        }).finally(function () {
          quill.enable(true);
        });
      }
    };
  }

  textarea.quill = quill;
});
var slimselect_data = {
  addable: function addable(select) {
    if (!select.hasAttribute('data-addable')) {
      return false;
    }

    return function (value) {
      var val = value;

      switch (select.getAttribute('data-addable')) {
        case 'tag':
          {
            val = value.replaceAll(/(?:(?![ 0-9A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD23\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF1C\uDF27\uDF30-\uDF45\uDF70-\uDF81\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDEB8\uDF00-\uDF1A\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCDF\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDEE0-\uDEF2\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE70-\uDEBE\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE7F\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD837[\uDF00-\uDF1E]|\uD838[\uDD00-\uDD2C\uDD37-\uDD3D\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB]|\uD839[\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43\uDD4B]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])[\s\S])+/gi, '').replaceAll(/[\s]+/g, ' ').trim();
            break;
          }

        default:
          {
            val = value.replaceAll(/[\s]+/g, ' ').trim();
            break;
          }
      }

      return val;
    };
  },
  allowDeselect: function allowDeselect(select) {
    return select.querySelector('option[data-placeholder]') ? true : false;
  },
  deselectLabel: function deselectLabel(select) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather-sm"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
  },
  hideSelectedOption: function hideSelectedOption(select) {
    return select.multiple ? true : false;
  },
  closeOnSelect: function closeOnSelect(select) {
    return select.multiple ? false : true;
  },
  showSearch: function showSearch(select) {
    return select.querySelectorAll('option').length > 10 || select.hasAttribute('data-addable') ? true : false;
  },
  placeholder: function placeholder(select) {
    return select.hasAttribute('data-placeholder') ? select.getAttribute('data-placeholder') : null;
  },
  searchPlaceholder: function searchPlaceholder(select) {
    return select.hasAttribute('data-placeholder-search') ? select.getAttribute('data-placeholder-search') : null;
  },
  searchText: function searchText(select) {
    return select.hasAttribute('data-placeholder-search-text') ? select.getAttribute('data-placeholder-search-text') : null;
  }
};
document.querySelectorAll('select').forEach(function (select) {
  if (select.hasAttribute('data-native')) {
    return false;
  }

  new SlimSelect({
    select: select,
    addable: slimselect_data.addable(select),
    allowDeselect: slimselect_data.allowDeselect(select),
    deselectLabel: slimselect_data.deselectLabel(select),
    // hideSelectedOption: slimselect_data.hideSelectedOption(select), // not work with optgroups
    closeOnSelect: slimselect_data.closeOnSelect(select),
    showSearch: slimselect_data.showSearch(select),
    placeholder: slimselect_data.placeholder(select),
    placeholderText: slimselect_data.placeholder(select),
    searchPlaceholder: slimselect_data.searchPlaceholder(select),
    searchText: slimselect_data.searchText(select),
    showContent: "down"
  });
});

var makeSortable = function makeSortable(element) {
  return new Sortable(element, {
    multiDrag: element.hasAttribute('data-multi') ? true : false,
    group: element.hasAttribute('data-multi') ? element.getAttribute('data-multi') : false,
    handle: element.hasAttribute('data-handle') ? element.getAttribute('data-handle') : false,
    filter: element.hasAttribute('data-disabled') ? element.getAttribute('data-disabled') : '.sortable__disabled',
    ghostClass: element.hasAttribute('data-ghost') ? element.getAttribute('data-ghost') : 'sortable__ghost',
    fallbackOnBody: false,
    swapThreshold: 0.5,
    animation: 150,
    onEnd: function onEnd(event) {
      if (element.onEnd && element.onEnd instanceof Function) {
        element.onEnd();
      }

      if (element.hasAttribute('data-callback') && window[element.getAttribute('data-callback')]) {
        window[element.getAttribute('data-callback')](event);
      }
    }
  });
};

document.querySelectorAll('[class*="sortable"]').forEach(function (element) {
  if (element.classList.contains('sortable')) {
    var sortable = makeSortable(element);
    element.sortable = sortable;
  }
});
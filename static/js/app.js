var group_modal_id = 0
var group_edit_id = 0
var group_active = 0
var question_delete_modal = 0
var question_edit_modal = 0
var answer_delete_modal = 0
var answer_link_modal = 0
var answer_outcome_modal = 0

create_answer = (answer) => {
  return `
  <li class="answer__item collection-item" data-id="${answer['id']}">
    <a class="answer__item-link row" href="#">
      <span class="answer__item-name col s8">${answer['text']}</span>
      <span class="secondary-content delete" data-id="${answer['id']}" data-name="${answer['text']}" data-url="${answer['delete_url']}">
        <i class="material-icons">close</i>
      </span>
      <span class="secondary-content edit"><i class="material-icons">edit</i></span>
      <span class="secondary-content outcome" data-outcome="${answer['outcome']}"><i class="material-icons">chevron_right</i></span>
      <span class="secondary-content append" data-outcome="${answer['outcome']}"><i class="material-icons">link</i></span>
      <div class="row">
        <div class="input-field col s3">
          <select data-type="humanity" class="answer__item-selector answer__item-humanity">
            <option value="-"${answer['humanity']=='-' ? ' selected' : ''}>Человечный</option>
            <option value="0"${answer['humanity']=='0' ? ' selected' : ''}>Нейтральный</option>
            <option value="+"${answer['humanity']=='+' ? ' selected' : ''}>Психопатичный</option>
          </select>
          <label>Человечность</label>
        </div>
        <div class="input-field col s3">
          <select data-type="curiosity" class="answer__item-selector answer__item-curiosity">
            <option value="-"${answer['curiosity']=='-' ? ' selected' : ''}>Любопытный</option>
            <option value="0"${answer['curiosity']=='0' ? ' selected' : ''}>Нейтральный</option>
            <option value="+"${answer['curiosity']=='+' ? ' selected' : ''}>Осторожный</option>
          </select>
          <label>Любопытство</label>
        </div>
        <div class="input-field col s3">
          <select data-type="tyranny" class="answer__item-selector answer__item-tyranny">
            <option value="-"${answer['tyranny']=='-' ? ' selected' : ''}>Властный</option>
            <option value="0"${answer['tyranny']=='0' ? ' selected' : ''}>Нейтральный</option>
            <option value="+"${answer['tyranny']=='+' ? ' selected' : ''}>Либеральный</option>
          </select>
          <label>Властность</label>
        </div>
        <div class="input-field col s3">
          <select data-type="independence" class="answer__item-selector answer__item-independence">
            <option value="-"${answer['independence']=='-' ? ' selected' : ''}>Независимый</option>
            <option value="0"${answer['independence']=='0' ? ' selected' : ''}>Нейтральный</option>
            <option value="+"${answer['independence']=='+' ? ' selected' : ''}>Коллективный</option>
          </select>
          <label>Неависимость</label>
        </div>
      </div>
  </a>
  <form class="answer__item-form hidden row" action="${answer['update_url']}" method="put" accept-charset="utf-8">
      <input placeholder="Название группы" id="name" name="text" type="text" value="${answer['text']}" class="validate col s12 group-name">
    </form>
  </li>
  `
}

$(".group-form").submit(function( event ) {
  let name = $('.group-name').val()
  event.preventDefault()
  let data = $('.group-form').serialize()
  $.post(
    '/api/v1/dialogs/groups/create/',
    $('.group-form').serialize(),
    function(data) {
      $('.group__list').append(
        `
        <li class="group__item collection-item" data-id="${data['id']}">
            <a class="group__item-link" href="#">
                ${data['name']}
                <span class="secondary-content delete" data-id="${data['id']}" data-name="${data['name']}" data-url="${data['delete_url']}">
                    <i class="material-icons">close</i>
                </span>
                <span class="secondary-content edit"><i class="material-icons">edit</i></span>
            </a>
            <form class="group__item-form hidden" action="${data['update_url']}" method="post" accept-charset="utf-8">
                <input placeholder="Название группы" id="name" name="name" type="text" value="${data['name']}" class="validate col s12 group-name">
            </form>
        </li>
        `
      )
    }
  )
})

$(document).on('click', '.group__item', function(event) {
  $('.group__item').removeClass('group__item-active')
  $(this).addClass('group__item-active')
  group_active = $(this).data('id')
  $.get('/api/v1/dialogs/questions/' + $(this).data('id') + '/', function(data) {
    elems = ''
    for(let one of data) {
      elems += `
      <div class="card" data-id=${one['id']}>
          <div class="card-content">
              <p>
                ${one['text']}
              </p>
          </div>
          <div class="card-action">
               <a class="question__edit" href="${one['url']}">Редактировать</a>
               <a class="question__delete-link" href="${one['delete_url']}">Удалить</a>
          </div>
      </div>
      `
    }
    $('.questions__list').html(elems)
  })
})

$(document).on('click', '.question-modal-dice', function(event) {
  event.preventDefault()
  event.stopPropagation()
  abc = ['-', '0', '0', '+']
  data = {
    text: 'empty',
    humanity: abc[Math.floor(Math.random() * abc.length)],
    curiosity: abc[Math.floor(Math.random() * abc.length)],
    tyranny: abc[Math.floor(Math.random() * abc.length)],
    independence: abc[Math.floor(Math.random() * abc.length)],
  }
  id = question_edit_modal
  url = '/api/v1/dialogs/answers/' + id + '/create/'
  $.ajax({
    url: url,
    type: 'POST',
    data: data,
    success: function(result) {
      answer = create_answer(result)
      $('.question-edit-modal-answers').append(answer)
      $('select').formSelect();
    }
  })
})

$(document).on('change', '.answer__item-selector', function(event) {
  id = $(this).parent().parent().parent().parent().parent().data('id')
  text = $(this).parent().parent().parent().parent().find('.answer__item-name').text()
  value = $(this).val()
  type = $(this).data('type')
  data = {
    [type]: value,
    text: text,
  }
  $.ajax({
    url: '/api/v1/dialogs/answers/' + id + '/update/',
    type: 'PUT',
    data: data
  })
})

$(document).on('click', '.group__item .secondary-content.edit', function(event) {
  event.stopPropagation()
  let parent = $(this).parent().addClass('hidden')
  let name = $(parent).find('.group__item-name').text().trim()
  let form = $(this).parent().parent().find('.group__item-form').removeClass('hidden')
  $(form).find('input').focus().val('').val(name)
})

$(document).on('focusout', '.group__item-form input', function(event) {
  $(this).parent().addClass('hidden')
  $(this).parent().parent().find('.group__item-link').removeClass('hidden')
})

$(document).on('submit', '.group__item-form', function(event) {
  event.preventDefault()
  url = $(this).attr('action')
  data = $(this).serialize()
  name = $(this).find('input[name=name]').val()
  name_block = $(this).parent().find('.group__item-name')
  form = $(this)
  $.ajax({
    url: url,
    type: 'PUT',
    data: data,
    success: function(result) {
      $(name_block).text(name)
      $(form).find('input').blur()
    }
  })
})

$(document).on('click', '.group__item .secondary-content.delete', function(event) {
  event.stopPropagation()
  let name = $(this).data('name')
  let url = $(this).data('url')
  let id = $(this).data('id')
  group_modal_id = id
  $('.group_delete_modal .modal-content p').html(name)
  $('.group_delete_modal .modal-footer a').attr('href', url)
  $('.group_delete_modal').modal('open')
})

$(document).on('click', '.group_delete_modal a', function(event) {
  event.stopPropagation()
  event.preventDefault()
  url = $(this).attr('href')
  $.ajax({
    url: url,
    type: 'DELETE',
    success: function(result) {
      $('.group__item[data-id=' + group_modal_id + ']').remove()
    }
  })
  $('.group_delete_modal').modal('close')
})

$(document).on('click', '.question__delete-link', function(event) {
  event.preventDefault()
  event.stopPropagation()
  let text = $(this).parent().parent().find('.card-content p').text().trim()
  $('.question_delete_modal .modal-content p').text(text)
  id = $(this).parent().parent().data('id')
  question_delete_modal = id
  url = $(this).attr('href')
  $('.question_delete_modal .modal-footer a').attr('href', url)
  $('.question_delete_modal').modal('open')
})

$(document).on('click', '.question__edit', function(event) {
  event.preventDefault()
  event.stopPropagation()
  url = $(this).attr('href')
  question_edit_modal = $(this).parent().parent().data('id')
  $.ajax({
    url: url,
    type: 'GET',
    success: function(result) {
      $('.question-edit-modal .modal-content textarea').val(result['text'])
      $('.question-edit-modal .question-edit-form').attr('action', result['update_url'])
      $('.question-edit-modal')
      $('.question-edit-modal').modal('open')
      answers = ''
      for(let one of result['answers']) {
        answers += create_answer(one)
      }
      $('.question-edit-modal-answers').html(answers)
      $('select').formSelect();
      incomes = ''
      for(let one of result['incomes']) {
        incomes += `
        <li>
          <a class="income-item" data-question="${one['question']['id']}" href="${one['question']['url']}" data-id="${one['id']}">${one['text']}</a>
        </li>
        `
      }
      $('.income-dropdown-list').html(incomes)
    }
  })
})

$(document).on('submit', '.answer-form', function(event) {
  event.preventDefault()
  event.stopPropagation()
  data = $(this).serialize()
  id = question_edit_modal
  url = '/api/v1/dialogs/answers/' + id + '/create/'
  $.ajax({
    url: url,
    type: 'POST',
    data: data,
    success: function(result) {
      answer = create_answer(result)
      $('.question-edit-modal-answers').append(answer)
      $('select').formSelect();
    }
  })
})

$(document).on('click', '.answer__item .answer__item-link .edit', function(event) {
  event.preventDefault()
  event.stopPropagation()
  let parent = $(this).parent().addClass('hidden')
  let name = $(parent).find('.answer__item-name').text().trim()
  let form = $(this).parent().parent().find('.answer__item-form').removeClass('hidden')
  $(form).find('input').focus().val('').val(name)
})

$(document).on('focusout', '.answer__item-form input', function(event) {
  $(this).parent().addClass('hidden')
  $(this).parent().parent().find('.answer__item-link').removeClass('hidden')
})

$(document).on('submit', '.answer__item-form', function(event) {
  event.preventDefault()
  url = $(this).attr('action')
  data = $(this).serialize()
  text = $(this).find('input[name=text]').val()
  text_block = $(this).parent().find('.answer__item-name')
  form = $(this)
  $.ajax({
    url: url,
    type: 'PUT',
    data: data,
    success: function(result) {
      $(text_block).text(text)
      $(form).find('input').blur()
    }
  })
})

$(document).on('click', '.answer__item .answer__item-link .append', function(event) {
  event.preventDefault()
  event.stopPropagation()

  answer_outcome_modal = $(this).data('outcome')
  answer_append_modal = $(this).parent().parent().data('id')
  $.ajax({
    url: '/api/v1/dialogs/questions/' + group_active + '/',
    type: 'GET',
    success: function(result) {
      elems = ''
      for(let one of result) {
        elems += `
        <li class="collection-item answers-append-item" data-id="${one['id']}">
          ${one['text']}
        </li>
        `
      }
      $('.answers-append-collection').html(elems)
      $('.answers-append-item[data-id=' + answer_outcome_modal + ']').addClass('active')
    }
  })
  $('.answer_append_modal').modal('open')
})

$(document).on('click', '.answers-append-item', function(event) {
  event.preventDefault()
  event.stopPropagation()
  el = this
  let text = $('.answer__item[data-id=' + answer_append_modal + '] .answer__item-name').text()
  data = {
    outcome: $(this).data('id'),
    text: text,
  }
  $.ajax({
    url: '/api/v1/dialogs/answers/' + answer_append_modal + '/update/',
    type: 'PUT',
    data: data,
    success: function(result) {
      $('.answer__item[data-id=' + answer_append_modal + '] .outcome').data('outcome', $(el).data('id'))
      $('.answer__item[data-id=' + answer_append_modal + '] .append').data('outcome', $(el).data('id'))
      $('.answer_append_modal').modal('close')
    }
  })
})

$(document).on('click', '.answer__item .answer__item-link .outcome', function(event) {
  event.preventDefault()
  event.stopPropagation()

  question_edit_modal = $(this).data('outcome')
  url = '/api/v1/dialogs/questions/' + question_edit_modal + '/detail/'
  $.ajax({
    url: url,
    type: 'GET',
    success: function(result) {
      $('.question-edit-modal .modal-content textarea').val(result['text'])
      $('.question-edit-modal .question-edit-form').attr('action', result['update_url'])
      $('.question-edit-modal')
      $('.question-edit-modal').modal('open')
      answers = ''
      for(let one of result['answers']) {
        answers += create_answer(one)
      }
      incomes = ''
      for(let one of result['incomes']) {
        incomes += `
        <li>
          <a class="income-item" data-question="${one['question']['id']}" href="${one['question']['url']}" data-id="${one['id']}">${one['text']}</a>
        </li>
        `
      }
      $('.income-dropdown-list').html(incomes)
      $('.question-edit-modal-answers').html(answers)
      $('select').formSelect();
    }
  })

})

$(document).on('click', '.income-item', function(event) {
  event.preventDefault()
  event.stopPropagation()

  question_edit_modal = $(this).data('question')
  url = $(this).attr('href')
  $.ajax({
    url: url,
    type: 'GET',
    success: function(result) {
      $('.question-edit-modal .modal-content textarea').val(result['text'])
      $('.question-edit-modal .question-edit-form').attr('action', result['update_url'])
      $('.question-edit-modal')
      $('.question-edit-modal').modal('open')
      answers = ''
      for(let one of result['answers']) {
        answers += create_answer(one)
      }
      incomes = ''
      for(let one of result['incomes']) {
        incomes += `
        <li>
          <a class="income-item" data-question="${one['question']['id']}" href="${one['question']['url']}" data-id="${one['id']}">${one['text']}</a>
        </li>
        `
      }
      $('.income-dropdown-list').html(incomes)
      $('.question-edit-modal-answers').html(answers)
      $('select').formSelect();
    }
  })

})

$(document).on('click', '.answer__item .answer__item-link .delete', function(event) {
  event.preventDefault()
  event.stopPropagation()
  text = $(this).parent().find('.answer__item-name').text().trim()
  answer_delete_modal = $(this).parent().parent().data('id')
  $('.answer_delete_modal .modal-content p').text(text)
  $('.answer_delete_modal').modal('open')
})

$(document).on('click', '.answer_delete_modal .modal-footer a', function(event) {
  event.preventDefault()
  event.stopPropagation()
  url = '/api/v1/dialogs/answers/' + answer_delete_modal + '/delete/'
  $.ajax({
    url: url,
    type: 'DELETE',
    success: function(result) {
      $('.answer__item[data-id=' + answer_delete_modal + ']').remove()
      // $('.answer_delete_modal').modal('close')
      $('.question-edit-modal').modal('open')
    }
  })
})

$(document).on('submit', '.question-edit-form', function(event) {
  event.preventDefault()
  event.stopPropagation()
  id = question_edit_modal
  data = $(this).serialize()
  url = '/api/v1/dialogs/questions/' + id + '/update/'
  $.ajax({
    url: url,
    type: 'PUT',
    data: data,
    success: function(result) {
      $('.card[data-id=' + question_edit_modal + '] .card-content p').text(result['text'])
    }
  })
  $('.question_delete_modal').modal('close')
})

$(document).on('click', '.question_delete_modal .modal-footer a', function(event) {
  event.preventDefault()
  event.stopPropagation()
  url = $(this).attr('href')
  $.ajax({
    url: url,
    type: 'DELETE',
    success: function(result) {
      $('.card[data-id=' + question_delete_modal + ']').remove()
    }
  })
  $('.question_delete_modal').modal('close')
})

$(document).on('submit', '.question-create-form', function(event) {
  event.preventDefault()
  url = `/api/v1/dialogs/questions/${group_active}/create/`
  data = $(this).serialize()
  $.ajax({
    url: url,
    type: 'POST',
    data: data,
    success: function(result) {
      elem = `
      <div class="card" data-id=${result['id']}>
          <div class="card-content">
              <p>
                ${result['text']}
              </p>
          </div>
          <div class="card-action">
               <a class="question__edit" href="${result['url']}">Редактировать</a>
               <a class="question__delete-link" href="${result['delete_url']}">Удалить</a>
          </div>
      </div>
      `
      $('.questions__list').append(elem)
    }
  })
})

$(document).ready(function(){
  function getCookie(name) {
    var cookieValue = null
    if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';')
      for (var i = 0; i < cookies.length; i++) {
        var cookie = jQuery.trim(cookies[i])
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
          break
        }
      }
    }
    return cookieValue
  }
  var csrftoken = getCookie('csrftoken')
  function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method))
  }
  $.ajaxSetup({
    beforeSend: function(xhr, settings) {
      if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
        xhr.setRequestHeader("X-CSRFToken", csrftoken)
      }
    }
  })
  $('.sidenav').sidenav();
  $('.modal').modal();
  $('select').formSelect();
  // $('.dropdown-trigger').dropdown();
  var elem = document.querySelector('.dropdown-trigger');
  var options = {
    constrainWidth: false
  }
  var instance = M.Dropdown.init(elem, options);
})

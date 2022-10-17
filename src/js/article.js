window.addEventListener('DOMContentLoaded', function() {

  async function getDataArticle(id) {
    const response = await fetch(`https://gorest.co.in/public-api/posts/${id}`);
    return await response.json();
  }

  async function getCommentArticle(id) {
    const response = await fetch(`https://gorest.co.in/public-api/comments?post_id=${id}`);
    return await response.json();
  }

  async function mainArticle() {
    const pageParams = new URLSearchParams(window.location.search);
    const container = document.querySelector('.container');
    let idPage = pageParams.get('id');

    function renderPage(obj) {
      const titlePage = document.createElement('h1');
      const captionPage = document.createElement('p');

      titlePage.classList.add('main-article__title');
      captionPage.classList.add('main-article__caption');

      titlePage.textContent = obj.title;
      captionPage.textContent = obj.body;

      container.append(titlePage);
      container.append(captionPage);
    }

    function renderComment(obj) {
      const titleComment = document.createElement('h2');
      const listAuthor = document.createElement('ul');

      titleComment.classList.add('main-article__head');
      listAuthor.classList.add('list-group');
      listAuthor.classList.add('main-article__list');

      titleComment.textContent = 'Комментарии:';

      for (let i = 0; i < obj.length; i++) {
        const itemAuthor = document.createElement('li');
        const name = document.createElement('h3');
        const descr = document.createElement('p');
        const email = document.createElement('a');

        itemAuthor.classList.add('list-group-item');
        itemAuthor.classList.add('main-article__item');
        name.classList.add('main-article__name');
        descr.classList.add('main-article__descr');
        email.classList.add('main-article__link-email');
        email.setAttribute('href', `mailto:${ obj[i].email}`);

        name.textContent = obj[i].name;
        descr.textContent = obj[i].body;
        email.textContent = obj[i].email;


        listAuthor.append(itemAuthor);
        itemAuthor.append(name);
        itemAuthor.append(descr);
        itemAuthor.append(email);
      }

      container.append(titleComment);
      container.append(listAuthor);
    }

    const pageData = getDataArticle(idPage);
    const pageComment = getCommentArticle(idPage);

    pageData.then(value => {
      if (value) {
        renderPage(value.data);
        pageComment.then(valueComment => {
            if (valueComment.data.length !== 0) {
              renderComment(valueComment.data);
            }
        })
      }
    });
  }

  mainArticle();
})

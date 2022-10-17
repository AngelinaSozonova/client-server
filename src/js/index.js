window.addEventListener('DOMContentLoaded', function() {
  const list = document.querySelector('.main__list');
  const pagination = document.querySelector('.main__pogination-list');
  let page;

  async function getData(page) {
    const response = await fetch(`https://gorest.co.in/public-api/posts?page=${page}`);
    return await response.json();
  }

  async function main() {
    let pageData = await getData(page);
    let allItemList;
    let pages = pageData.meta.pagination.pages;
    let maxPage = Math.ceil(pages / 10);

    function loadingPage(getValue) {
      getValue.then((value) => {
        list.innerHTML = '';
        for (let el of value.data) {
          renderList(el.title, el.id);
        }

        allItemList = document.querySelectorAll('.main__item');
        onClickItemList(allItemList);
      })
    }

    function renderList(text, id) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      item.classList.add('main__item');
      item.classList.add('list-group-item');
      link.classList.add('main__link');

      item.setAttribute('id', id);
      link.setAttribute('href', '#');
      link.textContent = text;

      item.append(link);
      list.append(item);
    }

    function renderPagination(number, next = false, prev = false) {
      const itemPagination = document.createElement('li');
      const linkPagination = document.createElement('a');

      itemPagination.classList.add('page-item');
      itemPagination.classList.add('main__pogination-item');
      linkPagination.classList.add('page-link');

      linkPagination.href = '#';
      linkPagination.textContent = number;

      if (number == 1) {
        itemPagination.setAttribute('id', 'first');
      } else if (number % maxPage === 0 && next === false && prev === false) {
        itemPagination.setAttribute('id', 'end');
      }

      if (next) {
        itemPagination.classList.add('next');
        itemPagination.classList.remove('main__pogination-item');
        linkPagination.textContent = 'Next';
        pagination.append(itemPagination);
      }
      if (prev) {
        itemPagination.classList.add('previous');
        itemPagination.classList.add('disabled');
        itemPagination.classList.remove('main__pogination-item');
        linkPagination.textContent = 'Prev';
        pagination.prepend(itemPagination);
      }

      itemPagination.append(linkPagination);
      pagination.append(itemPagination);
    }

    function onCkickNext() {
      const nextPage = document.getElementById('first');
      prevBtn.addEventListener('click', onClickPrev);

      for (let item of allItemPagination) {
        item.classList.remove('active');
        counter++;
        item.firstElementChild.textContent = counter;
        if (counter >= pages) {
          nextBtn.classList.add('disabled');
          nextBtn.removeEventListener('click', onCkickNext);
          if (counter > pages) item.classList.add('remove');
        }
      }

      page = nextPage.firstChild.textContent;
      pageData = getData(page);
      loadingPage(pageData);

      nextPage.classList.add('active');
      prevBtn.classList.remove('disabled');
    }

    function onClickPrev() {
      const prevPage = document.getElementById('end');
      counter = counter - (maxPage - 1);

      nextBtn.classList.remove('disabled');
      nextBtn.addEventListener('click', onCkickNext);

      for(let j = allItemPagination.length - 1; j >= 0; j--) {
        counter--;
        allItemPagination[j].classList.remove('active');
        allItemPagination[j].classList.remove('remove');
        allItemPagination[j].firstChild.textContent = counter;
      }
      counter = counter + (maxPage - 1);
      page = prevPage.firstChild.textContent;

      if (page <= maxPage) {
        prevBtn.classList.add('disabled');
        prevBtn.removeEventListener('click', onClickPrev);
      }

      pageData = getData(page);
      loadingPage(pageData);

      prevPage.classList.add('active');
    }

    function onClickItemList(arr) {
      arr.forEach(item => {
        item.firstChild.addEventListener('click', function() {
          let idItem = item.getAttribute('id');
          this.setAttribute('href', `article.html?id=${idItem}`);
        })
      });
    }

    for (let el of pageData.data) {
      renderList(el.title, el.id);
    }

    renderPagination('', false, true);
    for (let i = 1; i <= maxPage; i++) {
      renderPagination(i);
    }
    renderPagination('', true);

    const allItemPagination = document.querySelectorAll('.main__pogination-item');
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.previous');
    let counter = maxPage;

    nextBtn.addEventListener('click', onCkickNext);

    allItemPagination.forEach(element => {

      if (element.firstChild.textContent == 1) {
        element.classList.add('active');
      }

      element.addEventListener('click', () => {
        page = element.firstChild.textContent;

        if (page >= 1 && page <= maxPage) {
          prevBtn.classList.add('disabled');
        } else prevBtn.classList.remove('disabled');

        allItemPagination.forEach(item => {
          item.classList.remove('active');
        });

        element.classList.add('active');

        pageData = getData(page);
        loadingPage(pageData);
      })
    });

    allItemList = document.querySelectorAll('.main__item');
    onClickItemList(allItemList);
  }

  main();
})

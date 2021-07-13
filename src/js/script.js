/* global Handlebars, utils, dataSource */
// eslint-disable-line no-unused-vars
{
  'use strict';

  const select = {
    main: {
      book:'.container',
    },

    templateOf:{
      books: '#template-book',
    },

    booksPannel:{
      list: '.books-list',
    },
  };

  const favoriteBooks= [];
  const filters = [];
  const templates = {
    books: Handlebars.compile(document.querySelector(select.templateOf.books).innerHTML),
  };

  class BookList{
    constructor(data){
      const thisBookList = this;
      thisBookList.data = data;

      thisBookList.render();
      thisBookList.initActions();
    }

    initData(){
      const thisBookList = this;
      this.data = thisBookList.data;
    }

    render(){
      const thisBookList = this;

      for(let book of dataSource.books){
        const rating = book.rating;
        const ratingWidth = rating * 10;
        const ratingBgc = thisBookList.determineRatingBgc(rating);

        book.ratingWidth = ratingWidth;
        book.ratingBgc = ratingBgc;

        const generatedHTML = templates.books(book);
        thisBookList.element = utils.createDOMFromHTML(generatedHTML);
        const booksContainer = document.querySelector(select.booksPannel.list);
        booksContainer.appendChild(thisBookList.element);
      }
    }

    initActions(){
      const books = document.querySelector(select.main.book);
      const thisBookList = this;

      document.addEventListener('click', function(event){
        if(event.target.name === 'filter'){
          if(event.target.checked){
            filters.push(event.target.value);
          }else{
            filters.splice(filters.indexOf(event.target.value), 1);
          }
        }
        thisBookList.filterBooks(filters);
      });

      books.addEventListener('dblclick', function(event){
        event.preventDefault();
        if(event.target.offsetParent.classList.contains('book__image')){
          if(event.target.offsetParent.classList.contains('favorite')){
            event.target.offsetParent.classList.remove('favorite');
          }else{
            event.target.offsetParent.classList.add('favorite');
            const id = event.target.offsetParent.getAttribute('data-id');
            favoriteBooks.push(id);
          }
        }
      });
    }

    filterBooks(filters){
      for(const book of dataSource.books){
        const bookElem = document.querySelector('.book__image[data-id="' + book.id + '"]');
        bookElem.classList.remove('hidden');
        console.log(bookElem);
        for(const filter of filters){
          if(!book.details[filter]){
            bookElem.classList.add('hidden');
            break;
          }else{
            bookElem.classList.remove('hidden');
          }
        }
      }
    }

    determineRatingBgc(rating){
      if(rating < 6){
        return 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)';
      }else if (rating > 6 && rating <= 8){
        return 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      }else if (rating > 8 && rating <= 9){
        return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      }else{
        return'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
      }
    }
  }

  const app = new BookList(dataSource.books);
  app.initData();

}

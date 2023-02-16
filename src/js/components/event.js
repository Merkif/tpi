const eventModule = (function() {
  const defaultSettings = {
    templateId: 'event-template',
    addButtonSelector: '.event-add',
    eventsContainerSelector: '#events-container',
    maxEvents: 15,
    eventCounter: 0
  };

  function createEvent(settings) {
    const template = document.querySelector(`#${settings.templateId}`);
    const event = template.content.cloneNode(true).querySelector('.event');
    const eventTitle = event.querySelector('.event__title');
    const eventInput = event.querySelector('.event__input');
    const eventInputDateStart = event.querySelector('.event__input--date-start');
    const eventInputDateEnd = event.querySelector('.event__input--date-end');
    let menuOpened = false;

    eventTitle.textContent = `Мероприятие ${settings.eventCounter + 1}`;
    eventInput.name = `event-name-${settings.eventCounter + 1}`;
    eventInputDateStart.name = `event-start-${settings.eventCounter + 1}`;
    eventInputDateEnd.name = `event-end-${settings.eventCounter + 1}`;

    // Добавляем обработчик ввода текста в текстовое поле
    eventInput.addEventListener('input', () => {
      if (!eventInput.value.trim()) {
        eventTitle.textContent = `Мероприятие`;
      } else {
        eventTitle.textContent = eventInput.value;
      }
    });

    // добавляем обработчик события контекстного меню
    event.addEventListener('contextmenu', e => {
      e.preventDefault();
      if (menuOpened) {
        return;
      }

      // Закрываем другое контекстное меню, если оно открыто
      const otherMenu = document.querySelector('.event-menu');
      if (otherMenu) {
        otherMenu.remove();
      }

      menuOpened = true;
      const menu = document.createElement('div');
      menu.classList.add('event-menu');
      const deleteButton = document.createElement('button');
      deleteButton.classList.add("event-menu__button");
      deleteButton.type = "button";
      deleteButton.textContent = 'Удалить мероприятие';
      deleteButton.addEventListener('click', () => {
        deleteEvent(event);
        menu.remove();
        menuOpened = false;
      });

      menu.appendChild(deleteButton);
      document.body.appendChild(menu);
      menu.style.position = 'absolute';
      menu.style.left = `${e.pageX}px`;
      menu.style.top = `${e.pageY}px`;

      // добавляем обработчик события клика вне меню, чтобы закрыть его при клике вне меню
      const closeMenu = () => {
        menu.remove();
        document.removeEventListener('click', closeMenu);
        menuOpened = false;
      };
      document.addEventListener('click', closeMenu);
    });
    
    return event;
  }


  function deleteEvent(event) {
    event.remove();
  }

  function setEventLimit(limit) {
    eventCounter = limit;
  }

  function addEventListeners(settings) {
    const addButton = document.querySelector(settings.addButtonSelector);
    const eventsContainer = document.querySelector(settings.eventsContainerSelector);

    function addEvent() {
      if (eventsContainer.childElementCount < settings.maxEvents) {
        const event = createEvent(settings);
        eventsContainer.insertAdjacentElement('beforeend', event);
        settings.eventCounter++;
      } else {
        alert('Превышен лимит добавления мероприятий');
      }
    }

    addButton?.addEventListener('click', addEvent);
  }

  function init(settings) {
    settings = Object.assign({}, defaultSettings, settings);

    addEventListeners(settings);
  }

  return {
    init,
  };
})();

eventModule.init();

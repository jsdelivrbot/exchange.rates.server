"use strict";

// Components
// import Select from './components/select';
// import List   from './components/list';
// import yMap   from './components/ymap';
// import Footer from './components/footer';
// import Burger from './components/burger';

// Routes
import Index from './routes/index';
// import Map   from './routes/map';

// Utils
import Router   from './utils/router';
import EventBus from './utils/eventBus';
import Request  from './utils/request';
import Utils    from './utils/utils';

const eventBus  = new EventBus();
// const yandexMap = new yMap(eventBus);
const request   = new Request();
// const list      = new List(yandexMap, request, eventBus);
const index     = new Index(eventBus);
// const map       = new Map(yandexMap, eventBus);

//new Burger(eventBus);
//new Select(eventBus);
new Utils();
//new Footer();
new Router([index], eventBus);
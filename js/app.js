/*
    Cat Clicker Premium Pro Requirements

    Features:
    /1. Add 3 buttons (admin, save, cancel)
    /2. Add three input fields (name, URL, # of clicks)
    /3. Add a form to contain the input fields, and maybe the buttons

    Functionality:
    1. Click the admin button to make the form appear
        i. The should start with the current cat info filled in
    2. Click the save button to send updated cat model to view
        i. Also, the form should disappear
    3. Click the cancel button to make the form disappear
*/


/* ======= Model ======= */

var model = {
    currentCat: null,
    adminMode: false,
    cats: [
        {
            clickCount : 0,
            name : 'Tabby',
            imgSrc : 'img/434164568_fea0ad4013_z.jpg',
            imgAttribution : 'https://www.flickr.com/photos/bigtallguy/434164568'
        },
        {
            clickCount : 0,
            name : 'Tiger',
            imgSrc : 'img/4154543904_6e2428c421_z.jpg',
            imgAttribution : 'https://www.flickr.com/photos/xshamx/4154543904'
        },
        {
            clickCount : 0,
            name : 'Scaredy',
            imgSrc : 'img/22252709_010df3379e_z.jpg',
            imgAttribution : 'https://www.flickr.com/photos/kpjas/22252709'
        },
        {
            clickCount : 0,
            name : 'Shadow',
            imgSrc : 'img/1413379559_412a540d29_z.jpg',
            imgAttribution : 'https://www.flickr.com/photos/malfet/1413379559'
        },
        {
            clickCount : 0,
            name : 'Sleepy',
            imgSrc : 'img/9648464288_2516b35537_z.jpg',
            imgAttribution : 'https://www.flickr.com/photos/onesharp/9648464288'
        }
    ]
};


/* ======= Octopus ======= */

var octopus = {

    init: function() {
        // set our current cat to the first one in the list
        model.currentCat = model.cats[0];

        // tell our views to initialize
        catListView.init();
        catView.init();
        adminView.init();
    },

    getCurrentCat: function() {
        return model.currentCat;
    },

    getCats: function() {
        return model.cats;
    },

    // set the currently-selected cat to the object passed in
    setCurrentCat: function(cat) {
        model.currentCat = cat;
    },

    // increments the counter for the currently-selected cat
    incrementCounter: function() {
        model.currentCat.clickCount++;
        catView.render();
    },

    adminBool: function(bool) {
        bool = true ? (model.adminMode = true, adminView.render("visible"))
                    : (model.adminMode = false, adminView.render("hidden"));
        console.log(model.adminMode);
    },

    // set the counter for the admin-selected cat
    adminOverride: function(cat, url, count) {
        model.currentCat.clickCount = count;
        model.currentCat.imgSrc = url;
        model.currentCat.name = cat;

        this.adminBool(false);
    }
};


/* ======= View ======= */

var catView = {

    init: function() {
        // store pointers to our DOM elements for easy access later
        this.catElem = document.getElementById('cat');
        this.catNameElem = document.getElementById('cat-name');
        this.catImageElem = document.getElementById('cat-img');
        this.countElem = document.getElementById('cat-count');

        // store pointers to DOM header elements
        // this.adminForm = document.getElementById('admin-form');
        // this.adminButton = document.getElementById('admin-button');
        // this.adminList = document.getElementById('admin-list');
        // this.adminName = document.getElementById('admin-name');
        // this.adminUrl = document.getElementById('admin-url');
        // this.adminClickCount = document.getElementById('admin-click-count');
        // this.adminSave = document.getElementById('admin-save');
        // this.adminCancel = document.getElementById('admin-cancel');

        // on click, increment the current cat's counter
        this.catImageElem.addEventListener('click', function(){
            octopus.incrementCounter();
        });

        // render this view (update the DOM elements with the right values)
        this.render();
    },

    render: function() {
        // update the DOM elements with values from the current cat
        var currentCat = octopus.getCurrentCat();
        this.countElem.textContent = currentCat.clickCount;
        this.catNameElem.textContent = currentCat.name;
        this.catImageElem.src = currentCat.imgSrc;
    }
};

var catListView = {

    init: function() {
        // store the DOM element for easy access later
        this.catListElem = document.getElementById('cat-list');

        // render this view (update the DOM elements with the right values)
        this.render();
    },

    render: function() {
        var cat, elem, i;
        // get the cats we'll be rendering from the octopus
        var cats = octopus.getCats();

        // empty the cat list
        this.catListElem.innerHTML = '';

        // loop over the cats
        for (i = 0; i < cats.length; i++) {
            // this is the cat we're currently looping over
            cat = cats[i];

            // make a new cat list item and set its text
            elem = document.createElement('li');
            elem.textContent = cat.name;

            // on click, setCurrentCat and render the catView
            // (this uses our closure-in-a-loop trick to connect the value
            //  of the cat variable to the click event function)
            elem.addEventListener('click', (function(catCopy) {
                return function() {
                    octopus.setCurrentCat(catCopy);
                    catView.render();
                };
            })(cat));

            // finally, add the element to the list
            this.catListElem.appendChild(elem);
        }
    }
};

var adminView = {

    init: function() {
        this.adminForm = document.getElementById('admin-form');
        this.adminButton = document.getElementById('admin-button');
        this.adminList = document.getElementById('admin-list');
        this.adminName = document.getElementById('admin-name');
        this.adminUrl = document.getElementById('admin-url');
        this.adminClickCount = document.getElementById('admin-click-count');
        this.adminSave = document.getElementById('admin-save');
        this.adminCancel = document.getElementById('admin-cancel');

        this.adminList.style.visibility = "hidden";

        this.adminButton.addEventListener('click', function(event){
            event.preventDefault(event);
            octopus.adminBool(true);
        });

        // this.clickSave = function() {
        //     event.preventDefault(event);
        //     console.log(this);
        //     var name = this.adminName.value;
        //     var url = this.adminUrl.value;
        //     var clickCount = this.adminClickCount.value;
        //     octopus.adminOverride(name, url, clickCount);
        //     octopus.adminBool(false);
        // };
        // this.adminSave.addEventListener('click', this.clickSave.bind(this), false);

        this.adminSave.addEventListener('click', function(event){
            event.preventDefault(event);
            console.log(this);
            var name = this.adminName.value;
            var url = this.adminUrl.value;
            var clickCount = this.adminClickCount.value;
            octopus.adminOverride(name, url, clickCount);
            octopus.adminBool(false);
        });

        this.adminCancel.addEventListener('click', function(event){
            event.preventDefault(event);
            octopus.adminBool(false);
        });
    },

    render: function(visible) {
        this.adminList.style.visibility = visible;
        this.adminName.value = model.currentCat.name;
        this.adminUrl.value = model.currentCat.imgSrc;
        this.adminClickCount.value = model.currentCat.clickCount;
        console.log("visible value: " + visible);
    }
};

// make it go!
octopus.init();

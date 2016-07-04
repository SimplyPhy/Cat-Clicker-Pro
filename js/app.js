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

    // sets the state of visibility for adminList in adminView
    adminBool: function(happy) {
        happy === "true" ? (model.adminMode = true, adminView.render("visible"))
                    : (model.adminMode = false, adminView.render("hidden"));
    },

    // set the counter for the admin-selected cat
    adminOverride: function(cat, url, count) {
        var currentCat = octopus.getCurrentCat();
        currentCat.clickCount = count;
        currentCat.imgSrc = url;
        currentCat.name = cat;
        catView.render();

        this.adminBool("false");
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

        // store admin selector nodes
        this.adminForm = document.getElementById('admin-form');
        this.adminButton = document.getElementById('admin-button');
        this.adminList = document.getElementById('admin-list');
        this.adminName = document.getElementById('admin-name');
        this.adminUrl = document.getElementById('admin-url');
        this.adminClickCount = document.getElementById('admin-click-count');
        this.adminSave = document.getElementById('admin-save');
        this.adminCancel = document.getElementById('admin-cancel');

        // set default admin-list state to hidden
        this.adminList.style.visibility = "hidden";

        // when admin button is clicked, set admin-list to visible and show current
        // cat properties in the text input boxes
        this.adminButton.addEventListener('click', function(event){
            event.preventDefault(event);
            octopus.adminBool("true");
        });

        // when save button is clicked, tell octopus to update current cat obj
        // properties with the values in the input boxes, and display them, then
        // hide the admin options
        this.adminSave.addEventListener('click', function(event){
            event.preventDefault(event);
            adminView.update();
            octopus.adminBool("false");
        });

        // when cancel button is clicked, clear admin options
        this.adminCancel.addEventListener('click', function(event){
            event.preventDefault(event);
            octopus.adminBool("false");
        });
    },

    // called by adminBool, passing "visible" or "hidden", which changes the
    // style.visibility of the adminList; then update the admin input values for
    // the current cat
    render: function(visi) {
        var vis = visi;
        this.adminList.style.visibility = vis;
        this.adminName.value = model.currentCat.name;
        this.adminUrl.value = model.currentCat.imgSrc;
        this.adminClickCount.value = model.currentCat.clickCount;
    },

    // sets the current name, url, and click count values from the admin input
    // boxes, and passes them to the optopus's adminOverride function
    update: function() {
        var name = document.getElementById('admin-name').value;
        var url = document.getElementById('admin-url').value;
        var clickCount = document.getElementById('admin-click-count').value;

        console.log("name: " + name);
        octopus.adminOverride(name, url, clickCount);
    }
};

// make it go!
octopus.init();

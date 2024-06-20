// import { createApp } from 'vue'

import { bindColorSelector, card_colors } from "./colors.js";
import { bindIconSearch } from "./ui.js";
import { generatePage, renderSelectedCard, card_default_data } from "./generate.js";

var app = Vue.createApp({
    data() {
        var storedCardOptions = JSON.parse(localStorage.getItem("card_options"));
        var storedPageOptions = JSON.parse(localStorage.getItem("page_options"));
        var storedCards = JSON.parse(localStorage.getItem("card_data"));
        var defaultCards = card_default_data();
        var loadedFile = localStorage.getItem("loadedFile") || "rpg_cards.json";

        if (storedCards && !Array.isArray (storedCards)) {
            if (storedCards.card_options) {
                storedCardOptions = storedCards.card_options;
            }
            if (storedCards.page_options) {
                storedPageOptions = storedCards.page_options;
            }
            if (storedCards.cards) {
                storedCards = storedCards.cards
            }
            else {
                storedCards = defaultCards
            }
        }

        console.log("getting data");

        return {
            message: 'Hello Vue!',
            card_options: storedCardOptions || {
                height: '2.5in',
                width: '3.5in',
                defined_size: "2.5in,3.5in",
                foreground_color: "white",
                background_color: "white",
                default_color: "black",
                default_icon: "",
                default_title_size: "13",
                default_card_font_size: "inherit",
                // card_count: storedCards.length,
                icon_inline: true,
                rounded_corners: true
            },
            page_options: storedPageOptions || {
                height: '210mm',
                width: '297mm',
                defined_size: "210mm,297mm",
                card_arrangement: "doublesided",
                rows: "3",
                columns: "3",
                zoom: "100",
            },
            card_colors: card_colors,
            selected_index: storedCards.length > 0 ? 0 : null,
            card_list: storedCards,
            save_file: {
                name: loadedFile,
                url: ""
            },
            filter: {
                by_tag: ""
            },
            tags: [""],
            icon_search_website: "http://game-icons.net/"
        }
    },
    watch: {
        card_options: {
            handler() {
                localStorage.setItem("card_options", JSON.stringify(this.card_options));
                renderSelectedCard(this.card_options, this.selected_card);
            },
            deep: true
        },
        page_options: {
            handler() {
                localStorage.setItem("page_options", JSON.stringify(this.page_options));
            },
            deep: true
        },
        card_list: {
            handler() {
                // console.log("card_list changed");
                // renderSelectedCard(this.card_options, this.selected_card);
                localStorage.setItem("card_data", JSON.stringify(this.card_list));
                // this.card_count = this.card_list.length;/
            },
            deep: true
        },
        selected_card: {
            handler() {
                renderSelectedCard(this.card_options, this.selected_card);
            },
            deep: true
        },
        'page_options.defined_size'(newValue) {
            if (!this.updating && newValue != "") {
                var size = newValue.split(',');
                var width = size[0];
                var height = size[1];
                if (this.page_options.orientation === 'landscape') {
                    var tmpWidth = width;
                    width = height;
                    height = tmpWidth;
                }
                this.updating = true;
                this.page_options.width = width;
                this.page_options.height = height;
                this.page_options.orientation = getOrientation(width, height);
                this.updating = false;
            }
        },
        'page_options.width'(newWidth) {
            if (!this.updating) {
                this.page_options.orientation = getOrientation(newWidth, this.page_options.height);
                this.page_options.defined_size = getMatchingFormat('page-size', newWidth, this.page_options.height);
            }
        },
        'page_options.height'(newHeight) {
            if (!this.updating) {
                this.page_options.orientation = getOrientation(this.page_options.width, newHeight);
                this.page_options.defined_size = getMatchingFormat('page-size', this.page_options.width, newHeight);
            }
        },
        'card_options.defined_size'(newValue) {
            if (!this.updating && newValue != "") {
                var size = newValue.split(',');
                var width = size[0];
                var height = size[1];
                if (this.card_options.orientation === 'landscape') {
                    var tmpWidth = width;
                    width = height;
                    height = tmpWidth;
                }
                this.updating = true;
                this.card_options.width = width;
                this.card_options.height = height;
                this.card_options.orientation = getOrientation(width, height);
                this.updating = false;
            }
        },
        'card_options.width'(newWidth) {
            if (!this.updating) {
                this.card_options.orientation = getOrientation(newWidth, this.card_options.height);
                this.card_options.defined_size = getMatchingFormat('card-size', newWidth, this.card_options.height);
            }
        },
        'card_options.height'(newHeight) {
            if (!this.updating) {
                this.card_options.orientation = getOrientation(this.card_options.width, newHeight);
                this.card_options.defined_size = getMatchingFormat('card-size', this.card_options.width, newHeight);
            }
        },
        'save_file.name'(newValue) {
            localStorage.setItem("loadedFile", newValue);
        }
    },
    computed: {
        card_count: function() { return this.card_list.length; },
        card_plural: function() { return this.card_list.length == 1 ? "card" : "cards"; },
        filtered_cards: function() {
            let list = [];
            let app = this;
            app.card_list.forEach(function(card) {
                let tag = app.filter.by_tag.toLowerCase();
                if (tag == "" || card.tags.includes(tag)) {
                    list.push(card)
                }
            });
            return list;
        },
        selected_card: function() { 
            let app = this;
            app.refreshTags();

            let filtered_list = this.filtered_cards;
            if (this.selected_index >= 0 && this.selected_index < filtered_list.length) {
                let card = filtered_list[this.selected_index];
                if (!card.title_size) card.title_size = "";
                if (!card.font_size) card.font_size = "";
                return card;
            }
            else {
                return null;
            }
        },
        selected_tags: {
            get() {
                let card = this.selected_card;
                var x = card && card.tags ? card.tags.join(", ") : "";
                // console.log("getting tags as string: ", x);
                return x;
            },
            set(newValue) {
                let card = this.selected_card;
                if (card) {
                    var x = newValue.split(',').map(function(x) { return x.trim().toLowerCase(); });
                    // console.log("setting tags as list: ", x);
                    card.tags = x;
                }
            }
        },
        selected_content: {
            get() {
                let card = this.selected_card;
                return card && card.contents ? card.contents.join("\n") : "";
            },
            set(newValue) {
                let card = this.selected_card;
                if (card) {
                    card.contents = newValue.split('\n');
                }
            }
        },
        selected_back_content: {
            get() {
                let card = this.selected_card;
                return card && card.back_contents ? card.back_contents.join("\n") : "";
            },
            set(newValue) {
                let card = this.selected_card;
                if (card) {
                    card.back_contents = newValue.split('\n');
                }
            }
        }
    },
    methods: {
        deleteAll(_) {
            this.card_list = [];
        },
        loadFileButton(event) {
            let referencedFileControl = $(event.target).data("control-ref");
            $('#' + referencedFileControl).click();
        },
        loadFileControl(event) {
            let shouldReplace = $(event.target).data("replace");
            if (shouldReplace) {
                this.card_list = [];
            }
            
            let app = this;
            let refKey = $(event.target).attr("id");
            let files = app.$refs[refKey].files;
            for (var i = 0, f; f = files[i]; i++) {
                var reader = new FileReader();
                reader.onload = function (_) {
                    let data = JSON.parse(this.result);
                    let newCards = []
                    if (Array.isArray(data)) {
                        newCards = data;
                    }
                    else {
                        if (data.card_options) {
                            app.card_options = data.card_options;
                        }
                        if (data.page_options) {
                            app.page_options = data.page_options;
                        }
                        if (data.cards) {
                            newCards = storedCards.cards
                        }
                    }
                    newCards.forEach(card => app.card_list.push(card));
                };
                app.save_file.name = f.name;
                reader.readAsText(f);
            }
        },
        loadSample(_) {
            let app = this;
            this.card_list = [];
            card_data_example.forEach(card => app.card_list.push(card));
            if (app.card_list.length > 0) {
                this.selected_card = 0;
            }
        },
        openHelp(_) {
            $("#help-modal").modal('show');
        },
        saveToFile(_) {
            // console.log("saveToFile");
            let app = this;
            let saveData = {
                card_options: app.card_options,
                page_options: app.page_options,
                cards: app.card_list,
            };
            let str = JSON.stringify(saveData, null, "  ");
            // console.log("initializing blob");
            let parts = [str];
            let blob = new Blob(parts, { type: 'application/json' });
            // console.log("blob", blob);
            let url = URL.createObjectURL(blob);
            // console.log("url", url);
            app.save_file.url = url;
            if (app.save_file.name) {
                var link = $("#file-save-link");
            }
            link.attr("href", url);
            link[0].click();      
            // console.log("saved?");
            setTimeout(function () { URL.revokeObjectURL(url); }, 500);
        },
        rotatePage(_) {
            var height = this.page_options.height;
            this.page_options.height = this.page_options.width;
            this.page_options.width = height;
        },
        rotateCard(_) {
            var height = this.card_options.height;
            this.card_options.height = this.card_options.width;
            this.card_options.width = height;
        },
        rotateGrid(_) {
            var rows = this.page_options.rows;
            this.page_options.rows = this.page_options.columns;
            this.page_options.columns = rows;
        },
        generateHtml(_) {
            generatePage(this.page_options, this.card_options, this.card_list)
        },
        applyColorToAll(_) {
            let default_color = this.card_options.default_color;
            this.card_list.forEach((card) => card.color = default_color);
        },
        applyIconToAll(_) {
            let default_icon = this.card_options.default_icon;
            this.card_list.forEach((card) => card.icon = default_icon);
        },
        applyBackIconToAll(_) {
            let default_icon = this.card_options.default_icon;
            this.card_list.forEach((card) => card.icon_back = default_icon);
        },
        resetTitleFontSizeToAll(_) {
            this.card_list.forEach((card) => card.title_size = "");
        },
        resetCardFontSizeToAll(_) {
            this.card_list.forEach((card) => card.card_font_size = "");
        },
        addNewCard(_) {
            this.card_list.push(card_default_data());
            this.selected_index = this.card_list.length - 1;
        },
        deleteCard(_) {
            var index = this.selected_index;
            this.card_list.splice(index, 1);
            this.selected_index = Math.min(index, this.card_list.length - 1);
        },
        refreshTags(_) {
            let app = this;
            app.tags = [""];
            app.card_list.forEach(function(card) {
                card.tags.forEach(function(tag) {
                    if (!app.tags.includes(tag)) {
                        app.tags.push(tag);
                    }
                });
            });
            app.tags.sort();
        },
        sortCardsShow(_) {
            $("#sort-modal").modal('show');
        },
        sortCards(_) {
            console.log("sorting cards");
            $("#sort-modal").modal('hide');
        
            var fn_code = $("#sort-function").val();
            var fn = new Function("card_a", "card_b", fn_code);

            this.card_list = this.card_list.sort((card_a, card_b) => fn(card_a, card_b));
        },
        filterCardsShow(_) {
            $("#filter-modal").modal('show');
        },
        filterCards(_) {
            $("#filter-modal").modal('hide');
        
            var fn_code = $("#filter-function").val();
            var fn = new Function("card", fn_code);
        
            this.card_list = this.card_list.filter(function (card) {
                var result = fn(card);
                if (result === undefined) return true;
                else return result;
            });

        },
        duplicateCard(_) {
            let app = this;
            if (app.card_list.length > 0) {
                let new_card = $.extend({}, app.selected_card);
                new_card.title = new_card.title + " (Copy)";
                let newIndex = app.selected_index + 1;
                app.card_list.splice(newIndex, 0, new_card);
                app.selected_index = newIndex;
            } else {
                new_card = card_default_data();
                app.card_list.push(card_default_data());
                app.selected_index = 0;
            }
        },
        iconSelected(event) {
            console.log("icon selected", event);
        }
    },
    mounted() {
        var app = this;

        console.log('before mount');

        bindColorSelector('#foreground_color_selector', () => app.card_options, "foreground_color");
        bindColorSelector('#background_color_selector', () => app.card_options, "background_color");
        bindColorSelector('#default_color_selector', () => app.card_options, "default_color");
        bindColorSelector('#card_color_selector', () => app.selected_card, "color");

        $(".dropdown-colorselector").addClass("input-group-addon color-input-addon");

        bindIconSearch("#default-icon", () => app.card_options, "default_icon");
        bindIconSearch("#card-icon", () => app.selected_card, "icon");
        bindIconSearch("#card-icon-back", () => app.selected_card, "icon_back");

        renderSelectedCard(this.card_options, this.selected_card);
        app.refreshTags();
    }
});

app.mount("#app");
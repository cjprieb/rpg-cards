import { icon_names } from "./icons.js";

export function bindIconSearch(selectorId, getOptions, propertyName) {
    
    $(selectorId).typeahead({
        source: icon_names,
        items: 'all',
        render: function (items) {
          var that = this;
          console.log("this/that", that);

          items = $(items).map(function (i, item) {
            i = $(that.options.item).data('value', item);
            i.find('a').html(that.highlighter(item));
            var classname = 'icon-' + item.split(' ').join('-').toLowerCase();
            i.find('a').append('<span class="' + classname + '"></span>');
            return i[0];
          });

          if (this.autoSelect) {
            items.first().addClass('active');
          }
          this.$menu.html(items);
          return this;
        },
        select: function() {
          var val = this.$menu.find('.active').data('value');
          if(this.autoSelect || val) {
            var options = getOptions();
            options[propertyName] = val;
          }
          return this.hide();
        }
    });
}